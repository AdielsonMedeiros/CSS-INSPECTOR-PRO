/**
 * Utility to convert raw CSS values to Tailwind classes.
 * Focuses on Human-Readable standard classes over arbitrary values.
 */



// Named Colors Map (Simplified for MVP)
const NAMED_COLORS: Record<string, string> = {
  '#000000': 'black',
  '#ffffff': 'white',
  'transparent': 'transparent',
  '#ef4444': 'red-500',
  '#3b82f6': 'blue-500',
  '#10b981': 'green-500',
  '#f59e0b': 'amber-500',
  // Add more as needed or use a library like 'nearest-color' in future
};

export function rgbToHex(rgb: string): string {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return 'transparent';
  if (rgb.startsWith('#')) return rgb;

  // Extrai o que está dentro dos parênteses: rgb(1, 2, 3) -> "1, 2, 3"
  const match = rgb.match(/\((.*?)\)/);
  if (!match || !match[1]) return 'transparent';

  // Divide por vírgula, barra ou espaço e limpa vazios
  const parts = match[1].split(/[,/ ]+/).filter(Boolean);

  const r = parseInt(parts[0] || '0').toString(16).padStart(2, '0');
  const g = parseInt(parts[1] || '0').toString(16).padStart(2, '0');
  const b = parseInt(parts[2] || '0').toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`;
}

export function getColorClass(prop: 'text' | 'bg' | 'border', hex: string): string {
  if (hex === 'transparent') return `${prop}-transparent`;
  
  const named = NAMED_COLORS[hex.toLowerCase()];
  if (named) return `${prop}-${named}`;
  
  return `${prop}-[${hex}]`; // Fallback to arbitrary
}

export const getSpacing = (px: string, prefix: string): string => {
  const val = parseFloat(px);
  if (val === 0 || isNaN(val)) return '';
  
  // Tailwind Scale (px -> unit)
  // 1 = 4px, 4 = 16px, etc.
  const units = val / 4;
  
  // Checking common breakpoints
  if (units === 0.5) return `${prefix}-0.5`; // 2px
  if (units === 1.5) return `${prefix}-1.5`; // 6px
  if (units === 2.5) return `${prefix}-2.5`; // 10px
  if (Number.isInteger(units)) return `${prefix}-${units}`;
  
  // If extremely close to integer (browser rendering weirdness), snap it
  if (Math.abs(units - Math.round(units)) < 0.1) return `${prefix}-${Math.round(units)}`;

  return `${prefix}-[${val}px]`;
};

export const getFontSize = (px: string): string => {
  const size = parseFloat(px);
  // Default browser size is usually 16px
  if (size === 16) return 'text-base';
  if (size === 14) return 'text-sm';
  if (size === 12) return 'text-xs';
  if (size === 18) return 'text-lg';
  if (size === 20) return 'text-xl';
  if (size === 24) return 'text-2xl';
  if (size === 30) return 'text-3xl';
  if (size === 36) return 'text-4xl';
  if (size === 48) return 'text-5xl';
  
  return `text-[${size}px]`;
};

export const getFontWeight = (weight: string): string => {
  // Convert standard weights names
  const map: Record<string, string> = {
    '100': 'font-thin',
    '200': 'font-extralight',
    '300': 'font-light',
    '400': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
    '800': 'font-extrabold',
    '900': 'font-black',
  };
  return map[weight] || '';
};

// Helper para simplificar sombras
function getShadowClass(shadow: string): string {
    if (!shadow || shadow === 'none') return '';
    // Simplificação: Tailwind tem sombras padrão (sm, md, lg, etc)
    // Mapear exatamente é difícil, então vamos usar arbitrary value se for complexo
    // Mas se for comum, tentamos aproximar (futuro). Por enquanto, arbitrary é mais seguro.
    return `shadow-[${shadow.replace(/, /g, ',')}]`; 
}

export function cssToTailwind(styles: CSSStyleDeclaration, width: number, height: number): string {
  const classes: string[] = [];

  const display = styles.display;
  const pos = styles.position;
  
  if (pos === 'absolute') classes.push('absolute');
  if (pos === 'fixed') classes.push('fixed');
  if (pos === 'relative' && styles.zIndex !== 'auto') classes.push('relative'); 
  
  if (display === 'flex') {
    classes.push('flex');
    if (styles.flexDirection === 'column') classes.push('flex-col');
    if (styles.flexWrap === 'wrap') classes.push('flex-wrap');
    
    if (styles.alignItems === 'center') classes.push('items-center');
    else if (styles.alignItems === 'flex-start') classes.push('items-start');
    else if (styles.alignItems === 'flex-end') classes.push('items-end');
    
    if (styles.justifyContent === 'center') classes.push('justify-center');
    else if (styles.justifyContent === 'space-between') classes.push('justify-between');
    else if (styles.justifyContent === 'flex-end') classes.push('justify-end');

    if (styles.gap !== '0px') classes.push(getSpacing(styles.gap, 'gap'));
  } 
  else if (display === 'grid') {
      classes.push('grid');
      if (styles.gap !== '0px') classes.push(getSpacing(styles.gap, 'gap'));
  }
  else if (display === 'none') classes.push('hidden');
  else if (display === 'inline-block') classes.push('inline-block');
  else if (display === 'block' && parseFloat(styles.width) > 0) {
      // Intentionally empty
  }

  const sides = ['top', 'right', 'bottom', 'left'];
  const m = sides.map(s => parseFloat(styles.getPropertyValue(`margin-${s}`))) as [number, number, number, number];
  const p = sides.map(s => parseFloat(styles.getPropertyValue(`padding-${s}`))) as [number, number, number, number];

  if (p[0] === p[1] && p[0] === p[2] && p[0] === p[3] && p[0] !== 0) {
      classes.push(getSpacing(p[0].toString(), 'p'));
  } else {
      if(p[0] === p[2] && p[0] !== 0) classes.push(getSpacing(p[0].toString(), 'py'));
      else {
           if(p[0] !== 0) classes.push(getSpacing(p[0].toString(), 'pt'));
           if(p[2] !== 0) classes.push(getSpacing(p[2].toString(), 'pb'));
      }
      if(p[1] === p[3] && p[1] !== 0) classes.push(getSpacing(p[1].toString(), 'px'));
      else {
           if(p[3] !== 0) classes.push(getSpacing(p[3].toString(), 'pl'));
           if(p[1] !== 0) classes.push(getSpacing(p[1].toString(), 'pr'));
      }
  }

  if (m[0] === m[1] && m[0] === m[2] && m[0] === m[3] && m[0] !== 0) {
      classes.push(getSpacing(m[0].toString(), 'm'));
  } else {
       if(m[0] === m[2] && m[0] !== 0) classes.push(getSpacing(m[0].toString(), 'my'));
       if(m[1] === m[3] && m[1] !== 0) classes.push(getSpacing(m[1].toString(), 'mx'));
  }

  if (parseFloat(styles.fontSize) !== 16) classes.push(getFontSize(styles.fontSize));
  if (styles.fontWeight !== '400') classes.push(getFontWeight(styles.fontWeight));
  if (styles.fontStyle === 'italic') classes.push('italic');
  if (styles.textTransform === 'uppercase') classes.push('uppercase');
  if (styles.textAlign !== 'start') classes.push(`text-${styles.textAlign}`);

  const textColor = rgbToHex(styles.color);
  if (textColor !== '#000000') classes.push(getColorClass('text', textColor));

  const bgColor = rgbToHex(styles.backgroundColor);
  if (bgColor !== 'transparent') classes.push(getColorClass('bg', bgColor));

  // --- Radius Logic Melhorada ---
  const radiusStr = styles.borderRadius;
  const radiusVal = parseFloat(radiusStr);
  
  if (radiusVal > 0) {
      // Se for porcentagem
      if (radiusStr.includes('%')) {
          if (radiusVal >= 50) classes.push('rounded-full');
          else classes.push(`rounded-[${radiusVal}%]`);
      } 
      // Se for pixel (ou numérico simples)
      else {
          const minDim = Math.min(width, height);
          // Verifica se é visualmente um círculo (raio >= metade do tamanho)
          if (radiusVal >= (minDim / 2) - 1) { 
              classes.push('rounded-full');
          } else {
             if (radiusVal === 4) classes.push('rounded');
             else if (radiusVal === 6) classes.push('rounded-md');
             else if (radiusVal === 8) classes.push('rounded-lg');
             else if (radiusVal === 12) classes.push('rounded-xl');
             else if (radiusVal === 2) classes.push('rounded-sm');
             else classes.push(`rounded-[${radiusVal}px]`);
          }
      }
  }

  // --- Box Shadow ---
  if (styles.boxShadow && styles.boxShadow !== 'none') {
      classes.push(getShadowClass(styles.boxShadow));
  }

  if (styles.borderWidth && parseFloat(styles.borderWidth) > 0 && styles.borderColor !== 'transparent') {
      classes.push(`border-[${parseFloat(styles.borderWidth)}px]`); 
      classes.push(getColorClass('border', rgbToHex(styles.borderColor)));
  }

  return classes.filter(Boolean).join(' ');
}
