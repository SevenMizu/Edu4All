// src/components/Resource.jsx

import { useEffect, useState } from "react";
import {
  Container,
  Spinner,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { fetchResource } from "../api/resourceApi";
import docIcon from "../resources/doc-icon.png";
import imageIcon from "../resources/image-icon.png";
import pdfIcon from "../resources/pdf-icon.png";
import pptIcon from "../resources/ppt-icon.png";
import StickyNavbar from "./StickyNavbar";

export default function Resource() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8080";

  useEffect(() => {
    fetchResource(+id)
      .then(r => setResource(r))
      .catch(err => {
        console.error("Failed to load resource:", err);
        setResource(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <StickyNavbar />
        <Container className="py-5 d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading…</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (!resource) {
    return (
      <>
        <StickyNavbar />
        <Container className="py-5 text-danger">
          Resource not found.
        </Container>
      </>
    );
  }

  const getIcon = ext => {
    if (ext === "pdf") return pdfIcon;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return imageIcon;
    if (["doc", "docx"].includes(ext)) return docIcon;
    if (["ppt", "pptx"].includes(ext)) return pptIcon;
    return imageIcon;
  };

  const handleReadClick = file => {
    const url = `${BACKEND}/uploads/${file}`;
    const ext = file.split(".").pop().toLowerCase();
    setIsPdf(ext === "pdf");
    setFileUrl(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFileUrl(null);
  };

  return (
    <>
      <StickyNavbar />
      <Container className="py-2">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2>{resource.title}</h2>
            <Link to="/dashboard/student/resources" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left-circle me-2"></i> Back
            </Link>
          </div>

          <div className="card-body">
            <h6 className="text-muted mb-3">Subject: {resource.subject}</h6>

            <div className="download-area mb-4">
              <h5>Files</h5>
              {resource.files.length > 0 ? (
                <ul className="list-unstyled">
                  {resource.files.map((f, idx) => {
                    const ext = f.split(".").pop().toLowerCase();
                    return (
                      <li key={idx} className="d-flex align-items-center mb-2">
                        <img
                          src={getIcon(ext)}
                          alt=""
                          width={24}
                          height={24}
                          className="me-2"
                        />
                        <span className="me-auto"></span>

                        <a
                          href={`${BACKEND}/uploads/download/${f}`}
                          className="btn btn-sm btn-outline-dark me-2"
                          title="Download"
                        >
                          <i className="bi bi-download"></i> Download
                        </a>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleReadClick(f)}
                          title="Read"
                        >
                          <i className="bi bi-eye"></i> READ ONLINE
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted">No files attached.</p>
              )}
            </div>

            {resource.coverPhotoUrl && (
              <img
                src={`${BACKEND}/uploads/${resource.coverPhotoUrl}`}
                alt={resource.title}
                className="float-start me-3 mb-3"
                style={{
                  width: 200,
                  height: 250,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            )}

            <p className="resource_desc">{resource.description}</p>
            <div style={{ clear: "both" }} />
          </div>
        </div>
      </Container>

      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 0,
            margin: 0,
            height: "100vh",
          }}
          id="pdfModal"
          tabIndex="-1"
          aria-labelledby="pdfModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content" style={{ border: "none", height: "100vh" }}>
              <div className="modal-body" style={{ padding: 0, height: "100%" }}>
                {isPdf ? (
                  <iframe
                    src={`/flipbook/full-area.html?pdfUrl=${encodeURIComponent(fileUrl)}`}
                    width="100%"
                    height="100%"
                    style={{ border: "none", display: "block", height: "100%" }}
                    title="Flipbook PDF Viewer"
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt="Resource"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>

              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  fontSize: "54px",
                  color: "red",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
