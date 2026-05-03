import { elements } from "./dom.js";
import { getCurrentFilters, getFilteredTasks } from "./filters.js";
import { loadTasks, saveTasks } from "./storage.js";
import {
	changeTaskStatus,
	createTask,
	deleteTask,
	updateTask
} from "./taskService.js";
import {
	clearForm,
	clearMessages,
	fillFormForEdit,
	renderBoard,
	renderStatistics,
	resetFormState,
	showError,
	showSuccess
} from "./ui.js";

let tasks = [];
let editingTaskId = null;

document.addEventListener("DOMContentLoaded", initApp);

/**
 * Initializes the application.
 */
function initApp() {
  tasks = loadTasks();
  bindEvents();
  renderApp();
}

/**
 * Registers all UI event listeners.
 */
function bindEvents() {
  elements.form.addEventListener("submit", handleFormSubmit);
  elements.cancelEditButton.addEventListener("click", cancelEditMode);
  elements.clearFormButton.addEventListener("click", () => clearForm(elements));

  elements.statusFilter.addEventListener("change", renderApp);
  elements.priorityFilter.addEventListener("change", renderApp);
  elements.textSearch.addEventListener("input", renderApp);

  elements.clearFiltersButton.addEventListener("click", resetFilters);

  elements.board.addEventListener("click", handleBoardClick);
  elements.board.addEventListener("change", handleBoardChange);
}

/**
 * Handles form submission for creating or editing tasks.
 * @param {SubmitEvent} event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  clearMessages(elements);

  const formData = getFormData();

  if (!formData.title.trim()) {
    showError("El título es obligatorio.", elements);
    elements.titleInput.focus();
    return;
  }

  if (editingTaskId) {
    tasks = updateTask(tasks, editingTaskId, formData);
    showSuccess("La tarea se ha actualizado correctamente.", elements);
  } else {
    tasks = createTask(tasks, formData);
    showSuccess("La tarea se ha creado correctamente.", elements);
  }

  saveTasks(tasks);
  renderApp();

  editingTaskId = null;
  resetFormState(elements);
}

/**
 * Reads the current values from the form.
 * @returns {Object}
 */
function getFormData() {
  return {
    title: elements.titleInput.value.trim(),
    description: elements.descriptionInput.value.trim(),
    priority: elements.priorityInput.value,
    dueDate: elements.dueDateInput.value,
    status: elements.statusInput.value
  };
}

/**
 * Enters edit mode and fills the form with task data.
 * @param {string} taskId
 */
function startEditMode(taskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  editingTaskId = task.id;
  fillFormForEdit(task, elements);
}

/**
 * Cancels edit mode.
 */
function cancelEditMode() {
  editingTaskId = null;
  resetFormState(elements);
}

/**
 * Resets all active filters and search.
 */
function resetFilters() {
  elements.statusFilter.value = "all";
  elements.priorityFilter.value = "all";
  elements.textSearch.value = "";
  renderApp();
}

/**
 * Performs the full application render.
 */
function renderApp() {
  const filters = getCurrentFilters(elements);
  const filteredTasks = getFilteredTasks(tasks, filters);

  renderBoard(filteredTasks, elements);
  renderStatistics(tasks, elements);
}

/**
 * Handles click events inside the board.
 * @param {MouseEvent} event
 */
function handleBoardClick(event) {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const card = button.closest(".task-card");

  if (!card) {
    return;
  }

  const taskId = card.dataset.taskId;
  const action = button.dataset.action;

  if (action === "edit") {
    startEditMode(taskId);
    return;
  }

  if (action === "delete") {
    const confirmed = window.confirm("¿Seguro que quieres eliminar esta tarea?");

    if (confirmed) {
      tasks = deleteTask(tasks, taskId);
      saveTasks(tasks);
      renderApp();

      if (editingTaskId === taskId) {
        editingTaskId = null;
        resetFormState(elements);
      }

      showSuccess("La tarea se ha eliminado correctamente.", elements);
    }
  }
}

/**
 * Handles change events inside the board.
 * @param {Event} event
 */
function handleBoardChange(event) {
  const select = event.target.closest('select[data-action="change-status"]');

  if (!select) {
    return;
  }

  const card = select.closest(".task-card");

  if (!card) {
    return;
  }

  const taskId = card.dataset.taskId;
  const newStatus = select.value;

  tasks = changeTaskStatus(tasks, taskId, newStatus);
  saveTasks(tasks);
  renderApp();

  if (editingTaskId === taskId) {
    const updatedTask = tasks.find((task) => task.id === taskId);

    if (updatedTask) {
      elements.statusInput.value = updatedTask.status;
    }
  }
}