// Utility functions for exporting and importing data

import {
  sanitizeEntries,
  sanitizeGoals,
  sanitizeHourlyRate,
  sanitizeNotes,
} from "./dataValidation";

export const exportToJSON = (
  workEntries,
  hourlyRate,
  notes = {},
  goals = {}
) => {
  const data = {
    version: "2.0",
    exportDate: new Date().toISOString(),
    hourlyRate,
    entries: workEntries,
    notes: notes || {},
    goals: goals || {},
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `work-calendar-2026-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (workEntries, hourlyRate, notes = {}) => {
  const headers = ["Date", "Hours", "Earnings (EUR)", "Notes"];
  const rows = [headers.join(",")];

  const sortedDates = Object.keys(workEntries).sort();

  sortedDates.forEach((dateKey) => {
    const hours = workEntries[dateKey];
    const earnings = hours * hourlyRate;
    const note = notes[dateKey] || "";
    // Escape commas and quotes in notes
    const escapedNote = note.replace(/"/g, '""');
    rows.push(`${dateKey},${hours},${earnings.toFixed(2)},"${escapedNote}"`);
  });

  const csv = rows.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `work-calendar-2026-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate data structure
        if (!data.entries || typeof data.entries !== "object") {
          reject(new Error("Invalid file format: missing entries"));
          return;
        }

        resolve({
          entries: sanitizeEntries(data.entries),
          hourlyRate: sanitizeHourlyRate(data.hourlyRate),
          notes: sanitizeNotes(data.notes),
          goals: sanitizeGoals(data.goals),
        });
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};
