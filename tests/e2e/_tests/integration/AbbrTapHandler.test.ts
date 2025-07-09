'use strict';

import { test, expect, TestInfo, PlaywrightTestArgs } from '@playwright/test';
import { ATT_CLASS_ON } from '@src/ts/style.tokens.js';

import { beforeTest, hasVisibleAfter } from '@tests/e2e/.ancillary/helpers/helpers.js';

test.describe('AbbrTapHandler Test', () => {

    test.beforeEach(async ({ page }: PlaywrightTestArgs, testInfo: TestInfo) => {
        await beforeTest(page, testInfo, 'abbr.init.js');
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

    test('Should remove classes from all abbr tags when tap on body', async ({ page }: PlaywrightTestArgs) => {
        expect(page).toBeTruthy();

        // Arrange: tap on abbr
        const abbr = page.locator('abbr').last();
        await abbr.waitFor();

        await abbr?.dispatchEvent('touchstart');
        await abbr?.dispatchEvent('touchend');

        // Act: tap on body to clear all abbr's classes
        const body = page.locator('body');
        await body.waitFor();

        await body?.dispatchEvent('touchstart');
        await body?.dispatchEvent('touchend');

        // Assert: 
        const actual = await page.locator(`abbr.${ATT_CLASS_ON}`).count();
        expect(actual).toEqual(0);
    });

});

