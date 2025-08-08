'use strict';

import { ATapHandler } from '@src/ts/core/ATapHandler.js';
import { ATT_CLASS_ON, ATT_VARIABLE_TITLE_LEFT, ATT_VARIABLE_TITLE_RIGHT, ATT_VARIABLE_TITLE_WIDTH } from '@src/ts/core/style.tokens.js';

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
            abbrEl.style.removeProperty(ATT_VARIABLE_TITLE_WIDTH);
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
     * Sets the tooltip position coordinates and width on an abbr element.
     * 
     * @param {HTMLElement} abbrEl - The abbr element to position
     */
    private setTitleCoords(abbrEl: HTMLElement): void {
        // NB: Calculate the top-left coordinates of the abbr:after element.
        const coords = this.titleCoords(abbrEl);

        console.dir(coords);

        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_LEFT, coords.left);
        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_RIGHT, coords.right);
        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_WIDTH, coords.width);
    }

    /**
     * Calculates the optimal tooltip CSS position (`left`, `right`) based on viewport-
     * relative coordinates and its actual with using hidden `span` element as a measure
     * {@link assessActualWidth}.
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
        const vwMax = window.innerWidth * 0.95;
        const vwLeft = window.innerWidth * 0.1;
        const offset = { top: rect.height / 3, left: 10, right: 10 };

        /**
         * @problem
         * This is the treatment for multiline `abbr`.
         * 
         * @see https://github.com/WhereJuly/69-abbr-title-tap/issues/1
         * 
         * The multiline `abbr` has 2 left coordinates. First is where `abbr` (as inline 
         * and relative positioned element) line starts. 
         * 
         * The second is where the second and all following lines start.
         * 
         * Multiline `abbr` title content (tooltip) placed at first `left` coordinate 
         * will make the tooltip spread beyond the right edge of viewport causing 
         * the entire view to shift left.
         * 
         * Thus for multiline `abbr` we have to set tooltip `left` coordinate adjusting for
         * the second line `left` to keep the tooltip within given viewport.
         * 
         * @solution
         * We check if the `abbr` is multiline and make the respective adjustment.
         */
        const rects = abbrEl.getClientRects();
        if (rects.length > 1) { offset.left = rects[1]!.left - rects[0]!.left + offset.left; }

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

        /**
         * Now we decide on the width of the `:after` element. This is required because
         * `abbr` element width is mostly shorter than the title content width. So we need to
         * make the `:after` width to automatically match the actual width of the title content 
         * with or without word-wrapping.
         */
        const maxWidth = shouldAlignLeft ? vwMax - rect.left - offset.left : rect.right - offset.right - vwLeft;
        const actualWidth = this.assessActualWidth(abbrEl);
        const width = actualWidth < maxWidth ? actualWidth : this.round(maxWidth);

        return {
            left: leftAndRight.left,
            right: leftAndRight.right,
            width: `${width}px`
        };

    }

    /**
     * Measures the actual rendered width of the tooltip content (abbr::after pseudo-element).
     * For this it creates a temporary hidden span with the same content.
     * 
     * The returned NaN does not make any effect in the caller as the missing title attribute
     * is treated with CSS {@link src\styles\abbr.less}.
     * 
     * @param {HTMLElement} abbrEl The abbr element whose tooltip width to measure
     * 
     * @returns {number} The calculated width in pixels (with 4px safety margin), or NaN if no content exists
     */
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

    // Just a small local helper. 
    private round(value: number) { return Math.round(value); };

}