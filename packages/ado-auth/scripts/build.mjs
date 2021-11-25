// @ts-check
import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp'
import { analyzeMetafile, build } from 'esbuild'
import { readFileSync } from 'fs'
import { argv } from 'process'

/** @type import('../package.json') */
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

async function run() {
  const minify = argv.includes('--minify')

  /** @type import("esbuild").BuildOptions */
  const options = {
    plugins: [pnpPlugin()],
    external: Object.keys(packageJson.dependencies),
    minify,
    platform: 'node',
    target: ['es2015'],
    entryPoints: ['./src/cli.ts'],
    bundle: true,
    outfile: './bin/src/cli.js',
    metafile: true,
  }

  const unMinifiedResult = await build(options)

  if (unMinifiedResult.metafile) {
    let unMinifiedResultMeta = await analyzeMetafile(unMinifiedResult.metafile)
    console.log(unMinifiedResultMeta)
  }
}

run()
