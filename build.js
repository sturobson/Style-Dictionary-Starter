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
    css_semantic: {
      transformGroup: 'css',
      buildPath: 'build/css/combined/',
      files: [
        {
          destination: 'colors.css',
          format: 'css/variables-combined',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    
  },
});

// Register a new format for combined light and dark mode CSS
StyleDictionary.hooks.formats['css/variables-combined'] = function({ dictionary, options }) {
  const { outputReferences } = options;
  
  // Extract semantic tokens
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('combined')
  );

  const lightVariables = semanticTokens.map((token) => {
    const { name, comment } = token;
    const description = token.original.$description;
    const baseVariableName = token.original['$value'].replace(/^\{|\}$/g, ''); // Remove curly braces
    const cssVariableName = `var(--${baseVariableName.replace(/\./g, '-').replace(/_/g, '-')})`;
    return `  --${name}: ${cssVariableName};${description ? ` /* ${description} */` : ''}`;
  }).join('\n');

  const darkVariables = semanticTokens.map((token) => {
    const { name, comment } = token;
    const description = token.original.$description;
    const darkModeValue = token.original.$mods?.dark; // Access dark mode value
    if (darkModeValue) {
      const baseVariableName = darkModeValue.replace(/^\{|\}$/g, ''); // Remove curly braces
      const cssVariableName = `var(--${baseVariableName.replace(/\./g, '-').replace(/_/g, '-')})`;
      return `  --${name}: ${cssVariableName};${description ? ` /* ${description} */` : ''}`;
    }
    return '';
  }).filter(Boolean).join('\n'); // Filter out any undefined dark mode variables
  
  return `${HEADER_COMMENT}:root {\n${lightVariables}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkVariables}\n  }\n}`;
};


myStyleDictionary.buildAllPlatforms();
console.log('Build completed!');
