import { useApp } from '../context/AppContext'
import { translations } from '../utils/translations'

const MonthNavigation = ({ currentMonth, onMonthChange }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const monthNames = t.monthNames

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() - 1)
    onMonthChange(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + 1)
    onMonthChange(newMonth)
  }

  const handleMonthSelect = (e) => {
    const selectedMonthIndex = parseInt(e.target.value)
    const newMonth = new Date(2026, selectedMonthIndex, 1)
    onMonthChange(newMonth)
  }

  const isFirstMonth = currentMonth.getMonth() === 0
  const isLastMonth = currentMonth.getMonth() === 11

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-3 sm:p-4`}>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handlePreviousMonth}
          disabled={isFirstMonth}
          className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-xs sm:text-base ${
            isFirstMonth
              ? theme === 'dark'
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label={t.prev}
        >
          <span className="hidden sm:inline">← </span>
          {t.prev}
        </button>

        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
          <select
            value={currentMonth.getMonth()}
            onChange={handleMonthSelect}
            className={`px-2 sm:px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-lg font-semibold min-h-[44px] w-full max-w-[200px] sm:max-w-none`}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month} 2026
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          disabled={isLastMonth}
          className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-xs sm:text-base ${
            isLastMonth
              ? theme === 'dark'
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label={t.next}
        >
          {t.next}
          <span className="hidden sm:inline"> →</span>
        </button>
      </div>
    </div>
  )
}

export default MonthNavigation
