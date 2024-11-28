import StyleDictionary from 'style-dictionary';
import yaml from 'yaml';
import json5 from 'json5';
import hjson from 'hjson';

// Register custom parsers for YAML, JSON5, and HJSON
StyleDictionary.registerParser({
  name: 'yaml-parser',
  pattern: /\.ya?ml$/,
  parser: ({ contents }) => yaml.parse(contents),
});

StyleDictionary.registerParser({
  name: 'json5-parser',
  pattern: /\.json5$/,
  parser: ({ contents }) => json5.parse(contents),
});

StyleDictionary.registerParser({
  name: 'hjson-parser',
  pattern: /\.hjson$/,
  parser: ({ contents }) => hjson.parse(contents),
});

// Configure Style Dictionary
const myStyleDictionary = new StyleDictionary({
  source: [
    `src/tokens/**/*.json`,  // JSON (native)
    `src/tokens/**/*.tokens`,// TOKENS (native)
    `src/tokens/**/*.yaml`,  // YAML (custom parser)
    `src/tokens/**/*.json5`, // JSON5 (custom parser)
    `src/tokens/**/*.hjson`, // HJSON (custom parser)
  ],
  parsers: ['yaml-parser', 'json5-parser', 'hjson-parser'], // Custom parsers
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [
        {
          destination: 'all.css',
          format: 'css/variables',
        },
      ],
    },
  },
});

// Build all platforms
await myStyleDictionary.buildAllPlatforms();