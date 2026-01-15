/**
 * CSS Inspector Pro - Main Controller
 * Features: X-Ray Mode, DOM Walker
 */
import { InspectorUI } from './ui';

class InspectorEngine {
  private ui: InspectorUI;
  private isActive: boolean = true;
  private currentTarget: HTMLElement | null = null;
  private isLocked: boolean = false;
  private lockedTarget: HTMLElement | null = null;
  
  // X-Ray Mode
  private layerDepth: number = 0;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private isShiftHeld: boolean = false;

  // DOM Walker
  private walkerPanel: HTMLElement | null = null;
  private isWalkerOpen: boolean = false;

  constructor() {
    this.ui = new InspectorUI();
    this.bindEvents();
    this.createWalkerPanel();
    console.log('[CSS Inspector Pro] Engine Started (X-Ray + DOM Walker)');
  }

  private createWalkerPanel() {
    this.walkerPanel = document.createElement('div');
    this.walkerPanel.id = 'css-inspector-walker';
    this.walkerPanel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1e1e2e;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 12px;
      max-height: 400px;
      min-width: 300px;
      overflow-y: auto;
      z-index: 2147483646;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 13px;
      color: #cdd6f4;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      display: none;
    `;
    document.body.appendChild(this.walkerPanel);
  }

  private bindEvents() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'TOGGLE_INSPECTOR') {
        this.toggleActive();
      }
    });
  }

  private toggleActive() {
    this.isActive = !this.isActive;
    if (!this.isActive) {
      this.isLocked = false;
      this.lockedTarget = null;
      this.layerDepth = 0;
      this.closeWalker();
      this.ui.hide();
      console.log('[CSS Inspector Pro] Disabled');
    } else {
        console.log('[CSS Inspector Pro] Enabled');
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isActive) return;

    // DOM Walker Toggle
    if (e.code === 'KeyD' && !this.isWalkerOpen) {
      e.preventDefault();
      this.openWalker();
      return;
    }

    if (e.code === 'Escape' && this.isWalkerOpen) {
      this.closeWalker();
      return;
    }

    // Track SHIFT for X-Ray mode
    if (e.key === 'Shift') {
      this.isShiftHeld = true;
    }

    // Cycle deeper with SHIFT + [ and ] keys
    if (e.code === 'BracketRight' && this.isShiftHeld) {
      e.preventDefault();
      this.layerDepth++;
      this.updateXRayTarget();
    }
    if (e.code === 'BracketLeft' && this.isShiftHeld) {
      e.preventDefault();
      this.layerDepth = Math.max(0, this.layerDepth - 1);
      this.updateXRayTarget();
    }

    if (e.code === 'Space' && !this.isWalkerOpen) {
      e.preventDefault(); 
      this.isLocked = !this.isLocked;

      if (this.isLocked && this.currentTarget) {
          this.lockedTarget = this.currentTarget;
          this.inspect(this.lockedTarget); 
      } else {
          this.lockedTarget = null;
      }
    }

    if (e.code === 'Escape' && !this.isWalkerOpen) {
      this.isLocked = false;
      this.lockedTarget = null;
      this.layerDepth = 0;
      this.ui.hide();
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'Shift') {
      this.isShiftHeld = false;
      this.layerDepth = 0;
      this.updateXRayTarget();
    }
  }

  // ====== DOM WALKER ======
  private openWalker() {
    if (!this.walkerPanel) return;
    
    const allElements = this.getAllElementsAtPoint(this.lastMouseX, this.lastMouseY);
    
    if (allElements.length === 0) {
      this.walkerPanel.innerHTML = '<div style="color:#888;padding:8px">No elements found</div>';
    } else {
      this.walkerPanel.innerHTML = `
        <div style="font-weight:600;margin-bottom:8px;color:#89b4fa;border-bottom:1px solid #444;padding-bottom:6px">
          DOM Walker (${allElements.length} elements)
        </div>
        ${allElements.map((el, i) => {
          const tag = el.tagName.toLowerCase();
          const id = el.id ? `#${el.id}` : '';
          const cls = el.className && typeof el.className === 'string' 
            ? '.' + el.className.split(' ').slice(0,2).join('.') 
            : '';
          
          return `
            <div class="walker-item" data-index="${i}" style="
              padding: 6px 8px;
              margin: 2px 0;
              background: ${i === 0 ? 'rgba(137,180,250,0.2)' : 'rgba(255,255,255,0.05)'};
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: background 0.1s;
            ">
              <span style="color:#a6e3a1">&lt;${tag}&gt;</span>
              <span style="color:#f9e2af;font-size:11px">${id}${cls}</span>
            </div>
          `;
        }).join('')}
        <div style="margin-top:8px;font-size:11px;color:#666">Click to inspect • ESC to close</div>
      `;
      
      // Add click handlers
      this.walkerPanel.querySelectorAll('.walker-item').forEach((item) => {
        item.addEventListener('click', () => {
          const index = parseInt((item as HTMLElement).dataset.index || '0');
          const el = allElements[index];
          if (el) {
            this.closeWalker();
            this.isLocked = true;
            this.lockedTarget = el;
            this.currentTarget = el;
            this.inspect(el);
          }
        });
        item.addEventListener('mouseenter', () => {
          (item as HTMLElement).style.background = 'rgba(137,180,250,0.3)';
        });
        item.addEventListener('mouseleave', () => {
          (item as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
        });
      });
    }
    
    this.walkerPanel.style.display = 'block';
    this.isWalkerOpen = true;
  }

  private closeWalker() {
    if (this.walkerPanel) {
      this.walkerPanel.style.display = 'none';
    }
    this.isWalkerOpen = false;
  }

  private getAllElementsAtPoint(x: number, y: number): HTMLElement[] {
    const allElements: HTMLElement[] = [];
    
    // Recursive function to check all elements
    const checkElement = (el: Element) => {
      if (el === this.walkerPanel) return;
      if (el.id === 'css-inspector-pro-host') return;
      if (el === document.body || el === document.documentElement) return;
      
      const rect = el.getBoundingClientRect();
      
      // Check if point is inside this element's bounding box
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        allElements.push(el as HTMLElement);
      }
      
      // Check children
      for (const child of el.children) {
        checkElement(child);
      }
    };
    
    // Start from body
    for (const child of document.body.children) {
      checkElement(child);
    }
    
    // Sort by specificity (smaller elements first, they're usually more specific)
    allElements.sort((a, b) => {
      const areaA = a.offsetWidth * a.offsetHeight;
      const areaB = b.offsetWidth * b.offsetHeight;
      return areaA - areaB;
    });
    
    return allElements;
  }

  // ====== INSPECTION ======
  private handleMouseMove(e: MouseEvent) {
    if (!this.isActive || this.isLocked || this.isWalkerOpen) return;

    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[];
    
    const validElements = elements.filter(el => 
      el.id !== 'css-inspector-pro-host' && 
      el.id !== 'css-inspector-walker' &&
      !el.closest('#css-inspector-pro-host') &&
      el !== document.body &&
      el !== document.documentElement
    );

    if (validElements.length === 0) {
      this.ui.hide();
      return;
    }

    const depthIndex = Math.min(this.layerDepth, validElements.length - 1);
    const target = validElements[depthIndex];

    if (!target || target === this.currentTarget) return;

    this.currentTarget = target;
    this.inspect(target);
  }

  private updateXRayTarget() {
    if (this.isLocked || this.isWalkerOpen) return;
    
    const elements = document.elementsFromPoint(this.lastMouseX, this.lastMouseY) as HTMLElement[];
    
    const validElements = elements.filter(el => 
      el.id !== 'css-inspector-pro-host' && 
      el.id !== 'css-inspector-walker' &&
      !el.closest('#css-inspector-pro-host') &&
      el !== document.body &&
      el !== document.documentElement
    );

    if (validElements.length === 0) return;

    const depthIndex = Math.min(this.layerDepth, validElements.length - 1);
    const target = validElements[depthIndex];
    if (!target) return;

    this.currentTarget = target;
    this.inspect(target);
  }

  private inspect(el: HTMLElement) {
    if (!el || el === document.body || el === document.documentElement) {
       if (!this.isLocked) this.ui.hide();
       return;
    }

    const rect = el.getBoundingClientRect();
    const styles = window.getComputedStyle(el);

    requestAnimationFrame(() => {
      this.ui.update({
        rect,
        styles,
        tagName: el.tagName,
        isLocked: this.isLocked,
        element: el,
        layerDepth: this.layerDepth
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new InspectorEngine());
} else {
  new InspectorEngine();
}
