/**
 * Returns the active filter values.
 * @param {Object} elements
 * @returns {Object}
 */
export function getCurrentFilters(elements) {
  return {
    status: elements.statusFilter.value,
    priority: elements.priorityFilter.value,
    text: elements.textSearch.value.trim().toLowerCase()
  };
}

/**
 * Applies the filtering pipeline.
 * @param {Array} taskList
 * @param {Object} filters
 * @returns {Array}
 */
export function getFilteredTasks(taskList, filters) {
  return taskList.filter((task) => {
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    const searchText = filters.text;
    const title = (task.title || "").toLowerCase();
    const description = (task.description || "").toLowerCase();

    const matchesText =
      !searchText ||
      title.includes(searchText) ||
      description.includes(searchText);

    return matchesStatus && matchesPriority && matchesText;
  });
}