import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Chip, Divider } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { evMetricsAPI } from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';
import DetailListItem from '../components/DetailListItem';
import { formatFieldName, formatFieldValue } from '../utils/columnGenerator';

function RecordDetails({ data }) {
  if (!data) return null;

  const fields = Object.keys(data)
    .filter(key => key !== '__v' && key !== '_id')
    .map((key) => ({
      key,
      label: formatFieldName(key),
      value: formatFieldValue(data[key], key)
    }));

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        rowGap: 0.5,
        columnGap: { xs: 0, md: 4 },
        bgcolor: 'white',
        p: 2,
        gridAutoFlow: 'row',
        alignItems: 'start'
      }}
    >
      {fields.map((field) => (
        <DetailListItem
          key={field.key}
          label={field.label}
          value={field.value}
        />
      ))}
    </Box>
  );
}

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await evMetricsAPI.getById(id);
        setData(response);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Paper
            elevation={2}
            sx={{
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Record not found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The requested record could not be found or has been deleted.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
                }
              }}
            >
              Back to Table
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            size="small"
            sx={{
              mb: 2,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(-4px)',
                transition: 'transform 0.2s'
              }
            }}
            variant="outlined"
          >
            Back to Table
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                Selected Ev Details
              </Typography>
            </Box>
            <Chip
              label={`ID: ${id}`}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
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
          <RecordDetails data={data} />
        </Paper>
      </Box>
    </Box>
  );
}

export default DetailPage;

