import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally reset localStorage or other state
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f7fa',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              maxWidth: 600,
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: 2,
              p: 4
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#d32f2f',
                fontWeight: 700,
                mb: 2
              }}
            >
              Oops! Something went wrong
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 3,
                lineHeight: 1.6
              }}
            >
              We encountered an unexpected error while running the story. Don't worry, we've logged the issue.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  bgcolor: '#f5f5f5',
                  borderLeft: '4px solid #d32f2f',
                  p: 2,
                  mb: 3,
                  textAlign: 'left',
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#333',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{
                bgcolor: '#1976d2',
                color: '#fff',
                fontWeight: 700,
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#1565c0'
                }
              }}
            >
              Return to Start
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
