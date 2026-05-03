import { PRIORITY_LABELS, STATUS_LABELS } from "./constants.js";
import { escapeHtml, formatDate } from "./utils.js";

/**
 * Renders the filtered tasks into the board columns.
 * @param {Array} visibleTasks
 * @param {Object} elements
 */
export function renderBoard(visibleTasks, elements) {
  const groupedTasks = {
    todo: [],
    inProgress: [],
    done: []
  };

  visibleTasks.forEach((task) => {
    if (groupedTasks[task.status]) {
      groupedTasks[task.status].push(task);
    }
  });

  elements.todoColumn.innerHTML = "";
  elements.inProgressColumn.innerHTML = "";
  elements.doneColumn.innerHTML = "";

  renderColumn(
    elements.todoColumn,
    groupedTasks.todo,
    "No hay tareas pendientes con los filtros actuales."
  );

  renderColumn(
    elements.inProgressColumn,
    groupedTasks.inProgress,
    "No hay tareas en curso con los filtros actuales."
  );

  renderColumn(
    elements.doneColumn,
    groupedTasks.done,
    "No hay tareas finalizadas con los filtros actuales."
  );

  elements.todoCount.textContent = String(groupedTasks.todo.length);
  elements.inProgressCount.textContent = String(groupedTasks.inProgress.length);
  elements.doneCount.textContent = String(groupedTasks.done.length);
}

/**
 * Renders a single board column.
 * @param {HTMLElement} container
 * @param {Array} columnTasks
 * @param {string} emptyMessage
 */
function renderColumn(container, columnTasks, emptyMessage) {
  if (columnTasks.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = emptyMessage;
    container.appendChild(emptyState);
    return;
  }

  columnTasks.forEach((task) => {
    container.appendChild(createTaskCard(task));
  });
}

/**
 * Creates the DOM node for a task card.
 * @param {Object} task
 * @returns {HTMLElement}
 */
function createTaskCard(task) {
  const article = document.createElement("article");
  article.className = `task-card priority-${task.priority}`;
  article.dataset.taskId = task.id;

  const formattedDueDate = formatDate(task.dueDate);
  const hasDueDate = Boolean(task.dueDate);

  const descriptionHtml = task.description
    ? `<p class="task-card__description">${escapeHtml(task.description)}</p>`
    : "";

  article.innerHTML = `
    <div class="task-card__top">
      <span class="priority-badge badge-${escapeHtml(task.priority)}">
        ${escapeHtml(PRIORITY_LABELS[task.priority] || task.priority)}
      </span>

      <span class="task-card__date ${hasDueDate ? "" : "is-empty"}">
        ${escapeHtml(formattedDueDate)}
      </span>
    </div>

    <h4 class="task-card__title">${escapeHtml(task.title)}</h4>

    ${descriptionHtml}

    <div class="task-card__controls">
      <label class="sr-only" for="status-${escapeHtml(task.id)}">Cambiar estado</label>
      <select id="status-${escapeHtml(task.id)}" data-action="change-status">
        ${createStatusOptions(task.status)}
      </select>

      <div class="task-card__actions">
        <button type="button" class="btn btn-secondary" data-action="edit">Editar</button>
        <button type="button" class="btn btn-danger" data-action="delete">Eliminar</button>
      </div>
    </div>
  `;

  return article;
}

/**
 * Creates the HTML options for the task status select.
 * @param {string} currentStatus
 * @returns {string}
 */
function createStatusOptions(currentStatus) {
  return Object.entries(STATUS_LABELS)
    .map(([value, label]) => {
      const selected = value === currentStatus ? "selected" : "";
      return `<option value="${escapeHtml(value)}" ${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

/**
 * Renders global statistics.
 * @param {Array} taskList
 * @param {Object} elements
 */
export function renderStatistics(taskList, elements) {
  const total = taskList.length;
  const todo = taskList.filter((task) => task.status === "todo").length;
  const inProgress = taskList.filter((task) => task.status === "inProgress").length;
  const done = taskList.filter((task) => task.status === "done").length;

  const completionPercent = total === 0 ? 0 : Math.round((done / total) * 100);

  elements.totalStat.textContent = String(total);
  elements.todoStat.textContent = String(todo);
  elements.inProgressStat.textContent = String(inProgress);
  elements.doneStat.textContent = String(done);
  elements.percentStat.textContent = `${completionPercent}%`;

  const progressBar = document.getElementById("stat-progress-bar");

  if (progressBar) {
    progressBar.style.width = `${completionPercent}%`;
  }
}

/**
 * Fills the form with the selected task data.
 * @param {Object} task
 * @param {Object} elements
 */
export function fillFormForEdit(task, elements) {
  elements.titleInput.value = task.title;
  elements.descriptionInput.value = task.description;
  elements.priorityInput.value = task.priority;
  elements.dueDateInput.value = task.dueDate || "";
  elements.statusInput.value = task.status;

  elements.submitButton.textContent = "Guardar cambios";
  elements.cancelEditButton.classList.remove("hidden");
  elements.clearFormButton.classList.add("hidden");

  clearMessages(elements);
  elements.titleInput.focus();
  elements.form.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Clears form values.
 * @param {Object} elements
 */
export function clearForm(elements) {
  elements.form.reset();
  elements.priorityInput.value = "medium";
  elements.statusInput.value = "todo";
  clearMessages(elements);
}

/**
 * Resets the form to create mode.
 * @param {Object} elements
 */
export function resetFormState(elements) {
  elements.form.reset();
  elements.priorityInput.value = "medium";
  elements.statusInput.value = "todo";

  elements.submitButton.textContent = "Añadir tarea";
  elements.cancelEditButton.classList.add("hidden");
  elements.clearFormButton.classList.remove("hidden");

  clearMessages(elements);
}

/**
 * Shows an error message in the form area.
 * @param {string} message
 * @param {Object} elements
 */
export function showError(message, elements) {
  elements.formError.textContent = message;
  elements.formSuccess.textContent = "";
}

/**
 * Shows a success message in the form area.
 * @param {string} message
 * @param {Object} elements
 */
export function showSuccess(message, elements) {
  elements.formSuccess.textContent = message;
  elements.formError.textContent = "";
}

/**
 * Clears form messages.
 * @param {Object} elements
 */
export function clearMessages(elements) {
  elements.formError.textContent = "";
  elements.formSuccess.textContent = "";
}