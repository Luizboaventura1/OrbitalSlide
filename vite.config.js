import { defineConfig } from "vite"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/components.ts"),
      name: "orbitalslide",
      fileName: format => `orbitalslide.${format}.js`,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [],
  test: {
    environment: "happy-dom",
  },
})
