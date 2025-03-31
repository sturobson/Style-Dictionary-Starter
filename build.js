import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// The themes we want to generate
const themes = ['theme1', 'theme2', 'theme3'];
// The output formats we want to generate
const formats = ['css', 'scss'];

// Function to get config for a specific theme and format
function getStyleDictionaryConfig(theme, format) {
  return {
    source: [
      `src/tokens/base/${theme}/**/*.tokens`,
      'src/tokens/semantic/**/*.tokens'
    ],
    platforms: {
      // Configuration for base tokens - outputting to /base/ folder
      [`${format}_base`]: {
        transformGroup: format,
        buildPath: `build/${format}/base/`,
        files: [
          {
            destination: `${theme}.${format}`,
            format: `${format}/variables`,
            filter: (token) => token.filePath.includes(`src/tokens/base/${theme}/`)
          }
        ]
      }
    }
  };
}

// Only generate semantic once, not per theme
function getSemanticConfig(format) {
  // We'll just use theme1 as the "base" for semantic tokens
  // but the references will work for any theme
  return {
    source: [
      'src/tokens/base/theme1/**/*.tokens', // Need the base tokens for reference
      'src/tokens/semantic/**/*.tokens'
    ],
    platforms: {
      [`${format}_semantic`]: {
        transformGroup: format,
        buildPath: `build/${format}/semantic/`,
        files: [
          {
            destination: `tokens.${format}`,
            format: `${format}/variables-semantic`,
            filter: (token) => token.filePath.includes('src/tokens/semantic/'),
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  };
}

// Register custom format for CSS semantic variables with ds- prefix
StyleDictionary.hooks.formats['css/variables-semantic'] = function({ dictionary, options }) {
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('src/tokens/semantic/')
  );

  const variables = semanticTokens.map((token) => {
    const { name } = token;
    const description = token.original.$description || '';
    
    const referenceValue = token.original.$value;
    if (typeof referenceValue === 'string' && referenceValue.startsWith('{')) {
      const refPath = referenceValue.replace(/^\{|\}$/g, '');
      const cssVarName = `var(--${refPath.replace(/\./g, '-')})`;
      
      return `  --ds-${name}: ${cssVarName};${description ? ` /* ${description} */` : ''}`;
    } else {
      return `  --ds-${name}: ${token.value};${description ? ` /* ${description} */` : ''}`;
    }
  }).join('\n');

  return `:root {\n${variables}\n}`;
};

// Register custom format for SCSS semantic variables with ds- prefix
StyleDictionary.hooks.formats['scss/variables-semantic'] = function({ dictionary, options }) {
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('src/tokens/semantic/')
  );

  const variables = semanticTokens.map((token) => {
    const { name } = token;
    const description = token.original.$description || '';
    
    const referenceValue = token.original.$value;
    if (typeof referenceValue === 'string' && referenceValue.startsWith('{')) {
      const refPath = referenceValue.replace(/^\{|\}$/g, '');
      return `$ds-${name}: $${refPath.replace(/\./g, '-')};${description ? ` // ${description}` : ''}`;
    } else {
      return `$ds-${name}: ${token.value};${description ? ` // ${description}` : ''}`;
    }
  }).join('\n');

  return variables;
};

// Loop through each theme and format and build base tokens
themes.forEach(theme => {
  formats.forEach(format => {
    console.log(`Building ${format} base tokens for ${theme}...`);
    const sd = new StyleDictionary(getStyleDictionaryConfig(theme, format));
    
    // For each platform in the config
    Object.keys(sd.config.platforms).forEach(platform => {
      sd.buildPlatform(platform);
    });
  });
});

// Build semantic tokens once for each format
formats.forEach(format => {
  console.log(`Building ${format} semantic tokens...`);
  const sd = new StyleDictionary(getSemanticConfig(format));
  
  // For each platform in the config
  Object.keys(sd.config.platforms).forEach(platform => {
    sd.buildPlatform(platform);
  });
});

console.log('Build completed!');
