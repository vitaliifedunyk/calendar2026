import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { translations, formatCurrency } from '../utils/translations'
import { parseDateKey, formatDateKey } from '../utils/dateUtils'

const EnhancedSummary = ({ entries, hourlyRate, currentMonth, goals = { monthly: {}, yearly: { hours: 0, earnings: 0 } }, onGoalsChange }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const monthNames = t.monthNames
  const [editingGoal, setEditingGoal] = useState(null) // 'monthly' or 'yearly'

  const calculateMonthTotal = (month) => {
    // Ensure we're working with the first day of the month to avoid timezone issues
    const monthDate = new Date(month.getFullYear(), month.getMonth(), 1)
    const year = monthDate.getFullYear()
    const monthIndex = monthDate.getMonth()
    let totalHours = 0
    let maxHours = 0
    let bestDate = null

    Object.keys(entries).forEach(dateKey => {
      try {
        const entryDate = parseDateKey(dateKey)
        const entryYear = entryDate.getFullYear()
        const entryMonth = entryDate.getMonth()
        
        // Strict comparison to ensure we only count entries from the exact month
        if (entryYear === year && entryMonth === monthIndex) {
          const hours = entries[dateKey] || 0
          if (hours > 0) {
            totalHours += hours
            if (hours > maxHours) {
              maxHours = hours
              bestDate = dateKey
            }
          }
        }
      } catch (error) {
        console.error('Error parsing date key:', dateKey, error)
      }
    })

    const daysWithEntries = Object.keys(entries).filter(dateKey => {
      try {
        const entryDate = parseDateKey(dateKey)
        return entryDate.getFullYear() === year && entryDate.getMonth() === monthIndex
      } catch {
        return false
      }
    }).length

    return {
      totalHours,
      averageHours: daysWithEntries > 0 ? totalHours / daysWithEntries : 0,
      bestDay: bestDate ? { date: bestDate, hours: maxHours } : null,
      daysWithEntries,
    }
  }

  const calculateYearStats = () => {
    let totalHours = 0
    let maxHours = 0
    let bestDate = null
    const daysWithEntries = Object.keys(entries).length

    Object.keys(entries).forEach(dateKey => {
      const hours = entries[dateKey] || 0
      totalHours += hours
      if (hours > maxHours) {
        maxHours = hours
        bestDate = dateKey
      }
    })

    const today = new Date()
    const yearStart = new Date(2026, 0, 1)
    const yearEnd = new Date(2026, 11, 31)
    const daysPassed = Math.floor((today - yearStart) / (1000 * 60 * 60 * 24)) + 1
    const totalDaysInYear = 365
    const remainingDays = Math.max(0, totalDaysInYear - daysPassed)

    // Calculate average hours per day worked
    const avgHoursPerWorkDay = daysWithEntries > 0 ? totalHours / daysWithEntries : 0
    
    // Projected earnings based on current average
    const projectedEarnings = avgHoursPerWorkDay * remainingDays * hourlyRate

    return {
      totalHours,
      averageHours: daysWithEntries > 0 ? totalHours / daysWithEntries : 0,
      bestDay: bestDate ? { date: bestDate, hours: maxHours } : null,
      daysWithEntries,
      remainingDays,
      projectedEarnings,
    }
  }

  const monthStats = calculateMonthTotal(currentMonth)
  const yearStats = calculateYearStats()
  const monthEarnings = monthStats.totalHours * hourlyRate
  const yearEarnings = yearStats.totalHours * hourlyRate

  const monthKey = formatDateKey(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1))
  const monthlyGoal = goals.monthly?.[monthKey] || { hours: 0, earnings: 0 }
  const yearlyGoal = goals.yearly || { hours: 0, earnings: 0 }

  const monthlyProgressHours = monthlyGoal.hours > 0 ? (monthStats.totalHours / monthlyGoal.hours) * 100 : 0
  const monthlyProgressEarnings = monthlyGoal.earnings > 0 ? (monthEarnings / monthlyGoal.earnings) * 100 : 0
  const yearlyProgressHours = yearlyGoal.hours > 0 ? (yearStats.totalHours / yearlyGoal.hours) * 100 : 0
  const yearlyProgressEarnings = yearlyGoal.earnings > 0 ? (yearEarnings / yearlyGoal.earnings) * 100 : 0

  const handleSetGoal = (type, hours, earnings) => {
    const newGoals = { ...goals }
    if (type === 'monthly') {
      if (!newGoals.monthly) newGoals.monthly = {}
      newGoals.monthly[monthKey] = { hours: parseFloat(hours) || 0, earnings: parseFloat(earnings) || 0 }
    } else {
      newGoals.yearly = { hours: parseFloat(hours) || 0, earnings: parseFloat(earnings) || 0 }
    }
    onGoalsChange(newGoals)
    setEditingGoal(null)
  }

  const formatBestDay = (bestDay) => {
    if (!bestDay) return '-'
    try {
      const date = parseDateKey(bestDay.date)
      return `${date.getDate()} ${monthNames[date.getMonth()]} (${bestDay.hours}h)`
    } catch {
      return `${bestDay.hours}h`
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Monthly Enhanced Stats */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {monthNames[currentMonth.getMonth()]} 2026 {t.monthSummary}
          </h3>
          {editingGoal !== 'monthly' && (
            <button
              onClick={() => setEditingGoal('monthly')}
              className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {monthlyGoal.hours > 0 || monthlyGoal.earnings > 0 ? '✏️' : '➕'} {t.setGoal}
            </button>
          )}
        </div>
        
        {editingGoal === 'monthly' ? (
          <GoalEditor
            type="monthly"
            currentGoal={monthlyGoal}
            onSave={handleSetGoal}
            onCancel={() => setEditingGoal(null)}
            theme={theme}
            t={t}
          />
        ) : (
          <>
            {monthlyGoal.hours > 0 && (
              <div className="mb-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.goalHours}: {monthlyGoal.hours}h</span>
                  <span>{Math.min(100, monthlyProgressHours).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, monthlyProgressHours)}%` }}
                  />
                </div>
              </div>
            )}
            {monthlyGoal.earnings > 0 && (
              <div className="mb-3 p-2 rounded bg-green-50 dark:bg-green-900/20">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.goalEarnings}: {formatCurrency(monthlyGoal.earnings, language)}</span>
                  <span>{Math.min(100, monthlyProgressEarnings).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, monthlyProgressEarnings)}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.totalHours}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {monthStats.totalHours.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.earnings}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {formatCurrency(monthEarnings, language)}
            </span>
          </div>
          {monthStats.daysWithEntries > 0 && (
            <>
              <div className={`flex justify-between items-center pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.averageHoursPerDay}:</span>
                <span className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {monthStats.averageHours.toFixed(1)}
                </span>
              </div>
              {monthStats.bestDay && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.bestDay}:</span>
                  <span className={`text-sm sm:text-base font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {formatBestDay(monthStats.bestDay)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Yearly Enhanced Stats */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6`}>
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.yearSummary}
          </h3>
          {editingGoal !== 'yearly' && (
            <button
              onClick={() => setEditingGoal('yearly')}
              className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {yearlyGoal.hours > 0 || yearlyGoal.earnings > 0 ? '✏️' : '➕'} {t.setGoal}
            </button>
          )}
        </div>
        
        {editingGoal === 'yearly' ? (
          <GoalEditor
            type="yearly"
            currentGoal={yearlyGoal}
            onSave={handleSetGoal}
            onCancel={() => setEditingGoal(null)}
            theme={theme}
            t={t}
          />
        ) : (
          <>
            {yearlyGoal.hours > 0 && (
              <div className="mb-3 p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.goalHours}: {yearlyGoal.hours}h</span>
                  <span>{Math.min(100, yearlyProgressHours).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, yearlyProgressHours)}%` }}
                  />
                </div>
              </div>
            )}
            {yearlyGoal.earnings > 0 && (
              <div className="mb-3 p-2 rounded bg-green-50 dark:bg-green-900/20">
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.goalEarnings}: {formatCurrency(yearlyGoal.earnings, language)}</span>
                  <span>{Math.min(100, yearlyProgressEarnings).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, yearlyProgressEarnings)}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.totalHours}:</span>
            <span className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {yearStats.totalHours.toFixed(1)}
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
              {yearStats.daysWithEntries}
            </span>
          </div>
          {yearStats.daysWithEntries > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.averageHoursPerDay}:</span>
                <span className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {yearStats.averageHours.toFixed(1)}
                </span>
              </div>
              {yearStats.bestDay && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.bestDay}:</span>
                  <span className={`text-sm sm:text-base font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {formatBestDay(yearStats.bestDay)}
                  </span>
                </div>
              )}
              {yearStats.remainingDays > 0 && hourlyRate > 0 && (
                <div className={`flex justify-between items-center pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t.projectedEarnings}:</span>
                  <span className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    {formatCurrency(yearStats.projectedEarnings, language)}
                  </span>
                </div>
              )}
            </>
          )}
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

const GoalEditor = ({ type, currentGoal, onSave, onCancel, theme, t }) => {
  const [hours, setHours] = useState(currentGoal.hours.toString())
  const [earnings, setEarnings] = useState(currentGoal.earnings.toString())

  const handleSave = () => {
    onSave(type, hours, earnings)
  }

  return (
    <div className="space-y-3 mb-3 p-3 rounded border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20">
      <div>
        <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          {t.goalHours}:
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className={`w-full px-2 py-1 text-sm border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded`}
          placeholder="0"
        />
      </div>
      <div>
        <label className={`block text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          {t.goalEarnings} (EUR):
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={earnings}
          onChange={(e) => setEarnings(e.target.value)}
          className={`w-full px-2 py-1 text-sm border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded`}
          placeholder="0"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t.save}
        </button>
        <button
          onClick={onCancel}
          className={`px-2 py-1 text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} rounded`}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  )
}

export default EnhancedSummary

