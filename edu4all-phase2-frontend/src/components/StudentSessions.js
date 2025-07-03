// src/components/StudentSessions.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStudentSessions,
  startSession,
  unsubscribeSession
} from "../api/sessionApi";
import StickyNavbar from '../components/StickyNavbar';
import ZoomMeeting from "./ZoomMeeting";

import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "../toastr-overrides.css";

export default function StudentSessions() {
  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [meeting,     setMeeting]     = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetVaId,  setTargetVaId]  = useState(null);
  const navigate                      = useNavigate();

  // pull the real userId out of localStorage
  const raw = localStorage.getItem("userId");
  const userId = raw ? parseInt(raw, 10) : null;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getStudentSessions(userId)
      .then(data => setSessions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleJoin = async vaId => {
    try {
      const details = await startSession(vaId);
      setMeeting(details);
    } catch (e) {
      console.error(e);
    }
  };

  const openConfirm = vaId => {
    setTargetVaId(vaId);
    setShowConfirm(true);
  };

  const confirmUnsubscribe = async () => {
    setShowConfirm(false);
    try {
      await unsubscribeSession(userId, targetVaId);
      setSessions(s => s.filter(x => x.vaId !== targetVaId));
      toastr.success("Successfully Unsubscribed.");
    } catch (e) {
      console.error(e);
      toastr.error("Failed to unsubscribe.");
    } finally {
      setTargetVaId(null);
    }
  };

  const formatDate = iso =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric"
    });
  const formatTime = iso =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit", minute: "2-digit"
    });

  if (meeting) {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <button className="btn btn-link mb-3" onClick={() => setMeeting(null)}>
          ← Back to Sessions
        </button>
        <ZoomMeeting
          meetingNumber={meeting.meetingNumber}
          userName= {localStorage.getItem("userName")}
          userEmail="student@example.com"
          signature={meeting.signature}
          password={meeting.meetingPassword}
        />
      </div>
    );
  }

  return (
    <>
 

      <StickyNavbar/>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">My Registered Sessions</h2>
          <button
            className="btn btn-light"
            onClick={() => navigate(-1)}
            style={{
              fontSize: "18px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div>Loading sessions…</div>
        ) : sessions.length === 0 ? (
          <div className="alert alert-info">You have no registered sessions.</div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {sessions.map(s => (
              <div key={s.vaId} className="col">
                <div
                  className="card h-100"
                  style={{
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{s.title}</h5>
                    <p
                      className="card-text text-secondary mb-3"
                      style={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical"
                      }}
                    >
                      {s.description}
                    </p>
                    <ul className="list-unstyled mb-3" style={{ fontSize: "0.875rem" }}>
                      <li>
                        <strong>Starts:</strong> {formatDate(s.startDateTime)} at{" "}
                        {formatTime(s.startDateTime)}
                      </li>
                      <li>
                        <strong>Ends:</strong> {formatDate(s.endDateTime)} at{" "}
                        {formatTime(s.endDateTime)}
                      </li>
                      <li>
                        <strong>Duration:</strong> {s.sessionDuration} min
                      </li>
                      <li>
                        <strong>Host:</strong> {s.hostName}
                      </li>
                    </ul>
                  </div>
                  <div
                    className="card-footer d-flex justify-content-between"
                    style={{
                      backgroundColor: "rgb(236, 241, 245)",
                      padding: "15px"
                    }}
                  >
                    <button
                      className="btn btn-sm btn-dark"
                      onClick={() => handleJoin(s.vaId)}
                    >
                      Join Meeting
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => openConfirm(s.vaId)}
                    >
                      Unsubscribe
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirm && (
          <div className="modal d-block" tabIndex="-1">
            <div
              className="modal-backdrop fade show"
              onClick={() => setShowConfirm(false)}
            />
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
              style={{ zIndex: 1050 }}
            >
              <div className="modal-content" style={{ backdropFilter: "blur(10px)", background: "rgba(255, 255, 255, 0.3)" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Unsubscribe</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfirm(false)}
                  />
                </div>
                <div className="modal-body">
                  Are you sure you want to unsubscribe?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={confirmUnsubscribe}
                  >
                    Unsubscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
