import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp'
import { analyzeMetafile, build } from 'esbuild'
import { readFileSync } from 'fs'

/** @type import('../package.json') */
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

const result = await build({
  plugins: [pnpPlugin()],
  external: Object.keys(packageJson.dependencies),
  minify: true,
  platform: 'node',
  target: ['es2015'],
  entryPoints: ['./src/cli.ts'],
  bundle: true,
  outfile: './bin/src/cli.js',
  metafile: true,
})

let text = await analyzeMetafile(result.metafile)

console.log(text)
