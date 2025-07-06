import TapDetector from '@src/TapDetector.ts';
import DummyTapHandler from '@tests/e2e/.ancillary/fixtures/DummyTapHandler.ts';

declare global {
    interface Window {
        __ABBR_TAP_HANDLER__: DummyTapHandler;
        __TAP_DETECTOR__: TapDetector;
    }
}