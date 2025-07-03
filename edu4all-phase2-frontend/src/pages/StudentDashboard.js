// src/components/StudentDashboard.jsx

import { useEffect, useRef, useState } from 'react';
import { Card, Col, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchAllResources } from '../api/resourceApi';
import { searchSessions } from '../api/sessionApi';
import CenteredSearchBar from '../components/CenteredSearchBar';
import StickyNavbar from '../components/StickyNavbar';
import afternoon from '../resources/afternoon.png';
import evening from '../resources/evening.png';
import morning from '../resources/morning.png';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [sessionResults, setSessionResults] = useState([]);
  const [resourceResults, setResourceResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();

  // Fetch all resources on mount
  useEffect(() => {
    fetchAllResources()
      .then(data => {
        setResources(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Failed to load resources:', err);
        setResources([]);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return morning;
    if (hour < 18) return afternoon;
    return evening;
  };

  const greetingIcon = getGreetingIcon();
  const greeting = getGreeting();

  // Handler for combined search
  const handleSearch = async (keyword) => {
    const term = keyword.trim();
    if (!term) {
      setSessionResults([]);
      setResourceResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      // Search sessions
      const sessionResp = await searchSessions(term);
      const sessions = Array.isArray(sessionResp.data) ? sessionResp.data : [];

      // Filter resources locally
      const matchedResources = resources.filter(r =>
        [r.title, r.description, r.subject]
          .join(' ')
          .toLowerCase()
          .includes(term.toLowerCase())
      );

      setSessionResults(sessions);
      setResourceResults(matchedResources);
      setShowDropdown(true);
    } catch (err) {
      console.error('Search error:', err);
      setSessionResults([]);
      setResourceResults([]);
      setShowDropdown(true);
    } finally {
      setSearching(false);
    }
  };

  const cards = [
    {
      title: 'My Scheduled Sessions',
      text: 'View and join all the sessions you\'re signed up for.',
      btnText: 'View Sessions',
      onClick: () => navigate('/dashboard/student/sessions'),
    },
    {
      title: 'Register for Sessions',
      text: 'Browse upcoming sessions and register for ones you like.',
      btnText: 'Browse & Register',
      onClick: () => navigate('/dashboard/student/all-sessions'),
    },
    {
      title: 'Download Resources',
      text: 'Access handouts, slides, and other study materials.',
      btnText: 'Download Now',
      onClick: () => navigate('/dashboard/student/resources'),
    },
    {
      title: 'Discussion Forum',
      text: 'Join discussions, ask questions, and share knowledge with other students.',
      btnText: 'Enter Forum',
      onClick: () => navigate('forum'),
    },
  ];

  return (
    <>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <StickyNavbar />
      <div className="container py-5">
        <h2 className="mb-4 capitalize">
          <img className="greetIcon" src={greetingIcon} width={80} alt="" />
          {greeting}, {localStorage.getItem("userName")}!
        </h2>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <CenteredSearchBar onSearch={handleSearch} />
          {showDropdown && (
            <ListGroup
              className="position-absolute w-50"
              style={{
                top: 'calc(100% + 0.5rem)',
                left: '50%',
                transform: 'translateX(-50%)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000,
              }}
            >
              {searching && (
                <ListGroup.Item className="text-center">
                  <Spinner animation="border" size="sm" /> Searching…
                </ListGroup.Item>
              )}
              {!searching && sessionResults.length === 0 && resourceResults.length === 0 && (
                <ListGroup.Item className="text-center text-muted">
                  No results found.
                </ListGroup.Item>
              )}
              {!searching && sessionResults.map((s) => (
                <ListGroup.Item
                  action
                  key={`session-${s.vaId}`}
                  onClick={() => navigate(`/dashboard/student/all-sessions`)}
                >
                  <strong>Session:</strong> {s.title}
                </ListGroup.Item>
              ))}
              {!searching && resourceResults.map((r) => (
                <ListGroup.Item
                  action
                  key={`resource-${r.id}`}
                  onClick={() => navigate(`/dashboard/student/resources/${r.id}`)}
                >
                  <strong>Resource:</strong> {r.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        <div className="row g-4 mt-5">
          {cards.map((c, i) => (
            <Col key={i} md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{c.title}</Card.Title>
                  <Card.Text className="flex-grow-1">{c.text}</Card.Text>
                  <button className="btn btn-primary mt-3" onClick={c.onClick}>
                    {c.btnText}
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      </div>
    </>
  );
}
