import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EnhancedSummary from './components/EnhancedSummary'
import Settings from './components/Settings'
import MonthNavigation from './components/MonthNavigation'
import DataManagement from './components/DataManagement'
import Search from './components/Search'
import { useApp } from './context/AppContext'
import { translations } from './utils/translations'
import { formatDateKey, parseDateKey } from './utils/dateUtils'

const STORAGE_KEYS = {
  WORK_ENTRIES: 'workCalendar2026_entries',
  HOURLY_RATE: 'workCalendar2026_hourlyRate',
  NOTES: 'workCalendar2026_notes',
  GOALS: 'workCalendar2026_goals'
}

function App() {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1))
  const [workEntries, setWorkEntries] = useState({})
  const [hourlyRate, setHourlyRate] = useState(0)
  const [notes, setNotes] = useState({})
  const [goals, setGoals] = useState({ monthly: {}, yearly: { hours: 0, earnings: 0 } })
  const [showSettings, setShowSettings] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('month') // 'month' or 'week'

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem(STORAGE_KEYS.WORK_ENTRIES)
      const savedRate = localStorage.getItem(STORAGE_KEYS.HOURLY_RATE)
      const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES)
      const savedGoals = localStorage.getItem(STORAGE_KEYS.GOALS)

      if (savedEntries) {
        const parsed = JSON.parse(savedEntries)
        // Validate and clean up date keys
        const cleaned = {}
        Object.keys(parsed).forEach(key => {
          // Ensure key is in YYYY-MM-DD format
          if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
            cleaned[key] = parsed[key]
          }
        })
        setWorkEntries(cleaned)
      }

      if (savedRate) {
        setHourlyRate(parseFloat(savedRate) || 0)
      }

      if (savedNotes) {
        const parsed = JSON.parse(savedNotes)
        const cleaned = {}
        Object.keys(parsed).forEach(key => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(key) && typeof parsed[key] === 'string') {
            cleaned[key] = parsed[key]
          }
        })
        setNotes(cleaned)
      }

      if (savedGoals) {
        const parsed = JSON.parse(savedGoals)
        setGoals(parsed)
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      alert(t.errorLoadingData)
    } finally {
      setIsLoading(false)
    }
  }, [t])

  // Auto-save work entries to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.WORK_ENTRIES, JSON.stringify(workEntries))
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          alert(t.storageQuotaExceeded)
        } else {
          console.error('Error saving work entries:', error)
        }
      }
    }
  }, [workEntries, isLoading, t])

  // Auto-save hourly rate to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.HOURLY_RATE, hourlyRate.toString())
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          alert(t.storageQuotaExceeded)
        } else {
          console.error('Error saving hourly rate:', error)
        }
      }
    }
  }, [hourlyRate, isLoading, t])

  // Auto-save notes to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          alert(t.storageQuotaExceeded)
        } else {
          console.error('Error saving notes:', error)
        }
      }
    }
  }, [notes, isLoading, t])

  // Auto-save goals to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          alert(t.storageQuotaExceeded)
        } else {
          console.error('Error saving goals:', error)
        }
      }
    }
  }, [goals, isLoading, t])

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handleSaveEntry = (date, hours, note) => {
    const dateKey = formatDateKey(date)
    const newEntries = { ...workEntries }
    
    // Only save if hours is a valid positive number
    const hoursNum = parseFloat(hours)
    if (!isNaN(hoursNum) && hoursNum > 0) {
      newEntries[dateKey] = hoursNum
    } else {
      // Remove entry if hours is 0 or invalid
      delete newEntries[dateKey]
    }
    
    setWorkEntries(newEntries)
    
    // Save note if provided
    if (note !== undefined) {
      const newNotes = { ...notes }
      if (note && note.trim()) {
        newNotes[dateKey] = note.trim()
      } else {
        delete newNotes[dateKey]
      }
      setNotes(newNotes)
    }
    
    setSelectedDate(null)
  }

  const handleDeleteEntry = (date) => {
    const dateKey = formatDateKey(date)
    const newEntries = { ...workEntries }
    delete newEntries[dateKey]
    setWorkEntries(newEntries)
    setSelectedDate(null)
  }

  const handleMonthChange = (newMonth) => {
    setCurrentMonth(newMonth)
  }

  const handleImport = (importedEntries, importedRate, importedNotes, importedGoals) => {
    setWorkEntries(importedEntries)
    if (importedRate > 0) {
      setHourlyRate(importedRate)
    }
    if (importedNotes) {
      setNotes(importedNotes)
    }
    if (importedGoals) {
      setGoals(importedGoals)
    }
  }

  const getNoteForDate = (date) => {
    const dateKey = formatDateKey(date)
    return notes[dateKey] || ''
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return
      }

      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }

      // Ctrl/Cmd + , for settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault()
        setShowSettings(!showSettings)
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        if (showSearch) setShowSearch(false)
        if (showSettings) setShowSettings(false)
        if (selectedDate) setSelectedDate(null)
      }

      // Arrow keys for navigation (only when no modal is open)
      if (!showSettings && !showSearch && !selectedDate) {
        if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          const prevMonth = new Date(currentMonth)
          prevMonth.setMonth(prevMonth.getMonth() - 1)
          setCurrentMonth(prevMonth)
        } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          const nextMonth = new Date(currentMonth)
          nextMonth.setMonth(nextMonth.getMonth() + 1)
          setCurrentMonth(nextMonth)
        } else if (e.key === 'Home' || (e.key === 't' && (e.ctrlKey || e.metaKey))) {
          e.preventDefault()
          setCurrentMonth(new Date(2026, new Date().getMonth(), 1))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSettings, showSearch, selectedDate, currentMonth])

  const getEntriesForMonth = (month) => {
    const monthEntries = {}
    // Ensure we're working with the first day of the month to avoid timezone issues
    const monthDate = new Date(month.getFullYear(), month.getMonth(), 1)
    const year = monthDate.getFullYear()
    const monthIndex = monthDate.getMonth()
    
    Object.keys(workEntries).forEach(dateKey => {
      try {
        const entryDate = parseDateKey(dateKey)
        // Strict comparison to ensure we only include entries from the exact month
        if (entryDate.getFullYear() === year && entryDate.getMonth() === monthIndex) {
          monthEntries[dateKey] = workEntries[dateKey]
        }
      } catch (error) {
        console.error('Error parsing date key:', dateKey, error)
      }
    })
    
    return monthEntries
  }

  const getAllEntries = () => {
    return workEntries
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.appTitle}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors min-h-[44px] text-sm sm:text-base"
                aria-label={t.search}
                title={`${t.search} (Ctrl+K)`}
              >
                <span className="hidden sm:inline">🔍 </span>
                <span className="sm:hidden">🔍</span>
                <span className="hidden sm:inline"> {t.search}</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] text-sm sm:text-base"
                aria-label={t.settings}
                title={`${t.settings} (Ctrl+,)`}
              >
                <span className="hidden sm:inline">⚙️ </span>
                <span className="sm:hidden">⚙️</span>
                <span className="hidden sm:inline"> {t.settings}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {showSettings && (
          <div className="mb-4 sm:mb-6">
            <Settings
              hourlyRate={hourlyRate}
              onRateChange={setHourlyRate}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}

        <div className="mb-4 sm:mb-6">
          <MonthNavigation
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Calendar
              month={currentMonth}
              entries={getEntriesForMonth(currentMonth)}
              notes={notes}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
              onSaveEntry={handleSaveEntry}
              onDeleteEntry={handleDeleteEntry}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <EnhancedSummary
              entries={getAllEntries()}
              hourlyRate={hourlyRate}
              currentMonth={currentMonth}
              goals={goals}
              onGoalsChange={setGoals}
            />
            <DataManagement
              workEntries={getAllEntries()}
              hourlyRate={hourlyRate}
              notes={notes}
              goals={goals}
              onImport={handleImport}
            />
          </div>
        </div>
      </main>

      {showSearch && (
        <Search
          entries={getAllEntries()}
          notes={notes}
          onDateClick={handleDateClick}
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  )
}

export default App
