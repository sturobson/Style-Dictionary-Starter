// script for light-dark() attribute in CSS

import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

const tokenFiles = globSync('src/tokens/**/*.tokens');
const HEADER_COMMENT = `/**
 * Do not edit directly, this file was auto-generated.
 */\n\n`;

const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    css_base: {
      transformGroup: 'css',
      buildPath: 'build/css/base/',
      files: [
        {
          destination: 'colors.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('base'),
        },
      ],
    },
    css_themed: {
      transformGroup: 'css',
      buildPath: 'build/css/combined/',
      files: [
        {
          destination: 'colors.css',
          format: 'css/variables-themed',
        },
      ],
    },
  },
});

// Register a new format for themed CSS
StyleDictionary.hooks.formats['css/variables-themed'] = function({ dictionary }) {
  // Extract semantic tokens
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('combined')
  );

  // Generate CSS variables for light and dark modes
  const variables = semanticTokens.map((token) => {
    const { name } = token;
    const description = token.original.$description;
    const baseVariableName = token.original['$value'].replace(/^\{|\}$/g, ''); // Remove curly braces
    const lightCssVariableName = `var(--${baseVariableName.replace(/\./g, '-').replace(/_/g, '-')})`;
    const darkModeValue = token.original.$mods?.dark; // Access dark mode value
    const darkCssVariableName = darkModeValue ? `var(--${darkModeValue.replace(/^\{|\}$/g, '').replace(/\./g, '-').replace(/_/g, '-')})` : null;

    if (darkCssVariableName) {
      return `  --${name}: light-dark(${lightCssVariableName}, ${darkCssVariableName});`;
    } else {
      return `  --${name}: ${lightCssVariableName};`;
    }
  }).join('\n');

  return `${HEADER_COMMENT}:root {\n${variables}\n}`;
};

myStyleDictionary.buildAllPlatforms();
console.log('Build completed!');