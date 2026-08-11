import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all component directories
const componentsPath = path.join(__dirname, 'tokens', 'components');
let componentDirs = [];
try {
  componentDirs = readdirSync(componentsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
} catch (error) {
  console.warn('No components directory found');
}

// Build files array dynamically from component structure
const componentFiles = componentDirs.map((componentName) => {
  return {
    css: {
      destination: `css/components/${componentName}.tokens.css`,
      format: 'css/variables',
      filter: (token) => {
        // Filter tokens that belong to this component
        return token.path[0] === componentName;
      },
      options: {
        outputReferences: true,
      },
    },
    scss: {
      destination: `scss/components/${componentName}.tokens.scss`,
      format: 'scss/variables',
      filter: (token) => {
        // Filter tokens that belong to this component
        return token.path[0] === componentName;
      },
      options: {
        outputReferences: true,
      },
    },
  };
});

// Flatten the files array
const flatComponentFiles = componentFiles.flatMap((f) => [
  Object.assign({}, f.css),
  Object.assign({}, f.scss),
]);

// Base token files (shared across components)
const baseAndSemanticFiles = [
  {
    destination: 'base.tokens.css',
    format: 'css/variables',
    filter: (token) => {
      // Include only base/foundational tokens
      return token.path[0] === 'color' && (token.path[1] === 'brand' || token.path[1] === 'neutral');
    },
    options: {
      outputReferences: true,
    },
  },
  {
    destination: 'base.tokens.scss',
    format: 'scss/variables',
    filter: (token) => {
      return token.path[0] === 'color' && (token.path[1] === 'brand' || token.path[1] === 'neutral');
    },
    options: {
      outputReferences: true,
    },
  },
];

const myStyleDictionary = new StyleDictionary({
  // Include base, semantic, and component tokens
  source: [
    'tokens/base/**/*.tokens.json',
    'tokens/semantic/**/*.tokens.json',
    'tokens/components/**/*.tokens.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [...baseAndSemanticFiles, ...flatComponentFiles.filter((f) => f.destination.includes('.css'))],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [...baseAndSemanticFiles, ...flatComponentFiles.filter((f) => f.destination.includes('.scss'))],
    },
  }
});

myStyleDictionary.buildAllPlatforms();
console.log('✅ Per-component token files generated successfully!');
