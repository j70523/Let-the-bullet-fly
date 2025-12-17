import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '2rem', color: '#ff5555', background: '#111'}}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{padding: '0.5rem 1rem', marginTop: '1rem', background: '#333', color: '#fff', border: '1px solid #555'}}
          >
            Clear Cache & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);