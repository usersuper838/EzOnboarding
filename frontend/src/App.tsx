import React, { useState } from 'react';

const API_URL = 'http://localhost:4000/api/tickets';
const TEST_URL = 'http://localhost:4000/api/tickets/test';

function App() {
  const [ticketId, setTicketId] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [todoTickets, setTodoTickets] = useState<any[]>([]);
  const [todoLoading, setTodoLoading] = useState(false);
  const [todoError, setTodoError] = useState<string | null>(null);
  const [errorLog, setErrorLog] = useState<string[]>([]);

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

  const handleTodo = async () => {
    setTodoLoading(true);
    setTodoError(null);
    setTodoTickets([]);
    try {
      const res = await fetch('http://localhost:4000/api/tickets/todo');
      const data = await res.json();
      if (Array.isArray(data.tickets)) {
        setTodoTickets(data.tickets);
      } else if (data.error) {
        setTodoError(data.details || JSON.stringify(data));
        setErrorLog(errors => [...errors, `[To Do Fetch] ${data.details || JSON.stringify(data)}`]);
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch To Do tickets';
      setTodoError(msg);
      setErrorLog(errors => [...errors, `[To Do Fetch] ${msg}`]);
    } finally {
      setTodoLoading(false);
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
        <button onClick={handleTodo} disabled={todoLoading}>
          {todoLoading ? 'Loading To Do Tickets...' : 'List To Do Tickets'}
        </button>
        {todoError && (
          <div style={{ color: 'red', marginTop: 12 }}>{todoError}</div>
        )}
        {todoTickets.length > 0 && (
          <table style={{ width: '100%', marginTop: 20, borderCollapse: 'collapse', background: '#fafafa' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Title</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Description</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Acceptance Criteria</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {todoTickets.map((ticket, idx) => (
                <tr key={ticket.key || idx}>
                  <td style={{ border: '1px solid #ddd', padding: 8, verticalAlign: 'top' }}>{ticket.key}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8, verticalAlign: 'top' }}>{ticket.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8, verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>{ticket.description}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8, verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>
                    {ticket.acceptanceCriteria
                      ? ticket.acceptanceCriteria.split('\n').map((item: string, idx: number) =>
                          item.trim() ? (
                            <span key={idx}>
                              • {item}
                              <br />
                            </span>
                          ) : null
                        )
                      : ''}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 8, verticalAlign: 'top' }}>{ticket.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    {errorLog.length > 0 && (
      <div style={{ marginTop: 40, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 6, padding: 16 }}>
        <h3 style={{ color: '#cf1322' }}>Error Log</h3>
        <ul style={{ color: '#cf1322', fontFamily: 'monospace', fontSize: 14 }}>
          {errorLog.map((err, idx) => (
            <li key={idx} style={{ marginBottom: 8, whiteSpace: 'pre-wrap' }}>{err}</li>
          ))}
        </ul>
      </div>
    )}
    {/* Display raw HTML error in an iframe for debugging */}
    {errorLog.some(e => e.includes('<!DOCTYPE html>')) && (
      <div style={{ marginTop: 40, border: '2px solid #1890ff', borderRadius: 6, padding: 0, overflow: 'hidden' }}>
        <h3 style={{ color: '#1890ff', margin: 0, padding: 12, background: '#e6f7ff' }}>Raw HTML Response (Jira Login Page)</h3>
        <iframe
          title="Raw HTML Error"
          srcDoc={errorLog.reverse().find(e => e.includes('<!DOCTYPE html>'))}
          style={{ width: '100%', height: 500, border: 'none', background: '#fff' }}
        />
      </div>
    )}
    </div>
  );
}

export default App;
