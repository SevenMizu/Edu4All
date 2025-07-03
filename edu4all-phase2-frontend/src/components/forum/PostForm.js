// Ensure you have these installed:
// npm install react-draft-wysiwyg draft-js html-to-draftjs draftjs-to-html

import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import StickyNavbar from '../../components/StickyNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { forumService } from '../../services/forumService';

// Draft-WYSIWYG + Draft-JS imports
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';

// Make sure you import the Draft-WYSIWYG CSS once (e.g. in index.js or App.js):
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const PostForm = () => {
  const { id } = useParams();            // post ID if editing
  const navigate = useNavigate();
  const { user } = useAuth();            // { id, username, type, … }

  // Local state
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [loading, setLoading] = useState(false); // for network calls
  const [error, setError] = useState(null);      // error message
  const isEditing = Boolean(id);

  // Path back to the correct forum (student vs. mentor)
  const forumPath = `/dashboard/${user.type}/forum`;

  // 1) Load existing post if editing
  const loadPost = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getPostById(id);
      const post = response.data;

      // If the current user isn’t the author, redirect away
      if (post.userId !== user.id) {
        navigate(forumPath, { replace: true });
        return;
      }

      // Populate title
      setTitle(post.title);

      // Convert stored HTML (post.content) into EditorState
      const html = post.content || '';
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Unable to load the post. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id, user.id, navigate, forumPath]);

  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id, isEditing, loadPost]);

  // 2) Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Convert EditorState back to HTML
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState).trim();
    // Strip out HTML tags to check for any plain text:
    const plainText = htmlContent.replace(/<[^>]*>/g, '').trim();

    if (!title.trim() || !plainText) {
      setError('Both title and content are required.');
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: title.trim(),
        content: htmlContent, // send the full HTML (with <span style="color:..."> etc.)
        userId: user.id,
        username: user.username,
      };

      if (isEditing) {
        await forumService.updatePost(id, postData);
      } else {
        await forumService.createPost(postData);
      }

      // Navigate back to forum on success
      navigate(forumPath);
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3) While fetching an existing post for editing, show full-screen spinner
  if (loading && isEditing && editorState.getCurrentContent().getPlainText() === '') {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading post...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <StickyNavbar />

      {/* Glass‐style wrapper */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container
          className="mt-4"
          style={{
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '1000px',
          }}
        >
          <h2 className="mb-3">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>

          {error && (
            <Alert
              variant="danger"
              onClose={() => setError(null)}
              dismissible
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Title Field */}
            <Form.Group controlId="postTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                disabled={loading}
                required
              />
            </Form.Group>

            {/* Content Field using react-draft-wysiwyg */}
            <Form.Group controlId="postContent" className="mb-4">
              <Form.Label>Content</Form.Label>
              <div
                style={{
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  minHeight: '300px',
                  overflow: 'hidden',
                }}
              >
                <Editor
                  editorState={editorState}
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  toolbarClassName="toolbarClassName"
                  onEditorStateChange={setEditorState}
                  toolbar={{
                    options: [
                      'inline',
                      'blockType',
                      'fontSize',
                      'fontFamily',
                      'list',
                      'textAlign',
                      'colorPicker',
                      'link',
                      'image',
                      'emoji',
                      'history',
                    ],
                    inline: {
                      options: [
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'superscript',
                        'subscript',
                      ],
                    },
                    colorPicker: {
                      colors: [
                        'rgb(97,189,109)',
                        'rgb(26,188,156)',
                        'rgb(84,172,210)',
                        'rgb(44,130,201)',
                        'rgb(147,101,184)',
                        'rgb(71,85,119)',
                        'rgb(204,204,204)',
                        'rgb(65,168,95)',
                        'rgb(0,168,133)',
                        'rgb(61,142,185)',
                        'rgb(41,105,176)',
                        'rgb(85,57,130)',
                        'rgb(40,50,78)',
                        'rgb(0,0,0)',
                        'rgb(247,218,100)',
                        'rgb(251,160,38)',
                        'rgb(235,107,86)',
                        'rgb(226,80,65)',
                        'rgb(163,143,132)',
                        'rgb(239,239,239)',
                        'rgb(255,255,255)',
                        'rgb(250,197,28)',
                        'rgb(243,121,52)',
                        'rgb(209,72,65)',
                        'rgb(184,49,47)',
                        'rgb(124,112,107)',
                        'rgb(209,213,216)',
                      ],
                    },
                    list: {
                      options: ['unordered', 'ordered'],
                    },
                    textAlign: {
                      options: ['left', 'center', 'right', 'justify'],
                    },
                    link: {
                      defaultTargetOption: '_blank',
                    },
                    image: {
                      uploadEnabled: true,
                      uploadCallback: (file) =>
                        new Promise((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            resolve({ data: { link: e.target.result } });
                          };
                          reader.onerror = (err) => {
                            reject(err);
                          };
                          reader.readAsDataURL(file);
                        }),
                      previewImage: true,
                      alt: { present: false, mandatory: false },
                      defaultSize: {
                        height: 'auto',
                        width: '100%',
                      },
                    },
                  }}
                  readOnly={loading}
                />
              </div>
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading}>
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
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Post' : 'Create Post'
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate(forumPath)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default PostForm;
