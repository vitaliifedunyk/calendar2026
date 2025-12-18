import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { translations } from '../utils/translations'

const DayEntry = ({ date, hours: initialHours, note: initialNote = '', onSave, onDelete, onClose }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  
  const [hours, setHours] = useState(initialHours || 0)
  const [note, setNote] = useState(initialNote || '')

  useEffect(() => {
    // Reset to initial hours and note when date changes or modal opens
    setHours(initialHours || 0)
    setNote(initialNote || '')
  }, [initialHours, initialNote, date])

  const hourOptions = []
  for (let i = 0; i <= 24; i += 0.5) {
    hourOptions.push(i)
  }

  const formatDate = (date) => {
    const locales = {
      en: 'en-US',
      uk: 'uk-UA',
      it: 'it-IT',
    }
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(locales[language] || 'en-US', options)
  }

  const handleSave = () => {
    const hoursNum = parseFloat(hours)
    // Only save if hours is valid and greater than 0
    if (!isNaN(hoursNum) && hoursNum >= 0) {
      onSave(date, hoursNum, note)
    } else {
      // If invalid, just close without saving
      onClose()
    }
  }

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) {
      onDelete(date)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Close without saving - discard any changes
      onClose()
    }
  }

  const handleCancel = () => {
    // Reset to initial hours and note, then close
    setHours(initialHours || 0)
    setNote(initialNote || '')
    onClose()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setHours(initialHours || 0)
        setNote(initialNote || '')
        onClose()
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const hoursNum = parseFloat(hours)
        if (!isNaN(hoursNum) && hoursNum >= 0) {
          onSave(date, hoursNum, note)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hours, note, initialHours, initialNote, onClose, onSave, date])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {formatDate(date)}
            </h3>
            <button
              onClick={onClose}
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label={t.close}
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <label
              htmlFor="hours-select"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}
            >
              {t.workHours}
            </label>
            
            {/* Quick Add Buttons */}
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setHours(5)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-sm ${
                  hours === 5
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.add5h}
              </button>
              <button
                onClick={() => setHours(9)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-sm ${
                  hours === 9
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.add9h}
              </button>
              <button
                onClick={() => setHours(10)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-sm ${
                  hours === 10
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.add10h}
              </button>
            </div>
            
            <select
              id="hours-select"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg min-h-[44px]`}
            >
              {hourOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 0 
                    ? `0 ${t.hours}` 
                    : `${option} ${option === 1 ? t.hour : t.hours}`
                  }
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="note-input"
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}
            >
              {t.notes}
            </label>
            <textarea
              id="note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.addNote}
              rows={3}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[44px] text-sm sm:text-base"
            >
              {t.save}
            </button>
            {initialHours > 0 && (
              <button
                onClick={handleDelete}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium min-h-[44px] text-sm sm:text-base"
              >
                {t.delete}
              </button>
            )}
            <button
              onClick={handleCancel}
              className={`px-4 py-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors font-medium min-h-[44px] text-sm sm:text-base`}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DayEntry
