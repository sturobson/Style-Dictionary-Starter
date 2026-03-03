import { createStyleDictionary } from './style-dictionary-config.js';

/**
 * Build microcopy tokens in multiple formats
 */
async function build() {
  console.log('🏗️  Building microcopy tokens...\n');

  // Create configured Style Dictionary instance
  const sd = createStyleDictionary();

  // Build all platforms (JavaScript, JSON, Nunjucks, TypeScript)
  await sd.buildAllPlatforms();

  console.log('\n✅ Build complete!');
}

build().catch(console.error);
