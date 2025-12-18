import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { translations } from '../utils/translations'
import { formatDateKey, parseDateKey } from '../utils/dateUtils'

const Search = ({ entries, notes, onDateClick, onClose }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const matches = []

    // Search in dates
    Object.keys(entries).forEach(dateKey => {
      try {
        const date = parseDateKey(dateKey)
        const dateStr = date.toLocaleDateString(language === 'uk' ? 'uk-UA' : language === 'it' ? 'it-IT' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }).toLowerCase()
        
        if (dateStr.includes(query) || dateKey.includes(query)) {
          matches.push({
            type: 'date',
            dateKey,
            date,
            hours: entries[dateKey],
            note: notes[dateKey] || ''
          })
        }
      } catch (error) {
        console.error('Error parsing date:', dateKey, error)
      }
    })

    // Search in notes
    Object.keys(notes).forEach(dateKey => {
      if (notes[dateKey].toLowerCase().includes(query)) {
        try {
          const date = parseDateKey(dateKey)
          // Avoid duplicates
          if (!matches.find(m => m.dateKey === dateKey)) {
            matches.push({
              type: 'note',
              dateKey,
              date,
              hours: entries[dateKey] || 0,
              note: notes[dateKey]
            })
          }
        } catch (error) {
          console.error('Error parsing date:', dateKey, error)
        }
      }
    })

    // Sort by date (newest first)
    matches.sort((a, b) => b.date - a.date)
    setResults(matches)
  }, [searchQuery, entries, notes, language])

  const handleResultClick = (result) => {
    onDateClick(result.date)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.search}
            </h3>
            <button
              onClick={onClose}
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label={t.close}
            >
              ×
            </button>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            autoFocus
            className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base`}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {searchQuery.trim() && results.length === 0 ? (
            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.noResults}
            </p>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => (
                <button
                  key={result.dateKey}
                  onClick={() => handleResultClick(result)}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {result.date.toLocaleDateString(language === 'uk' ? 'uk-UA' : language === 'it' ? 'it-IT' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </p>
                      {result.hours > 0 && (
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                          {result.hours}h {t.hours}
                        </p>
                      )}
                      {result.note && (
                        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          📝 {result.note}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Search
