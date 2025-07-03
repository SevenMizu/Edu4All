// src/components/Support.jsx
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import StickyNavbar from '../components/StickyNavbar';
import coverPhoto from '../resources/cover-photo.jpg';

export default function Support() {
  return (
    <>
      <StickyNavbar />

      <div className="d-flex">
        {/* Left: Full-height, 40%-width cover photo */}
        <div
          style={{
            flex: '0 0 40%',
            height: '100vh',
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center left',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
          />
          <h1
            className="text-white text-center"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '2.5rem',
              fontWeight: '600',
            }}
          >
            Need Assistance?
          </h1>
        </div>

        {/* Right: Accordions (60% width) */}
        <div
          className="flex-grow-1 p-5"
          style={{ backgroundColor: '#f8f9fa', overflowY: 'auto', height: '100vh' }}
        >
          <div className="container">
            <h2 className="mb-4" style={{ fontWeight: '600' }}>
              Support Center
            </h2>
            <div className="card shadow-sm mb-5">
              <div className="card-body">
                <div className="accordion accordion-flush" id="supportAccordion">
                  {/* 1. How to? */}
                  <div className="accordion-item mb-3">
                    <h2 className="accordion-header" id="headingHow">
                      <button
                        className="accordion-button collapsed fs-5"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseHow"
                        aria-expanded="false"
                        aria-controls="collapseHow"
                      >
                        <i className="bi bi-lightbulb-fill me-2 text-warning"></i>
                        How to?
                      </button>
                    </h2>
                    <div
                      id="collapseHow"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingHow"
                      data-bs-parent="#supportAccordion"
                    >
                      <div className="accordion-body">
                        {/* Nested accordion for subtopics */}
                        <div className="accordion accordion-flush" id="howSubAccordion">
                          
                          {/* How to search online sessions */}
                          <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id="headingSearchSessions">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseSearchSessions"
                                aria-expanded="false"
                                aria-controls="collapseSearchSessions"
                              >
                                How to search online sessions
                              </button>
                            </h2>
                            <div
                              id="collapseSearchSessions"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingSearchSessions"
                              data-bs-parent="#howSubAccordion"
                            >
                              <div className="accordion-body">
                                <p>
                                  After logging in, navigate to the “Sessions” tab on the menubar.
                                  Use the search bar at the top of the page and enter keywords (e.g., subject name,
                                  mentor name, or grade level).
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* How to register for a session */}
                          <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id="headingRegisterSession">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseRegisterSession"
                                aria-expanded="false"
                                aria-controls="collapseRegisterSession"
                              >
                                How to register for a session
                              </button>
                            </h2>
                            <div
                              id="collapseRegisterSession"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingRegisterSession"
                              data-bs-parent="#howSubAccordion"
                            >
                              <div className="accordion-body">
                                <p>
                                  Once you find a session you’d like to join, press the “Register” button located below the session
                                  description. You’ll see the registered session in your “My Scheduled Sessions” card.
                              
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* How to join an online session */}
                          <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id="headingJoinSession">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseJoinSession"
                                aria-expanded="false"
                                aria-controls="collapseJoinSession"
                              >
                                How to join an online session
                              </button>
                            </h2>
                            <div
                              id="collapseJoinSession"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingJoinSession"
                              data-bs-parent="#howSubAccordion"
                            >
                              <div className="accordion-body">
                                <p>
                                  On the day of the session, go to your “My Scheduld Sessions” page. Click “Join Now” to launch the video interface. Make sure
                                  your camera and microphone are working. If prompted, grant
                                  permissions. The mentor and all participants will appear in a video
                                  grid.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* How to unregister from a session */}
                          <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id="headingUnregisterSession">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseUnregisterSession"
                                aria-expanded="false"
                                aria-controls="collapseUnregisterSession"
                              >
                                How to unregister from a session
                              </button>
                            </h2>
                            <div
                              id="collapseUnregisterSession"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingUnregisterSession"
                              data-bs-parent="#howSubAccordion"
                            >
                              <div className="accordion-body">
                                <p>
                                  If you can no longer attend, go to “My Scheduled Sessions” and find the session
                                  you want to leave. Click the “Unregister” button and Confirm when prompted.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* How to search educational content */}
                          <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id="headingSearchContent">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseSearchContent"
                                aria-expanded="false"
                                aria-controls="collapseSearchContent"
                              >
                                How to search educational content
                              </button>
                            </h2>
                            <div
                              id="collapseSearchContent"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingSearchContent"
                              data-bs-parent="#howSubAccordion"
                            >
                              <div className="accordion-body">
                                <p>
                                  Navigate to the “Resources” tab on the menubar. Use the search bar
                                  to type in keywords. Each resource card shows a brief
                                  description and a “READ MORE” link.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* How to download educational content */}
                          <div className="accordion-item mb-2">
                            <h2 className="accordion-header" id="headingDownloadContent">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseDownloadContent"
                                aria-expanded="false"
                                aria-controls="collapseDownloadContent"
                              >
                                How to download educational content
                              </button>
                            </h2>
                            <div
                              id="collapseDownloadContent"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingDownloadContent"
                              data-bs-parent="#howSubAccordion"
                            >
                              <div className="accordion-body">
                                <p>
                                  Within the “Resources” tab, locate the content you want. Each resource
                                  card has a READ MORE button and once you clicked you will be redirected to resource detail page.
                                  Click “Download” button
                                  and the file will save to your device’s default downloads folder. You
                                  can then open it offline anytime.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Report a problem / Technical Support */}
                  <div className="accordion-item mb-3">
                    <h2 className="accordion-header" id="headingReport">
                      <button
                        className="accordion-button collapsed fs-5"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseReport"
                        aria-expanded="false"
                        aria-controls="collapseReport"
                      >
                        <i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                        Technical Support
                      </button>
                    </h2>
                    <div
                      id="collapseReport"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingReport"
                      data-bs-parent="#supportAccordion"
                    >
                      <div className="accordion-body">
                        <p>
                          If you encounter any technical issues—whether you're having trouble
                          logging in, experiencing connectivity problems, or any other app
                          malfunction, please reach out to our support team. Send a detailed
                          description of the issue, along with screenshots if possible, to:
                        </p>
                        <p>
                          <a
                            href="mailto:support@edu4all.com"
                            className="fw-bold text-decoration-none"
                            style={{ color: '#2563eb' }}
                          >
                            support@edu4all.com
                          </a>
                        </p>
                        <p>
                          Our engineers and support specialists monitor this inbox throughout
                          business hours and will work with you to resolve the problem as
                          quickly as possible.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. FAQ */}
                  <div className="accordion-item mb-3">
                    <h2 className="accordion-header" id="headingFAQ">
                      <button
                        className="accordion-button collapsed fs-5"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFAQ"
                        aria-expanded="false"
                        aria-controls="collapseFAQ"
                      >
                        <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                        FAQ
                      </button>
                    </h2>
                    <div
                      id="collapseFAQ"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingFAQ"
                      data-bs-parent="#supportAccordion"
                    >
                      <div className="accordion-body">
                        <h6 className="fw-semibold">Q: Why does Edu4ALL focus on rural primary students?</h6>
                        <p>
                          A: Many rural communities lack reliable infrastructure, teacher resources,
                          and high-speed internet. By connecting university volunteers with these
                          students, we ensure access to quality education for underrepresented
                          learners, helping bridge the gap between rural and urban academic
                          achievement.
                        </p>

                        <h6 className="fw-semibold">Q: How is Edu4ALL different from other platforms?</h6>
                        <p>
                          A: Unlike some educational apps that assume high-speed connectivity,
                          Edu4ALL is optimized for low-bandwidth and offline use. Students can
                          download study notes, videos, and PDFs to access materials even without
                          reliable internet. Additionally, we solely connect rural students with
                          university mentors for real-time tutoring and culturally responsive
                          guidance.
                        </p>

                        <h6 className="fw-semibold">Q: What features support low-bandwidth environments?</h6>
                        <p>
                          A: Our platform compresses videos for smoother streaming, offers downloadable
                          PDFs, and includes an offline reading mode. All resources are formatted to
                          work on basic smartphones and slow connections. You can view or download
                          lessons directly from the “Resources” section.
                        </p>

                        <h6 className="fw-semibold">Q: How does Edu4ALL contribute to the UN’s SDGs?</h6>
                        <p>
                          A: By providing equitable access to quality primary education (SDG 4) and
                          reducing educational inequality between rural and urban students (SDG 10),
                          Edu4ALL helps uplift underrepresented communities. Our volunteer mentor
                          network and low-bandwidth design directly address these global targets.
                        </p>

                        <h6 className="fw-semibold">Q: What do I do if I can’t find a mentor for my subject?</h6>
                        <p>
                          A: If a specific subject isn’t available, check back regularly—new mentors
                          join weekly. You can also request a mentor by emailing
                          <a
                            href="mailto:support@edu4all.com"
                            className="text-decoration-none"
                            style={{ color: '#2563eb' }}
                          >
                            support@edu4all.com
                          </a>
                          ; we’ll prioritize matching a volunteer in that field.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. Video Tutorials */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingVideos">
                      <button
                        className="accordion-button collapsed fs-5"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseVideos"
                        aria-expanded="false"
                        aria-controls="collapseVideos"
                      >
                        <i className="bi bi-play-circle-fill me-2 text-success"></i>
                        Video Tutorials
                      </button>
                    </h2>
                    <div
                      id="collapseVideos"
                      className="accordion-collapse collapse"
                      aria-labelledby="headingVideos"
                      data-bs-parent="#supportAccordion"
                    >
                      <div className="accordion-body">
                        <div
                          className="d-flex flex-column align-items-center justify-content-center"
                          style={{ height: '200px' }}
                        >
                          <i className="bi bi-clock-history display-1 text-secondary mb-3" />
                          <p className="h5 text-secondary">Video tutorials coming soon</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* /.accordion-item */}
                </div>
                {/* /.accordion */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
