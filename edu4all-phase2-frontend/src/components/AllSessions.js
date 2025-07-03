// src/components/AllSessions.jsx

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import {
  getAllSessions,
  getStudentSessions,
  searchSessions,
  subscribeSession,
  unsubscribeSession,
} from "../api/sessionApi";
import StickyNavbar from "../components/StickyNavbar";
import "../toastr-overrides.css";
import OnlineSessionImg from "./Online_session.png";

export default function AllSessions() {
  const [allSessions, setAllSessions] = useState([]);
  const [displayedSessions, setDisplayedSessions] = useState([]);
  const [registeredSet, setRegisteredSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  // Current userId from localStorage
  const raw = localStorage.getItem("userId");
  const userId = raw ? parseInt(raw, 10) : null;

  // Helpers for formatting
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);

        // 1) Fetch all sessions
        const sessionsData = await getAllSessions();
        setAllSessions(sessionsData);
        setDisplayedSessions(sessionsData);

        // 2) Fetch sessions this user has registered for
        const studentData = await getStudentSessions(userId);
        const regSet = new Set(studentData.map((s) => s.vaId));
        setRegisteredSet(regSet);

        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to load sessions. Please try again later.");
        toastr.error("Could not fetch sessions.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError("");
    const keyword = searchKeyword.trim();
    if (!keyword) {
      // Reset to all sessions
      setDisplayedSessions(allSessions);
      return;
    }

    setSearching(true);
    try {
      const response = await searchSessions(keyword);
      setDisplayedSessions(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to search sessions. Please try again.");
      toastr.error("Search failed.");
    } finally {
      setSearching(false);
    }
  };

  const handleRegister = async (sessionId) => {
    if (!userId) return;
    setLoadingIds((prev) => new Set(prev).add(sessionId));
    try {
      await subscribeSession(userId, sessionId);
      setRegisteredSet((prev) => new Set(prev).add(sessionId));
      toastr.success("Registered successfully.");
    } catch (e) {
      console.error(e);
      toastr.error("Failed to register.");
    } finally {
      setLoadingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(sessionId);
        return updated;
      });
    }
  };

  const handleUnregister = async (sessionId) => {
    if (!userId) return;
    setLoadingIds((prev) => new Set(prev).add(sessionId));
    try {
      await unsubscribeSession(userId, sessionId);
      setRegisteredSet((prev) => {
        const updated = new Set(prev);
        updated.delete(sessionId);
        return updated;
      });
      toastr.success("Unregistered successfully.");
    } catch (e) {
      console.error(e);
      toastr.error("Failed to unregister.");
    } finally {
      setLoadingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(sessionId);
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <>

        <StickyNavbar />

        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">All Sessions</h2>
            <button
              className="btn btn-light"
              onClick={() => navigate(-1)}
              style={{
                fontSize: "18px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              ← Back
            </button>
          </div>

          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading sessions…</span>
            </Spinner>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
 

      <StickyNavbar />

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">All Sessions</h2>
          <button
            className="btn btn-light"
            onClick={() => navigate(-1)}
            style={{
              fontSize: "18px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            ← Back
          </button>
        </div>

        {/* Search Bar */}
        <Form onSubmit={handleSearch} className="mb-4">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search keyword…"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="shadow-sm"
            />
            <Button
              variant="secondary"
              type="submit"
              disabled={searching}
              className="d-flex align-items-center"
            >
              {searching ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Searching…
                </>
              ) : (
                <>
                  <FaSearch className="me-2" />
                  Search
                </>
              )}
            </Button>
          </InputGroup>
        </Form>

        {error && <div className="alert alert-danger">{error}</div>}

        {displayedSessions.length === 0 && !error ? (
          <div className="alert alert-info">No sessions found.</div>
        ) : (
          <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {displayedSessions.map((s) => {
              const isRegistered = registeredSet.has(s.vaId);
              const isLoadingThis = loadingIds.has(s.vaId);

              return (
                <Col key={s.vaId}>
                  <Card className="shadow-sm h-100 session-card">
                    <div className="position-relative overflow-hidden session-image-container">
                      <Card.Img
                        variant="top"
                        src={OnlineSessionImg}
                        className="session-image"
                      />
                      <div className="session-image-overlay" />
                      <div className="session-title-overlay">{s.title}</div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <p className="session-description">{s.description}</p>
                      <ul
                        className="list-unstyled mb-3"
                        style={{ fontSize: "0.875rem" }}
                      >
                        <li>
                          <strong>Starts:</strong> {formatDate(s.startDateTime)}{" "}
                          at {formatTime(s.startDateTime)}
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
                      <div className="mt-auto d-flex justify-content-between">
                        {isRegistered ? (
                          <Button
                            variant="outline-dark"
                            size="sm"
                            disabled={isLoadingThis}
                            onClick={() => handleUnregister(s.vaId)}
                            className="d-flex align-items-center"
                          >
                            {isLoadingThis && (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                            )}
                            {isLoadingThis ? "Unregistering…" : "Unregister"}
                          </Button>
                        ) : (
                          <Button
                            variant="dark"
                            size="sm"
                            disabled={isLoadingThis}
                            onClick={() => handleRegister(s.vaId)}
                            className="d-flex align-items-center"
                          >
                            {isLoadingThis && (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                            )}
                            {isLoadingThis ? "Registering…" : "Register Now"}
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
}
