/**
 * CSS Inspector Pro - Tailwind Converter Engine V2
 * Comprehensive CSS to Tailwind conversion with high precision.
 */

// ============ COLOR UTILITIES ============

const NAMED_COLORS: Record<string, string> = {
  '#000000': 'black',
  '#ffffff': 'white',
  'transparent': 'transparent',
  '#ef4444': 'red-500',
  '#3b82f6': 'blue-500',
  '#10b981': 'green-500',
  '#f59e0b': 'amber-500',
  '#8b5cf6': 'violet-500',
  '#ec4899': 'pink-500',
  '#06b6d4': 'cyan-500',
  '#f97316': 'orange-500',
  '#84cc16': 'lime-500',
  '#14b8a6': 'teal-500',
  '#6366f1': 'indigo-500',
};

export function rgbToHex(rgb: string): string {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return 'transparent';
  if (rgb.startsWith('#')) return rgb;

  const match = rgb.match(/\((.*?)\)/);
  if (!match || !match[1]) return 'transparent';

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
  return `${prop}-[${hex}]`;
}

// ============ SPACING UTILITIES ============

export const getSpacing = (px: string, prefix: string): string => {
  const val = parseFloat(px);
  if (val === 0 || isNaN(val)) return '';
  
  const units = val / 4;
  
  if (units === 0.5) return `${prefix}-0.5`;
  if (units === 1.5) return `${prefix}-1.5`;
  if (units === 2.5) return `${prefix}-2.5`;
  if (Number.isInteger(units) && units <= 96) return `${prefix}-${units}`;
  if (Math.abs(units - Math.round(units)) < 0.1) return `${prefix}-${Math.round(units)}`;

  return `${prefix}-[${val}px]`;
};

// ============ TYPOGRAPHY UTILITIES ============

export const getFontSize = (px: string): string => {
  const size = parseFloat(px);
  const map: Record<number, string> = {
    10: 'text-[10px]', 12: 'text-xs', 14: 'text-sm', 16: 'text-base',
    18: 'text-lg', 20: 'text-xl', 24: 'text-2xl', 30: 'text-3xl',
    36: 'text-4xl', 48: 'text-5xl', 60: 'text-6xl', 72: 'text-7xl',
  };
  return map[size] || `text-[${size}px]`;
};

export const getFontWeight = (weight: string): string => {
  const map: Record<string, string> = {
    '100': 'font-thin', '200': 'font-extralight', '300': 'font-light',
    '400': 'font-normal', '500': 'font-medium', '600': 'font-semibold',
    '700': 'font-bold', '800': 'font-extrabold', '900': 'font-black',
  };
  return map[weight] || '';
};

export const getLineHeight = (lh: string, fontSize: string): string => {
  const val = parseFloat(lh);
  const fs = parseFloat(fontSize);
  if (isNaN(val) || isNaN(fs)) return '';
  
  const ratio = val / fs;
  if (ratio === 1) return 'leading-none';
  if (ratio >= 1.2 && ratio <= 1.3) return 'leading-tight';
  if (ratio >= 1.4 && ratio <= 1.5) return 'leading-normal';
  if (ratio >= 1.6 && ratio <= 1.7) return 'leading-relaxed';
  if (ratio >= 1.8) return 'leading-loose';
  
  return `leading-[${lh}]`;
};

export const getLetterSpacing = (ls: string): string => {
  if (!ls || ls === 'normal') return '';
  const val = parseFloat(ls);
  if (isNaN(val) || val === 0) return '';
  if (val < 0) return 'tracking-tight';
  if (val > 0 && val <= 0.5) return 'tracking-normal';
  if (val > 0.5 && val <= 1) return 'tracking-wide';
  if (val > 1) return 'tracking-wider';
  return '';
};

// ============ EFFECTS UTILITIES ============

function getShadowClass(shadow: string): string {
  if (!shadow || shadow === 'none') return '';
  
  // Try to match common shadows
  if (shadow.includes('0px 1px 2px')) return 'shadow-sm';
  if (shadow.includes('0px 4px 6px')) return 'shadow';
  if (shadow.includes('0px 10px 15px')) return 'shadow-lg';
  if (shadow.includes('0px 20px 25px')) return 'shadow-xl';
  if (shadow.includes('0px 25px 50px')) return 'shadow-2xl';
  
  return `shadow-[${shadow.replace(/, /g, ',')}]`;
}

function getOpacityClass(opacity: string): string {
  const val = parseFloat(opacity);
  if (val === 1) return '';
  const percent = Math.round(val * 100);
  const standards = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100];
  if (standards.includes(percent)) return `opacity-${percent}`;
  return `opacity-[${val}]`;
}

function getOverflowClass(overflow: string): string {
  if (overflow === 'visible') return '';
  if (overflow === 'hidden') return 'overflow-hidden';
  if (overflow === 'scroll') return 'overflow-scroll';
  if (overflow === 'auto') return 'overflow-auto';
  return '';
}

function getZIndexClass(z: string): string {
  if (z === 'auto' || z === '0') return '';
  const val = parseInt(z);
  const standards = [10, 20, 30, 40, 50];
  if (standards.includes(val)) return `z-${val}`;
  return `z-[${val}]`;
}

function getCursorClass(cursor: string): string {
  const map: Record<string, string> = {
    'pointer': 'cursor-pointer',
    'default': '',
    'wait': 'cursor-wait',
    'text': 'cursor-text',
    'move': 'cursor-move',
    'not-allowed': 'cursor-not-allowed',
    'grab': 'cursor-grab',
    'grabbing': 'cursor-grabbing',
    'zoom-in': 'cursor-zoom-in',
    'zoom-out': 'cursor-zoom-out',
  };
  return map[cursor] || '';
}

function getObjectFitClass(fit: string): string {
  if (!fit || fit === 'fill') return ''; // fill is default, skip it
  const map: Record<string, string> = {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'none': 'object-none',
    'scale-down': 'object-scale-down',
  };
  return map[fit] || '';
}

function getAspectRatioClass(ratio: string): string {
  if (ratio === 'auto') return '';
  if (ratio === '1 / 1') return 'aspect-square';
  if (ratio === '16 / 9') return 'aspect-video';
  if (ratio === '4 / 3') return 'aspect-[4/3]';
  return `aspect-[${ratio.replace(/ /g, '')}]`;
}

// ============ SIZE UTILITIES ============

function getSizeClass(value: string, prefix: 'w' | 'h'): string {
  if (!value) return '';
  const val = parseFloat(value);
  if (isNaN(val)) return '';
  
  // Check for viewport units
  if (value.includes('vw') || value.includes('vh') || value.includes('vmin') || value.includes('vmax')) {
    return `${prefix}-[${value}]`;
  }
  
  // Check for percentage
  if (value.includes('%')) {
    const pct = parseFloat(value);
    if (pct === 100) return `${prefix}-full`;
    if (pct === 50) return `${prefix}-1/2`;
    if (pct === 33.33 || pct === 33.3333) return `${prefix}-1/3`;
    if (pct === 66.66 || pct === 66.6667) return `${prefix}-2/3`;
    if (pct === 25) return `${prefix}-1/4`;
    if (pct === 75) return `${prefix}-3/4`;
    return `${prefix}-[${Math.round(pct)}%]`;
  }
  
  // Pixel values - only show if not auto
  if (val > 0) {
    // Common Tailwind sizes
    const units = val / 4;
    if (Number.isInteger(units) && units <= 96) return `${prefix}-${units}`;
    return `${prefix}-[${Math.round(val)}px]`;
  }
  
  return '';
}

