import { useApp } from '../context/AppContext'
import { translations, formatCurrency } from '../utils/translations'

const EnhancedSummary = ({ hourlyRate }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en

  return (
    <div className="space-y-3 sm:space-y-4">
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

export default EnhancedSummary
