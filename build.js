import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// The themes we want to generate
const themes = ['theme1', 'theme2', 'theme3'];
// The output formats we want to generate
const formats = ['css'];

// Function to get config for a specific theme and format (theme tokens)
function getStyleDictionaryConfig(theme, format) {
  const platformConfig = {};

  // Add theme CSS files
  platformConfig[`${format}_theme`] = {
    transformGroup: format,
    buildPath: `build/${format}/themes/`,
    files: [
      {
        destination: `${theme}.${format}`,
        format: `${format}/theme-wrapper`,
        filter: (token) => token.filePath.includes(`src/tokens/base/${theme}/`),
        options: {
          themeName: theme
        }
      }
    ]
  };

  return {
    source: [
      `src/tokens/base/${theme}/**/*.tokens`,
      'src/tokens/semantic/**/*.tokens'
    ],
    platforms: platformConfig
  };
}

// Only generate semantic once, not per theme
function getSemanticConfig(format) {
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

// Helper function to safely get token value
function getTokenValue(token) {
  if (token && token.original && token.original.$value) {
    return token.original.$value;
  }
  if (token && token.value) {
    return token.value;
  }
  return token.value;
}

// Register custom format for CSS theme wrapper with class selector
StyleDictionary.hooks.formats['css/theme-wrapper'] = function({ dictionary, options }) {
  const themeName = options.themeName || 'default';
  
  const tokens = dictionary.allTokens.filter(token => 
    token.filePath.includes(`src/tokens/base/${themeName}/`)
  );

  console.log(`Theme ${themeName} has ${tokens.length} tokens for theme wrapper`);
  
  const variables = tokens.map((token) => {
    const name = token.path.join('-');
    const value = getTokenValue(token);
    
    return `  --${name}: ${value};`;
  }).join('\n');

  return `.${themeName} {\n${variables}\n}`;
};



// Register custom format for CSS semantic variables with ds- prefix
StyleDictionary.hooks.formats['css/variables-semantic'] = function({ dictionary, options }) {
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('src/tokens/semantic/')
  );

  const variables = semanticTokens.map((token) => {
    const name = token.path.join('-');
    const description = token.original.$description || '';
    
    const referenceValue = getTokenValue(token);
    if (typeof referenceValue === 'string' && referenceValue.startsWith('{')) {
      const refPath = referenceValue.replace(/^\{|\}$/g, '');
      const cssVarName = `var(--${refPath.replace(/\./g, '-')})`;
      
      return `  --ds-${name}: ${cssVarName};${description ? ` /* ${description} */` : ''}`;
    } else {
      return `  --ds-${name}: ${referenceValue};${description ? ` /* ${description} */` : ''}`;
    }
  }).join('\n');

  return `:root {\n${variables}\n}`;
};


// Loop through each theme and format and build theme tokens
themes.forEach(theme => {
  formats.forEach(format => {
    console.log(`Building ${format} tokens for ${theme}...`);
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
