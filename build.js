import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const getThemesAndMetadata = () => {
  const coreFolders = globSync('src/tokens/core/*');
  const semanticFolders = globSync('src/tokens/semantic/*');
  const themes = [];
  const tokenSetOrder = [];

  // Include core folders in the token set order
  const sortedCoreFolders = coreFolders.sort((a, b) => {
    const aPrefix = parseInt(path.basename(a).split('-')[0], 10) || 0;
    const bPrefix = parseInt(path.basename(b).split('-')[0], 10) || 0;
    return aPrefix - bPrefix;
  });

  sortedCoreFolders.forEach(folder => {
    const folderName = path.basename(folder).replace(/^\d+-/, ''); // Remove numeric prefix
    tokenSetOrder.push(folderName);
  });

  // Include semantic folders in the token set order and themes
  const sortedSemanticFolders = semanticFolders.sort((a, b) => {
    const aPrefix = parseInt(path.basename(a).split('-')[0], 10) || 0;
    const bPrefix = parseInt(path.basename(b).split('-')[0], 10) || 0;
    return aPrefix - bPrefix;
  });

  sortedSemanticFolders.forEach(folder => {
    const folderName = path.basename(folder).replace(/^\d+-/, ''); // Remove numeric prefix
    tokenSetOrder.push(folderName);

    if (folderName !== 'base') {
      themes.push({
        name: folderName.replace(/-/g, ' '),
        selectedTokenSets: {
          base: 'enabled',
          [folderName]: 'enabled'
        }
      });
    }
  });

  return { themes, metadata: {
    "$metadata": {
      "tokenSetOrder": tokenSetOrder,
      "activeThemes": themes.map(theme => `/${theme.name}`),
      "activeSets": tokenSetOrder
    }
  }};
};

StyleDictionary.registerFormat({
  name: 'json/penpot',
  format: async function ({ dictionary }) {
    const simplifyTokens = (tokens) => {
      const result = {};
      Object.entries(tokens).forEach(([key, token]) => {
        if (token.$value !== undefined) {
          result[key] = {
            $value: token.$value,
            $type: token.$type
          };
        } else if (typeof token === 'object') {
          result[key] = simplifyTokens(token);
        }
      });
      return result;
    };

    const { themes, metadata } = getThemesAndMetadata();
    const semanticTokens = simplifyTokens(dictionary.tokens);

    return JSON.stringify({ ...semanticTokens, "$themes": themes, ...metadata }, null, 2);
  }
});

// Find all token files matching the pattern
const tokenFiles = globSync('src/tokens/**/*.tokens');

// Configure Style Dictionary instance
const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    json_combined: {
      buildPath: 'build/',
      files: [{
        destination: 'penpot.json',
        format: 'json/penpot',
        options: {
          outputReferences: true,
          nesting: {
            global: 'src/tokens/base/**/*.tokens',
            semantic: 'src/tokens/semantic/**/*.tokens'
          }
        }
      }],
    },
  }
});

// Ensure the build directory exists
const buildDir = path.resolve('build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Execute the build process for the json_combined platform
(async () => {
  await myStyleDictionary.buildAllPlatforms();
  console.log('Build completed!');
})();