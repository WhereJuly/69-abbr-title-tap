'use strict';

import { ATapHandler } from '@src/ts/ATapHandler.js';
import { ATT_CLASS_ON, ATT_VARIABLE_TITLE_LEFT, ATT_VARIABLE_TITLE_TOP } from '@src/ts/style.tokens.js';

type TTitleCoords = { top: number; left: number; };

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
        });
    }

    // NB: Must be called only after setting `el` on `this`.
    private isAbbrTag(): boolean {
        return this.el?.tagName?.toLowerCase() === 'abbr';
    }

    private setTitleCoords(abbrEl: HTMLElement): void {
        // NB: Calculate the top-left coordinates of the abbr:after element.
        const coords = this.titleCoords(abbrEl);

        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_TOP, `${coords.top}px`);
        abbrEl.style.setProperty(ATT_VARIABLE_TITLE_LEFT, `${coords.left}px`);
    }

    private titleCoords(abbrEl: HTMLElement): TTitleCoords {
        const round = (value: number) => Math.round(value);
        const rect = abbrEl.getBoundingClientRect();

        const offset = { top: rect.height / 3, left: 10 };
        return { top: round(rect.bottom + offset.top), left: round(rect.x + offset.left) };
    }

}