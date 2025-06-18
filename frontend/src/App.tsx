import React, { useState } from 'react';

const API_URL = 'http://localhost:4000/api/tickets';
const TEST_URL = 'http://localhost:4000/api/tickets/test';

function App() {
  const [ticketId, setTicketId] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testConfig, setTestConfig] = useState<any | null>(null);
  const [showConfig, setShowConfig] = useState<any | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const handleTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(TEST_URL);
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
      setTestConfig(data.config || null);
    } catch (err: any) {
      setTestResult(`Exception: ${err?.message || err?.toString() || JSON.stringify(err)}`);
    } finally {
      setTestLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFiles([]);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      });
      const data = await res.json();
      setFiles(data.files);
    } catch (err) {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>EzOnboarding</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Jira Ticket ID:
          <input
            type="text"
            value={ticketId}
            onChange={e => setTicketId(e.target.value)}
            required
            style={{ marginLeft: 8 }}
          />
        </label>
        <button type="submit" style={{ marginLeft: 12 }} disabled={loading}>
          {loading ? 'Loading...' : 'Find Related Files'}
        </button>
      </form>
      <div style={{ marginTop: 16 }}>
        <button onClick={async () => {
          const res = await fetch(TEST_URL);
          const data = await res.json();
          setShowConfig(data.config || null);
        }}>Show Properties</button>
        {showConfig && (
          <div style={{ marginTop: 12, background: '#fffbe6', padding: 12, borderRadius: 4 }}>
            <strong>Jira Properties:</strong>
            <pre style={{ margin: 0 }}>{JSON.stringify(showConfig, null, 2)}</pre>
          </div>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={handleTest} disabled={testLoading}>
          {testLoading ? 'Testing Jira Connection...' : 'Test Jira Connection'}
        </button>
        {testResult && (
          <pre style={{ background: '#f4f4f4', padding: 12, marginTop: 12, borderRadius: 4 }}>
            {testResult}
          </pre>
        )}
        {testConfig && (
          <div style={{ marginTop: 12, background: '#e6f7ff', padding: 12, borderRadius: 4 }}>
            <strong>Jira Config Used:</strong>
            <pre style={{ margin: 0 }}>{JSON.stringify(testConfig, null, 2)}</pre>
          </div>
        )}
      </div>
      <div style={{ marginTop: 32 }}>
        {files.length > 0 && (
          <>
            <h2>Files related to {ticketId}:</h2>
            <ul>
              {files.map(f => <li key={f}>{f}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
