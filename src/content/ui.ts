/**
 * Manages the Visual Interface inside Shadow DOM.
 */
import { cssToTailwind, rgbToHex } from './tailwind';

// Simple Icons
const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const LINK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;

export class InspectorUI {
  private host: HTMLElement;
  private shadow: ShadowRoot;
  private highlightEl: HTMLElement;
  private cardEl: HTMLElement;
  private activeStyles: string = '';


  constructor() {
    this.host = document.createElement('div');
    this.host.id = 'css-inspector-pro-host';
    this.host.style.cssText = 'all: initial; position: fixed; top: 0; left: 0; z-index: 2147483647; pointer-events: none; width: 0; height: 0;';
    
    this.shadow = this.host.attachShadow({ mode: 'closed' });
    this.injectStyles();
    
    this.highlightEl = document.createElement('div');
    this.highlightEl.className = 'highlight-box';
    
    this.cardEl = document.createElement('div');
    this.cardEl.className = 'inspector-card';

    this.shadow.append(this.highlightEl, this.cardEl);
    document.body.appendChild(this.host);

    this.cardEl.addEventListener('click', (e) => this.handleCardClick(e));
  }

  private handleCardClick(e: Event) {
    const target = e.target as HTMLElement;
    
    // Copy Tailwind
    if (target.closest('.tw-badge')) {
      const badge = target.closest('.tw-badge') as HTMLElement;
      this.copyToClipboard(this.activeStyles, badge);
    }
    
    // Generic Copy Row (Source, Shadow, Effects)
    if (target.closest('.interactive-row')) {
       const row = target.closest('.interactive-row') as HTMLElement;
       const val = row.getAttribute('data-copy');
       if (val) this.copyToClipboard(val, row);
    }
  }

