// src/components/ViewSessions.jsx
import { useEffect, useState } from 'react';
import { deleteSession, getSessions, startSession } from '../api/sessionApi';
import EditSession from './EditSession';
import ZoomMeeting from './ZoomMeeting';

const ViewSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    setFilteredSessions(
      sessions.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [sessions, search]);

  const loadSessions = () => {
    setLoading(true);
    getSessions()
      .then((data) => setSessions(data))
      .catch((err) => console.error('Error fetching sessions:', err))
      .finally(() => setLoading(false));
  };

  const handleJoin = async (id) => {
    try {
      const details = await startSession(id);
      setMeetingDetails(details);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteSession(toDelete.vaId);
      setToDelete(null);
      loadSessions();
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setDeleteLoading(false);
    }
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const fmtDur = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m`;
  };

  // In-session view
  if (meetingDetails) {
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <button onClick={() => setMeetingDetails(null)}>← Back</button>
        <ZoomMeeting
          meetingNumber={meetingDetails.meetingNumber}
          userName={meetingDetails.hostName}
          userEmail="mentor@example.com"
          signature={meetingDetails.signature}
          password={meetingDetails.meetingPassword}
        />
      </div>
    );
  }

  // Styles for our custom modal
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const panelStyle = {
    background: '#fff',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90%',
    overflowY: 'auto',
    padding: '1rem',
  };

  return (
    <>
      <div style={{ paddingTop: '20px' }}>
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="session_search form-control mb-3"
          disabled={loading}
        />

        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: 'collapse', width: '100%' }}
          className="sessionTable"
        >
          <thead>
            <tr>
              <th>Topic</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredSessions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No sessions found.
                </td>
              </tr>
            ) : (
              filteredSessions.map((s) => (
                <tr key={s.vaId}>
                  <td>{s.title}</td>
                  <td>{fmtDate(s.startDateTime)}</td>
                  <td>{fmtDur(s.sessionDuration)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-1"
                      onClick={() => handleJoin(s.vaId)}
                    >
                      Join
                    </button>
                    <button
                      className="btn btn-sm btn-secondary me-1"
                      onClick={() => setEditing(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setToDelete(s)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={overlayStyle}>
          <div style={panelStyle}>
            <EditSession
              session={editing}
              onClose={() => setEditing(null)}
              onSaved={() => {
                setEditing(null);
                loadSessions();
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {toDelete && (
        <div style={overlayStyle}>
          <div style={panelStyle}>
            <h5>Confirm Delete</h5>
            <p>
              Are you sure you want to delete “
              <strong>{toDelete.title}</strong>”?
            </p>
            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setToDelete(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewSessions;
