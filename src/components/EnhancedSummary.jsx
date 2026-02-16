import { useApp } from '../context/AppContext'
import { translations, formatCurrency } from '../utils/translations'
import { parseDateKey } from '../utils/dateUtils'

const EnhancedSummary = ({ entries = {}, hourlyRate, currentMonth }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const monthNames = t.monthNames

  const calculateCurrentMonthHours = () => {
    if (!currentMonth) return 0

    const year = currentMonth.getFullYear()
    const monthIndex = currentMonth.getMonth()
    let totalHours = 0

    Object.keys(entries).forEach((dateKey) => {
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

  const currentMonthHours = calculateCurrentMonthHours()
  const currentMonthEarnings = currentMonthHours * hourlyRate

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm p-4 sm:p-6 border`}>
      <h3 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
        {monthNames[currentMonth.getMonth()]} 2026 {t.currentMonthEarnings}
      </h3>
      <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
        {formatCurrency(currentMonthEarnings, language)}
      </p>
      <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {currentMonthHours.toFixed(1)}h × {formatCurrency(hourlyRate, language)}
      </p>
      {hourlyRate === 0 && (
        <p className={`text-xs sm:text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.setRateMessage}
        </p>
      )}
      </div>
  )
}

export default EnhancedSummary
