// @ts-check

import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp'
import { analyzeMetafile, build } from 'esbuild'

/**
 * @param {boolean} minify specify whether to minify the output
 */
async function run(minify) {
  /** @type import("esbuild").BuildOptions */
  const options = {
    plugins: [pnpPlugin()],
    platform: 'node',
    target: ['es2019'],
    entryPoints: ['./src/index.ts'],
    bundle: true,
    outfile: minify ? './bin/index.min.js' : './bin/index.js',
    metafile: true,
    minify,
  }

  const unMinifiedResult = await build(options)

  if (unMinifiedResult.metafile) {
    let unMinifiedResultMeta = await analyzeMetafile(unMinifiedResult.metafile)
    console.log(unMinifiedResultMeta)
  }
}

run(false)
run(true)