// ============ INSET/POSITION UTILITIES ============

function getInsetClass(top: string, right: string, bottom: string, left: string): string {
  const t = parseFloat(top) || 0;
  const r = parseFloat(right) || 0;
  const b = parseFloat(bottom) || 0;
  const l = parseFloat(left) || 0;
  
  // Skip if all auto or not positioned
  if (top === 'auto' && right === 'auto' && bottom === 'auto' && left === 'auto') return '';
  
  const classes: string[] = [];
  
  // Check for inset-0 (all sides 0)
  if (t === 0 && r === 0 && b === 0 && l === 0 && top !== 'auto') {
    return 'inset-0';
  }
  
  // Check for inset-x-0 or inset-y-0
  if (l === 0 && r === 0 && left !== 'auto' && right !== 'auto') {
    classes.push('inset-x-0');
  } else {
    if (left !== 'auto' && l === 0) classes.push('left-0');
    else if (left !== 'auto') classes.push(`left-[${left}]`);
    if (right !== 'auto' && r === 0) classes.push('right-0');
    else if (right !== 'auto') classes.push(`right-[${right}]`);
  }
  
  if (t === 0 && b === 0 && top !== 'auto' && bottom !== 'auto') {
    classes.push('inset-y-0');
  } else {
    if (top !== 'auto' && t === 0) classes.push('top-0');
    else if (top !== 'auto') classes.push(`top-[${top}]`);
    if (bottom !== 'auto' && b === 0) classes.push('bottom-0');
    else if (bottom !== 'auto') classes.push(`bottom-[${bottom}]`);
  }
  
  return classes.join(' ');
}

// ============ BACKGROUND UTILITIES (Extended) ============

function getBackgroundSizeClass(size: string): string {
  if (!size || size === 'auto') return '';
  if (size === 'cover') return 'bg-cover';
  if (size === 'contain') return 'bg-contain';
  // For custom sizes like "60vw, 60vw"
  if (size.includes(',') || size.includes('vw') || size.includes('vh') || size.includes('%')) {
    return `bg-[size:${size.replace(/,\s*/g, '_')}]`;
  }
  return '';
}

function getBackgroundPositionClass(pos: string): string {
  if (!pos || pos === '0% 0%') return '';
  const map: Record<string, string> = {
    'center': 'bg-center',
    'center center': 'bg-center',
    'top': 'bg-top',
    'top center': 'bg-top',
    'right': 'bg-right',
    'center right': 'bg-right',
    'bottom': 'bg-bottom',
    'bottom center': 'bg-bottom',
    'left': 'bg-left',
    'center left': 'bg-left',
    'left top': 'bg-left-top',
    'left bottom': 'bg-left-bottom',
    'right top': 'bg-right-top',
    'right bottom': 'bg-right-bottom',
  };
  if (map[pos]) return map[pos];
  // Complex positions
  if (pos.includes('calc') || pos.includes('%') || pos.includes('px')) {
    return `bg-[position:${pos.replace(/,\s*/g, '_').replace(/\s+/g, '_')}]`;
  }
  return '';
}

function getBackgroundRepeatClass(repeat: string): string {
  if (!repeat || repeat === 'repeat') return ''; // default
  const map: Record<string, string> = {
    'no-repeat': 'bg-no-repeat',
    'repeat-x': 'bg-repeat-x',
    'repeat-y': 'bg-repeat-y',
    'round': 'bg-repeat-round',
    'space': 'bg-repeat-space',
  };
  return map[repeat] || '';
}

function getTextDecorationClass(deco: string): string {
  if (deco === 'underline') return 'underline';
  if (deco === 'overline') return 'overline';
  if (deco === 'line-through') return 'line-through';
  return '';
}

// ============ GRID UTILITIES ============

