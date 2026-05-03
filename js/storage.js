import { STORAGE_KEY } from "./constants.js";

/**
 * Loads tasks from localStorage.
 * @returns {Array}
 */
export function loadTasks() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (!rawData) {
      return [];
    }

    const parsedData = JSON.parse(rawData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
}

/**
 * Saves tasks to localStorage.
 * @param {Array} tasksToSave
 */
export function saveTasks(tasksToSave) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
}