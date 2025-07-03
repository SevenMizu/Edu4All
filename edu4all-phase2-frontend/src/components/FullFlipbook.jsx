import { useEffect, useRef } from "react";

// Helper to load a script dynamically ONCE
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function FullFlipbook({ open, onClose,  pdfUrl}) {
  const containerRef = useRef(null);

  const v = "https://www.ekiaai.com/books/October2024_2024-10-01_6044041.pdf"

  useEffect(() => {
    if (!open || !pdfUrl) return;

    // Clean up container on close
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Dynamically create the full fb5 structure
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div id="fb5-ajax" data-cat="student_resources" data-template="true">
          <div class="fb5-bcg-book"></div>
          <div class="fb5-preloader"></div>
          <div class="fb5" id="fb5">
            <section id="config">
              <ul>
                <li key="page_width">918</li>
                <li key="page_height">1298</li>
                <li key="gotopage_width">25</li>
                <li key="zoom_double_click">1</li>
                <li key="zoom_step">0.1</li>
                <li key="toolbar_visible">true</li>
                <li key="tooltip_visible">true</li>
                <li key="deeplinking_enabled">true</li>
                <li key="lazy_loading_pages">false</li>
                <li key="lazy_loading_thumbs">false</li>
                <li key="double_click_enabled">true</li>
                <li key="rtl">false</li>
                <li key="pdf_url">${v}</li>
                <li key="pdf_scale">1</li>
                <li key="page_mode">double</li>
                <li key="sound_sheet">img/turning_page.mp3</li>
              </ul>
            </section>
            <a href="#" id="fb5-button-back">&lt; Back</a>
            <div id="fb5-container-book">
              <section id="fb5-deeplinking"><ul></ul></section>
              <section id="fb5-about"></section>
              <section id="links"></section>
              <div id="fb5-book"></div>
            </div>
            <div id="fb5-footer">
              <div class="fb5-bcg-tools"></div>
              <a id="fb5-logo" href="#"><img src="img/logo.png" alt="Logo"></a>
              <div class="fb5-menu" id="fb5-center"><ul></ul></div>
              <div class="fb5-menu" id="fb5-right"><ul>
                <li class="fb5-goto">
                  <label id="fb5-label-page-number" for="fb5-page-number"></label>
                  <input type="text" id="fb5-page-number" style="width:25px">
                  <span id="fb5-page-number-two"></span>
                </li>
              </ul></div>
            </div>
            <div id="fb5-all-pages" class="fb5-overlay">
              <section class="fb5-container-pages">
                <div id="fb5-menu-holder"><ul id="fb5-slider"></ul></div>
              </section>
            </div>
            <audio preload="auto" id="sound_sheet"></audio>
            <div id="fb5-close-lightbox"><i class="fa fa-times pull-right"></i></div>
          </div>
        </div>
      `;
    }

    // Dynamically load the CSS if not present
    if (!document.querySelector('link[href="/flipbook/css/style.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/flipbook/css/style.css";
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[href="https://fonts.googleapis.com/css?family=Play:400,700"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css?family=Play:400,700";
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[href="/flipbook/css/font-awesome.min.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/flipbook/css/font-awesome.min.css";
      document.head.appendChild(link);
    }

 Promise.resolve()
    .then(() => loadScriptOnce("/flipbook/js/jquery.js"))
    .then(() => loadScriptOnce("/flipbook/js/jquery_no_conflict.js"))
    .then(() => loadScriptOnce("/flipbook/js/turn.js"))
    .then(() => loadScriptOnce("/flipbook/js/wait.js"))
    .then(() => loadScriptOnce("/flipbook/js/jquery.mousewheel.js"))
    .then(() => loadScriptOnce("/flipbook/js/jquery.fullscreen.js"))
    .then(() => loadScriptOnce("/flipbook/js/jquery.address-1.6.min.js"))
    .then(() => loadScriptOnce("/flipbook/js/pdf.js"))
    .then(() => loadScriptOnce("/flipbook/js/onload.js"))
    .then(() => {
      // **Here’s the key:** bypass onload.js’s bad ready-handler
      console.log(window.Ajax_v5);
      if (
        window.Ajax_v5 &&
        typeof window.Ajax_v5.start_book_shortcode === "function"
      ) {
        window.Ajax_v5.start_book_shortcode();
      } else if (
        window.Ajax_v5 &&
        typeof window.Ajax_v5.start_book_lightbox === "function"
      ) {
        window.Ajax_v5.start_book_lightbox();
      } else {
        console.error("Flipbook: Ajax_v5 not found");
      }
    })
    .catch((e) => {
      console.error("Failed to load flipbook scripts", e);
    });

    // Optionally: cleanup on close (removes HTML, scripts will remain in browser, which is fine for SPA)
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [open, pdfUrl]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative", width: "80vw", height: "90vh", background: "#111",
          borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", right: 10, top: 10, zIndex: 10, fontSize: 24, color: "#fff",
            background: "none", border: "none", cursor: "pointer"
          }}
        >×</button>
        <div
          ref={containerRef}
          id="react-flipbook-container"
          style={{
            width: "100%",
            height: "100%",
            background: "#222",
            margin: "0 auto"
          }}
        ></div>
      </div>
    </div>
  );
}
