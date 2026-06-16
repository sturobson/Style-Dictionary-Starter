import { getContrastRatio, findBestContrast, getDefaultForegroundOptions } from '../contrast-helpers.js';
import { contrastConfig } from '../../build.js';

/**
 * Style Dictionary transform that calculates contrast for background tokens
 * Generates AA/AAA text colours and validates any chosen foreground colour
 */
export default {
  name: 'color/add-contrast',
  type: 'attribute',
  filter: (token) => {
    // Apply to background tokens only (configurable name)
    return token.type === 'color' && token.path[token.path.length - 1] === contrastConfig.backgroundTokenName;
  },
  transform: (token, options) => {
    const backgroundColor = token.value;

    // Always generate AA/AAA with black and white
    const defaultOptions = getDefaultForegroundOptions();
    const aa = findBestContrast(backgroundColor, defaultOptions, 4.5);
    const aaa = findBestContrast(backgroundColor, defaultOptions, 7);

    return {
      ...token.attributes,
      contrast: {
        aa: { color: aa.color, ratio: aa.ratio.toFixed(2), passes: aa.passes },
        aaa: { color: aaa.color, ratio: aaa.ratio.toFixed(2), passes: aaa.passes },
        chosen: null // Will be populated by format function
      }
    };
  }
};
