import { useEffect, useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';

export default function CommentForm({ onSubmit, isSubmitting }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);

  // Whenever `isSubmitting` goes from true → false, clear the textarea
  useEffect(() => {
    if (!isSubmitting) {
      setValue('');
    }
  }, [isSubmitting]);

  const handleSubmit = (e) => {
    e.preventDefault(); // just in case, to block any default
    if (!value.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    setError(null);
    onSubmit(value.trim());
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Form>
          {error && (
            <div className="alert alert-danger py-1 px-2 mb-3">{error}</div>
          )}
          <Form.Group controlId="commentContent" className="mb-3">
            <Form.Label className="fw-bold">Add a Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your comment here..."
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              className="border-secondary"
              disabled={isSubmitting}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              type="button"
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
              )}
              Add Comment
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
