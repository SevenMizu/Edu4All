// src/components/ManageResources.jsx
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import apiClient from "../api/apiClient";
import {
  deleteResource,
  updateResource
} from "../api/resourceApi";
import StickyNavbar from '../components/StickyNavbar';

// icons in src/resources
import docIcon from "../resources/doc-icon.png";
import imageIcon from "../resources/image-icon.png";
import pdfIcon from "../resources/pdf-icon.png";
import pptIcon from "../resources/ppt-icon.png";

function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  // if we found a space, cut there; otherwise just use the slice
  const trimmed = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
  return trimmed + "....";
}


export default function ManageResources() {
  // --- State ---

  const [search,        setSearch]        = useState("");

  // file-view modal
  const [showModal,     setShowModal]     = useState(false);
  const [modalUrl,      setModalUrl]      = useState("");
  const [modalExt,      setModalExt]      = useState("");

  // edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMeta,      setEditMeta]      = useState({
    id: null, title: "", description: "", subject: ""
  });
  const [existingCover, setExistingCover] = useState("");   // filename or URL
  const [removedCover,  setRemovedCover]  = useState(false);
  const [newCover,      setNewCover]      = useState(null); // File
  const [existingFiles, setExistingFiles] = useState([]);   // strings
  const [removedFiles,  setRemovedFiles]  = useState([]);   // filenames
  const [newFiles,      setNewFiles]      = useState([]);   // File[]

  // delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget,    setDeleteTarget]    = useState(null);
  const [isDeleting,      setIsDeleting]      = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const userId  = parseInt(localStorage.getItem("userId") || "0", 10);
  const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8080";

// --- State (hydrate from cache synchronously) ---
const cacheKey     = `resources:${userId}`;
const tsKey        = `resourcesLastModified:${userId}`;
const initialCache = localStorage.getItem(cacheKey);

const [resources, setResources] = useState(
  initialCache ? JSON.parse(initialCache) : []
);
// only show the spinner if there’s nothing in cache
const [loading,   setLoading]   = useState(
  initialCache ? false : true
);

