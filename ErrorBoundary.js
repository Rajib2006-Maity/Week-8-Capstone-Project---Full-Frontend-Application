// src/components/ErrorBoundary/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a production app this would report to a logging service.
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            maxWidth: 500,
            margin: '4rem auto',
            textAlign: 'center',
            padding: '2.5rem',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ color: '#1a1a2e' }}>Something went wrong</h2>
          <p style={{ color: '#666' }}>
            We hit an unexpected error rendering this part of the app.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#ff6b6b',
              color: '#fff',
              border: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
