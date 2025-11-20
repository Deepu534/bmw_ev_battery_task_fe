import { Box, CircularProgress } from '@mui/material';

function LoadingIndicator() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                p: 3
            }}
        >
            <CircularProgress size={60} thickness={4} />
        </Box>
    );
}

export default LoadingIndicator;

