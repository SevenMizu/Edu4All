// src/components/UploadResources.jsx
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import toastr from "toastr";

import { uploadResources } from "../api/resourceApi";
import StickyNavbar from '../components/StickyNavbar';

export default function UploadResources() {
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject]         = useState("");
  const [coverPhoto, setCoverPhoto]   = useState(null);
  const coverInputRef                 = useRef(null);
  const [files, setFiles]             = useState([]);
  const [submitting, setSubmitting]   = useState(false);

  const userId = parseInt(localStorage.getItem("userId") || "", 10);

  // Dropzone for resource files
  const onDrop = useCallback(accepted => {
    setFiles(curr => {
      const seen = new Set(curr.map(f => f.name + f.size));
      const next = [...curr];
      for (let f of accepted) {
        const key = f.name + f.size;
        if (!seen.has(key)) {
          seen.add(key);
          next.push(f);
        }
      }
      return next;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: true
  });

  const removeFile = idx => setFiles(curr => curr.filter((_, i) => i !== idx));

  // handle cover photo selection
  function onCoverChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverPhoto(file);
    } else {
      toastr.error("Please select a valid image file for the cover photo.");
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || files.length === 0) {
      toastr.error("Title, subject and at least one file are required.");
      return;
    }
    setSubmitting(true);
    try {
      // pass coverPhoto in the payload
      const uploaded = await uploadResources({ 
        title, 
        description, 
        subject, 
        userId, 
        coverPhoto, 
        files 
      });
      toastr.success(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? "s" : ""} successfully.`);
      // reset form state
      setTitle(""); 
      setDescription(""); 
      setSubject(""); 
      setCoverPhoto(null);
      setFiles([]);

      // **new**: clear the underlying file input element
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      toastr.error("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <StickyNavbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm" style={{ position: "relative", borderRadius: "0.75rem" }}>
              <div className="card-header text-center border-0">
                <h2 className="mb-1 mt-4">📚 Upload Resources</h2>
                <p className="text-muted mb-4">Add metadata and drop your files below</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          id="title"
                          type="text"
                          className="form-control"
                          placeholder="Title"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          required
                        />
                        <label htmlFor="title">Title</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          id="subject"
                          type="text"
                          className="form-control"
                          placeholder="Subject"
                          value={subject}
                          onChange={e => setSubject(e.target.value)}
                          required
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          id="description"
                          className="form-control"
                          placeholder="Description"
                          style={{ height: "100px" }}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                        />
                        <label htmlFor="description">Description (optional)</label>
                      </div>
                    </div>

                    {/* Cover Photo Picker */}
                    <div className="col-12">
                      <label htmlFor="coverPhoto" className="form-label">Cover Photo (optional)</label>
                      <input
                        id="coverPhoto"
                        type="file"
                        accept="image/*"
                        className="form-control mb-2"
                        onChange={onCoverChange}
                        ref={coverInputRef}
                      />
                      {coverPhoto && (
                        <img
                          src={URL.createObjectURL(coverPhoto)}
                          alt="Cover preview"
                          className="img-fluid rounded mb-3"
                          style={{ maxHeight: "200px" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Existing Drag & Drop zone */}
                  <div
                    {...getRootProps()}
                    className="border rounded text-center py-5 mb-3"
                    style={{
                      borderStyle: "dashed",
                      borderColor: "#6c757d",
                      backgroundColor: isDragActive ? "#e9ecef" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <input {...getInputProps()} />
                    <i className="bi bi-cloud-arrow-up" style={{ fontSize: "2rem", color: "#6c757d" }}/>
                    <p className="mt-2 mb-0 text-secondary">
                      {isDragActive
                        ? "Drop files here…"
                        : "Drag & drop resource files or click to browse"
                      }
                    </p>
                  </div>

                  {files.length > 0 && (
                    <ul className="list-group list-group-flush mb-4">
                      {files.map((f, i) => (
                        <li
                          key={i}
                          className="list-group-item d-flex align-items-center justify-content-between"
                        >
                          <div className="d-flex align-items-center">
                            <i className="bi bi-file-earmark-text me-2 text-secondary" />
                            <small className="text-truncate" style={{ maxWidth: "300px" }}>
                              {f.name}
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFile(i)}
                          >
                            <i className="bi bi-x-lg" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={submitting}
                    >
                      {submitting
                        ? <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"/>
                            Uploading…
                          </>
                        : "Upload All"
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
