declare global {
  interface Window {
    versions: Record<'node' | 'chrome' | 'electron', string>;
    app: {
      ready: (from: string) => void;
      openExternal: (url: string) => void;
    };
  }
}

// a export is needed so the extended Window types are available globally
export {};
