import "@testing-library/jest-dom/vitest";

// Mock matchMedia for jsdom (not natively supported).
// Default: queries don't match → BetterTable renders the desktop table layout.
// Individual test files can override this to simulate mobile viewport.
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}),
});

// Mock ResizeObserver for jsdom (not natively supported).
// Used by useVirtualization to measure container height.
class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
	writable: true,
	value: ResizeObserverMock,
});
