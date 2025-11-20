const processSingleFilter = (filter, defaultType) => {
  const filterTypeValue = filter.type || defaultType;
  const operator = filterTypeValue === 'blank' ? 'isEmpty' : filterTypeValue;

  if (operator === 'isEmpty') {
    return { operator, value: null };
  }

  const filterValue = filter.filter;
  if (filterValue === null || filterValue === undefined || filterValue === '') {
    return null;
  }

  return { operator, value: filterValue };
};

const addProcessedCondition = (conditions, condition, defaultType) => {
  const processed = processSingleFilter(condition, defaultType);
  if (processed) {
    conditions.push(processed);
  }
};

const processFilterConditions = (filter, filterType) => {
  const conditions = [];
  const defaultType = filterType === 'number' ? 'equals' : 'contains';

  if (filter.conditions && Array.isArray(filter.conditions)) {
    filter.conditions.forEach(condition => {
      addProcessedCondition(conditions, condition, defaultType);
    });
  } else if (filter.condition1 || filter.condition2) {
    if (filter.condition1) addProcessedCondition(conditions, filter.condition1, defaultType);
    if (filter.condition2) addProcessedCondition(conditions, filter.condition2, defaultType);
  } else {
    addProcessedCondition(conditions, filter, defaultType);
  }

  return conditions;
};

export const convertFilterToAPIFormat = (filterModel) => {
  if (!filterModel || Object.keys(filterModel).length === 0) {
    return {};
  }

  const apiFilters = {};

  Object.entries(filterModel).forEach(([field, filter]) => {
    if (!filter) return;

    const filterType = filter.filterType || 'text';
    const isNumber = filterType === 'number' || filterType === 'agNumberColumnFilter';
    const conditions = processFilterConditions(filter, isNumber ? 'number' : 'text');

    if (conditions.length === 0) return;

    if (conditions.length === 1) {
      apiFilters[field] = conditions[0];
    } else {
      const operator = (filter.type || filter.operator || 'AND').toLowerCase();
      apiFilters[field] = { operator, conditions };
    }
  });

  return apiFilters;
};

