import StyleDictionary from 'style-dictionary';

// Filter tokens to get only microcopy tokens based on extensions
const getMicrocopyTokens = (dictionary) => {
  return dictionary.allTokens.filter(token => {
    return token.$extensions &&
      token.$extensions['com.alwaystwisted.microcopy'] &&
      token.$extensions['com.alwaystwisted.microcopy'].enabled;
  });
};

// Build a nested object from flat token paths
const buildNestedObject = (tokens) => {
  const result = {};

  tokens.forEach(token => {
    const path = token.path.slice(1); // Skip 'copy' prefix from path
    let current = result;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        current[key] = token.$value;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });
  });

  return result;
};

// Register custom format for JavaScript ES6 export
StyleDictionary.registerFormat({
  name: 'javascript/microcopy',
  format: function ({ dictionary }) {
    const nested = buildNestedObject(getMicrocopyTokens(dictionary));
    return `export const microcopy = ${JSON.stringify(nested, null, 2)};`;
  }
});

// Register custom format for JSON output
StyleDictionary.registerFormat({
  name: 'json/microcopy',
  format: function ({ dictionary }) {
    const nested = buildNestedObject(getMicrocopyTokens(dictionary));
    return JSON.stringify(nested, null, 2);
  }
});

// List of supported languages
const languages = ['en', 'fr'];

// Build microcopy for each language
languages.forEach(language => {
  const config = {
    source: [`tokens/copy/${language}/**/*.tokens.json`],
    platforms: {
      js: {
        transformGroup: 'js',
        buildPath: `build/js/${language}/`,
        files: [{
          destination: 'microcopy.js',
          format: 'javascript/microcopy'
        }]
      },
      json: {
        transformGroup: 'js',
        buildPath: `build/json/${language}/`,
        files: [{
          destination: 'microcopy.json',
          format: 'json/microcopy'
        }]
      }
    }
  };

  const sd = new StyleDictionary(config);
  sd.buildAllPlatforms();
});
