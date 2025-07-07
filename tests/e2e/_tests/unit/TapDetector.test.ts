'use strict';

import { test, expect, TestInfo, PlaywrightTestArgs } from '@playwright/test';

import { hasVisibleAfter, htmlContent } from '@tests/e2e/.ancillary/helpers/helpers.js';
import { ATT_CLASS_ON } from '@tests/e2e/.ancillary/fixtures/DummyTapHandler.js';

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

    test('Should successfully tap on first <abbr>', async ({ page }: PlaywrightTestArgs) => {
        expect(page).toBeTruthy();

        const abbr = page.locator('abbr').first();
        await abbr.waitFor();

        // Act
        await abbr?.dispatchEvent('touchstart');
        await abbr?.dispatchEvent('touchend');

        // Assert
        const class1 = await abbr.getAttribute('class');
        expect(class1).toEqual(ATT_CLASS_ON);
    });

    test('Should remove classes from the first tapped <abbr> when tap on second <abbr>', async ({ page }: PlaywrightTestArgs) => {
        expect(page).toBeTruthy();

        await page.pause();

        const abbr1 = page.locator('abbr').first();
        await abbr1.waitFor();

        // Arrange
        await abbr1?.dispatchEvent('touchstart');
        await abbr1?.dispatchEvent('touchend');

        const abbr2 = page.locator('abbr').last();
        await abbr2.waitFor();

        // Act
        await abbr2?.dispatchEvent('touchstart');
        await abbr2?.dispatchEvent('touchend');

        const class1 = await abbr1.getAttribute('class');
        const class2 = await abbr2.getAttribute('class');

        expect(class1).toEqual('');
        expect(class2).toEqual(ATT_CLASS_ON);

        const abbr1HasVisibleAfter = await hasVisibleAfter(abbr1);
        const abbr2HasVisibleAfter = await hasVisibleAfter(abbr2);

        expect(abbr1HasVisibleAfter).toEqual(false);
        expect(abbr2HasVisibleAfter).toEqual(true);
    });

});

