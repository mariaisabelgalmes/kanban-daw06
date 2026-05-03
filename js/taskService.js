import { generateUniqueId } from "./utils.js";

/**
 * Creates a new task and returns the updated task array.
 * @param {Array} taskList
 * @param {Object} formData
 * @returns {Array}
 */
export function createTask(taskList, formData) {
  const newTask = {
    id: generateUniqueId(),
    title: formData.title,
    description: formData.description,
    priority: formData.priority,
    dueDate: formData.dueDate,
    status: formData.status,
    createdAt: new Date().toISOString()
  };

  return [...taskList, newTask];
}

/**
 * Updates an existing task and returns the updated task array.
 * @param {Array} taskList
 * @param {string} taskId
 * @param {Object} formData
 * @returns {Array}
 */
export function updateTask(taskList, taskId, formData) {
  return taskList.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate,
      status: formData.status
    };
  });
}

/**
 * Deletes a task and returns the updated task array.
 * @param {Array} taskList
 * @param {string} taskId
 * @returns {Array}
 */
export function deleteTask(taskList, taskId) {
  return taskList.filter((task) => task.id !== taskId);
}

/**
 * Changes the status of a task and returns the updated task array.
 * @param {Array} taskList
 * @param {string} taskId
 * @param {string} newStatus
 * @returns {Array}
 */
export function changeTaskStatus(taskList, taskId, newStatus) {
  return taskList.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      status: newStatus
    };
  });
}