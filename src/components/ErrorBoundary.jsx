import { Component } from "react";
import PropTypes from "prop-types";
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-md p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h2>
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};

export default ErrorBoundary;