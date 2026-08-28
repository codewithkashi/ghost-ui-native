import * as React from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type GhostTheme = 'light' | 'dark' | 'system';
export type GhostResolvedTheme = 'light' | 'dark';

type GhostThemeContextValue = {
  theme: GhostTheme;
  resolvedTheme: GhostResolvedTheme;
  setTheme: (theme: GhostTheme) => void;
  toggleTheme: () => void;
};

const GhostThemeContext = React.createContext<GhostThemeContextValue | null>(
  null
);

export function GhostThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode;
  defaultTheme?: GhostTheme;
}) {
  const system = useSystemColorScheme();
  const [theme, setTheme] = React.useState<GhostTheme>(defaultTheme);

  const resolvedTheme: GhostResolvedTheme =
    theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : theme;

  const value = React.useMemo<GhostThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () =>
        setTheme(current => {
          const resolved =
            current === 'system'
              ? system === 'dark'
                ? 'dark'
                : 'light'
              : current;
          return resolved === 'dark' ? 'light' : 'dark';
        }),
    }),
    [theme, resolvedTheme, system]
  );

  return (
    <GhostThemeContext.Provider value={value}>
      {children}
    </GhostThemeContext.Provider>
  );
}

export function useGhostTheme() {
  const ctx = React.useContext(GhostThemeContext);
  if (!ctx) {
    throw new Error('useGhostTheme must be used within GhostUIProvider');
  }
  return ctx;
}
