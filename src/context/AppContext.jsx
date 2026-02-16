import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('workCalendar2026_theme')
      return saved || 'light'
    } catch {
      return 'light'
    }
  })

  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('workCalendar2026_language')
      return saved || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('workCalendar2026_theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('workCalendar2026_language', language)
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }, [language])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  )
}

