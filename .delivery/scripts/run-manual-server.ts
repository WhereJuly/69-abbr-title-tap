'use strict';

import browserSync from 'browser-sync';
import { cwd } from 'process';

const server = browserSync.create();

console.log(cwd());

server.init({
    open: false,
    server: {
        baseDir: './tests/manual',  // Your main served directory
        routes: {
            '/.builds': './tests/.builds'  // Map `/shared` to `../folder`
        }
    },
    files: ['./tests/manual', './tests/.builds']  // Watch both directories
});