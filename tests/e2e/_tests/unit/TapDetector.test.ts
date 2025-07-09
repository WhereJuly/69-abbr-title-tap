'use strict';

import { test, expect, TestInfo, PlaywrightTestArgs } from '@playwright/test';

import { beforeTest, retrieveTagName } from '@tests/e2e/.ancillary/helpers/helpers.js';

test.describe('Basic TapDetector Test', () => {

    test.beforeEach(async ({ page }: PlaywrightTestArgs, testInfo: TestInfo) => {
        await beforeTest(page, testInfo, 'dummy.init.js');
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