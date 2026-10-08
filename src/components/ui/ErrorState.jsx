export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="error-state">
    <div className="error-icon">⚠️</div>
    <h3>Error</h3>
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn primary-btn">
        Try Again
      </button>
    )}
  </div>
);
