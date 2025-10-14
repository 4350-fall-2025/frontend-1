// MockResizeObserver generated with GPT-5 mini
// Minimal ResizeObserver polyfill for jsdom tests
class MockResizeObserver {
    callback: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
        this.callback = cb;
    }
    observe() {
        // no-op
    }
    unobserve() {
        // no-op
    }
    disconnect() {
        // no-op
    }
}

// @ts-ignore
global.ResizeObserver = MockResizeObserver;

// Optional: increase default timeout for async tests if needed
jest.setTimeout(10000);
