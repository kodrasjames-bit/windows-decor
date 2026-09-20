import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
export default defineConfig({
  resolve: { preserveSymlinks: true, alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  // Use the existing TypeScript compiler instead of launching an esbuild subprocess.
  // This also supports Windows environments where child-process pipes are restricted.
  esbuild: false,
  plugins: [{ name: 'typescript-test-transform', enforce: 'pre', transform(code, id) {
    if (!/\.[jt]sx?$/.test(id) || id.includes('node_modules')) return null;
    return ts.transpileModule(code, { fileName: id, compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, sourceMap:true,
    } }).outputText;
  } }],
  test: { environment:'jsdom', setupFiles:['./tests/setup.ts'], include:['tests/**/*.test.tsx'], pool:'threads' },
});