  private async copyToClipboard(text: string, triggerEl: HTMLElement) {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      
      triggerEl.classList.add('copied');
      

      // Simple feedback: change text color or icon
      // For badge we handle icon separately in CSS/JS
      
      // If generic interactive row
      if (triggerEl.classList.contains('interactive-row') || triggerEl.classList.contains('source-row')) {
           const val = triggerEl.querySelector('.value');
           if (val) {
               const oldText = val.textContent;
               val.textContent = 'COPIED!';
               val.classList.add('success');
               setTimeout(() => {
                   val.textContent = oldText;
                   val.classList.remove('success');
                   triggerEl.classList.remove('copied');
               }, 1200);
           }
      } else {
        // Tailwind badge logic
        const iconContainer = triggerEl.querySelector('.icon-box');
        if (iconContainer) iconContainer.innerHTML = CHECK_ICON;

        setTimeout(() => {
            triggerEl.classList.remove('copied');
            if (iconContainer) iconContainer.innerHTML = COPY_ICON;
        }, 1200);
      }

    } catch (err) {}
  }

  private injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :host { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      
      .highlight-box {
        position: fixed;
        border: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        pointer-events: none;
        z-index: 10;
        display: none;
      }
      .highlight-box.locked { border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); }

      .inspector-card {
        position: fixed;
        background: rgba(15, 15, 15, 0.98);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.1);
        color: #e5e7eb;
        padding: 12px;
        border-radius: 10px;
        font-size: 11px;
        z-index: 20;
        display: none;
        box-shadow: 0 15px 30px rgba(0,0,0,0.5);
        pointer-events: auto;
        
        width: max-content;
        max-width: 320px;
        min-width: 240px;
      }

      .inspector-card.visible { display: block; animation: fadeIn 0.1s ease-out; }

      .row { display: flex; justify-content: space-between; margin-bottom: 4px; align-items: center; gap: 16px; }
      .label { color: #888; font-family: sans-serif; font-weight: 500; white-space: nowrap; }
      .value { 
          font-family: 'Menlo', monospace; 
          color: #fff; 
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }
      .value.success { color: #10b981; }
      .accent { color: #60a5fa; }
      
      .tw-badge {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        background: #3b82f6;
        color: white;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-family: 'Menlo', monospace;
        margin-bottom: 12px;
        width: 100%;
        text-align: left;
        cursor: pointer;
        box-sizing: border-box;
        font-weight: 500;
        transition: background 0.2s, transform 0.1s;
      }
      .tw-badge:hover { opacity: 0.95; }
      .tw-badge:active { transform: scale(0.98); }
      .tw-badge.copied { background: #10b981; }

      .tw-content {
        white-space: pre-wrap; 
        word-break: break-all;
        line-height: 1.4;
        max-height: 80px; 
        overflow-y: auto;
        flex: 1;
      }
      .icon-box { flex-shrink: 0; opacity: 0.8; }

      .source-row, .interactive-row {
        background: rgba(255,255,255,0.05);
        padding: 4px 8px; /* Compact padding */
        border-radius: 4px;
        margin-bottom: 4px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
      }
      .source-row:hover, .interactive-row:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.1);
      }
      .source-row .value, .interactive-row .value { color: #60a5fa; text-decoration: underline; max-width: 200px; }

      .sep { height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0; }
      .color-preview { width: 10px; height: 10px; border-radius: 2px; border: 1px solid #444; display: inline-block; vertical-align: middle; margin-right: 6px; }
      .lock-hint { font-size: 9px; color: #555; text-align: right; margin-top: 6px; }

      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    `;
    this.shadow.appendChild(style);
  }

  update(params: { 
    rect: DOMRect, 
    styles: CSSStyleDeclaration, 
    tagName: string, 
    isLocked: boolean
    element: HTMLElement
    layerDepth?: number
  }) {
    const { rect, styles, tagName, isLocked, element, layerDepth = 0 } = params;

    const tailwindClasses = cssToTailwind(styles, rect.width, rect.height);
    this.activeStyles = tailwindClasses;
    
    // Standard Props
    const fontFamily = (styles.fontFamily || '').split(',')[0]?.replace(/['"]/g, '') || 'System';
    const fontSize = Math.round(parseFloat(styles.fontSize));
    const fontWeight = styles.fontWeight;
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const hexColor = rgbToHex(styles.color);
    
    // Detail Props
    const display = styles.display;
    const pos = styles.position !== 'static' ? styles.position : '';
    const radius = styles.borderRadius !== '0px' ? styles.borderRadius : '-';
    // Se for rounded-full (nosso detec), mostra 50% ou Full na tabela pra ficar bonito?
    // Vamos manter o valor real do browser se possível, ou simplificar.
    // O browser geralmente retorna PX. Se quisermos mostrar %, precisaríamos calcular.
    // Vou deixar o valor nativo por enquanto (que é preciso).

    const p = styles.padding === '0px' ? '-' : styles.padding;
    const m = styles.margin === '0px' ? '-' : styles.margin;
    
 
    // Mostrar 'Yes' ou um resumo curto, pois shadow string é gigante.
    // Se for pequena, mostra.
    let shadowDisplay = '-';
    if (styles.boxShadow && styles.boxShadow !== 'none') {
        shadowDisplay = 'On'; // Simples, já que a string é enorme e complexa de ler
    }

    // Image Source Logic
    let sourceContent = '';

    
    if (tagName === 'IMG') {
        const src = (element as HTMLImageElement).src;
        if (src) {
            
            // Shorten URL for display
            const filename = src.split('/').pop() || src;
            const displaySrc = filename.length > 25 ? filename.substring(0, 22) + '...' : filename;
            
            sourceContent = `
              <div class="row interactive-row" data-copy="${src}" title="${src} (Click to Copy Link)">
                <span class="label" style="display:flex;align-items:center;gap:4px">
                  ${LINK_ICON} Source
                </span>
                <span class="value">${displaySrc}</span>
              </div>
              <div class="sep"></div>
            `;
        }
    }

    if (isLocked) this.highlightEl.classList.add('locked');
    else this.highlightEl.classList.remove('locked');

    this.highlightEl.style.display = 'block';
    this.highlightEl.style.top = `${rect.top}px`;
    this.highlightEl.style.left = `${rect.left}px`;
    this.highlightEl.style.width = `${rect.width}px`;
    this.highlightEl.style.height = `${rect.height}px`;

    this.cardEl.classList.add('visible');
    
    const CARD_WIDTH = 340; // Max width safe margin
    let left = rect.right + 20;
    let top = rect.top;
    
    // Se não couber na direita, joga para a esquerda
    if (left + CARD_WIDTH > window.innerWidth) {
        left = rect.left - CARD_WIDTH - 20;
    }

    // Se ficar muito na esquerda (negativo), cola na borda esquerda
    if (left < 10) left = 10;
    
    // Se ainda assim estiver vazando na direita (caso de tela muito pequena + elemento gigante), limita max
    if (left + 320 > window.innerWidth) {
        left = window.innerWidth - 330;
    }

    if (top + 300 > window.innerHeight) top = window.innerHeight - 300;
    if (top < 10) top = 10;

    this.cardEl.style.top = `${top}px`;
    this.cardEl.style.left = `${left}px`;

    this.cardEl.innerHTML = `
      <div class="tw-badge" title="Click to copy">
        <div class="tw-content">${tailwindClasses || 'No styles detected'}</div>
        <div class="icon-box">${COPY_ICON}</div>
      </div>
      
      <div class="row">
        <span class="label">Element</span>
        <span class="value accent">&lt;${tagName.toLowerCase()}&gt;</span>
      </div>

      <div class="row">
        <span class="label">Size</span>
        <span class="value">${w} x ${h} px</span>
      </div>

      <div class="sep"></div>
      
      ${sourceContent}

      <div class="row">
        <span class="label">Display</span>
        <span class="value">${display} ${pos ? `(${pos})` : ''}</span>
      </div>
      ${styles.overflow !== 'visible' ? `
      <div class="row">
        <span class="label">Overflow</span>
        <span class="value">${styles.overflow}</span>
      </div>` : ''}
      ${styles.zIndex !== 'auto' ? `
      <div class="row">
        <span class="label">Z-Index</span>
        <span class="value">${styles.zIndex}</span>
      </div>` : ''}
       <div class="row">
        <span class="label">Radius</span>
        <span class="value">${radius}</span>
      </div>
      
      <div class="sep"></div>
      
      <div class="row ${styles.boxShadow !== 'none' ? 'interactive-row' : ''}" 
           ${styles.boxShadow !== 'none' ? `data-copy="box-shadow: ${styles.boxShadow};"` : ''} 
           title="${styles.boxShadow !== 'none' ? 'Click to Copy Shadow' : ''}">
        <span class="label">Shadow</span>
        <span class="value" title="${styles.boxShadow}">${shadowDisplay}</span>
      </div>
      ${parseFloat(styles.opacity) < 1 ? `
      <div class="row">
        <span class="label">Opacity</span>
        <span class="value">${Math.round(parseFloat(styles.opacity) * 100)}%</span>
      </div>` : ''}
      ${styles.transform !== 'none' ? `
      <div class="row interactive-row" data-copy="transform: ${styles.transform};" title="Click to Copy Transform">
        <span class="label">Transform</span>
        <span class="value" title="${styles.transform}">Yes</span>
      </div>` : ''}
      ${styles.filter !== 'none' ? `
      <div class="row interactive-row" data-copy="filter: ${styles.filter};" title="Click to Copy Filter">
        <span class="label">Filter</span>
        <span class="value" title="${styles.filter}">Yes</span>
      </div>` : ''}
      ${styles.animationName !== 'none' ? (() => {
          const fullCSS = `animation: ${styles.animationName} ${styles.animationDuration} ${styles.animationTimingFunction} ${styles.animationDelay} ${styles.animationIterationCount} ${styles.animationDirection};`;
          const title = `Name: ${styles.animationName}\nDuration: ${styles.animationDuration}\nTiming: ${styles.animationTimingFunction}\nDelay: ${styles.animationDelay}\nIteration: ${styles.animationIterationCount}\nDirection: ${styles.animationDirection}`;
          return `
          <div class="row interactive-row" data-copy="${fullCSS}" title="Click to Copy Animation">
            <span class="label">Animation</span>
            <span class="value" title="${title}">${styles.animationName} (${styles.animationDuration})</span>
          </div>`;
      })() : ''}
      ${parseFloat(styles.transitionDuration) > 0 ? (() => {
          const fullCSS = `transition: ${styles.transitionProperty} ${styles.transitionDuration} ${styles.transitionTimingFunction} ${styles.transitionDelay};`;
          const title = `Props: ${styles.transitionProperty}\nDuration: ${styles.transitionDuration}\nTiming: ${styles.transitionTimingFunction}\nDelay: ${styles.transitionDelay}`;
          return `
          <div class="row interactive-row" data-copy="${fullCSS}" title="Click to Copy Transition">
            <span class="label">Transition</span>
            <span class="value" title="${title}">${styles.transitionProperty.split(',')[0]} (${styles.transitionDuration.split(',')[0]})</span>
          </div>`;
      })() : ''}
      
      <div class="sep"></div>
      
      <div class="row">
        <span class="label">Padding</span>
        <span class="value" title="${styles.padding}">${p}</span>
      </div>
      <div class="row">
        <span class="label">Margin</span>
        <span class="value" title="${styles.margin}">${m}</span>
      </div>

      <div class="sep"></div>

      <div class="row">
        <span class="label">Font</span>
        <span class="value" title="${styles.fontFamily}">${fontFamily}</span>
      </div>

      <div class="row">
        <span class="label">Type</span>
        <span class="value">${fontSize}px / ${fontWeight}</span>
      </div>
      ${styles.lineHeight !== 'normal' ? `
      <div class="row">
        <span class="label">Line-H</span>
        <span class="value">${styles.lineHeight}</span>
      </div>` : ''}

      <div class="row">
         <span class="label">Color</span>
         <span class="value"><span class="color-preview" style="background:${hexColor}"></span>${hexColor}</span>
      </div>
      
      ${tagName === 'IMG' ? `
      <div class="sep"></div>
      <div class="row">
        <span class="label">Object-Fit</span>
        <span class="value">${styles.objectFit || 'fill'}</span>
      </div>
      ${styles.aspectRatio !== 'auto' ? `
      <div class="row">
        <span class="label">Aspect</span>
        <span class="value">${styles.aspectRatio}</span>
      </div>` : ''}
      ` : ''}
      
      ${styles.cursor !== 'auto' && styles.cursor !== 'default' ? `
      <div class="row">
        <span class="label">Cursor</span>
        <span class="value">${styles.cursor}</span>
      </div>` : ''}
      
      ${styles.display === 'grid' ? `
      <div class="sep"></div>
      ${styles.gridTemplateColumns !== 'none' ? `
      <div class="row interactive-row" data-copy="grid-template-columns: ${styles.gridTemplateColumns};" title="Click to Copy">
        <span class="label">Grid Cols</span>
        <span class="value" title="${styles.gridTemplateColumns}">Yes</span>
      </div>` : ''}
      ${styles.gridTemplateRows !== 'none' ? `
      <div class="row interactive-row" data-copy="grid-template-rows: ${styles.gridTemplateRows};" title="Click to Copy">
        <span class="label">Grid Rows</span>
        <span class="value" title="${styles.gridTemplateRows}">Yes</span>
      </div>` : ''}
      ` : ''}
      
      ${styles.backdropFilter !== 'none' ? `
      <div class="row interactive-row" data-copy="backdrop-filter: ${styles.backdropFilter};" title="Click to Copy Backdrop Filter">
        <span class="label">Backdrop</span>
        <span class="value" title="${styles.backdropFilter}">Yes</span>
      </div>` : ''}
      
      ${styles.mixBlendMode !== 'normal' ? `
      <div class="row">
        <span class="label">Blend</span>
        <span class="value">${styles.mixBlendMode}</span>
      </div>` : ''}
      
      ${styles.backgroundImage !== 'none' ? (() => {
        // Extract readable info from background-image
        let bgDisplay = '';
        if (styles.backgroundImage.includes('linear-gradient')) {
          bgDisplay = 'linear-gradient(...)';
        } else if (styles.backgroundImage.includes('radial-gradient')) {
          bgDisplay = 'radial-gradient(...)';
        } else if (styles.backgroundImage.includes('url(')) {
          // Extract filenames from URLs
          const urls = styles.backgroundImage.match(/url\([^)]+\)/g) || [];
          const filenames = urls.map(u => {
            const match = u.match(/\/([^\/\)]+)\)/);
            return match?.[1]?.substring(0, 20) || 'image';
          });
          bgDisplay = filenames.length > 1 ? `${filenames.length} images` : filenames[0] || 'image';
        } else {
          bgDisplay = 'custom';
        }
        // Escape quotes for HTML attributes
        const cssValue = `background-image: ${styles.backgroundImage};`;
        return `
        <div class="row interactive-row" data-copy="${cssValue.replace(/"/g, '&quot;')}" title="Click to copy full CSS">
          <span class="label">BG Image</span>
          <span class="value">${bgDisplay}</span>
        </div>`;
      })() : ''}
      
      ${styles.clipPath !== 'none' ? `
      <div class="row interactive-row" data-copy="clip-path: ${styles.clipPath};" title="Click to Copy Clip Path">
        <span class="label">Clip Path</span>
        <span class="value" title="${styles.clipPath}">Yes</span>
      </div>` : ''}
      
      ${(styles.scrollSnapType !== 'none' || styles.scrollSnapAlign !== 'none') ? `
      <div class="row">
        <span class="label">Scroll</span>
        <span class="value">Snap</span>
      </div>` : ''}

      ${styles.willChange !== 'auto' ? `
      <div class="row">
        <span class="label">Optimize</span>
        <span class="value">${styles.willChange}</span>
      </div>` : ''}
      
      ${(styles.userSelect !== 'auto' || styles.pointerEvents !== 'auto') ? `
      <div class="row">
        <span class="label">Interact</span>
        <span class="value">${styles.pointerEvents === 'none' ? 'No Pointer' : styles.userSelect}</span>
      </div>` : ''}
      
      ${styles.outlineStyle !== 'none' && parseFloat(styles.outlineWidth) > 0 ? `
      <div class="row interactive-row" data-copy="outline: ${styles.outlineWidth} ${styles.outlineStyle} ${styles.outlineColor};" title="Click to Copy Outline">
        <span class="label">Outline</span>
        <span class="value">${styles.outlineWidth} ${styles.outlineStyle}</span>
      </div>` : ''}
      
      ${styles.visibility !== 'visible' ? `
      <div class="row">
        <span class="label">Visibility</span>
        <span class="value">${styles.visibility}</span>
      </div>` : ''}
      
      ${styles.columnCount !== 'auto' ? `
      <div class="row">
        <span class="label">Columns</span>
        <span class="value">${styles.columnCount}</span>
      </div>` : ''}
      
      ${styles.touchAction !== 'auto' ? `
      <div class="row">
        <span class="label">Touch</span>
        <span class="value">${styles.touchAction}</span>
      </div>` : ''}
      
      ${styles.scrollBehavior === 'smooth' ? `
      <div class="row">
        <span class="label">Scroll</span>
        <span class="value">Smooth</span>
      </div>` : ''}
      
      ${styles.order !== '0' ? `
      <div class="row">
        <span class="label">Order</span>
        <span class="value">${styles.order}</span>
      </div>` : ''}
      
      ${styles.cssFloat !== 'none' ? `
      <div class="row">
        <span class="label">Float</span>
        <span class="value">${styles.cssFloat}</span>
      </div>` : ''}
      
      ${styles.isolation === 'isolate' ? `
      <div class="row">
        <span class="label">Isolation</span>
        <span class="value">isolate</span>
      </div>` : ''}
      
      ${styles.listStyleType !== 'none' && styles.listStyleType !== 'disc' ? `
      <div class="row">
        <span class="label">List</span>
        <span class="value">${styles.listStyleType}</span>
      </div>` : ''}
      
      ${styles.flexGrow !== '0' && styles.display === 'flex' ? `
      <div class="row">
        <span class="label">Grow</span>
        <span class="value">${styles.flexGrow}</span>
      </div>` : ''}
      
      ${styles.flexShrink !== '1' && styles.display === 'flex' ? `
      <div class="row">
        <span class="label">Shrink</span>
        <span class="value">${styles.flexShrink}</span>
      </div>` : ''}

      <div class="lock-hint">
        ${layerDepth > 0 ? `<span style="color:#facc15">X-RAY L${layerDepth}</span> | ` : ''}${isLocked ? 'LOCKED' : 'SHIFT+] Deeper'}
      </div>
    `;
  }

  hide() {
    this.highlightEl.style.display = 'none';
    this.cardEl.classList.remove('visible');
  }
}
