// src/components/forum/Forum.jsx

import { useEffect, useState } from 'react';
import { Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import StickyNavbar from '../../components/StickyNavbar';
import { forumService } from '../../services/forumService';
import DiscussionList from "./DiscussionList";

const Forum = () => {
  const [allPosts, setAllPosts] = useState([]);      // Holds the full list of posts from the API
  const [searchTerm, setSearchTerm] = useState('');  // What the user types
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch all posts once on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const response = await forumService.getAllPosts();
        setAllPosts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 2. Compute a filtered list based on searchTerm.
  //    - Convert both title/content and searchTerm to lowercase for case-insensitive matching.
  //    - We check if searchTerm is a substring of either title or content.
  const filteredPosts = allPosts.filter((post) => {
    if (!searchTerm.trim()) return true; // no filter if the search field is empty
    const lower = searchTerm.toLowerCase();
    const inTitle = post.title.toLowerCase().includes(lower);
    const inContent = post.content.toLowerCase().includes(lower);
    return inTitle || inContent;
  });

  // 3. Sort filteredPosts by createdAt descending so newest appear first
  const sortedPosts = filteredPosts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 4. Map the sorted posts into the shape DiscussionList expects
  const discussions = sortedPosts.map(post => ({
    id: post.id,
    title: post.title,
    description: post.content,
    createdAt: post.createdAt,
    username: post.username,
    avatarUrl: `https://i.pravatar.cc/40?u=${post.userId}`
  }));

  return (
    <>
      <StickyNavbar />

      <Container className="mt-5 mb-5">
        {/* Header and "Create New Post" button always visible */}
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="display-5">Community Forum</h1>
            <p className="text-muted">Browse and discuss topics with fellow members.</p>
          </Col>
          <Col xs="auto">
            <Link to="create">
              <button className="btn resource-btn">
                <FaPlus className="me-2" />
                Create New Post
              </button>
            </Link>
          </Col>
        </Row>

        {loading ? (
          // Show spinner while loading, below header
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading forum posts…</span>
            </Spinner>
          </div>
        ) : (
          <>
            {/* Search input (no API button) */}
            <Row className="mb-5">
              <Col lg={6} md={8} sm={10}>
                <InputGroup>
                  <InputGroup.Text
                    style={{
                      background: 'transparent',
                      borderRight: 'none',
                      color: '#6c757d'
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search posts…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderLeft: 'none',
                      boxShadow: 'none'
                    }}
                  />
                </InputGroup>
              </Col>
            </Row>

            {/* Error message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Discussion list */}
            <DiscussionList discussions={discussions} />

            {/* Empty state (when no posts match the filter) */}
            {sortedPosts.length === 0 && (
              <div className="text-center mt-5">
                <p className="text-secondary fs-5">No posts found.</p>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Forum;
