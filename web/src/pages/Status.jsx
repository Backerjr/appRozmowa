import React, { useEffect, useState } from 'react';

export function Status() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchStatus() {
    setLoading(true);
    try {
      const res = await fetch('/status');
      const json = await res.json();
      setStatus(json);
    } catch (e) {
      setStatus({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStatus(); }, []);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Status</h2>
      <div>
        <button onClick={fetchStatus} disabled={loading}>
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      <pre style={{ background: '#f6f8fa', padding: 12, marginTop: 12 }}>
        {status ? JSON.stringify(status, null, 2) : 'No status yet'}
      </pre>
    </div>
  );
}
