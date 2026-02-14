'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 420, padding: 16 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '8px 16px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
