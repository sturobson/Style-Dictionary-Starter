import Color from 'colorjs.io';

/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 * @param {string} color1 - First color (any CSS format)
 * @param {string} color2 - Second color (any CSS format)
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(color1, color2) {
  try {
    const c1 = new Color(color1);
    const c2 = new Color(color2);
    return Math.abs(c1.contrast(c2, 'WCAG21'));
  } catch (error) {
    console.error(`Error calculating contrast between ${color1} and ${color2}:`, error);
    return 0;
  }
}

/**
 * Find the best contrasting color from a list of options
 * @param {string} backgroundColor - The background color to contrast against
 * @param {string[]} foregroundOptions - Array of possible foreground colors
 * @param {number} minRatio - Minimum acceptable contrast ratio (default: 4.5 for AA)
 * @returns {Object} { color, ratio, passes }
 */
export function findBestContrast(backgroundColor, foregroundOptions, minRatio = 4.5) {
  let bestColor = null;
  let bestRatio = 0;

  // Test each foreground option
  for (const fgColor of foregroundOptions) {
    const ratio = getContrastRatio(backgroundColor, fgColor);

    if (ratio > bestRatio) {
      bestColor = fgColor;
      bestRatio = ratio;
    }
  }

  // If no option meets the threshold, fall back to black or white
  if (bestRatio < minRatio) {
    const whiteRatio = getContrastRatio(backgroundColor, '#ffffff');
    const blackRatio = getContrastRatio(backgroundColor, '#000000');

    if (whiteRatio > blackRatio) {
      bestColor = '#ffffff';
      bestRatio = whiteRatio;
    } else {
      bestColor = '#000000';
      bestRatio = blackRatio;
    }
  }

  return {
    color: bestColor,
    ratio: bestRatio,
    passes: bestRatio >= minRatio
  };
}

/**
 * Get default fallback text color options
 * Used when no custom foreground options are defined
 * @returns {string[]} Array of color values (black and white)
 */
export function getDefaultForegroundOptions() {
  // Return only pure black and white as fallback
  return ['#ffffff', '#000000'];
}
