/**
 * CSS Inspector Pro - Main Controller
 */
import { InspectorUI } from './ui';

class InspectorEngine {
  private ui: InspectorUI;
  private isActive: boolean = true;
  private currentTarget: HTMLElement | null = null;
  private isLocked: boolean = false;
  private lockedTarget: HTMLElement | null = null;

  constructor() {
    this.ui = new InspectorUI();
    this.bindEvents();
    console.log('[CSS Inspector Pro] Engine Started');
  }

  private bindEvents() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
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
      this.ui.hide();
      console.log('[CSS Inspector Pro] Disabled');
    } else {
        console.log('[CSS Inspector Pro] Enabled');
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isActive) return;

    if (e.code === 'Space') {
      e.preventDefault(); 
      this.isLocked = !this.isLocked;

      if (this.isLocked && this.currentTarget) {
          this.lockedTarget = this.currentTarget;
          this.inspect(this.lockedTarget); 
      } else {
          this.lockedTarget = null;
      }
    }

    if (e.code === 'Escape') {
      this.isLocked = false;
      this.lockedTarget = null;
      this.ui.hide();
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isActive || this.isLocked) return;

    const target = e.target as HTMLElement;

    if (target.id === 'css-inspector-pro-host') return;
    if (target === this.currentTarget) return; // Opt

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
        element: el // Passing the full element now
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new InspectorEngine());
} else {
  new InspectorEngine();
}
