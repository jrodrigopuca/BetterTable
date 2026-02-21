import { useState, useEffect } from "react";

/**
 * Hook that tracks a CSS media query match state.
 * SSR-safe: returns `false` during server rendering and hydrates on mount.
 *
 * @param query - CSS media query string, e.g. `'(max-width: 640px)'`
 * @returns `true` when the viewport matches the query
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mql = window.matchMedia(query);
		// Sync in case initial state diverged (SSR hydration)
		setMatches(mql.matches);

		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, [query]);

	return matches;
}