function getGridColumnsClass(cols: string): string {
  if (!cols || cols === 'none') return '';
  
  // Count columns by splitting on spaces (simplified)
  const parts = cols.split(/\s+/).filter(p => p && p !== 'none');
  const count = parts.length;
  
  // Check for repeat()
  const repeatMatch = cols.match(/repeat\((\d+)/);
  if (repeatMatch) {
    return `grid-cols-${repeatMatch[1]}`;
  }
  
  if (count >= 1 && count <= 12) return `grid-cols-${count}`;
  return `grid-cols-[${cols.replace(/\s+/g, '_')}]`;
}

function getGridRowsClass(rows: string): string {
  if (!rows || rows === 'none') return '';
  
  const parts = rows.split(/\s+/).filter(p => p && p !== 'none');
  const count = parts.length;
  
  const repeatMatch = rows.match(/repeat\((\d+)/);
  if (repeatMatch) {
    return `grid-rows-${repeatMatch[1]}`;
  }
  
  if (count >= 1 && count <= 6) return `grid-rows-${count}`;
  return '';
}

function getPlaceItemsClass(place: string): string {
  const map: Record<string, string> = {
    'center': 'place-items-center',
    'start': 'place-items-start',
    'end': 'place-items-end',
    'stretch': 'place-items-stretch',
  };
  return map[place] || '';
}

function getPlaceContentClass(place: string): string {
  const map: Record<string, string> = {
    'center': 'place-content-center',
    'start': 'place-content-start',
    'end': 'place-content-end',
    'space-between': 'place-content-between',
    'space-around': 'place-content-around',
    'space-evenly': 'place-content-evenly',
    'stretch': 'place-content-stretch',
  };
  return map[place] || '';
}

// ============ BACKDROP & BLEND UTILITIES ============

function getBackdropFilterClass(filter: string): string {
  if (!filter || filter === 'none') return '';
  
  const classes: string[] = [];
  
  if (filter.includes('blur')) {
    const match = filter.match(/blur\((\d+)px\)/);
    if (match) {
      const val = parseInt(match[1] || '0');
      if (val <= 4) classes.push('backdrop-blur-sm');
      else if (val <= 8) classes.push('backdrop-blur');
      else if (val <= 12) classes.push('backdrop-blur-md');
      else if (val <= 16) classes.push('backdrop-blur-lg');
      else if (val <= 24) classes.push('backdrop-blur-xl');
      else classes.push(`backdrop-blur-[${val}px]`);
    }
  }
  
  if (filter.includes('brightness')) {
    const match = filter.match(/brightness\(([\d.]+)\)/);
    if (match) {
      const val = parseFloat(match[1] || '1');
      if (val !== 1) classes.push(`backdrop-brightness-[${Math.round(val * 100)}%]`);
    }
  }
  
  if (filter.includes('saturate')) {
    const match = filter.match(/saturate\(([\d.]+)\)/);
    if (match) {
      const val = parseFloat(match[1] || '1');
      if (val !== 1) classes.push(`backdrop-saturate-[${Math.round(val * 100)}%]`);
    }
  }
  
  if (filter.includes('grayscale')) classes.push('backdrop-grayscale');
  if (filter.includes('sepia')) classes.push('backdrop-sepia');
  if (filter.includes('invert')) classes.push('backdrop-invert');
  
  return classes.join(' ');
}

function getMixBlendModeClass(mode: string): string {
  if (mode === 'normal') return '';
  const map: Record<string, string> = {
    'multiply': 'mix-blend-multiply',
    'screen': 'mix-blend-screen',
    'overlay': 'mix-blend-overlay',
    'darken': 'mix-blend-darken',
    'lighten': 'mix-blend-lighten',
    'color-dodge': 'mix-blend-color-dodge',
    'color-burn': 'mix-blend-color-burn',
    'hard-light': 'mix-blend-hard-light',
    'soft-light': 'mix-blend-soft-light',
    'difference': 'mix-blend-difference',
    'exclusion': 'mix-blend-exclusion',
    'hue': 'mix-blend-hue',
    'saturation': 'mix-blend-saturation',
    'color': 'mix-blend-color',
    'luminosity': 'mix-blend-luminosity',
  };
  return map[mode] || '';
}

// ============ BACKGROUND UTILITIES ============

function getBackgroundImageClass(bg: string): string {
  if (!bg || bg === 'none') return '';
  
  // Linear gradient
  if (bg.includes('linear-gradient')) {
    // Extract direction
    const dirMatch = bg.match(/linear-gradient\((to\s+\w+|[\d.]+deg)/);
    let dir = '';
    if (dirMatch) {
      const d = dirMatch[1];
      if (d === 'to right') dir = 'bg-gradient-to-r';
      else if (d === 'to left') dir = 'bg-gradient-to-l';
      else if (d === 'to bottom') dir = 'bg-gradient-to-b';
      else if (d === 'to top') dir = 'bg-gradient-to-t';
      else if (d === 'to bottom right' || d === '135deg') dir = 'bg-gradient-to-br';
      else if (d === 'to bottom left') dir = 'bg-gradient-to-bl';
      else if (d === 'to top right') dir = 'bg-gradient-to-tr';
      else if (d === 'to top left') dir = 'bg-gradient-to-tl';
      else dir = `bg-[linear-gradient(${d},...)]`;
    } else {
      dir = 'bg-gradient-to-r'; // Default
    }
    return dir;
  }
  
  // Radial gradient
  if (bg.includes('radial-gradient')) {
    return 'bg-[radial-gradient(...)]';
  }
  
  // URL (image)
  if (bg.includes('url(')) {
    // Extract filenames from URLs for readability
    const urls = bg.match(/url\(["']?([^"')]+)["']?\)/g) || [];
    if (urls.length === 0) return 'bg-[url(...)]';
    
    const filenames = urls.map(u => {
      const match = u.match(/\/([^\/?"']+)(?:\?[^"']*)?["']?\)$/);
      return match?.[1] || 'image';
    });
    
    if (filenames.length === 1) {
      return `bg-[url(${filenames[0]})]`;
    } else {
      return `bg-[${filenames.length}x url(...)]`;
    }
  }
  
  return '';
}

// ============ SVG UTILITIES ============

function getFillClass(fill: string): string {
  // Only apply to SVG elements - we'll check in main function
  if (!fill || fill === 'none' || fill === 'rgb(0, 0, 0)') return '';
  const hex = rgbToHex(fill);
  if (hex === '#000000') return ''; // Default black, skip
  if (hex === '#ffffff') return 'fill-white';
  return `fill-[${hex}]`;
}

function getStrokeClass(stroke: string): string {
  if (!stroke || stroke === 'none') return '';
  const hex = rgbToHex(stroke);
  if (hex === '#000000' || hex === 'transparent') return ''; // Skip defaults
  if (hex === '#ffffff') return 'stroke-white';
  return `stroke-[${hex}]`;
}

function getStrokeWidthClass(width: string): string {
  const val = parseFloat(width);
  if (isNaN(val) || val === 0 || val === 1) return ''; // 1 is often default
  if (val === 2) return 'stroke-2';
  return `stroke-[${val}]`;
}

// ============ INTERACTION & PERFORMANCE UTILITIES ============

function getUserSelectClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'none': 'select-none',
    'text': 'select-text',
    'all': 'select-all',
    'auto': 'select-auto',
  };
  return map[val] || '';
}

function getPointerEventsClass(val: string): string {
  if (val === 'auto') return '';
  if (val === 'none') return 'pointer-events-none';
  return '';
}

function getWillChangeClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'scroll-position': 'will-change-scroll',
    'contents': 'will-change-contents',
    'transform': 'will-change-transform',
  };
  return map[val] || `will-change-[${val}]`;
}

function getResizeClass(val: string): string {
    if (val === 'none') return '';
    const map: Record<string, string> = {
        'vertical': 'resize-y',
        'horizontal': 'resize-x',
        'both': 'resize',
        'none': 'resize-none'
    };
    return map[val] || '';
}

// ============ ADVANCED GEOMETRY & SCROLL ============

function getTransformOriginClass(val: string): string {
  // Skip complex pixel values, only map common keywords
  if (!val || val === '50% 50%' || val === 'center' || val.includes('px')) return '';
  
  const map: Record<string, string> = {
      'center': 'origin-center',
      'top': 'origin-top',
      'top right': 'origin-top-right',
      'right': 'origin-right',
      'bottom right': 'origin-bottom-right',
      'bottom': 'origin-bottom',
      'bottom left': 'origin-bottom-left',
      'left': 'origin-left',
      'top left': 'origin-top-left',
  };
  return map[val] || '';
}

function getClipPathClass(val: string): string {
    if (!val || val === 'none') return '';
    // Clip paths are complex, usually become arbitrary values
    return `clip-[${val}]`; // Not standard Tailwind utility, but understandable
}

function getScrollSnapTypeClass(val: string): string {
    if (val === 'none') return '';
    if (val.includes('x')) return 'snap-x';
    if (val.includes('y')) return 'snap-y';
    if (val.includes('both')) return 'snap-both';
    return '';
}

function getScrollSnapAlignClass(val: string): string {
    if (val === 'none') return '';
    const map: Record<string, string> = {
        'start': 'snap-start',
        'end': 'snap-end',
        'center': 'snap-center',
        'align-none': 'snap-none',
    };
    return map[val] || '';
}

// ============ FASE 1 - NOVAS PROPRIEDADES ESSENCIAIS ============

// 1. OUTLINE
function getOutlineStyleClass(style: string): string {
  if (!style || style === 'none') return '';
  const map: Record<string, string> = {
    'solid': 'outline',
    'dashed': 'outline-dashed',
    'dotted': 'outline-dotted',
    'double': 'outline-double',
  };
  return map[style] || '';
}

function getOutlineWidthClass(width: string): string {
  const val = parseFloat(width);
  if (isNaN(val) || val === 0) return '';
  if (val === 1) return 'outline-1';
  if (val === 2) return 'outline-2';
  if (val === 4) return 'outline-4';
  if (val === 8) return 'outline-8';
  return `outline-[${val}px]`;
}

function getOutlineColorClass(color: string): string {
  if (!color || color === 'transparent') return '';
  const hex = rgbToHex(color);
  if (hex === '#000000') return 'outline-black';
  if (hex === '#ffffff') return 'outline-white';
  return `outline-[${hex}]`;
}

function getOutlineOffsetClass(offset: string): string {
  const val = parseFloat(offset);
  if (isNaN(val) || val === 0) return '';
  if (val === 1) return 'outline-offset-1';
  if (val === 2) return 'outline-offset-2';
  if (val === 4) return 'outline-offset-4';
  if (val === 8) return 'outline-offset-8';
  return `outline-offset-[${val}px]`;
}

// 2. TEXT DECORATION (Advanced)
function getTextDecorationColorClass(color: string): string {
  if (!color || color === 'currentcolor' || color === 'currentColor') return '';
  const hex = rgbToHex(color);
  return `decoration-[${hex}]`;
}

