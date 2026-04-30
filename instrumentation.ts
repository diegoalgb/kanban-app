export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js in this environment exposes a `localStorage` global but with
    // broken methods (getItem is not a function). Patch it with an in-memory
    // implementation so @dnd-kit and other browser-oriented packages don't crash.
    const ls = (global as any).localStorage;
    if (typeof ls !== 'undefined' && typeof ls.getItem !== 'function') {
      const store: Record<string, string> = {};
      (global as any).localStorage = {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { for (const k in store) delete store[k]; },
        key: (i: number) => Object.keys(store)[i] ?? null,
        get length() { return Object.keys(store).length; },
      };
    }
  }
}
