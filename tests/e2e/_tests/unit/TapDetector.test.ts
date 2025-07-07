'use strict';

import { test, expect, TestInfo, PlaywrightTestArgs, Page } from '@playwright/test';

import { htmlContent, retrieveTagName } from '@tests/e2e/.ancillary/helpers/helpers.js';

test.describe('Basic TapDetector Test', () => {

    test.beforeEach(async ({ page }: PlaywrightTestArgs, testInfo: TestInfo) => {
        // Set up basic page DOM
        const html = htmlContent('page.html', testInfo);
        await page.setContent(html, { waitUntil: 'load' });

        // WARNING: Run `npm run build:test` after update and before using it here 
        await page.addScriptTag({ path: '.delivery/.builds/test/initialization.js', type: 'module' });
        await page.addStyleTag({ path: '.delivery/.builds/test/styles.css' });

        // Forward all console messages from page to Node.js console
        page.on('console', msg => { console.log(`PAGE LOG [${msg.type()}]: ${msg.text()}`); });
    });

    test.describe('Should successfully call the tap handler', () => {
        
        dataProvider_call_tap_handler().forEach((data) => {
            test(`Tap on: ${data.name}`, async ({ page }: PlaywrightTestArgs) => {
                expect(page).toBeTruthy();

                const locator = page.locator(data.selector);
                await locator.waitFor();

                // Act
                await locator?.dispatchEvent('touchstart');
                await locator?.dispatchEvent('touchend');

                // Assert
                const actual = await retrieveTagName(page);
                expect(actual).toEqual(data.expected);
            });
        });

    });

    test('Should not call tap handler on absent `touchend` event', async ({ page }: PlaywrightTestArgs) => {
        expect(page).toBeTruthy();

        const abbr = page.locator('abbr').last();
        await abbr.waitFor();

        // Act
        await abbr?.dispatchEvent('touchstart');

        // Assert
        const actual = await retrieveTagName(page);
        expect(actual).toEqual(null);
    });

    function dataProvider_call_tap_handler() {
        return [
            { name: 'First abbr', selector: 'abbr:first-of-type', expected: 'abbr' },
            { name: 'Last abbr', selector: 'abbr:last-of-type', expected: 'abbr' },
            { name: 'body', selector: 'body', expected: 'document' }
        ];
    }

});