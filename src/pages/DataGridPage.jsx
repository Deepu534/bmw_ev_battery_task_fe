import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Box, Typography, Backdrop, CircularProgress, TextField, Paper, Button, Tooltip } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import { evMetricsAPI } from '../services/api';
import { getColumnDefinitions } from '../components/columnDefinitions.jsx';
import { convertFilterToAPIFormat } from '../utils/filterConverter';
import { convertSortToAPIFormat } from '../utils/sortConverter';
import { createDataSourceFactory } from '../utils/dataSourceFactory';
import DeleteDialog from '../components/DeleteDialog';
import NotificationSnackbar from '../components/NotificationSnackbar';

const gridContainerStyles = {
  height: '75vh',
  width: '100%',
  position: 'relative',
  '& .ag-theme-material': {
    '--ag-header-background-color': '#f8f9fa',
    '--ag-header-foreground-color': '#1a202c',
    '--ag-odd-row-background-color': '#ffffff',
    '--ag-row-hover-color': '#f0f4ff',
    '--ag-selected-row-background-color': '#e8eeff',
    '--ag-border-color': '#e2e8f0',
    '--ag-header-column-separator-color': '#cbd5e0',
    '--ag-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  '& .ag-header': {
    borderBottom: '2px solid #667eea',
  },
  '& .ag-header-cell': {
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.025em',
  },
  '& .ag-cell': {
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
  },
  '& .ag-row': {
    borderBottom: '1px solid #e2e8f0',
  },
  '& .ag-paging-panel': {
    borderTop: '2px solid #e2e8f0',
    padding: '12px 16px',
    bgcolor: '#fafafa',
  },
};

function DataGridPage() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 50 });
  const [columnFilters, setColumnFilters] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [sampleData, setSampleData] = useState([]);
  const filterTimeoutRef = useRef(null);

  const handleDeleteClick = useCallback((id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  }, []);

  useEffect(() => {
    const fetchSampleData = async () => {
      try {
        const response = await evMetricsAPI.getAll({ page: 1, limit: 10 });
        if (response.data && response.data.length > 0) {
          setSampleData(response.data);
        }
      } catch (error) {
        console.error('Error fetching sample data:', error);
      }
    };
    fetchSampleData();
  }, []);

  const columnDefs = useMemo(() => {
    if (sampleData.length === 0) return [];
    return getColumnDefinitions(sampleData, navigate, handleDeleteClick);
  }, [sampleData, navigate, handleDeleteClick]);

  const createDataSource = useMemo(() => {
    return createDataSourceFactory(
      evMetricsAPI.getAll,
      pagination,
      searchTerm,
      columnFilters,
      setLoading,
      () => { },
      convertSortToAPIFormat
    );
  }, [searchTerm, pagination.limit, columnFilters]);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption('datasource', createDataSource);
      gridRef.current.api.refreshInfiniteCache();
    }
  }, [createDataSource]);

  const handleFilterChanged = () => {
    if (!gridRef.current?.api) return;

    const filterModel = gridRef.current.api.getFilterModel();
    const apiFilters = convertFilterToAPIFormat(filterModel);

    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(() => {
      setColumnFilters(apiFilters);
      if (gridRef.current?.api) {
        gridRef.current.api.refreshInfiniteCache();
        gridRef.current.api.paginationGoToFirstPage();
      }
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
  };

  const handleSortChanged = () => {
    if (!gridRef.current?.api) return;
    gridRef.current.api.refreshInfiniteCache();
  };

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.refreshInfiniteCache();
      gridRef.current.api.paginationGoToFirstPage();
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  const handleDeleteConfirm = async () => {
    try {
      await evMetricsAPI.delete(deleteId);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      if (gridRef.current?.api) {
        gridRef.current.api.refreshInfiniteCache();
      }
      setSnackbar({ open: true, message: 'Record deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting record:', error);
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Failed to delete record', severity: 'error' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleResetFilters = () => {
    // Clear search term
    setSearchTerm('');

    // Clear column filters
    setColumnFilters({});

    // Clear grid filters
    if (gridRef.current?.api) {
      gridRef.current.api.setFilterModel(null);
      gridRef.current.api.refreshInfiniteCache();
      gridRef.current.api.paginationGoToFirstPage();
    }

    // Reset pagination
    setPagination({ page: 1, limit: pagination.limit });
  };

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    unSortIcon: false,
  }), []);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              EV - Battery Cell Info
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage and explore electric vehicle battery data
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="filled"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              size="small"
              sx={{
                width: 300,
                bgcolor: 'white',
                borderRadius: 1,
              }}
            />
            <Tooltip title="Clear search and all applied filters">
              <Button
                variant="contained"
                startIcon={<ClearIcon />}
                onClick={handleResetFilters}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                  },
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Reset
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={gridContainerStyles}>
          {columnDefs.length > 0 ? (
            <AgGridReact
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              loading={loading}
              rowModelType="infinite"
              pagination={true}
              paginationPageSize={pagination.limit}
              paginationPageSizeSelector={[25, 50, 100]}
              rowHeight={60}
              cacheBlockSize={pagination.limit}
              maxBlocksInCache={10}
              onPaginationChanged={(params) => {
                if (params.api) {
                  const currentPageNum = params.api.paginationGetCurrentPage() + 1;
                  setPagination({ ...pagination, page: currentPageNum });
                }
              }}
              onFilterChanged={handleFilterChanged}
              onSortChanged={handleSortChanged}
              onGridReady={(params) => {
                params.api.setGridOption('datasource', createDataSource);
              }}
              className="ag-theme-material"
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: 'white' }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          )}
          <Backdrop
            open={loading && columnDefs.length > 0}
            sx={{
              position: 'absolute',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 2,
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Backdrop>
        </Box>
      </Paper>

      <DeleteDialog
        title="Confirm Delete"
        description="Are you sure you want to delete this record? This action cannot be undone."
        proceedText="Delete"
        cancelText="Cancel"
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default DataGridPage;

