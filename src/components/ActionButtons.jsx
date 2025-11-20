import { Box, Button } from '@mui/material';
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

const ActionButtons = ({ id, navigate, handleDeleteClick }) => {
    return (
        <Box sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
        }}>
            <Button
                size="small"
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => navigate(`/detail/${id}`)}
                sx={{ minWidth: 90, px: 2, py: 0.75 }}
            >
                View
            </Button>
            <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(id)}
                sx={{ minWidth: 90, px: 2, py: 0.75 }}
            >
                Delete
            </Button>
        </Box>
    );
};

export default ActionButtons;

