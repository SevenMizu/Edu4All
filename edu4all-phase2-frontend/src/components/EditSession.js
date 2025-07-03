// src/components/EditSession.jsx
import { useState } from 'react';
import { updateSession } from '../api/sessionApi';

export default function EditSession({ session, onClose, onSaved }) {
  const [form, setForm] = useState({
    topic:       session.title,
    agenda:      session.description || '',
    startTime:   session.startDateTime,
    duration:    session.sessionDuration,
    password:    session.sessionPassword || '',
    waitingRoom: session.waitRoom || false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSession(session.vaId, {
        topic:       form.topic,
        agenda:      form.agenda,
        startTime:   form.startTime,
        duration:    Number(form.duration),
        password:    form.password,
        waitingRoom: form.waitingRoom
      });
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  console.log("Passss: " + form.password);
  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Session</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="topic" className="form-label">Title</label>
                <input
                  id="topic"
                  name="topic"
                  type="text"
                  className="form-control"
                  value={form.topic}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="agenda" className="form-label">Description</label>
                <textarea
                  id="agenda"
                  name="agenda"
                  className="form-control"
                  rows="3"
                  value={form.agenda}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startTime" className="form-label">Start Time</label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    className="form-control"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label htmlFor="duration" className="form-label">Duration (min)</label>
                  <input
                    id="duration"
                    name="duration"
                    type="number"
                    className="form-control"
                    min="1"
                    value={form.duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3 mb-3 d-flex align-items-end">
                  <div className="form-check w-100">
                    <input
                      id="waitingRoom"
                      name="waitingRoom"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.waitingRoom}
                      onChange={handleChange}
                    />
                    <label htmlFor="waitingRoom" className="form-check-label">
                      Waiting Room
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="text"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
