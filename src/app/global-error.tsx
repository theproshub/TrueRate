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
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#0f1419', color: '#e7e9ea' }}>
        <main style={{ maxWidth: 560, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: '#f87171', marginBottom: 16 }}>
            CRITICAL ERROR
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            TrueRate encountered a problem
          </h1>
          <p style={{ fontSize: 16, color: '#9ca3af', marginBottom: 32 }}>
            The page failed to load. This is usually temporary.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#f5a623',
              color: '#0f1419',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: 40, fontSize: 12, color: '#6b7280' }}>
              Error ID: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
