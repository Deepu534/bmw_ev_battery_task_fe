import { Box, Typography } from '@mui/material';

const DetailListItem = ({ label, value }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                px: 2,
                borderRadius: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    transform: 'translateX(4px)'
                }
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    minWidth: '140px',
                    mr: 2
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 300,
                    color: 'text.primary',
                    textAlign: 'right',
                    flex: 1
                }}
            >
                {value ?? 'N/A'}
            </Typography>
        </Box>
    );
};

export default DetailListItem;

