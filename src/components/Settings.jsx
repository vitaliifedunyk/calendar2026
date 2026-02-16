import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { translations, formatCurrency } from '../utils/translations'

const Settings = ({ hourlyRate, onRateChange, onClose }) => {
  const { theme, setTheme, language, setLanguage } = useApp()
  const t = translations[language] || translations.en
  
  const [rate, setRate] = useState(hourlyRate.toString())

  useEffect(() => {
    setRate(hourlyRate.toString())
  }, [hourlyRate])

  const handleSave = () => {
    const parsedRate = parseFloat(rate) || 0
    if (parsedRate < 0) {
      alert(t.rateCannotBeNegative)
      return
    }
    onRateChange(parsedRate)
    onClose()
  }

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6 border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t.settings}
        </h2>
        <button
          onClick={onClose}
          className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} text-2xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center`}
          aria-label={t.close}
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Theme Selection */}
        <div>
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t.theme}
          </label>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors font-medium min-h-[44px] text-sm sm:text-base ${
                theme === 'light'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t.lightTheme}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors font-medium min-h-[44px] text-sm sm:text-base ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t.darkTheme}
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t.language}
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg min-h-[44px]`}
          >
            <option value="en">English</option>
            <option value="uk">Українська</option>
            <option value="it">Italiano</option>
          </select>
        </div>

        {/* Hourly Rate */}
        <div>
          <label
            htmlFor="hourly-rate"
            className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}
          >
            {t.hourlyRate}
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {t.currencySymbol}
            </span>
            <input
              id="hourly-rate"
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.00"
              className={`w-full pl-8 pr-3 sm:pr-4 py-2 sm:py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg min-h-[44px]`}
            />
          </div>
          {rate && !isNaN(parseFloat(rate)) && parseFloat(rate) > 0 && (
            <p className={`mt-2 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.currentRate}: {formatCurrency(parseFloat(rate), language)} {t.perHour}
            </p>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[44px] text-sm sm:text-base"
          >
            {t.saveRate}
          </button>
          <button
            onClick={onClose}
            className={`px-3 sm:px-4 py-2 sm:py-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded-lg transition-colors font-medium min-h-[44px] text-sm sm:text-base`}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
