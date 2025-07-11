'use strict';

import { defineConfig, devices } from '@playwright/test';
import { cwd } from 'process';
import { fileURLToPath, pathToFileURL } from 'url';

const root = pathToFileURL(cwd()).toString();

const projectRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const testRoot = `${projectRoot}tests/e2e`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    // INFO: It is impossible to set multiple folders for tests except as this way.
    testDir: `${testRoot}/_tests`,
    testMatch: '**/*.test.ts',
    outputDir: `${testRoot}/.ancillary/.outputs`,
    globalSetup: `${testRoot}/.ancillary//bootstrap/setup.ts`,

    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        // ['list', { printSteps: true }],
        ['playwright-hierarchy-reporter']
        // ['json', { outputFile: `${testRoot}/.ancillary/.reports/json/report.json` }],
        // ['html', { outputFolder: `${testRoot}/.ancillary/.reports/html` }] // NB: Example
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
