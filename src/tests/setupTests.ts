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

// Mock URL constructor and its static methods for tests generated with Claude Sonnet 4.5
// @ts-ignore
global.URL = class URL {
    constructor(url: string) {
        return {
            href: url,
            protocol: "http:",
            host: "localhost",
            hostname: "localhost",
            port: "",
            pathname: url,
            search: "",
            hash: "",
            origin: "http://localhost",
        };
    }
    static createObjectURL = jest.fn(() => "blob:mock-placeholder");
    static revokeObjectURL = jest.fn();
};

// Also set static methods on globalThis.URL for compatibility
// @ts-ignore
globalThis.URL.createObjectURL = jest.fn(() => "blob:mock-placeholder");
// @ts-ignore
globalThis.URL.revokeObjectURL = jest.fn();

// Prevent TypeScript errors about missing scrollIntoView, which is called by some Mantine components.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Element.prototype.scrollIntoView = function () {
    // no-op
};

// Mock localStorage for all tests
// This creates a working localStorage implementation that persists within a test but resets between tests
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index: number) => {
            const keys = Object.keys(store);
            return keys[index] || null;
        },
    };
})();

Object.defineProperty(global, "localStorage", {
    value: localStorageMock,
    writable: true,
});

// Mock Mantine's useFileDialog hook so tests don't open native dialogs or leave event listeners
// This mock keeps the real implementation for everything except useFileDialog. Generated with Claude Sonnet 4.5
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
    // Clear localStorage between tests
    localStorage.clear();
});

// Increase default timeout for async tests if needed
jest.setTimeout(10000);
