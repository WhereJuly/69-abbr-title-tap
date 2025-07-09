'use strict';

import { execSync } from 'child_process';

const commands: string[] = [
    'npm run test:e2e -- -- --workers 1',
    'npm run lint',
    'rimraf ./.delivery/.builds/dist',
    'tsx .delivery/scripts/build/for-browser.ts',
    'tsc -p ./.delivery/configuration/tsconfig.json',
    'npm run package:build:less',
    'npm run package:bundle:copy',
    'cd .usage && npm install',
    // 'npm run package:pack',
];

try {
    commands.forEach((cmd) => {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    });
} catch (_error) {
    const error = _error as Error;

    console.error(`Error running command: ${error.message}`);

    process.exit(1);
}