function getTextDecorationStyleClass(style: string): string {
  if (!style || style === 'solid') return '';
  const map: Record<string, string> = {
    'double': 'decoration-double',
    'dotted': 'decoration-dotted',
    'dashed': 'decoration-dashed',
    'wavy': 'decoration-wavy',
  };
  return map[style] || '';
}

function getTextDecorationThicknessClass(thickness: string): string {
  if (!thickness || thickness === 'auto') return '';
  const val = parseFloat(thickness);
  if (isNaN(val)) {
    if (thickness === 'from-font') return 'decoration-from-font';
    return '';
  }
  if (val === 0) return 'decoration-0';
  if (val === 1) return 'decoration-1';
  if (val === 2) return 'decoration-2';
  if (val === 4) return 'decoration-4';
  if (val === 8) return 'decoration-8';
  return `decoration-[${val}px]`;
}

function getTextUnderlineOffsetClass(offset: string): string {
  if (!offset || offset === 'auto') return '';
  const val = parseFloat(offset);
  if (isNaN(val) || val === 0) return '';
  if (val === 1) return 'underline-offset-1';
  if (val === 2) return 'underline-offset-2';
  if (val === 4) return 'underline-offset-4';
  if (val === 8) return 'underline-offset-8';
  return `underline-offset-[${val}px]`;
}

// 3. VISIBILITY
function getVisibilityClass(val: string): string {
  if (val === 'visible') return 'visible';
  if (val === 'hidden') return 'invisible';
  if (val === 'collapse') return 'collapse';
  return '';
}

// 4. VERTICAL ALIGN
function getVerticalAlignClass(val: string): string {
  const map: Record<string, string> = {
    'baseline': 'align-baseline',
    'top': 'align-top',
    'middle': 'align-middle',
    'bottom': 'align-bottom',
    'text-top': 'align-text-top',
    'text-bottom': 'align-text-bottom',
    'sub': 'align-sub',
    'super': 'align-super',
  };
  return map[val] || '';
}

// 5. WORD BREAK
function getWordBreakClass(val: string): string {
  if (val === 'normal') return '';
  if (val === 'break-all') return 'break-all';
  if (val === 'keep-all') return 'break-keep';
  return '';
}

// 6. TOUCH ACTION
function getTouchActionClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'none': 'touch-none',
    'pan-x': 'touch-pan-x',
    'pan-y': 'touch-pan-y',
    'pan-left': 'touch-pan-left',
    'pan-right': 'touch-pan-right',
    'pan-up': 'touch-pan-up',
    'pan-down': 'touch-pan-down',
    'pinch-zoom': 'touch-pinch-zoom',
    'manipulation': 'touch-manipulation',
  };
  return map[val] || '';
}

// 7. OVERSCROLL BEHAVIOR
function getOverscrollBehaviorClass(val: string, axis?: 'x' | 'y'): string {
  if (val === 'auto') return '';
  const prefix = axis ? `overscroll-${axis}` : 'overscroll';
  const map: Record<string, string> = {
    'contain': `${prefix}-contain`,
    'none': `${prefix}-none`,
    'auto': `${prefix}-auto`,
  };
  return map[val] || '';
}

// 8. SCROLL BEHAVIOR
function getScrollBehaviorClass(val: string): string {
  if (val === 'smooth') return 'scroll-smooth';
  if (val === 'auto') return 'scroll-auto';
  return '';
}

// 9. TABLE LAYOUT
function getTableLayoutClass(val: string): string {
  if (val === 'auto') return 'table-auto';
  if (val === 'fixed') return 'table-fixed';
  return '';
}

// 10. ORDER
function getOrderClass(val: string): string {
  const num = parseInt(val);
  if (isNaN(num) || num === 0) return '';
  if (num === -1) return '-order-1';
  if (num === 1) return 'order-1';
  if (num === 2) return 'order-2';
  if (num === 3) return 'order-3';
  if (num === 4) return 'order-4';
  if (num === 5) return 'order-5';
  if (num === 6) return 'order-6';
  if (num === 7) return 'order-7';
  if (num === 8) return 'order-8';
  if (num === 9) return 'order-9';
  if (num === 10) return 'order-10';
  if (num === 11) return 'order-11';
  if (num === 12) return 'order-12';
  if (num === 9999) return 'order-last';
  if (num === -9999) return 'order-first';
  return `order-[${num}]`;
}

// 11. CARET COLOR
function getCaretColorClass(color: string): string {
  if (!color || color === 'auto') return '';
  const hex = rgbToHex(color);
  if (hex === 'transparent') return 'caret-transparent';
  if (hex === '#000000') return 'caret-black';
  if (hex === '#ffffff') return 'caret-white';
  const named = NAMED_COLORS[hex.toLowerCase()];
  if (named) return `caret-${named}`;
  return `caret-[${hex}]`;
}

// 12. COLUMNS
function getColumnsClass(val: string): string {
  if (!val || val === 'auto') return '';
  const num = parseInt(val);
  if (!isNaN(num) && num >= 1 && num <= 12) return `columns-${num}`;
  // Width-based columns
  if (val.includes('px')) {
    const px = parseFloat(val);
    if (px === 256) return 'columns-xs';
    if (px === 288) return 'columns-sm';
    if (px === 320) return 'columns-md';
    if (px === 384) return 'columns-lg';
    if (px === 448) return 'columns-xl';
    if (px === 512) return 'columns-2xl';
    return `columns-[${px}px]`;
  }
  return '';
}

// 13. HYPHENS
function getHyphensClass(val: string): string {
  if (val === 'none') return 'hyphens-none';
  if (val === 'manual') return 'hyphens-manual';
  if (val === 'auto') return 'hyphens-auto';
  return '';
}

// 14. ACCENT COLOR
function getAccentColorClass(color: string): string {
  if (!color || color === 'auto') return '';
  const hex = rgbToHex(color);
  if (hex === 'transparent') return 'accent-transparent';
  const named = NAMED_COLORS[hex.toLowerCase()];
  if (named) return `accent-${named}`;
  return `accent-[${hex}]`;
}

// 15. SCROLL MARGIN & PADDING
function getScrollMarginClass(val: string, side?: string): string {
  const px = parseFloat(val);
  if (isNaN(px) || px === 0) return '';
  const prefix = side ? `scroll-m${side}` : 'scroll-m';
  const units = px / 4;
  if (Number.isInteger(units) && units <= 96) return `${prefix}-${units}`;
  return `${prefix}-[${px}px]`;
}

function getScrollPaddingClass(val: string, side?: string): string {
  const px = parseFloat(val);
  if (isNaN(px) || px === 0) return '';
  const prefix = side ? `scroll-p${side}` : 'scroll-p';
  const units = px / 4;
  if (Number.isInteger(units) && units <= 96) return `${prefix}-${units}`;
  return `${prefix}-[${px}px]`;
}

// ============ FASE 2 - SVG AVANÇADO ============

// Fill Opacity
function getFillOpacityClass(opacity: string): string {
  const val = parseFloat(opacity);
  if (isNaN(val) || val === 1) return '';
  const percent = Math.round(val * 100);
  const standards = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95];
  if (standards.includes(percent)) return `fill-opacity-${percent}`;
  return `fill-opacity-[${val}]`;
}

// Stroke Opacity
function getStrokeOpacityClass(opacity: string): string {
  const val = parseFloat(opacity);
  if (isNaN(val) || val === 1) return '';
  const percent = Math.round(val * 100);
  const standards = [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95];
  if (standards.includes(percent)) return `stroke-opacity-${percent}`;
  return `stroke-opacity-[${val}]`;
}

