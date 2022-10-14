import { build } from "esbuild"

build({
  entryPoints: ["src/scripts/convertAll.ts"],
  outdir: "build",
  bundle: true,
  minify: true,
  format: "esm",
  target: "esnext",
  platform: "node",
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
  },
  outExtension: {
    ".js": ".mjs",
  },
})
