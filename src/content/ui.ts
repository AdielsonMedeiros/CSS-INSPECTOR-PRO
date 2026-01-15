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
  private activeSrc: string = '';

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
    
    // Copy Image Source
    if (target.closest('.source-row')) {
       const row = target.closest('.source-row') as HTMLElement;
       this.copyToClipboard(this.activeSrc, row);
    }
  }

  private async copyToClipboard(text: string, triggerEl: HTMLElement) {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      
      triggerEl.classList.add('copied');
      

      // Simple feedback: change text color or icon
      // For badge we handle icon separately in CSS/JS
      
      // If image source row
      if (triggerEl.classList.contains('source-row')) {
           const val = triggerEl.querySelector('.value');
           if (val) {
               const oldText = val.textContent;
               val.textContent = 'COPIED LINK!';
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

      .source-row {
        background: rgba(255,255,255,0.05);
        padding: 6px 8px;
        border-radius: 4px;
        margin-bottom: 8px;
        cursor: pointer;
        border: 1px solid transparent;
      }
      .source-row:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.1);
      }
      .source-row .value { color: #60a5fa; text-decoration: underline; max-width: 200px; }

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
  }) {
    const { rect, styles, tagName, isLocked, element } = params;

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
    this.activeSrc = '';
    
    if (tagName === 'IMG') {
        const src = (element as HTMLImageElement).src;
        if (src) {
            this.activeSrc = src;
            // Shorten URL for display
            const filename = src.split('/').pop() || src;
            const displaySrc = filename.length > 25 ? filename.substring(0, 22) + '...' : filename;
            
            sourceContent = `
              <div class="row source-row" title="${src} (Click to Copy Link)">
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
       <div class="row">
        <span class="label">Radius</span>
        <span class="value">${radius}</span>
      </div>
      <div class="row">
        <span class="label">Shadow</span>
        <span class="value" title="${styles.boxShadow}">${shadowDisplay}</span>
      </div>
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

      <div class="row">
         <span class="label">Color</span>
         <span class="value"><span class="color-preview" style="background:${hexColor}"></span>${hexColor}</span>
      </div>

      <div class="lock-hint">
        ${isLocked ? 'LOCKED' : 'SPACE to Lock'}
      </div>
    `;
  }

  hide() {
    this.highlightEl.style.display = 'none';
    this.cardEl.classList.remove('visible');
  }
}
