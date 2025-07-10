'use strict';

import { ATapHandler } from '@src/ts/core/ATapHandler.js';
import { ATT_CLASS_ON, ATT_VARIABLE_TITLE_LEFT, ATT_VARIABLE_TITLE_RIGHT } from '@src/ts/core/style.tokens.js';

const ATT_VARIABLE_WIDTH = '--title-width';

type TTitleCoords = { left: string; right: string; width: string; };

/**
 * Handles tap events on `<abbr>` elements to display their title attributes as tooltips.
 * Manages tooltip positioning and cleanup of previously shown tooltips.
 */
export default class AbbrTapHandler extends ATapHandler {

    constructor() {
        super();
    }

    /**
     * Handles tap on an element, showing its title as a positioned tooltip if it's an `<abbr>` tag.
     * 
     * @param {HTMLElement | Document} _el The tapped element to handle.
     */
    public handle(_el: HTMLElement | Document): void {
        this.cleanUp(document.querySelectorAll('abbr'));

        // NB: Should not process the non-abbr elements
        if (!this.isAbbrTag(_el)) { return; }

        const el = _el as HTMLElement;

        this.setTitleCoords(el);

        el.classList.add(ATT_CLASS_ON);
    }

    /**
     * Cleans up all visible abbr tooltips by removing their active class and position styles.
     * 
     * @param {NodeListOf<HTMLElement>} abbrEls Collection of abbr elements to clean up.
     */
    private cleanUp(abbrEls: NodeListOf<HTMLElement>): void {
        abbrEls.forEach((abbrEl: HTMLElement) => {
            abbrEl.classList.remove(ATT_CLASS_ON);

            abbrEl.style.removeProperty(ATT_VARIABLE_TITLE_LEFT);
            abbrEl.style.removeProperty(ATT_VARIABLE_TITLE_RIGHT);
            abbrEl.style.removeProperty(ATT_VARIABLE_WIDTH);
        });
    }

    /**
     * Checks if the current element is an `<abbr>` tag.
     * 
     * @param {HTMLElement | Document} el The element to check if it is an abbr tag.
     * 
     * @returns {boolean} True if the element is an abbr tag
     */
    private isAbbrTag(el: HTMLElement | Document): boolean {
        return !!(el as HTMLElement)?.tagName && (el as HTMLElement).tagName?.toLowerCase() === 'abbr';
    }

    /**
     * Sets the tooltip position coordinates on an abbr element.
     * 
     * @param {HTMLElement} abbrEl - The abbr element to position
     */
    private setTitleCoords(abbrEl: HTMLElement): void {
        // NB: Calculate the top-left coordinates of the abbr:after element.
        const coords = this.titleCoords(abbrEl);

        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_LEFT, coords.left);
        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_RIGHT, coords.right);
        abbrEl.style.setProperty(ATT_VARIABLE_WIDTH, coords.width);
    }

    /**
     * Calculates the optimal tooltip CSS position (`left`, `right`) based on viewport-
     * relative coordinates. 
     * 
     * Align title content left (as in `text-align: left;` CSS rule) 
     * if `abbr` element is in left half of viewport, otherwise align right.
     * 
     * @param {HTMLElement} abbrEl The abbr element to calculate positions for.
     * 
     * @returns {TTitleCoords} Object containing top, left and right CSS values
     */
    private titleCoords(abbrEl: HTMLElement): TTitleCoords {
        const rect = abbrEl.getBoundingClientRect();
        const vwMax = window.innerWidth * 0.9;
        const vwLeft = window.innerWidth * 0.1;
        const offset = { top: rect.height / 3, left: 10, right: 10 };

        /**
         * Here we decide on title content alignment (left or right).
         * Calculate threshold (50vw, middle of the viewport) in pixels
         * 
        */
        const vwThreshold = this.round(0.5 * window.innerWidth);
        const shouldAlignLeft = rect.x < vwThreshold;

        /**
         * NB: Depending on the alignment decision (left or right), the opposite CSS 
         * rule (`right` or `left`) is set to `auto`
        */
        const leftAndRight = {
            left: shouldAlignLeft ? `${offset.left}px` : 'auto',
            right: shouldAlignLeft ? 'auto' : `${offset.right}px`,
        };

        const maxWidth = shouldAlignLeft ? vwMax - rect.left - offset.left : rect.right - offset.right - vwLeft;
        const actualWidth = this.assessActualWidth(abbrEl);
        const width = actualWidth < maxWidth ? actualWidth : this.round(maxWidth);

        console.log('actual width: ', actualWidth);
        console.log('vwMax: ', vwMax);

        return {
            left: leftAndRight.left,
            right: leftAndRight.right,
            width: `${width}px`
        };

    }

    private assessActualWidth(abbrEl: HTMLElement): number {
        const content = getComputedStyle(abbrEl, '::after').content;

        if (!content || content === 'none' || content === '""') return NaN;

        // Remove surrounding quotes from content string
        const text = content.replace(/^"(.*)"$/, '$1');

        // Create hidden span to measure text
        const span = document.createElement('span');
        span.classList.add(ATT_CLASS_ON);
        span.textContent = text;

        document.body.appendChild(span);

        // NB: Add 4px safety margin for calculation error
        const actualWidth = this.round(span.offsetWidth + 4);

        document.body.removeChild(span);

        return actualWidth;
    }

    private round(value: number) { return Math.round(value); };

}