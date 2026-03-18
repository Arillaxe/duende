'use client';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <h2>Something went wrong.</h2>
      <p>{error.message || 'Unexpected runtime error'}</p>
      <button
        onClick={reset}
        style={{
          padding: '8px 12px',
          border: '1px solid #999',
          borderRadius: '6px',
          cursor: 'pointer',
          background: 'transparent',
        }}
      >
        Try again
      </button>
    </div>
  );
}
