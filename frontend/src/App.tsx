import React, { useState } from 'react';

const API_URL = 'http://localhost:4000/api/tickets';

function App() {
  const [ticketId, setTicketId] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
