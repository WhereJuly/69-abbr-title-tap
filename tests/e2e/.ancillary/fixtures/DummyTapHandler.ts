'use strict';

import { ATapHandler } from '@src/ts/ATapHandler.js';

export const ATT_CLASS_ON = 'att-on';

export const ATT_VARIABLE_TITLE_TOP = '--title-top';
export const ATT_VARIABLE_TITLE_LEFT = '--title-left';

export default class DummyTapHandler extends ATapHandler {

    constructor() {
        super();
    }

    public handle(el: HTMLElement): void {
        this.el = el;
        document.querySelectorAll('abbr').forEach(el => el.classList.remove(ATT_CLASS_ON));

        // NB: Should not process the non-abbr elements
        console.log('is abbr tag...');
        if (!this.isAbbrTag()) { return; }


        // NB: Calculate the top-left coordinates of the abbr:after element.
        const coords = this.titleCoords(this.el);

        this.el.style.setProperty(ATT_VARIABLE_TITLE_TOP, `${coords.top}px`);
        this.el.style.setProperty(ATT_VARIABLE_TITLE_LEFT, `${coords.left}px`);

        this.el.classList.add(ATT_CLASS_ON);
    }

    // NB: Must be called only after setting `el` on `this`.
    private isAbbrTag(): boolean {
        return this.el?.tagName.toLowerCase() === 'abbr';
    }

    private titleCoords(abbrEl: HTMLElement): { top: number; left: number; } {
        const rect = abbrEl.getBoundingClientRect();

        // console.log(JSON.stringify(rect));

        const offset = { top: rect.height / 3, left: 10 };
        return { top: rect.bottom + offset.top, left: rect.x + offset.left };
    }

}