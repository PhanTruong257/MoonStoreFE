import { createContext, useMemo, useState, type PropsWithChildren } from 'react'

interface ThemeContextValue {
  isCompact: boolean
  toggleCompact: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  isCompact: false,
  toggleCompact: () => undefined,
})

export const ThemeContextProvider = ({ children }: PropsWithChildren) => {
  const [isCompact, setIsCompact] = useState(false)

  const value = useMemo(
    () => ({
      isCompact,
      toggleCompact: () => setIsCompact((prev) => !prev),
    }),
    [isCompact],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
