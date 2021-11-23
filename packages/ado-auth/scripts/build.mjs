import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { build } from "esbuild";
import { readFileSync, readSync } from "fs";

/** @type import('./package.json') */
const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

await build({
  plugins: [
    pnpPlugin(),
  ],
  external: Object.keys(packageJson.dependencies),
  minify: true,
  platform: "node",
  target: ["es2015"],
  entryPoints: ["./src/cli.ts"],
  bundle: true,
  outfile: "./bin/src/cli.js",
});
