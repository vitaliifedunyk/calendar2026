import { useRef } from 'react'
import { useApp } from '../context/AppContext'
import { translations } from '../utils/translations'
import { exportToJSON, exportToCSV, importFromJSON } from '../utils/exportUtils'

const DataManagement = ({ workEntries, hourlyRate, notes = {}, goals = {}, onImport }) => {
  const { theme, language } = useApp()
  const t = translations[language] || translations.en
  const fileInputRef = useRef(null)

  const handleExportJSON = () => {
    try {
      exportToJSON(workEntries, hourlyRate, notes, goals)
    } catch (error) {
      alert(t.importError)
    }
  }

  const handleExportCSV = () => {
    try {
      exportToCSV(workEntries, hourlyRate, notes)
    } catch (error) {
      alert(t.importError)
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const data = await importFromJSON(file)
      const notesCount = Object.keys(data.notes || {}).length
      const hasGoals = (data.goals?.yearly?.hours > 0 || data.goals?.yearly?.earnings > 0) || Object.keys(data.goals?.monthly || {}).length > 0
      const confirmMsg = `${t.importSuccess}\n\nEntries: ${Object.keys(data.entries).length}\nNotes: ${notesCount}\nHourly Rate: ${data.hourlyRate}€\nGoals: ${hasGoals ? 'Yes' : 'No'}\n\nReplace current data?`
      
      if (window.confirm(confirmMsg)) {
        onImport(data.entries, data.hourlyRate, data.notes, data.goals)
      }
    } catch (error) {
      alert(`${t.importError}: ${error.message}`)
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const hasData = Object.keys(workEntries).length > 0

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 sm:p-6 border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'}`}>
      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
        {t.dataManagement}
      </h3>

      <div className="space-y-3">
        {/* Export Section */}
        <div>
          <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t.exportData}
          </h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExportJSON}
              disabled={!hasData}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-sm ${
                hasData
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              📥 {t.exportJSON}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={!hasData}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-sm ${
                hasData
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              📊 {t.exportCSV}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div>
          <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            {t.importData}
          </h4>
          <label className="block">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <span
              className={`inline-block w-full px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] text-sm text-center cursor-pointer ${
                theme === 'dark'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              📤 {t.importJSON}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default DataManagement

