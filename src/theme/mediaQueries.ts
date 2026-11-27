const createMediaStore = (query: string, serverValue: boolean) => {
    const subscribe = (callback: () => void) => {
        const list = window.matchMedia(query);
        list.addEventListener("change", callback);
        return () => list.removeEventListener("change", callback);
    };
    const getSnapshot = () => window.matchMedia(query).matches;
    const getServerSnapshot = () => serverValue;
    return { subscribe, getSnapshot, getServerSnapshot };
};

export const darkSchemeStore = createMediaStore("(prefers-color-scheme: dark)", false);

export const reducedMotionStore = createMediaStore("(prefers-reduced-motion: reduce)", false);
