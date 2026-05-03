/**
 * Generates a simple unique id.
 * @returns {string}
 */
export function generateUniqueId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

/**
 * Formats a YYYY-MM-DD date string.
 * @param {string} dateValue
 * @returns {string}
 */
export function formatDate(dateValue) {
  if (!dateValue) {
    return "Sin fecha límite";
  }

  const dateObject = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(dateObject.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(dateObject);
}

/**
 * Formats an ISO date-time string.
 * @param {string} dateTimeValue
 * @returns {string}
 */
export function formatDateTime(dateTimeValue) {
  if (!dateTimeValue) {
    return "Sin registro";
  }

  const dateObject = new Date(dateTimeValue);

  if (Number.isNaN(dateObject.getTime())) {
    return dateTimeValue;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(dateObject);
}

/**
 * Escapes HTML to avoid injecting user content into the DOM.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  const temp = document.createElement("div");
  temp.textContent = String(value);
  return temp.innerHTML;
}