// --- Background revalidation using lastModified (stale-while-revalidate) ---
useEffect(() => {
  async function revalidate() {
    try {
      // 1) our last seen timestamp
      const localMillis = parseInt(localStorage.getItem(tsKey) || "0", 10);

      // 2) fetch server’s current lastModified (always UTC ISO)
      const { data: serverIso } = await apiClient.get(
        `/resources/lastModified?userid=${userId}`
      );
      const serverMillis = new Date(serverIso).getTime();

      // 3) if unchanged, bail out (UI stays on cached data)
      if (serverMillis === localMillis) return;

      // 4) otherwise fetch fresh resources
      const res = await apiClient.get(`/resources?userid=${userId}`);
      const fresh = Array.isArray(res.data)
        ? res.data.map(r => ({ ...r, files: Array.isArray(r.files) ? r.files : [] }))
        : [];

      // 5) update state, cache, and timestamp
      setResources(fresh);
      localStorage.setItem(cacheKey, JSON.stringify(fresh));
      localStorage.setItem(tsKey,    String(serverMillis));
    } catch (err) {
      console.error("Revalidation failed:", err);
    }
  }

  revalidate();
}, [userId]);  // note: we never flip `loading` here

  // --- Helpers ---
  function getIcon(ext) {
    if (ext === "pdf") return pdfIcon;
    if (["jpg","jpeg","png","gif"].includes(ext)) return imageIcon;
    if (["doc","docx"].includes(ext)) return docIcon;
    if (["ppt","pptx"].includes(ext)) return pptIcon;
    return imageIcon;
  }
  function openModal(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    setModalUrl(`${BACKEND}/uploads/${filename}`);
    setModalExt(ext);
    setShowModal(true);
  }

  function openEdit(r) {
    setEditMeta({
      id:          r.id,
      title:       r.title,
      description: r.description,
      subject:     r.subject
    });
    setExistingCover(r.cover || r.coverPhotoUrl || ""); // adjust field name
    setRemovedCover(false);
    setNewCover(null);
    setExistingFiles([...r.files]);
    setRemovedFiles([]);
    setNewFiles([]);
    setShowEditModal(true);
  }

  function removeExisting(idx) {
    const fn = existingFiles[idx];
    setExistingFiles(prev => prev.filter((_,i)=>i!==idx));
    setRemovedFiles(prev => [...prev, fn]);
  }
  function removeNew(idx) {
    setNewFiles(prev => prev.filter((_,i)=>i!==idx));
  }

  function onEditChange(field, val) {
    setEditMeta(prev => ({ ...prev, [field]: val }));
  }

  // Dropzone for new resource files
  const onDrop = useCallback(acceptedFiles => {
    setNewFiles(curr => {
      const seen = new Set(curr.map(f=>f.name+f.size));
      const next = [...curr];
      for (let f of acceptedFiles) {
        const key = f.name+f.size;
        if (!seen.has(key)) {
          seen.add(key);
          next.push(f);
        }
      }
      return next;
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  // handle cover‐photo selection
  function onCoverChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewCover(file);
      setRemovedCover(true);
    }
  }
  function removeCover() {
    setExistingCover("");
    setNewCover(null);
    setRemovedCover(true);
  }

  // Save edits
  async function saveEdit() {
    setIsSaving(true);
    try {
      await updateResource({
        id:            editMeta.id,
        title:         editMeta.title,
        description:   editMeta.description,
        subject:       editMeta.subject,
        removedFiles,
        newFiles,
        // cover‐related payload:
        removedCover,
        coverPhoto: newCover
      });
      // reload
      const res = await apiClient.get(`/resources?userid=${userId}`);
      setResources(Array.isArray(res.data) ? res.data : []);
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  // Delete flow
  function promptDelete(id) {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  }
  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await deleteResource(deleteTarget);
      setResources(rs => rs.filter(r => r.id !== deleteTarget));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete resource.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (loading) return <div className="container py-5">Loading…</div>;

  // Filter list
  const filtered = resources.filter(r =>
    [r.title, r.description, r.subject].join(" ")
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <StickyNavbar/>

      <div className="container my-5">
        <div className="card shadow-sm rounded">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Manage Resources</h3>
              <input
                type="text"
                className="form-control w-auto resource-search"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-center text-muted">No matching resources.</p>
            ) : (
              <div className="table-responsive glass-table">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="text-center">
                    <tr>
                      <th>ID</th>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Subject</th>
                      <th>Files</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id}>
                        <td className="text-center">{r.id}</td>
                        <td>
                          {r.cover || r.coverPhotoUrl ? (
                            <img
                              src={`${BACKEND}/uploads/${r.cover || r.coverPhotoUrl}`}
                              alt="cover"
                              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                            />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{r.title}</td>
                        <td width={400} style={{textAlign: "justify"}}>{truncateText(r.description, 500)}</td>
                        <td>{r.subject}</td>
                        <td>
                          {r.files.length > 0 ? r.files.map((f,i) => {
                            const ext = f.split(".").pop().toLowerCase();
                            return (
                              <img
                                key={i}
                                src={getIcon(ext)}
                                alt={f}
                                title={f}
                                onClick={()=>openModal(f)}
                                className={`file-icon file-icon-${ext}`}
                                style={{ cursor:"pointer", marginRight:6 }}
                              />
                            );
                          }) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={()=>openEdit(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={()=>promptDelete(r.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File‐view Modal */}
      {showModal && (
        <div
          onClick={()=>setShowModal(false)}
          style={{
            position:"fixed", top:0,left:0,right:0,bottom:0,
            backgroundColor:"rgba(0,0,0,0.5)", zIndex:9999,
            display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              position:"relative", background:"#fff", borderRadius:"0.5rem",
              maxWidth:"90%", maxHeight:"90%", width:"80%", height:"80%",
              overflow:"auto", padding:"1rem"
            }}
          >
            <button
              onClick={()=>setShowModal(false)}
              style={{
                position:"absolute", top:"0.5rem", right:"0.5rem",
                background:"none", border:"none", fontSize:"1.5rem",
                cursor:"pointer"
              }}>×</button>

            {modalExt === "pdf" && (
              <embed src={modalUrl} type="application/pdf" style={{ width:"100%", height:"100%" }} />
            )}
            {["jpg","jpeg","png","gif"].includes(modalExt) && (
              <img src={modalUrl} alt="" style={{ maxWidth:"100%", maxHeight:"100%" }} />
            )}
            {["doc","docx","ppt","pptx"].includes(modalExt) && (
              <iframe src={modalUrl}
                      title="Document"
                      style={{ width:"100%", height:"100%", border:"none" }} />
            )}
          </div>
        </div>
      )}

      {/* EDIT Modal */}
      {showEditModal && (
        <div
          onClick={()=>setShowEditModal(false)}
          style={{
            position:"fixed", top:0,left:0,right:0,bottom:0,
            backgroundColor:"rgba(0,0,0,0.5)", zIndex:9999,
            display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            className="card p-4"
            style={{
              width:"450px", borderRadius:"0.5rem",
              maxHeight:"90vh", overflowY:"auto"
            }}
          >
            <h5 className="mb-3">Edit Resource #{editMeta.id}</h5>

            {/* Title */}
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={editMeta.title}
                onChange={e=>onEditChange("title", e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={editMeta.description}
                onChange={e=>onEditChange("description", e.target.value)}
              />
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                value={editMeta.subject}
                onChange={e=>onEditChange("subject", e.target.value)}
              />
            </div>

            {/* Cover Photo */}
            <div className="mb-3">
              <label className="form-label">Cover Photo</label>
              {existingCover && !removedCover ? (
                <div className="d-flex align-items-center mb-2" style={{ gap:"0.5rem" }}>
                  <img
                    src={`${BACKEND}/uploads/${existingCover}`}
                    alt="cover"
                    style={{ width:60, height:60, objectFit:"cover", borderRadius:4 }}
                  />
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={removeCover}
                    disabled={isSaving}
                  >
                    Remove
                  </button>
                </div>
              ) : null}
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={onCoverChange}
                disabled={isSaving}
              />
              {newCover && (
                <img
                  src={URL.createObjectURL(newCover)}
                  alt="new cover preview"
                  style={{ width:60, height:60, objectFit:"cover", marginTop:8, borderRadius:4 }}
                />
              )}
            </div>

            {/* Existing Files */}
            <div className="mb-3">
              <label className="form-label">Existing Files</label>
              {existingFiles.length > 0 ? (
                existingFiles.map((f,idx) => (
                  <div key={idx} className="d-flex align-items-center mb-2" style={{gap:"0.5rem"}}>
                    <i className="bi bi-file-earmark-text fs-5"/>
                    <div style={{flex:1, wordBreak:"break-all", overflow:"hidden"}} title={f}>
                      {f}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={()=>removeExisting(idx)}
                      disabled={isSaving}
                    >Remove</button>
                  </div>
                ))
              ) : (
                <p className="text-muted small mb-0">No files currently</p>
              )}
            </div>

            {/* Add New Files */}
            <div className="mb-4">
              <label className="form-label">Add New Files</label>
              <div
                {...getRootProps()}
                className="border rounded text-center py-4 mb-2"
                style={{
                  borderStyle:"dashed",
                  borderColor:"#6c757d",
                  backgroundColor:isDragActive?"#e9ecef":"transparent",
                  cursor:"pointer"
                }}
              >
                <input {...getInputProps()}/>
                <i className="bi bi-cloud-arrow-up" style={{fontSize:"2rem",color:"#6c757d"}}/>
                <p className="mt-2 mb-0 text-secondary">
                  {isDragActive ? "Drop files here…" : "Drag & drop files or click to browse"}
                </p>
              </div>
              {newFiles.length > 0 && (
                <ul className="list-group list-group-flush mb-3">
                  {newFiles.map((f,i) => (
                    <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-file-earmark-text me-2 text-secondary"/>
                        <small className="text-truncate" style={{maxWidth:"250px"}}>{f.name}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={()=>removeNew(i)}
                        disabled={isSaving}
                      ><i className="bi bi-x-lg"/></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions */}
            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={()=>setShowEditModal(false)}
                disabled={isSaving}
              >Cancel</button>
              <button
                className="btn btn-primary"
                onClick={saveEdit}
                disabled={isSaving}
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE Confirmation Modal */}
      {showDeleteModal && (
        <div
          onClick={()=>setShowDeleteModal(false)}
          style={{
            position:"fixed", top:0,left:0,right:0,bottom:0,
            backgroundColor:"rgba(0,0,0,0.5)", zIndex:9999,
            display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            className="card p-4 text-center"
            style={{ width: "320px", borderRadius: "0.5rem" }}
          >
            <h5 className="mb-3">Confirm Deletion</h5>
            <p>Are you sure you want to delete resource #{deleteTarget}?</p>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-secondary"
                onClick={()=>setShowDeleteModal(false)}
                disabled={isDeleting}
              >Cancel</button>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
