'use strict';

import * as esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';

const outDir = '.delivery/.builds/dist/browser';

const config: BuildOptions = {
    entryPoints: ['.delivery/scripts/build/browser-entry-point.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2017'],
    platform: 'browser',
    format: 'iife',
    outfile: `${outDir}/abbr-title-tap.min.js`
};

esbuild.build(config)
    .then(() => console.log('[ts] ESBuild completed'))
    .catch(() => process.exit(1));

esbuild.build({
    entryPoints: ['src/styles/styles.less'],
    bundle: true,
    minify: true,
    plugins: [lessLoader()],
    outfile: `${outDir}/styles.min.css`,
})
    .then(() => console.log('[styles] ESBuild completed'))
    .catch(() => process.exit(1));