import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Theme = 'paper' | 'ink'

const STORAGE_KEY = 'ihub-theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'ink' ? 'ink' : 'paper'
  } catch {
    return 'paper'
  }
}

/** Applies the active theme to <body data-theme="ink">, per
 * migration-plan/DESIGN_SYSTEM.md §1.1 — deliberately `document.body`, not a
 * nested element, since Radix portals (Dialog/Popover/DropdownMenu/Select)
 * attach directly under <body> and need to inherit the override. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    if (theme === 'ink') document.body.setAttribute('data-theme', 'ink')
    else document.body.removeAttribute('data-theme')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* private-browsing / storage-blocked — theme still applies for this session */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'paper' ? 'ink' : 'paper'))
  }, [])

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
