import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingSpinner = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress />
      <div style={{ fontFamily: 'Montserrat', marginTop: '1rem' }}>
        Analyzing images...
      </div>
    </Box>
  );
};

export default LoadingSpinner; 