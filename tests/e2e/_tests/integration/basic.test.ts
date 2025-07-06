'use strict';

import { test, expect, TestInfo, PlaywrightTestArgs } from '@playwright/test';

import { htmlContent } from '@tests/e2e/.ancillary/helpers/helpers.js';

test('calculates remaining width correctly', async ({ page }: PlaywrightTestArgs, testInfo: TestInfo) => {
    const html = htmlContent('page.html', testInfo);
    await page.setContent(html, { waitUntil: 'load' });
    const abbr = await page.$('abbr:first-of-type');

    expect(abbr).not.toBe(null);

    const parentBox = await abbr!.evaluate(el => (el as HTMLElement).offsetParent!.getBoundingClientRect());

    console.dir(parentBox);

    // // Simulate touch
    await abbr!.dispatchEvent('touchstart');

    // // Read value written to DOM or assert via layout changes
    // const remaining = await page.evaluate(() => window.lastRemainingWidth);
    // expect(remaining).toBeCloseTo(parentBox.right - touchX, 1);
});


test('Check touchstart event payload', async ({ page }: PlaywrightTestArgs, testInfo: TestInfo) => {
    // Set up a listener to capture the event
    const html = htmlContent('page.html', testInfo);
    await page.setContent(html, { waitUntil: 'load' });
    const abbr = page.locator('abbr').first();

    abbr.waitFor();

    const box = await abbr.boundingBox();
    console.dir(box);

    // await page.pause();

    // NB: Fire postponed event so that the following listener would be called.
    setTimeout(async () => {
        // await abbr.dispatchEvent('touchstart', { touches: [{ identifier: 'id', clientX: 10, clientY: 10 }] });
        await abbr.dispatchEvent('touchstart');
    }, 400);

    const event = await abbr.evaluate((element) => {

        return new Promise((resolve) => {
            element.addEventListener('touchstart', (event: Event) => {
                // extract some example event data

                const { type } = event;
                const target = event.target as HTMLElement;
                const abbrBox = target.getBoundingClientRect();
                const parentBox = target.offsetParent!.getBoundingClientRect();

                // const { id } = target!;
                // then resolve the promise with that data
                resolve({
                    type, target,
                    abbrTagName: target.tagName,
                    abbrBox,
                    parentTagName: target.offsetParent?.tagName,
                    parentBox,
                    event
                });
            });
        });
    });

    console.log('here...');
    console.dir(event);

    await expect(event).toBeTruthy();

});