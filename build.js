import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// The brands we want to generate
const brands = ['raw', 'smackdown', 'nxt'];
// The output formats we want to generate
const formats = ['css', 'scss'];

// Function to get config for a specific brand and format (base tokens)
function getStyleDictionaryConfig(brand, format) {
  // Base platform configuration (for both CSS and SCSS)
  const platformConfig = {
    [`${format}_base`]: {
      transformGroup: format,
      buildPath: `build/${format}/base/`,
      files: [
        {
          destination: `${brand}.${format}`,
          format: `${format}/variables`,
          filter: (token) => token.filePath.includes(`src/tokens/base/${brand}/`)
        }
      ]
    }
  };
  
  // Removed the brand CSS files configuration here

  return {
    source: [
      `src/tokens/base/${brand}/**/*.tokens`,
      'src/tokens/semantic/**/*.tokens'
    ],
    platforms: platformConfig
  };
}

// Only generate semantic once, not per brand
function getSemanticConfig(format) {
  return {
    source: [
      'src/tokens/base/raw/**/*.tokens', // a brand (any brand) is needed to generate semantic tokens
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

// Removed the brand wrapper format registration

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

// Register custom format for SCSS semantic variables with ds- prefix
StyleDictionary.hooks.formats['scss/variables-semantic'] = function({ dictionary, options }) {
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('src/tokens/semantic/')
  );

  const variables = semanticTokens.map((token) => {
    const name = token.path.join('-');
    const description = token.original.$description || '';
    
    const referenceValue = getTokenValue(token);
    if (typeof referenceValue === 'string' && referenceValue.startsWith('{')) {
      const refPath = referenceValue.replace(/^\{|\}$/g, '');
      return `$ds-${name}: $${refPath.replace(/\./g, '-')};${description ? ` // ${description}` : ''}`;
    } else {
      return `$ds-${name}: ${referenceValue};${description ? ` // ${description}` : ''}`;
    }
  }).join('\n');

  return variables;
};

// Loop through each brand and format and build base tokens
brands.forEach(brand => {
  formats.forEach(format => {
    console.log(`Building ${format} tokens for ${brand}...`);
    const sd = new StyleDictionary(getStyleDictionaryConfig(brand, format));
    
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