// Stroke Dasharray
function getStrokeDasharrayClass(dasharray: string): string {
  if (!dasharray || dasharray === 'none') return '';
  // Tailwind doesn't have direct support, use arbitrary
  return `stroke-dasharray-[${dasharray.replace(/,\s*/g, '_')}]`;
}

// Stroke Linecap
function getStrokeLinecapClass(linecap: string): string {
  if (!linecap || linecap === 'butt') return ''; // butt is default
  const map: Record<string, string> = {
    'round': 'stroke-round',
    'square': 'stroke-square',
  };
  return map[linecap] || '';
}

// Stroke Linejoin
function getStrokeLinejoinClass(linejoin: string): string {
  if (!linejoin || linejoin === 'miter') return ''; // miter is default
  const map: Record<string, string> = {
    'round': 'stroke-join-round',
    'bevel': 'stroke-join-bevel',
  };
  return map[linejoin] || '';
}

// ============ FASE 3 - UI AVANÇADA ============

// Isolation
function getIsolationClass(val: string): string {
  if (val === 'auto') return '';
  if (val === 'isolate') return 'isolate';
  return '';
}

// Contain
function getContainClass(val: string): string {
  if (!val || val === 'none') return '';
  if (val === 'content') return 'contain-content';
  if (val === 'strict') return 'contain-strict';
  if (val === 'size') return 'contain-size';
  if (val === 'layout') return 'contain-layout';
  if (val === 'paint') return 'contain-paint';
  if (val === 'style') return 'contain-style';
  return '';
}

// Appearance
function getAppearanceClass(val: string): string {
  if (val === 'none') return 'appearance-none';
  if (val === 'auto') return 'appearance-auto';
  return '';
}

// Content Visibility
function getContentVisibilityClass(val: string): string {
  if (val === 'visible') return '';
  if (val === 'auto') return 'content-auto';
  if (val === 'hidden') return 'content-hidden';
  return '';
}

// Forced Color Adjust
function getForcedColorAdjustClass(val: string): string {
  if (val === 'auto') return '';
  if (val === 'none') return 'forced-color-adjust-none';
  return 'forced-color-adjust-auto';
}

// Text Wrap
function getTextWrapClass(val: string): string {
  if (val === 'wrap') return '';  // default
  if (val === 'nowrap') return 'text-nowrap';
  if (val === 'balance') return 'text-balance';
  if (val === 'pretty') return 'text-pretty';
  return '';
}

// Break After
function getBreakAfterClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'avoid': 'break-after-avoid',
    'all': 'break-after-all',
    'avoid-page': 'break-after-avoid-page',
    'page': 'break-after-page',
    'left': 'break-after-left',
    'right': 'break-after-right',
    'column': 'break-after-column',
  };
  return map[val] || '';
}

// Break Before
function getBreakBeforeClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'avoid': 'break-before-avoid',
    'all': 'break-before-all',
    'avoid-page': 'break-before-avoid-page',
    'page': 'break-before-page',
    'left': 'break-before-left',
    'right': 'break-before-right',
    'column': 'break-before-column',
  };
  return map[val] || '';
}

// Break Inside
function getBreakInsideClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'avoid': 'break-inside-avoid',
    'avoid-page': 'break-inside-avoid-page',
    'avoid-column': 'break-inside-avoid-column',
  };
  return map[val] || '';
}

// Float
function getFloatClass(val: string): string {
  if (val === 'none') return '';
  if (val === 'left') return 'float-left';
  if (val === 'right') return 'float-right';
  if (val === 'inline-start') return 'float-start';
  if (val === 'inline-end') return 'float-end';
  return '';
}

// Clear
function getClearClass(val: string): string {
  if (val === 'none') return '';
  if (val === 'left') return 'clear-left';
  if (val === 'right') return 'clear-right';
  if (val === 'both') return 'clear-both';
  if (val === 'inline-start') return 'clear-start';
  if (val === 'inline-end') return 'clear-end';
  return '';
}

// Box Decoration Break
function getBoxDecorationBreakClass(val: string): string {
  if (val === 'slice') return 'box-decoration-slice';
  if (val === 'clone') return 'box-decoration-clone';
  return '';
}

// Box Sizing
function getBoxSizingClass(val: string): string {
  if (val === 'content-box') return 'box-content';
  if (val === 'border-box') return 'box-border';
  return '';
}

// Object Position
function getObjectPositionClass(pos: string): string {
  if (!pos || pos === '50% 50%') return '';
  const map: Record<string, string> = {
    'center': 'object-center',
    'center center': 'object-center',
    'top': 'object-top',
    'top center': 'object-top',
    'right': 'object-right',
    'center right': 'object-right',
    'bottom': 'object-bottom',
    'bottom center': 'object-bottom',
    'left': 'object-left',
    'center left': 'object-left',
    'left top': 'object-left-top',
    'left bottom': 'object-left-bottom',
    'right top': 'object-right-top',
    'right bottom': 'object-right-bottom',
  };
  return map[pos] || '';
}

// List Style Type
function getListStyleTypeClass(val: string): string {
  if (val === 'disc') return ''; // default for ul
  if (val === 'none') return 'list-none';
  if (val === 'decimal') return 'list-decimal';
  return `list-[${val}]`;
}

// List Style Position
function getListStylePositionClass(val: string): string {
  if (val === 'outside') return ''; // default
  if (val === 'inside') return 'list-inside';
  return '';
}

// Align Content
function getAlignContentClass(val: string): string {
  const map: Record<string, string> = {
    'center': 'content-center',
    'flex-start': 'content-start',
    'flex-end': 'content-end',
    'space-between': 'content-between',
    'space-around': 'content-around',
    'space-evenly': 'content-evenly',
    'stretch': 'content-stretch',
    'baseline': 'content-baseline',
    'normal': '',
  };
  return map[val] || '';
}

// Align Self
function getAlignSelfClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'flex-start': 'self-start',
    'flex-end': 'self-end',
    'center': 'self-center',
    'stretch': 'self-stretch',
    'baseline': 'self-baseline',
    'auto': 'self-auto',
  };
  return map[val] || '';
}

// Justify Self
function getJustifySelfClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'start': 'justify-self-start',
    'end': 'justify-self-end',
    'center': 'justify-self-center',
    'stretch': 'justify-self-stretch',
    'auto': 'justify-self-auto',
  };
  return map[val] || '';
}

// Justify Items
function getJustifyItemsClass(val: string): string {
  if (val === 'legacy' || val === 'normal') return '';
  const map: Record<string, string> = {
    'start': 'justify-items-start',
    'end': 'justify-items-end',
    'center': 'justify-items-center',
    'stretch': 'justify-items-stretch',
  };
  return map[val] || '';
}

// Place Self
function getPlaceSelfClass(val: string): string {
  if (val === 'auto') return '';
  const map: Record<string, string> = {
    'start': 'place-self-start',
    'end': 'place-self-end',
    'center': 'place-self-center',
    'stretch': 'place-self-stretch',
    'auto': 'place-self-auto',
  };
  return map[val] || '';
}

// Flex Grow
function getFlexGrowClass(val: string): string {
  if (val === '0') return '';
  if (val === '1') return 'grow';
  return `grow-[${val}]`;
}

// Flex Shrink
function getFlexShrinkClass(val: string): string {
  if (val === '1') return ''; // default
  if (val === '0') return 'shrink-0';
  return `shrink-[${val}]`;
}

