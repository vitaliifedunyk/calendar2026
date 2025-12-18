import { useApp } from '../context/AppContext'
import { translations, formatCurrency } from '../utils/translations'
import { parseDateKey } from '../utils/dateUtils'

const Summary = ({ entries, hourlyRate, currentMonth }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const monthNames = t.monthNames

  const calculateMonthTotal = (month) => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    let totalHours = 0

    Object.keys(entries).forEach(dateKey => {
      try {
        const entryDate = parseDateKey(dateKey)
        if (entryDate.getFullYear() === year && entryDate.getMonth() === monthIndex) {
          totalHours += entries[dateKey] || 0
        }
      } catch (error) {
        console.error('Error parsing date key:', dateKey, error)
      }
    })

    return totalHours
  }

  const calculateYearTotal = () => {
    let totalHours = 0
    Object.values(entries).forEach(hours => {
      totalHours += hours || 0
    })
    return totalHours
  }

  const monthHours = calculateMonthTotal(currentMonth)
  const monthEarnings = monthHours * hourlyRate
  const yearHours = calculateYearTotal()
  const yearEarnings = yearHours * hourlyRate

  const daysWithEntries = Object.keys(entries).length

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Monthly Summary */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6`}>
        <h3 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>
          {monthNames[currentMonth.getMonth()]} 2026 {t.monthSummary}
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.totalHours}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {monthHours.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.earnings}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {formatCurrency(monthEarnings, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Yearly Summary */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6`}>
        <h3 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4`}>
          {t.yearSummary}
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.totalHours}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {yearHours.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.earnings}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {formatCurrency(yearEarnings, language)}
            </span>
          </div>
          <div className={`flex justify-between items-center pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.daysWorked}:</span>
            <span className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {daysWithEntries}
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Rate Display */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} rounded-lg shadow-sm p-4 sm:p-6 border`}>
        <h3 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
          {t.currentRateTitle}
        </h3>
        <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
          {formatCurrency(hourlyRate, language)}/hour
        </p>
        {hourlyRate === 0 && (
          <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.setRateMessage}
          </p>
        )}
      </div>
    </div>
  )
}

export default Summary
