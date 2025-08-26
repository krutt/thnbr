/* ~~/vite.config.ts */

import autoImport from 'unplugin-auto-import/vite'
import autoprefixer from 'autoprefixer'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { gzip } from 'node:zlib'
import { promisify } from 'node:util'
import { resolve } from 'node:path'
import svgLoader from 'vite-svg-loader'
import tailwind from 'tailwindcss'
import topLevelAwait from 'vite-plugin-top-level-await'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/thnbr/',
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwind()],
    },
  },
  build: { compilerOptions: { target: 'esnext' } },
  optimizeDeps: { exclude: ['pyodide'] },
  plugins: [
    autoImport({
      dirs: ['./src/stores'],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        {
          '@vueuse/core': ['useColorMode'],
        },
        'pinia',
        'vue',
        'vue-router',
        {
          'vue-sonner': ['toast'],
        },
      ],
    }),
    svgLoader(),
    topLevelAwait(),
    vue(),
    {
      generateBundle: async () => {
        const assetsDir = 'dist/assets'
        await mkdir(assetsDir, { recursive: true })
        const files = [
          'pyodide-lock.json',
          'pyodide.asm.js',
          'pyodide.asm.wasm',
          'python_stdlib.zip',
        ]
        const gzipAsync = promisify(gzip)
        const modulePath = resolve(__dirname, './static/')
        for (const file of files) {
          const buffer = await readFile(resolve(modulePath, file))
          const compressed = await gzipAsync(buffer)
          await writeFile(resolve(assetsDir, file), compressed)
        }
      },
      name: 'vite-pyodide',
    },
    {
      configureServer: (server) => {
        server.middlewares.use((_, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((_, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          next()
        })
      },
      name: 'configure-response-headers',
    },
  ],
  publicDir: fileURLToPath(new URL('./static', import.meta.url)),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  worker: { format: 'es' },
})