// Flex Basis
function getFlexBasisClass(val: string): string {
  if (val === 'auto') return '';
  if (val === '0px' || val === '0%') return 'basis-0';
  if (val.includes('%')) {
    const pct = parseFloat(val);
    if (pct === 100) return 'basis-full';
    if (pct === 50) return 'basis-1/2';
    if (pct === 33.33) return 'basis-1/3';
    if (pct === 66.67) return 'basis-2/3';
    if (pct === 25) return 'basis-1/4';
    if (pct === 75) return 'basis-3/4';
    return `basis-[${Math.round(pct)}%]`;
  }
  const px = parseFloat(val);
  if (!isNaN(px)) {
    const units = px / 4;
    if (Number.isInteger(units) && units <= 96) return `basis-${units}`;
    return `basis-[${px}px]`;
  }
  return '';
}

// Min/Max Width & Height
function getMinWidthClass(val: string): string {
  if (val === '0px') return 'min-w-0';
  if (val === 'auto') return '';
  if (val === '100%') return 'min-w-full';
  if (val === 'min-content') return 'min-w-min';
  if (val === 'max-content') return 'min-w-max';
  if (val === 'fit-content') return 'min-w-fit';
  const px = parseFloat(val);
  if (!isNaN(px)) return `min-w-[${px}px]`;
  return '';
}

function getMaxWidthClass(val: string): string {
  if (val === 'none') return 'max-w-none';
  if (val === '100%') return 'max-w-full';
  if (val === 'min-content') return 'max-w-min';
  if (val === 'max-content') return 'max-w-max';
  if (val === 'fit-content') return 'max-w-fit';
  const px = parseFloat(val);
  if (!isNaN(px)) {
    if (px === 320) return 'max-w-xs';
    if (px === 384) return 'max-w-sm';
    if (px === 448) return 'max-w-md';
    if (px === 512) return 'max-w-lg';
    if (px === 576) return 'max-w-xl';
    if (px === 672) return 'max-w-2xl';
    if (px === 768) return 'max-w-3xl';
    if (px === 896) return 'max-w-4xl';
    if (px === 1024) return 'max-w-5xl';
    if (px === 1152) return 'max-w-6xl';
    if (px === 1280) return 'max-w-7xl';
    return `max-w-[${px}px]`;
  }
  return '';
}

function getMinHeightClass(val: string): string {
  if (val === '0px') return 'min-h-0';
  if (val === 'auto') return '';
  if (val === '100%') return 'min-h-full';
  if (val === '100vh') return 'min-h-screen';
  if (val === '100dvh') return 'min-h-dvh';
  if (val === 'min-content') return 'min-h-min';
  if (val === 'max-content') return 'min-h-max';
  if (val === 'fit-content') return 'min-h-fit';
  const px = parseFloat(val);
  if (!isNaN(px)) return `min-h-[${px}px]`;
  return '';
}

function getMaxHeightClass(val: string): string {
  if (val === 'none') return 'max-h-none';
  if (val === '100%') return 'max-h-full';
  if (val === '100vh') return 'max-h-screen';
  if (val === '100dvh') return 'max-h-dvh';
  if (val === 'min-content') return 'max-h-min';
  if (val === 'max-content') return 'max-h-max';
  if (val === 'fit-content') return 'max-h-fit';
  const px = parseFloat(val);
  if (!isNaN(px)) {
    const units = px / 4;
    if (Number.isInteger(units) && units <= 96) return `max-h-${units}`;
    return `max-h-[${px}px]`;
  }
  return '';
}


function getFilterClass(filter: string): string {
  if (!filter || filter === 'none') return '';
  
  const classes: string[] = [];
  
  if (filter.includes('blur')) {
    const match = filter.match(/blur\((\d+)px\)/);
    if (match) {
      const val = parseInt(match[1] || '0');
      if (val <= 4) classes.push('blur-sm');
      else if (val <= 8) classes.push('blur');
      else if (val <= 12) classes.push('blur-md');
      else if (val <= 16) classes.push('blur-lg');
      else classes.push(`blur-[${val}px]`);
    }
  }
  
  if (filter.includes('grayscale')) classes.push('grayscale');
  if (filter.includes('sepia')) classes.push('sepia');
  if (filter.includes('invert')) classes.push('invert');
  
  if (filter.includes('brightness')) {
    const match = filter.match(/brightness\(([\d.]+)\)/);
    if (match) {
      const val = parseFloat(match[1] || '1');
      if (val !== 1) classes.push(`brightness-[${Math.round(val * 100)}%]`);
    }
  }
  
  if (filter.includes('contrast')) {
    const match = filter.match(/contrast\(([\d.]+)\)/);
    if (match) {
      const val = parseFloat(match[1] || '1');
      if (val !== 1) classes.push(`contrast-[${Math.round(val * 100)}%]`);
    }
  }
  
  if (filter.includes('saturate')) {
    const match = filter.match(/saturate\(([\d.]+)\)/);
    if (match) {
      const val = parseFloat(match[1] || '1');
      if (val !== 1) classes.push(`saturate-[${Math.round(val * 100)}%]`);
    }
  }
  
  return classes.join(' ');
}

function getTransformClasses(transform: string): string {
  if (!transform || transform === 'none') return '';
  
  const classes: string[] = [];
  
  // Scale
  const scaleMatch = transform.match(/scale\(([\d.]+)(?:,\s*([\d.]+))?\)/);
  if (scaleMatch) {
    const x = parseFloat(scaleMatch[1] || '1');
    const y = scaleMatch[2] ? parseFloat(scaleMatch[2]) : x;
    if (x === y && x !== 1) {
      const percent = Math.round(x * 100);
      classes.push(`scale-[${percent}%]`);
    }
  }
  
  // Rotate
  const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/);
  if (rotateMatch) {
    const deg = parseFloat(rotateMatch[1] || '0');
    if (deg !== 0) {
      const standards = [0, 1, 2, 3, 6, 12, 45, 90, 180];
      if (standards.includes(Math.abs(deg))) {
        classes.push(`rotate-${deg < 0 ? '-' : ''}${Math.abs(deg)}`);
      } else {
        classes.push(`rotate-[${deg}deg]`);
      }
    }
  }
  
  // Translate
  const translateMatch = transform.match(/translate(?:X|Y|3d)?\(([-\d.]+)(?:px|%)(?:,\s*([-\d.]+)(?:px|%))?\)/);
  if (translateMatch) {
    const x = parseFloat(translateMatch[1] || '0');
    if (x !== 0) classes.push(`translate-x-[${x}px]`);
  }
  
  // Skew
  const skewMatch = transform.match(/skew(?:X|Y)?\(([-\d.]+)deg/);
  if (skewMatch) {
    const deg = parseFloat(skewMatch[1] || '0');
    if (deg !== 0) classes.push(`skew-x-[${deg}deg]`);
  }
  
  return classes.join(' ');
}

// ============ MAIN CONVERTER ============

