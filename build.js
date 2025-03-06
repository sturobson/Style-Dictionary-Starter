import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';
import { utilities } from './config/utilities.js'; // For spacing utilities
import { colorUtilities } from './config/colorUtilities.js'; // For color utilities
import { fontUtilities } from './config/fontUtilities.js'; // For font utilities

const tokenFiles = globSync('src/tokens/**/*.tokens');
const HEADER_COMMENT = `/**
 * Do not edit directly, this file was auto-generated.
 */\n\n`;

// Register a new format for generating spacing utility classes
StyleDictionary.hooks.formats['utilityClass'] = function({ dictionary }) {
  let output = '';

  // Iterate over all tokens for spacing
  dictionary.allTokens.forEach(function (token) {
    const tokenType = token.path[0]; // Get the token type (e.g., spacing)

    // Check each utility definition for spacing
    utilities.forEach(function (utility) {
      if (tokenType === utility.tokenType) {
        const tokenShade = token.path[1]; // Get the shade (e.g., 100, 200, 300)
        const utilityClass = `u-${utility.name}-${tokenShade}`; // Create utility class name

        // Use the correct value based on the token's original value
        const tokenValue = token.original["$value"];
        output += `.${utilityClass} { ${utility.CSSprop}: ${tokenValue}; }\n`;
      }
    });
  });

  return output;
};

// Register a new format for generating color utility classes
StyleDictionary.hooks.formats['colorUtilityClass'] = function({ dictionary }) {
  let output = '';

  // Iterate over all tokens for colors
  dictionary.allTokens.forEach(function (token) {
    const tokenType = token.path[0]; // Get the token type (e.g., color)

    // Check each utility definition for colors
    colorUtilities.forEach(function (utility) {
      if (tokenType === utility.tokenType) {
        const colorName = token.path[1]; // Get the color name (e.g., red, blue)
        const tokenShade = token.path[2]; // Get the shade (e.g., 300, 400, 500)

        // Create utility class names with shades
        const utilityClass = `u-${utility.name}-${colorName}--${tokenShade}`; // Create utility class name

        // Use the correct value based on the token's original value
        const tokenValue = token.original["$value"];
        output += `.${utilityClass} { ${utility.CSSprop}: ${tokenValue}; }\n`;
      }
    });
  });

  return output;
};

// Register a new format for generating font utility classes
StyleDictionary.hooks.formats['fontUtilityClass'] = function({ dictionary }) {
  let output = '';

  // Iterate over all tokens for font sizes and weights
  dictionary.allTokens.forEach(function (token) {
    const tokenType = token.path[0]; // Get the token type (e.g., font)
    const tokenCategory = token.path[1]; // Get the category (e.g., size, weight)
    const tokenShade = token.path[2]; // Get the size or weight (e.g., 100, 200, 300)

    // Check each utility definition for font sizes and weights
    fontUtilities.forEach(function (utility) {
      if (tokenType === utility.tokenType && tokenCategory === utility.name.split('-')[1]) {
        // Create utility class name with the correct size or weight identifier
        const utilityClass = `u-${utility.name}--${tokenShade}`; // Create utility class name

        // Use the correct value based on the token's original value
        const tokenValue = token.original["$value"];
        output += `.${utilityClass} { ${utility.CSSprop}: ${tokenValue}; }\n`;
      }
    });
  });

  return output;
};

// Initialize Style Dictionary with the utility class formats
const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'utility.css',
          format: 'utilityClass' // For spacing utilities
        },
        {
          destination: 'color-utility.css',
          format: 'colorUtilityClass' // For color utilities
        },
        {
          destination: 'font-utility.css',
          format: 'fontUtilityClass' // For font utilities
        }
      ]
    }
  }
});

// Build all platforms
myStyleDictionary.buildAllPlatforms();
console.log('Build completed!');
