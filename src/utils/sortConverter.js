export const convertSortToAPIFormat = (sortModel) => {
  if (!sortModel || sortModel.length === 0) {
    return {};
  }

  const firstSort = sortModel[0];
  const apiField = firstSort.colId;
  const direction = firstSort.sort === 'desc' ? 'desc' : 'asc';

  return {
    field: apiField,
    direction: direction
  };
};