export function cssToTailwind(styles: CSSStyleDeclaration, width: number, height: number): string {
  const classes: string[] = [];

  // === LAYOUT ===
  const display = styles.display;
  const pos = styles.position;
  
  if (pos === 'absolute') classes.push('absolute');
  else if (pos === 'fixed') classes.push('fixed');
  else if (pos === 'sticky') classes.push('sticky');
  else if (pos === 'relative') classes.push('relative');
  
  // Inset (top/right/bottom/left) - only for positioned elements
  if (pos !== 'static') {
    classes.push(getInsetClass(styles.top, styles.right, styles.bottom, styles.left));
  }
  
  // Z-Index
  classes.push(getZIndexClass(styles.zIndex));
  
  // === SIZE ===
  // Only show if explicitly set (not auto-calculated by browser)
  const widthStr = styles.width;
  const heightStr = styles.height;
  
  // For height with vh units or explicit values
  if (heightStr.includes('vh') || heightStr.includes('vw') || heightStr.includes('%')) {
    classes.push(getSizeClass(heightStr, 'h'));
  }
  if (widthStr.includes('vw') || widthStr.includes('vh') || widthStr.includes('%')) {
    classes.push(getSizeClass(widthStr, 'w'));
  }
  
  // Display & Flex/Grid
  if (display === 'flex') {
    classes.push('flex');
    if (styles.flexDirection === 'column') classes.push('flex-col');
    else if (styles.flexDirection === 'column-reverse') classes.push('flex-col-reverse');
    else if (styles.flexDirection === 'row-reverse') classes.push('flex-row-reverse');
    if (styles.flexWrap === 'wrap') classes.push('flex-wrap');
    else if (styles.flexWrap === 'wrap-reverse') classes.push('flex-wrap-reverse');
    
    if (styles.alignItems === 'center') classes.push('items-center');
    else if (styles.alignItems === 'flex-start') classes.push('items-start');
    else if (styles.alignItems === 'flex-end') classes.push('items-end');
    else if (styles.alignItems === 'baseline') classes.push('items-baseline');
    else if (styles.alignItems === 'stretch') classes.push('items-stretch');
    
    if (styles.justifyContent === 'center') classes.push('justify-center');
    else if (styles.justifyContent === 'space-between') classes.push('justify-between');
    else if (styles.justifyContent === 'space-around') classes.push('justify-around');
    else if (styles.justifyContent === 'space-evenly') classes.push('justify-evenly');
    else if (styles.justifyContent === 'flex-end') classes.push('justify-end');
    else if (styles.justifyContent === 'flex-start') classes.push('justify-start');

    if (styles.gap !== '0px') classes.push(getSpacing(styles.gap, 'gap'));
  } 
  else if (display === 'inline-flex') {
    classes.push('inline-flex');
  }
  else if (display === 'grid') {
    classes.push('grid');
    classes.push(getGridColumnsClass(styles.gridTemplateColumns));
    classes.push(getGridRowsClass(styles.gridTemplateRows));
    classes.push(getPlaceItemsClass(styles.placeItems));
    classes.push(getPlaceContentClass(styles.placeContent));
    if (styles.gap !== '0px') classes.push(getSpacing(styles.gap, 'gap'));
  }
  else if (display === 'inline-grid') classes.push('inline-grid');
  else if (display === 'none') classes.push('hidden');
  else if (display === 'inline-block') classes.push('inline-block');
  else if (display === 'inline') classes.push('inline');

  // Overflow
  classes.push(getOverflowClass(styles.overflow));

  // === SPACING ===
  const sides = ['top', 'right', 'bottom', 'left'];
  const m = sides.map(s => parseFloat(styles.getPropertyValue(`margin-${s}`))) as [number, number, number, number];
  const p = sides.map(s => parseFloat(styles.getPropertyValue(`padding-${s}`))) as [number, number, number, number];

  // Padding
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

  // Margin
  if (m[0] === m[1] && m[0] === m[2] && m[0] === m[3] && m[0] !== 0) {
    classes.push(getSpacing(m[0].toString(), 'm'));
  } else {
    if(m[0] === m[2] && m[0] !== 0) classes.push(getSpacing(m[0].toString(), 'my'));
    else {
      if(m[0] !== 0) classes.push(getSpacing(m[0].toString(), 'mt'));
      if(m[2] !== 0) classes.push(getSpacing(m[2].toString(), 'mb'));
    }
    if(m[1] === m[3] && m[1] !== 0) classes.push(getSpacing(m[1].toString(), 'mx'));
    else {
      if(m[3] !== 0) classes.push(getSpacing(m[3].toString(), 'ml'));
      if(m[1] !== 0) classes.push(getSpacing(m[1].toString(), 'mr'));
    }
  }

  // === TYPOGRAPHY ===
  if (parseFloat(styles.fontSize) !== 16) classes.push(getFontSize(styles.fontSize));
  if (styles.fontWeight !== '400') classes.push(getFontWeight(styles.fontWeight));
  if (styles.fontStyle === 'italic') classes.push('italic');
  if (styles.textTransform === 'uppercase') classes.push('uppercase');
  else if (styles.textTransform === 'lowercase') classes.push('lowercase');
  else if (styles.textTransform === 'capitalize') classes.push('capitalize');
  
  if (styles.textAlign === 'center') classes.push('text-center');
  else if (styles.textAlign === 'right') classes.push('text-right');
  else if (styles.textAlign === 'justify') classes.push('text-justify');
  
  classes.push(getLineHeight(styles.lineHeight, styles.fontSize));
  classes.push(getLetterSpacing(styles.letterSpacing));
  classes.push(getTextDecorationClass(styles.textDecorationLine));
  
  if (styles.whiteSpace === 'nowrap') classes.push('whitespace-nowrap');
  else if (styles.whiteSpace === 'pre') classes.push('whitespace-pre');
  else if (styles.whiteSpace === 'pre-wrap') classes.push('whitespace-pre-wrap');

  if (styles.textOverflow === 'ellipsis') classes.push('truncate');

  // === COLORS ===
  const textColor = rgbToHex(styles.color);
  if (textColor !== '#000000') classes.push(getColorClass('text', textColor));

  const bgColor = rgbToHex(styles.backgroundColor);
  if (bgColor !== 'transparent') classes.push(getColorClass('bg', bgColor));

  // === BACKGROUND PROPERTIES ===
  classes.push(getBackgroundSizeClass(styles.backgroundSize));
  classes.push(getBackgroundPositionClass(styles.backgroundPosition));
  classes.push(getBackgroundRepeatClass(styles.backgroundRepeat));

  // === BORDERS ===
  const radiusStr = styles.borderRadius;
  const radiusVal = parseFloat(radiusStr);
  
  if (radiusVal > 0) {
    if (radiusStr.includes('%')) {
      if (radiusVal >= 50) classes.push('rounded-full');
      else classes.push(`rounded-[${radiusVal}%]`);
    } else {
      const minDim = Math.min(width, height);
      if (radiusVal >= (minDim / 2) - 1) { 
        classes.push('rounded-full');
      } else {
        if (radiusVal === 2) classes.push('rounded-sm');
        else if (radiusVal === 4) classes.push('rounded');
        else if (radiusVal === 6) classes.push('rounded-md');
        else if (radiusVal === 8) classes.push('rounded-lg');
        else if (radiusVal === 12) classes.push('rounded-xl');
        else if (radiusVal === 16) classes.push('rounded-2xl');
        else if (radiusVal === 24) classes.push('rounded-3xl');
        else classes.push(`rounded-[${radiusVal}px]`);
      }
    }
  }

  if (styles.borderWidth && parseFloat(styles.borderWidth) > 0 && styles.borderColor !== 'transparent') {
    const bw = parseFloat(styles.borderWidth);
    if (bw === 1) classes.push('border');
    else if (bw === 2) classes.push('border-2');
    else if (bw === 4) classes.push('border-4');
    else if (bw === 8) classes.push('border-8');
    else classes.push(`border-[${bw}px]`);
    classes.push(getColorClass('border', rgbToHex(styles.borderColor)));
  }

  // === EFFECTS ===
  if (styles.boxShadow && styles.boxShadow !== 'none') {
    classes.push(getShadowClass(styles.boxShadow));
  }

  classes.push(getOpacityClass(styles.opacity));
  classes.push(getFilterClass(styles.filter));
  classes.push(getTransformClasses(styles.transform));

  // === IMAGE-SPECIFIC ===
  classes.push(getObjectFitClass(styles.objectFit));
  classes.push(getAspectRatioClass(styles.aspectRatio));

  // === INTERACTION ===
  classes.push(getCursorClass(styles.cursor));

  // === BACKDROP & BLEND ===
  classes.push(getBackdropFilterClass(styles.backdropFilter));
  classes.push(getMixBlendModeClass(styles.mixBlendMode));

  // === BACKGROUND IMAGE/GRADIENT ===
  classes.push(getBackgroundImageClass(styles.backgroundImage));

  // === SVG ===
  classes.push(getFillClass(styles.fill));
  classes.push(getStrokeClass(styles.stroke));
  classes.push(getStrokeWidthClass(styles.strokeWidth));

  // === INTERACTION & PERFORMANCE ===
  classes.push(getUserSelectClass(styles.userSelect));
  classes.push(getPointerEventsClass(styles.pointerEvents));
  classes.push(getResizeClass(styles.resize));
  classes.push(getWillChangeClass(styles.willChange));

  // === ADVANCED GEOMETRY ===
  classes.push(getTransformOriginClass(styles.transformOrigin));
  classes.push(getClipPathClass(styles.clipPath));
  classes.push(getScrollSnapTypeClass(styles.scrollSnapType));
  classes.push(getScrollSnapAlignClass(styles.scrollSnapAlign));

  // === FASE 1 - NOVAS PROPRIEDADES ESSENCIAIS ===
  
  // Outline
  classes.push(getOutlineStyleClass(styles.outlineStyle));
  classes.push(getOutlineWidthClass(styles.outlineWidth));
  classes.push(getOutlineColorClass(styles.outlineColor));
  classes.push(getOutlineOffsetClass(styles.outlineOffset));
  
  // Text Decoration Advanced
  classes.push(getTextDecorationColorClass(styles.textDecorationColor));
  classes.push(getTextDecorationStyleClass(styles.textDecorationStyle));
  classes.push(getTextDecorationThicknessClass(styles.textDecorationThickness));
  classes.push(getTextUnderlineOffsetClass(styles.textUnderlineOffset));
  
  // Visibility
  if (styles.visibility !== 'visible') {
    classes.push(getVisibilityClass(styles.visibility));
  }
  
  // Vertical Align (skip baseline - default)
  if (styles.verticalAlign !== 'baseline') {
    classes.push(getVerticalAlignClass(styles.verticalAlign));
  }
  
  // Word Break
  classes.push(getWordBreakClass(styles.wordBreak));
  
  // Touch Action
  classes.push(getTouchActionClass(styles.touchAction));
  
  // Overscroll Behavior
  classes.push(getOverscrollBehaviorClass(styles.overscrollBehavior));
  classes.push(getOverscrollBehaviorClass(styles.overscrollBehaviorX, 'x'));
  classes.push(getOverscrollBehaviorClass(styles.overscrollBehaviorY, 'y'));
  
  // Scroll Behavior
  classes.push(getScrollBehaviorClass(styles.scrollBehavior));
  
  // Table Layout (only for table elements)
  if (styles.display === 'table' || styles.display === 'inline-table') {
    classes.push(getTableLayoutClass(styles.tableLayout));
  }
  
  // Order (for flex/grid items)
  classes.push(getOrderClass(styles.order));
  
  // Caret Color
  classes.push(getCaretColorClass(styles.caretColor));
  
  // Columns
  classes.push(getColumnsClass(styles.columnCount));
  
  // Hyphens
  classes.push(getHyphensClass(styles.hyphens));
  
  // Accent Color
  classes.push(getAccentColorClass(styles.accentColor));
  
  // Scroll Margin
  classes.push(getScrollMarginClass(styles.scrollMarginTop, 't'));
  classes.push(getScrollMarginClass(styles.scrollMarginRight, 'r'));
  classes.push(getScrollMarginClass(styles.scrollMarginBottom, 'b'));
  classes.push(getScrollMarginClass(styles.scrollMarginLeft, 'l'));
  
  // Scroll Padding
  classes.push(getScrollPaddingClass(styles.scrollPaddingTop, 't'));
  classes.push(getScrollPaddingClass(styles.scrollPaddingRight, 'r'));
  classes.push(getScrollPaddingClass(styles.scrollPaddingBottom, 'b'));
  classes.push(getScrollPaddingClass(styles.scrollPaddingLeft, 'l'));

  // === FASE 2 - SVG AVANÇADO ===
  classes.push(getFillOpacityClass(styles.fillOpacity));
  classes.push(getStrokeOpacityClass(styles.strokeOpacity));
  classes.push(getStrokeDasharrayClass(styles.strokeDasharray));
  classes.push(getStrokeLinecapClass(styles.strokeLinecap));
  classes.push(getStrokeLinejoinClass(styles.strokeLinejoin));

  // === FASE 3 - UI AVANÇADA ===
  classes.push(getIsolationClass(styles.isolation));
  classes.push(getContainClass(styles.contain));
  classes.push(getAppearanceClass(styles.appearance));
  classes.push(getContentVisibilityClass(styles.contentVisibility));
  classes.push(getForcedColorAdjustClass(styles.forcedColorAdjust));
  classes.push(getTextWrapClass(styles.textWrap));
  
  // Break utilities (for columns/pages)
  classes.push(getBreakAfterClass(styles.breakAfter));
  classes.push(getBreakBeforeClass(styles.breakBefore));
  classes.push(getBreakInsideClass(styles.breakInside));
  
  // Float & Clear
  classes.push(getFloatClass(styles.cssFloat));
  classes.push(getClearClass(styles.clear));
  
  // Box utilities
  classes.push(getBoxDecorationBreakClass(styles.boxDecorationBreak));
  classes.push(getBoxSizingClass(styles.boxSizing));
  
  // Object Position
  classes.push(getObjectPositionClass(styles.objectPosition));
  
  // List Style
  classes.push(getListStyleTypeClass(styles.listStyleType));
  classes.push(getListStylePositionClass(styles.listStylePosition));
  
  // Alignment (for flex/grid)
  classes.push(getAlignContentClass(styles.alignContent));
  classes.push(getAlignSelfClass(styles.alignSelf));
  classes.push(getJustifySelfClass(styles.justifySelf));
  classes.push(getJustifyItemsClass(styles.justifyItems));
  classes.push(getPlaceSelfClass(styles.placeSelf));
  
  // Flex utilities
  classes.push(getFlexGrowClass(styles.flexGrow));
  classes.push(getFlexShrinkClass(styles.flexShrink));
  classes.push(getFlexBasisClass(styles.flexBasis));
  
  // Min/Max Size
  classes.push(getMinWidthClass(styles.minWidth));
  classes.push(getMaxWidthClass(styles.maxWidth));
  classes.push(getMinHeightClass(styles.minHeight));
  classes.push(getMaxHeightClass(styles.maxHeight));

  return classes.filter(Boolean).join(' ');
}
