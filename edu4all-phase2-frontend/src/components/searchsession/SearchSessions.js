// src/components/SearchSessions.jsx

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {
  getStudentSessions,
  searchSessions,
  subscribeSession,
  unsubscribeSession,
} from "../../api/sessionApi";
import StickyNavbar from "../../components/StickyNavbar";
import OnlineSessionImg from "./Online_session.png";
import "./SearchSessions.css";

export default function SearchSessions() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [registeredSet, setRegisteredSet] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingIds, setLoadingIds] = useState(new Set());

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

  // Load registered sessions on mount (to know which sessions are already registered)
  useEffect(() => {
    if (!userId) return;
    const loadRegistered = async () => {
      try {
        const studentData = await getStudentSessions(userId);
        setRegisteredSet(new Set(studentData.map((s) => s.vaId)));
      } catch (e) {
        console.error(e);
      }
    };
    loadRegistered();
  }, [userId]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError("");
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await searchSessions(keyword.trim());
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (sessionId) => {
    if (!userId) return;
    setLoadingIds((prev) => new Set(prev).add(sessionId));
    try {
      await subscribeSession(userId, sessionId);
      setRegisteredSet((prev) => new Set(prev).add(sessionId));
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(sessionId);
        return updated;
      });
    }
  };

  return (
    <>
      <StickyNavbar />

      <Container className="py-5">
        <h2 className="mb-4">Search Sessions</h2>

        <Form onSubmit={handleSearch} className="mb-5">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter keyword…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="shadow-sm"
            />
            <Button
              variant="secondary"
              type="submit"
              disabled={loading}
              className="d-flex align-items-center"
            >
              {loading ? (
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

        {error && <p className="text-danger mb-4">{error}</p>}

        <Row className="g-4">
          {results.map((s) => {
            const isRegistered = registeredSet.has(s.vaId);
            const isLoadingThis = loadingIds.has(s.vaId);

            return (
              <Col key={s.vaId} xs={12} md={6} lg={4}>
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
                    <ul className="list-unstyled mb-3" style={{ fontSize: "0.875rem" }}>
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
                    <div className="mt-auto text-center">
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
      </Container>
    </>
  );
}
