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

// Stub missing DOM/browser APIs that Mantine or our code uses during mount
// @ts-ignore
if (!globalThis.URL?.createObjectURL) {
    // @ts-ignore
    globalThis.URL = Object.create(globalThis.URL || {});
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.URL.createObjectURL = jest.fn(() => "blob:mock-placeholder");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.URL.revokeObjectURL = jest.fn();

// Mantine's combobox/select code calls scrollIntoView on items. jsdom doesn't
// implement this; provide a no-op so it won't throw.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Element.prototype.scrollIntoView = function () {
    // no-op
};

// Mock Mantine's useFileDialog hook so tests don't open native dialogs or leave event listeners
// This mock keeps the real implementation for everything except useFileDialog
jest.mock("@mantine/hooks", () => {
    const actual = jest.requireActual("@mantine/hooks");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!actual.useIsomorphicEffect) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        actual.useIsomorphicEffect = actual.useEffect;
    }

    return {
        ...actual,
        useFileDialog: () => ({
            files: [],
            open: jest.fn(),
            reset: jest.fn(),
        }),
    };
});

// Clear mocks between tests to keep things deterministic.
afterEach(() => {
    jest.clearAllMocks();
});

// Optional: increase default timeout for async tests if needed
jest.setTimeout(10000);
