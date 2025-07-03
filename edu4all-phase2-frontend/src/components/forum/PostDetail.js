// src/components/forum/PostDetail.jsx

import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    ListGroup,
    Modal,
    Row,
    Spinner,
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import StickyNavbar from '../../components/StickyNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { forumService } from '../../services/forumService';
import CommentForm from './CommentForm';
import styles from './PostDetail.module.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // newest-first
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Modal state:
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deletingComment, setDeletingComment] = useState(false);

  const loadPostAndComments = useCallback(async () => {
    try {
      setLoadingPost(true);
      const [postResponse, commentsResponse] = await Promise.all([
        forumService.getPostById(id),
        forumService.getCommentsByPost(id),
      ]);
      setPost(postResponse.data);

      // Store comments newest-first
      const fetchedComments = commentsResponse.data.slice().reverse();
      setComments(fetchedComments);

      setError(null);
    } catch (err) {
      setError('Failed to load post. Please try again later.');
      console.error('Error loading post:', err);
    } finally {
      setLoadingPost(false);
    }
  }, [id]);

  useEffect(() => {
    loadPostAndComments();
  }, [id, loadPostAndComments]);

  const handleCommentSubmit = async (commentContent) => {
    setCommentSubmitting(true);
    try {
      const payload = {
        content: commentContent,
        post: { id: parseInt(id) },
      };
      const response = await forumService.createComment(payload);
      // Prepend new comment
      setComments((prev) => [response.data, ...prev]);
    } catch (err) {
      setError('Failed to post comment. Please try again later.');
      console.error('Error posting comment:', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Post deletion prompts and handlers
  const promptDeletePost = () => {
    setShowDeletePostModal(true);
  };
  const confirmDeletePost = async () => {
    setDeletingPost(true);
    try {
      await forumService.deletePost(id);
      navigate(`/dashboard/${user.type}/forum`);
    } catch (err) {
      setError('Failed to delete post. Please try again later.');
      console.error('Error deleting post:', err);
    } finally {
      setDeletingPost(false);
      setShowDeletePostModal(false);
    }
  };

  // Comment deletion prompts and handlers
  const promptDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteCommentModal(true);
  };
  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    setDeletingComment(true);
    try {
      await forumService.deleteComment(commentToDelete);
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
    } catch (err) {
      setError('Failed to delete comment. Please try again later.');
      console.error('Error deleting comment:', err);
    } finally {
      setDeletingComment(false);
      setShowDeleteCommentModal(false);
      setCommentToDelete(null);
    }
  };
  const cancelDeleteComment = () => {
    setShowDeleteCommentModal(false);
    setCommentToDelete(null);
  };

  if (loadingPost) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading post...</span>
        </Spinner>
      </div>
    );
  }

  if (!post) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="text-center">
          Post not found.
        </Alert>
      </Container>
    );
  }

  const isAuthor = user && post.userId === user.id;

  return (
    <>
      <StickyNavbar />

      <Container className="mt-4 mb-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* --- Post Card --- */}
        <Card className="shadow-sm mb-5">
          <Card.Header
            as="h5"
            className="d-flex justify-content-between align-items-center"
          >
            <span className="text-truncate">{post.title}</span>
            {isAuthor && (
              <div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`edit/${id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={promptDeletePost}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card.Header>

          <Card.Body className={styles.cardBody}>
            <div
              className={styles.postContent}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card.Body>

          <Card.Footer className="text-muted d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <div className={`${styles.avatarCircle} me-2`}>
                {post.username
                  ? post.username.charAt(0).toUpperCase()
                  : 'U'}
              </div>
              <div>
                <div>{post.username || 'Unknown'}</div>
                <div className="small">
                  Posted at{' '}
                  {format(
                    new Date(post.createdAt),
                    "hh:mm a 'on' MMM dd, yyyy"
                  )}
                </div>
              </div>
            </div>
            <Badge
              bg="secondary"
              style={{
                padding: '0.25em 0.5em',
                fontSize: '0.85rem',
                lineHeight: 1,
                height: 23
              }}
            >
              {comments.length} Comment{comments.length !== 1 ? 's' : ''}
            </Badge>
          </Card.Footer>
        </Card>

        {/* --- Comments + Form Side-by-Side --- */}
        <Row>
          {/* Left: Add Comment */}
          <Col md={4}>
            {user && (
              <CommentForm
                onSubmit={handleCommentSubmit}
                isSubmitting={commentSubmitting}
              />
            )}
          </Col>

          {/* Right: Existing Comments (Newest on Top) */}
          <Col md={8}>
            <h5 className="mb-3">Comments</h5>

            {comments.length === 0 && (
              <p className="text-muted">
                No comments yet. Be the first to comment!
              </p>
            )}

            <div className="bg-white rounded shadow-sm p-3 mb-4">
              <ListGroup variant="flush">
                {comments.map((comment) => (
                  <ListGroup.Item key={comment.id} className="px-0">
                    <Row className="align-items-start">
                      <Col xs="auto" className="pe-0">
                        <div className={styles.avatarCircle}>
                          {comment.username
                            ? comment.username.charAt(0).toUpperCase()
                            : 'U'}
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{comment.username || 'Unknown'}</strong>{' '}
                            <span className="text-muted small">
                              {format(
                                new Date(comment.createdAt),
                                "MMM dd, yyyy 'at' hh:mm a"
                              )}
                            </span>
                          </div>
                          {user && comment.userId === user.id && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => promptDeleteComment(comment.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                        <div
                          className="bg-light rounded mt-2"
                          style={{
                            padding: '1rem',
                            whiteSpace: 'pre-line',
                          }}
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>

      {/* --- Delete Post Confirmation Modal --- */}
      <Modal
        show={showDeletePostModal}
        onHide={() => setShowDeletePostModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeletePostModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeletePost}
            disabled={deletingPost}
          >
            {deletingPost && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            Delete Post
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Delete Comment Confirmation Modal --- */}
      <Modal
        show={showDeleteCommentModal}
        onHide={cancelDeleteComment}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteComment} disabled={deletingComment}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeleteComment}
            disabled={deletingComment}
          >
            {deletingComment && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            Delete Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostDetail;
