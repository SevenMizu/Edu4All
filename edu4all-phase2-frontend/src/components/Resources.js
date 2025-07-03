// src/components/Resources.jsx

import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchAllResources } from "../api/resourceApi";
import "./Resources.css";
import StickyNavbar from "./StickyNavbar";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllResources()
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load all resources:", err);
        setResources([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // filter by title, description, or subject
  const filtered = resources.filter((r) =>
    [r.title, r.description, r.subject]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <StickyNavbar />

      <Container className="py-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center vh-50">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading resources…</span>
            </Spinner>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <Row className="mb-4 justify-content-center">
              <Col xs={12} md={8} lg={6}>
                <InputGroup className="search-input-group">
                  <Form.Control
                    type="text"
                    placeholder="Search resources..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="shadow-sm search-input"
                  />
                  <InputGroup.Text className="bg-white border-start-0">
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>

            {filtered.length === 0 ? (
              <Row>
                <Col>
                  <p className="text-center text-muted">No resources found.</p>
                </Col>
              </Row>
            ) : (
              <Row className="g-4">
                {filtered.map((r) => (
                  <Col key={r.id} xs={12} md={6} lg={3}>
                    <Card className="h-100 resource-card">
                      <div className="resource-image-wrapper">
                        {r.coverPhotoUrl ? (
                          <Card.Img
                            variant="top"
                            src={`${
                              process.env.REACT_APP_API_URL ||
                              "http://localhost:8080"
                            }/uploads/${r.coverPhotoUrl}`}
                            alt={r.title}
                            className="resource-image"
                          />
                        ) : (
                          <div className="no-cover-placeholder">
                            No Cover
                          </div>
                        )}
                      </div>

                      <Card.Body className="d-flex flex-column p-3">
                        <Card.Title className="resource-title">{r.title}</Card.Title>
                        <Card.Text className="resource-desc flex-grow-1">
                          {r.description.length > 120
                            ? r.description.slice(0, 120) + "…"
                            : r.description}
                        </Card.Text>
                        <Link
                          to={`/dashboard/student/resources/${r.id}`}
                          className="btn resource-btn mt-3"
                        >
                          Read More
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
}
