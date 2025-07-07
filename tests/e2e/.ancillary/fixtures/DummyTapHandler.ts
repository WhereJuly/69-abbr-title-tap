'use strict';

import { ATapHandler } from '@src/ATapHandler.js';

export const ATT_CLASS_ON = 'att-on';

export default class DummyTapHandler extends ATapHandler {

    constructor() {
        super();
    }

    public handle(el: HTMLElement): void {
        this.el = el;
        document.querySelectorAll('abbr').forEach(el => el.classList.remove(ATT_CLASS_ON));

        this.el.classList.add(ATT_CLASS_ON);
    }

}