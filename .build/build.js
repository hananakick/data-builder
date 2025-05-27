import { build } from 'esbuild';

async function buildAlohomoraCore() {
  try {
    await build({
      entryPoints: ['./src/index.ts'],
      outfile: './bundle/index.js',
      bundle: true,
      minify: true,
    });
    console.log('Alohomora Core built successfully.');
  } catch (error) {
    console.error('Error building Alohomora Core:', error);
    process.exit(1);
  }
}
buildAlohomoraCore();