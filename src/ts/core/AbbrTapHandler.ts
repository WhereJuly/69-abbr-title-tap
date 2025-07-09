'use strict';

import { ATapHandler } from '@src/ts/core/ATapHandler.js';
import { ATT_CLASS_ON, ATT_VARIABLE_TITLE_LEFT, ATT_VARIABLE_TITLE_RIGHT, ATT_VARIABLE_TITLE_TOP } from '@src/ts/core/style.tokens.js';

type TTitleCoords = { top: string; left: string; right: string; };

export default class AbbrTapHandler extends ATapHandler {

    constructor() {
        super();
    }

    public handle(el: HTMLElement): void {
        this.el = el;
        this.cleanUp(document.querySelectorAll('abbr'));

        // NB: Should not process the non-abbr elements
        if (!this.isAbbrTag()) { return; }

        this.setTitleCoords(this.el);

        this.el.classList.add(ATT_CLASS_ON);
    }

    private cleanUp(abbrEls: NodeListOf<HTMLElement>): void {
        abbrEls.forEach((abbrEl: HTMLElement) => {
            abbrEl.classList.remove(ATT_CLASS_ON);

            abbrEl.style.removeProperty(ATT_VARIABLE_TITLE_TOP);
            abbrEl.style.removeProperty(ATT_VARIABLE_TITLE_LEFT);
            abbrEl.style.removeProperty(ATT_VARIABLE_TITLE_RIGHT);
        });
    }

    // NB: Must be called only after setting `el` on `this`.
    private isAbbrTag(): boolean {
        return this.el?.tagName?.toLowerCase() === 'abbr';
    }

    private setTitleCoords(abbrEl: HTMLElement): void {
        // NB: Calculate the top-left coordinates of the abbr:after element.
        const coords = this.titleCoords(abbrEl);

        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_TOP, coords.top);
        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_LEFT, coords.left);
        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_RIGHT, coords.right);
    }

    /**
     * Calculate top, left and right CSS values for the `abbr:after` pseudo-element. 
     * 
     * The alignment of the abbr:after pseudo-element is based on the position of the tapped
     * `abbr.left` coordinate. If it is < 50vw, we align abbr:after left, similar to how `text-align: left;`
     * works. Otherwise we align it right. 
     */
    private titleCoords(abbrEl: HTMLElement): TTitleCoords {
        const round = (value: number) => Math.round(value);
        const rect = abbrEl.getBoundingClientRect();

        const offset = { top: rect.height / 3, left: 10, right: 10 };

        // Calculate threshold (50vw) in pixels
        const vwThreshold = round(0.5 * window.innerWidth);

        const shouldAlignLeft = rect.x < vwThreshold;
        const leftAndRight = {
            left: shouldAlignLeft ? `${round(rect.left + offset.left)}px` : 'auto',
            right: shouldAlignLeft ? 'auto' : `${round( window.innerWidth - rect.right + offset.right)}px`
        };

        return {
            top: `${round(rect.bottom + offset.top)}px`,
            left: leftAndRight.left,
            right: leftAndRight.right
        };

    }

}