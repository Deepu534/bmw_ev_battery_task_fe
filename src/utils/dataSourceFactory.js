export const createDataSourceFactory = (
  apiGetAll,
  pagination,
  searchTerm,
  columnFilters,
  setLoading,
  setTotalRows,
  convertSortToAPIFormat
) => {
  return {
    getRows: async (params) => {
      setLoading(true);
      try {
        const page = Math.floor(params.startRow / pagination.limit) + 1;
        const apiParams = {
          search: searchTerm || undefined,
          page: page,
          limit: pagination.limit,
        };

        if (Object.keys(columnFilters).length > 0) {
          apiParams.filters = JSON.stringify(columnFilters);
        }

        if (params.sortModel && params.sortModel.length > 0) {
          const sorting = convertSortToAPIFormat(params.sortModel);
          if (sorting.field) {
            apiParams.sortField = sorting.field;
            apiParams.sortDirection = sorting.direction || 'asc';
          }
        }

        const response = await apiGetAll(apiParams);
        const data = response.data || [];
        const totalRows = response.pagination?.total || 0;

        setTotalRows(totalRows);
        params.successCallback(data, totalRows);
      } catch (error) {
        console.error('Error fetching data:', error);
        params.failCallback();
      } finally {
        setLoading(false);
      }
    },
  };
};

