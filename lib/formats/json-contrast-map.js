/**
 * Format that outputs a JSON map of all background colors
 * and their accessible text color pairs
 */
import { getContrastRatio } from '../contrast-helpers.js';
import { contrastConfig } from '../../build.js';

export default {
  name: 'json/contrast-map',
  format: async ({ dictionary }) => {
    const contrastMap = {};

    // Build a map of foreground tokens for quick lookup
    const foregroundTokens = {};
    dictionary.allTokens.forEach(token => {
      if (token.path[token.path.length - 1] === contrastConfig.foregroundTokenName) {
        const key = `${token.path[0]}.${token.path[1]}`;
        foregroundTokens[key] = token.value;
      }
    });

    dictionary.allTokens.forEach(token => {
      if (token.attributes?.contrast) {
        const baseName = token.name.replace(`-${contrastConfig.backgroundTokenName}`, '');
        const { aa, aaa } = token.attributes.contrast;

        const entry = {
          value: token.value,
          textAA: aa.color,
          textAAA: aaa.color,
          ratioAA: parseFloat(aa.ratio),
          ratioAAA: parseFloat(aaa.ratio),
          passesAA: aa.passes,
          passesAAA: aaa.passes,
          // Include token names for validation
          tokens: {
            background: token.name,
            textAA: `${baseName}-text-aa`,
            textAAA: `${baseName}-text-aaa`
          }
        };

        // If a foreground was chosen, include its test results
        const componentGroup = token.path[0];
        const componentVariant = token.path[1];
        const foregroundKey = `${componentGroup}.${componentVariant}`;
        if (foregroundTokens[foregroundKey]) {
          const chosenForeground = foregroundTokens[foregroundKey];
          const chosenAARatio = getContrastRatio(token.value, chosenForeground);
          const chosenAAARatio = getContrastRatio(token.value, chosenForeground);

          entry.chosen = {
            color: chosenForeground,
            ratioAA: parseFloat(chosenAARatio.toFixed(2)),
            ratioAAA: parseFloat(chosenAAARatio.toFixed(2)),
            passesAA: chosenAARatio >= 4.5,
            passesAAA: chosenAAARatio >= 7
          };
        }

        contrastMap[token.name] = entry;
      }
    });

    return JSON.stringify(contrastMap, null, 2);
  }
};
