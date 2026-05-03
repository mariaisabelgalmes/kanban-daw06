export const elements = {
  form: document.getElementById("task-form"),
  titleInput: document.getElementById("title"),
  descriptionInput: document.getElementById("description"),
  priorityInput: document.getElementById("priority"),
  dueDateInput: document.getElementById("dueDate"),
  statusInput: document.getElementById("status"),

  submitButton: document.getElementById("submit-button"),
  cancelEditButton: document.getElementById("cancel-edit-button"),
  clearFormButton: document.getElementById("clear-form-button"),

  formError: document.getElementById("form-error"),
  formSuccess: document.getElementById("form-success"),

  statusFilter: document.getElementById("filter-status"),
  priorityFilter: document.getElementById("filter-priority"),
  textSearch: document.getElementById("search-text"),
  clearFiltersButton: document.getElementById("clear-filters-button"),

  board: document.getElementById("kanban-board"),
  todoColumn: document.getElementById("column-todo"),
  inProgressColumn: document.getElementById("column-in-progress"),
  doneColumn: document.getElementById("column-done"),

  todoCount: document.getElementById("count-todo"),
  inProgressCount: document.getElementById("count-in-progress"),
  doneCount: document.getElementById("count-done"),

  totalStat: document.getElementById("stat-total"),
  todoStat: document.getElementById("stat-todo"),
  inProgressStat: document.getElementById("stat-in-progress"),
  doneStat: document.getElementById("stat-done"),
  percentStat: document.getElementById("stat-percent")
};