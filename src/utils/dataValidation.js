const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MONTH_KEY_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]'

const sanitizeNonNegativeNumber = (value) => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0
}

const sanitizeGoalMetrics = (value) => {
  if (!isPlainObject(value)) {
    return { hours: 0, earnings: 0 }
  }

  return {
    hours: sanitizeNonNegativeNumber(value.hours),
    earnings: sanitizeNonNegativeNumber(value.earnings)
  }
}

export const createDefaultGoals = () => ({
  monthly: {},
  yearly: { hours: 0, earnings: 0 }
})

export const sanitizeEntries = (value) => {
  if (!isPlainObject(value)) {
    return {}
  }

  const cleaned = {}

  Object.entries(value).forEach(([key, entryValue]) => {
    if (DATE_KEY_REGEX.test(key) && typeof entryValue === 'number' && Number.isFinite(entryValue) && entryValue > 0) {
      cleaned[key] = entryValue
    }
  })

  return cleaned
}

export const sanitizeNotes = (value) => {
  if (!isPlainObject(value)) {
    return {}
  }

  const cleaned = {}

  Object.entries(value).forEach(([key, noteValue]) => {
    if (DATE_KEY_REGEX.test(key) && typeof noteValue === 'string') {
      cleaned[key] = noteValue
    }
  })

  return cleaned
}

export const sanitizeHourlyRate = (value) => {
  const parsedRate =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
      ? Number(value)
      : Number.NaN

  return Number.isFinite(parsedRate) && parsedRate >= 0 ? parsedRate : 0
}

export const sanitizeGoals = (value) => {
  if (!isPlainObject(value)) {
    return createDefaultGoals()
  }

  const cleanedMonthly = {}

  if (isPlainObject(value.monthly)) {
    Object.entries(value.monthly).forEach(([key, monthlyGoal]) => {
      if (MONTH_KEY_REGEX.test(key) && isPlainObject(monthlyGoal)) {
        cleanedMonthly[key] = sanitizeGoalMetrics(monthlyGoal)
      }
    })
  }

  return {
    monthly: cleanedMonthly,
    yearly: sanitizeGoalMetrics(value.yearly)
  }
}
