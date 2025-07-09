'use strict';

import * as esbuild from 'esbuild';
import type { BuildOptions } from 'esbuild';

const config: BuildOptions = {
    entryPoints: ['.delivery/scripts/build/browser-entry-point.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2017'],
    platform: 'browser',
    format: 'iife',
    outfile: '.delivery/.builds/dist/browser/abbr-title-tap.min.js'
};

esbuild.build(config)
    .then(() => console.log('ESBuild completed'))
    .catch(() => process.exit(1));
