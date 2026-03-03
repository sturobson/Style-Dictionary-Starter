import StyleDictionary from 'style-dictionary';

const getMicrocopyTokens = (dictionary) => {
  return dictionary.allTokens.filter(token => {
    return token.$extensions &&
      token.$extensions['com.alwaystwisted.microcopy'] &&
      token.$extensions['com.alwaystwisted.microcopy'].enabled;
  });
};

const buildNestedObject = (tokens) => {
  const result = {};

  tokens.forEach(token => {
    const path = token.path.slice(1); // Skip 'copy' from path
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

StyleDictionary.registerFormat({
  name: 'javascript/microcopy',
  format: function ({ dictionary }) {
    const nested = buildNestedObject(getMicrocopyTokens(dictionary));
    return `export const microcopy = ${JSON.stringify(nested, null, 2)};`;
  }
});

StyleDictionary.registerFormat({
  name: 'json/microcopy',
  format: function ({ dictionary }) {
    const nested = buildNestedObject(getMicrocopyTokens(dictionary));
    return JSON.stringify(nested, null, 2);
  }
});

export default {
  source: ['tokens/**/*.tokens.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [{
        destination: 'microcopy.js',
        format: 'javascript/microcopy'
      }]
    },
    json: {
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [{
        destination: 'microcopy.json',
        format: 'json/microcopy'
      }]
    }
  }
};
