// import { build } from 'esbuild';

// async function buildAlohomoraCore() {
//   try {
//     await build({
//       entryPoints: ['./src/index.ts'],
//       outfile: './bundle/index.js',
//       bundle: true,
//       minify: true,
//     });
//     console.log('Alohomora Core built successfully.');
//   } catch (error) {
//     console.error('Error building Alohomora Core:', error);
//     process.exit(1);
//   }
// }
// buildAlohomoraCore();
import { build } from 'esbuild';
import { execSync } from 'child_process';
import { rmSync } from 'fs';

// 1. 기존 dist 삭제
rmSync('./dist', { recursive: true, force: true });

// 2. 타입 선언 생성 (tsc 사용)
execSync('npx tsc');

// 3. esbuild로 ESM 번들
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'bundle/index.mjs',
  bundle: true,
  format: 'esm',
  target: ['esnext'],
  sourcemap: true
});

// 4. esbuild로 CJS 번들
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'bundle/index.cjs',
  bundle: true,
  format: 'cjs',
  target: ['esnext'],
  sourcemap: true
});

console.log('Build complete.');