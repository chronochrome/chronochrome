import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// The demo builds straight from workspace sources, so edits to the core or the
// widget show up on the next reload without rebuilding their dist/.
const pkg = (path: string) => fileURLToPath(new URL(`../../packages/${path}`, import.meta.url));

// GITHUB_PAGES=1 pnpm build:demo → base /chronochrome/ for project Pages
const pages = process.env.GITHUB_PAGES === "1" || process.env.GITHUB_PAGES === "true";

export default defineConfig({
  root: "src",
  base: pages ? "/chronochrome/" : "/",
  resolve: {
    alias: [
      { find: /^@chronochrome\/widget\/sky\.css$/, replacement: pkg("widget/src/sky.css") },
      { find: /^@chronochrome\/widget$/, replacement: pkg("widget/src/index.ts") },
      { find: /^chronochrome$/, replacement: pkg("core/src/index.ts") },
    ],
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "../site",
    emptyOutDir: true,
    sourcemap: true,
  },
});
