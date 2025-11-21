import StyleDictionary from 'style-dictionary';
import { utilityConfig } from './config/utilities.js';

// Helper function to create utility format
function createUtilityFormat(configKey, tokenPath, title) {
  return function({ dictionary }) {
    let output = `/* ${title} */\n\n`;

    utilityConfig[configKey].forEach(util => {
      dictionary.allTokens
        .filter(token => {
          // Handle both single path (spacing, color) and nested paths (font.size, font.weight)
          if (tokenPath.length === 1) {
            return token.path[0] === tokenPath[0];
          }
          return token.path[0] === tokenPath[0] && token.path[1] === tokenPath[1];
        })
        .forEach(token => {
          // Build class name
          let tokenName;
          if (tokenPath[0] === 'color') {
            tokenName = token.path.slice(1).join('-');
          } else {
            tokenName = token.path[token.path.length - 1];
          }
          
          const className = `${util.prefix}-${tokenName}`;
          output += `.${className} {\n  ${util.property}: ${token.$value};\n}\n\n`;
        });
    });

    return output;
  };
}

// Register all formats using the helper
StyleDictionary.registerFormat({
  name: 'css/utility-spacing',
  format: createUtilityFormat('spacing', ['spacing'], 'Spacing Utilities')
});

StyleDictionary.registerFormat({
  name: 'css/utility-color',
  format: createUtilityFormat('color', ['color'], 'Color Utilities')
});

StyleDictionary.registerFormat({
  name: 'css/utility-font-size',
  format: createUtilityFormat('fontSize', ['font', 'size'], 'Font Size Utilities')
});

StyleDictionary.registerFormat({
  name: 'css/utility-font-weight',
  format: createUtilityFormat('fontWeight', ['font', 'weight'], 'Font Weight Utilities')
});

StyleDictionary.registerFormat({
  name: 'css/utility-font-family',
  format: createUtilityFormat('fontFamily', ['font', 'family'], 'Font Family Utilities')
});

const sd = new StyleDictionary({
  source: ['src/tokens/base/**/*.tokens'],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'utilities-spacing.css',
          format: 'css/utility-spacing'
        },
        {
          destination: 'utilities-color.css',
          format: 'css/utility-color'
        },
        {
          destination: 'utilities-font-size.css',
          format: 'css/utility-font-size'
        },
        {
          destination: 'utilities-font-weight.css',
          format: 'css/utility-font-weight'
        },
        {
          destination: 'utilities-font-family.css',
          format: 'css/utility-font-family'
        }
      ]
    }
  }
});

await sd.buildAllPlatforms();
