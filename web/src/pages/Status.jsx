import React, { useEffect, useState } from 'react';

export function Status() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchStatus() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/status`);
      const json = await res.json();
      setStatus(json);
    } catch (e) {
      setStatus({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStatus(); }, []);

  function badge(ok) {
    const style = {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: 12,
      color: 'white',
      background: ok ? '#16a34a' : '#dc2626',
      marginLeft: 8,
      fontSize: 12
    };
    return <span style={style}>{ok ? 'OK' : 'DOWN'}</span>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Status</h2>
      <div>
        <button onClick={fetchStatus} disabled={loading}>
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {!status && <div>No status yet</div>}
        {status && (
          <div>
            <div>API: {badge(!!status.api)}</div>
            <div>Database: {badge(!!status.db)}</div>
            <div>
              Proxy ({status.proxy && status.proxy.host}:{status.proxy && status.proxy.port}): {badge(status.proxy && status.proxy.ok)}
            </div>
            {status.error && <div style={{ color: '#b91c1c' }}>Error: {String(status.error)}</div>}
            <pre style={{ background: '#f6f8fa', padding: 12, marginTop: 12 }}>
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
