import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useThemeContext();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
        borderTop: 1,
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          color: theme === 'dark' ? '#b0b0b0' : '#666666',
          mb: 1
        }}
      >
        Created by{' '}
        <Link
          href="https://twitter.com/khaeldgore2"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: theme === 'dark' ? '#90caf9' : '#1976d2',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Khaled Eldahshan
        </Link>
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          color: theme === 'dark' ? '#888888' : '#777777',
          display: 'block',
          fontSize: '0.75rem',
          letterSpacing: '0.2px',
          mb: 1
        }}
      >
        © {currentYear} Eisenhower Matrix App
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: theme === 'dark' ? '#888888' : '#777777',
          display: 'block',
          fontSize: '0.7rem',
          letterSpacing: '0.2px',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        Based on the time management principles of President Dwight D. Eisenhower. This app is designed for personal productivity and educational use. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;