// src/components/RegisterSession.js

import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import {
    getStudentSessions,
    subscribeSession,
    unsubscribeSession,
} from "../api/sessionApi";


export default function RegisterSession({ sessionId, userId, onStatusChange }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount (or whenever userId/sessionId changes), fetch the list of this user's sessions
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkRegistered = async () => {
      try {
        const data = await getStudentSessions(userId);
        // If any returned session has vaId === sessionId, user is registered
        const registered = data.some((s) => s.vaId === sessionId);
        setIsRegistered(registered);
      } catch (e) {
        console.error(e);
        toastr.error("Failed to check registration status.");
      } finally {
        setLoading(false);
      }
    };

    checkRegistered();
  }, [userId, sessionId]);

  const handleRegister = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await subscribeSession(userId, sessionId);
      setIsRegistered(true);
      toastr.success("Registered successfully.");
      if (onStatusChange) onStatusChange(sessionId, true);
    } catch (e) {
      console.error(e);
      toastr.error("Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await unsubscribeSession(userId, sessionId);
      setIsRegistered(false);
      toastr.success("Unregistered successfully.");
      if (onStatusChange) onStatusChange(sessionId, false);
    } catch (e) {
      console.error(e);
      toastr.error("Failed to unregister.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Button variant="secondary" size="sm" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
        ...
      </Button>
    );
  }

  return isRegistered ? (
    <Button variant="outline-dark" size="sm" onClick={handleUnregister}>
      Unregister
    </Button>
  ) : (
    <Button variant="dark" size="sm" onClick={handleRegister}>
      Register
    </Button>
  );
}
