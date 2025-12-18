import DayEntry from './DayEntry'
import { useApp } from '../context/AppContext'
import { translations } from '../utils/translations'
import { formatDateKey, isSameDate } from '../utils/dateUtils'

const Calendar = ({ month, entries, notes = {}, onDateClick, selectedDate, onSaveEntry, onDeleteEntry, viewMode = 'month', onViewModeChange }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const dayNames = t.dayNames
  const monthNames = t.monthNames

  const year = month.getFullYear()
  const monthIndex = month.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, monthIndex, 1)
  const lastDay = new Date(year, monthIndex + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Generate calendar days
  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, monthIndex, day))
  }

  const getHoursForDate = (date) => {
    if (!date) return 0
    const dateKey = formatDateKey(date)
    return entries[dateKey] || 0
  }

  const getNoteForDate = (date) => {
    if (!date) return ''
    const dateKey = formatDateKey(date)
    return notes[dateKey] || ''
  }

  const isWeekend = (date) => {
    if (!date) return false
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const handleDayClick = (date) => {
    if (date) {
      onDateClick(date)
    }
  }

  const today = new Date()

  // Get week view days - show the week containing the first day of the month
  const getWeekDays = () => {
    const firstDayOfMonth = new Date(year, monthIndex, 1)
    const weekStart = new Date(firstDayOfMonth)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start from Sunday
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(day.getDate() + i)
      weekDays.push(day)
    }
    return weekDays
  }

  const weekDays = viewMode === 'week' ? getWeekDays() : []

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-2 sm:p-4 lg:p-6`}>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {viewMode === 'week' 
            ? `${monthNames[monthIndex]} ${year} - Week View`
            : `${monthNames[monthIndex]} ${year}`
          }
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('month')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors min-h-[32px] ${
              viewMode === 'month'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.monthView}
          </button>
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors min-h-[32px] ${
              viewMode === 'week'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.weekView}
          </button>
        </div>
      </div>

      {viewMode === 'week' ? (
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, idx) => (
            <div
              key={day}
              className={`text-center font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm py-2`}
            >
              {day}
            </div>
          ))}
          {weekDays.map((date) => {
            const hours = getHoursForDate(date)
            const note = getNoteForDate(date)
            const isToday = isSameDate(date, today)
            const isSelected = selectedDate && isSameDate(date, selectedDate)
            const weekend = isWeekend(date)

            return (
              <button
                key={formatDateKey(date)}
                onClick={() => handleDayClick(date)}
                className={`
                  rounded-lg border-2 transition-all p-3 min-h-[100px]
                  flex flex-col items-center justify-center
                  ${isSelected 
                    ? theme === 'dark'
                      ? 'border-blue-500 bg-blue-900'
                      : 'border-blue-600 bg-blue-50'
                    : isToday
                    ? theme === 'dark'
                      ? 'border-blue-400 bg-blue-900'
                      : 'border-blue-400 bg-blue-50'
                    : weekend
                    ? theme === 'dark'
                      ? 'border-gray-600 bg-gray-700/50'
                      : 'border-gray-300 bg-gray-50'
                    : hours > 0
                    ? theme === 'dark'
                      ? 'border-green-600 bg-green-900 hover:bg-green-800'
                      : 'border-green-500 bg-green-50 hover:bg-green-100'
                    : theme === 'dark'
                    ? 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <span className={`text-sm sm:text-base font-medium ${
                  isToday 
                    ? theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                    : theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </span>
                {hours > 0 && (
                  <span className={`text-xs font-semibold mt-1 ${
                    theme === 'dark' ? 'text-green-300' : 'text-green-700'
                  }`}>
                    {hours}h
                  </span>
                )}
                {note && (
                  <span className={`text-[10px] mt-1 truncate w-full text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} title={note}>
                    📝
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-2">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className={`text-center font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-[10px] xs:text-xs sm:text-sm py-1 sm:py-2`}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
          const hours = getHoursForDate(date)
          const note = getNoteForDate(date)
          const isToday = date && isSameDate(date, today)
          const isSelected = date && selectedDate && isSameDate(date, selectedDate)
          const weekend = date && isWeekend(date)

          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          return (
            <button
              key={`${year}-${monthIndex}-${date.getDate()}`}
              onClick={() => handleDayClick(date)}
              className={`
                aspect-square rounded-md sm:rounded-lg border-2 transition-all
                min-h-[36px] xs:min-h-[40px] sm:min-h-[50px] md:min-h-[60px]
                flex flex-col items-center justify-center p-0.5 sm:p-1
                ${isSelected 
                  ? theme === 'dark'
                    ? 'border-blue-500 bg-blue-900'
                    : 'border-blue-600 bg-blue-50'
                  : isToday
                  ? theme === 'dark'
                    ? 'border-blue-400 bg-blue-900'
                    : 'border-blue-400 bg-blue-50'
                  : weekend
                  ? theme === 'dark'
                    ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-600/50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  : hours > 0
                  ? theme === 'dark'
                    ? 'border-green-600 bg-green-900 hover:bg-green-800'
                    : 'border-green-500 bg-green-50 hover:bg-green-100'
                  : theme === 'dark'
                  ? 'border-gray-700 bg-gray-700 hover:border-gray-600 hover:bg-gray-600'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              aria-label={`${date.getDate()} ${monthNames[monthIndex]}`}
            >
              <span className={`text-[11px] xs:text-xs sm:text-sm md:text-base font-medium ${
                isToday 
                  ? theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                  : theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {date.getDate()}
              </span>
              {hours > 0 && (
                <span className={`text-[9px] xs:text-[10px] sm:text-xs font-semibold mt-0.5 ${
                  theme === 'dark' ? 'text-green-300' : 'text-green-700'
                }`}>
                  {hours}h
                </span>
              )}
              {note && (
                <span className={`text-[8px] xs:text-[9px] mt-0.5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} title={note}>
                  📝
                </span>
              )}
            </button>
          )
        })}
        </div>
      )}

      {selectedDate && (
        <DayEntry
          date={selectedDate}
          hours={getHoursForDate(selectedDate)}
          note={getNoteForDate(selectedDate)}
          onSave={onSaveEntry}
          onDelete={onDeleteEntry}
          onClose={() => onDateClick(null)}
        />
      )}
    </div>
  )
}

export default Calendar
