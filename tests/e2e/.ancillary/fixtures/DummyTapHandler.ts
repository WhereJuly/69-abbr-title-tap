'use strict';

import { ATapHandler } from '@src/ATapHandler.js';

export default class DummyTapHandler extends ATapHandler {

    private _isOn: boolean;

    constructor() {
        super();

        this._isOn = false;
    }

    public handle(el: HTMLElement): void {
        this.el = el;

        console.log('replace with actual behavior...');
        console.log(`el: ${this.el?.tagName}`);

        this._isOn = true;
    }

    public get isOn(): boolean {
        return this._isOn;
    }

}