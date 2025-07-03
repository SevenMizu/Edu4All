// src/components/LegacyArolax.jsx

import hero from "../resources/hero.webp";
import logo from "../resources/logo.png";
import sdgs from "../resources/sdgs.png";

import about from "../resources/about-sample.jpg";
import sdgs10 from "../resources/sdgs-10.png";
import sdgs4 from "../resources/sdgs-4.png";

const Home = () => {
  const html = `
<!DOCTYPE html>
<html lang="en">


<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Edu4ALL">

  <title>Edu4ALL</title>

  <!-- Fav Icon -->
  <link rel="icon" type="image/x-icon" href="https://crowdytheme.com/html/arolax/assets/imgs/logo/favicon.png">

  <style>
@import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Jim+Nightshade&display=swap');


footer p {
  color: #ccc !important;
}

.wc-btn-primary {
    padding: 19px 28px;
    background-color: #fff !important;
    border-color: rgba(0, 0, 0, 1) !important;
    color: #000 !important;
}


/* --------------------------------------- */
/* Top section (.wrapper + children)       */
/* --------------------------------------- */
.wrapper {
  display: flex;
  justify-content: space-between;   
  align-items: flex-start;
  
  width: 100%;                 
  max-width: 1080px;              
  margin: 0 auto;                  
  padding: 0 2vw;                 
  box-sizing: border-box;
  margin-top: 15px;
  min-height: 80vh;
  margin-bottom: 0cqi;
}

.left {
  flex: 1;
  padding-right: 1vw;
  max-width: 600px;
  margin-top: 220px; 
  margin-right: 50px;
}

.heading {
  font-size: 2.4rem;
  font-weight: 700;
  color: #181818;
  letter-spacing: 0.5px;
  margin-bottom: 1.2rem;
}

.text {
  font-size: 1.15rem;
  color: #222;
  line-height: 1.7;
  max-width: 480px;
  text-align: justify;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 700px;
  margin-top: 200px;
}

.image {
  width: 100%;         
  max-width: 600px;
  min-width: 320px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  display: block;
  margin-bottom: 10px;
}

/* --------------------------------------- */
/* Feature section with Flexbox            */
/* --------------------------------------- */
.featuresWrapper {
  display: flex;
  justify-content: space-between; 
  align-items: stretch;
  gap: 20px;

  width: 100%;
  max-width: 1080px;   
  margin: 0 auto;
  padding: 0 2vw;         
  box-sizing: border-box;
  margin-top: -40px;
  margin-bottom: 60px;
}

.featureBox {
  flex: 0 0 300px;         
  min-height: 220px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  padding: 32px 24px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.featureTitle {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #1a3a6b;
  text-align: center; 
  width: 100%; 
}

.featureText {
  font-size: 1.05rem;
  color: #333;
  line-height: 1.7;
  text-align: justify;
}

.featureIcon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* --------------------------------------- */
/* Responsive adjustments                  */
/* --------------------------------------- */
@media (max-width: 900px) {
  .wrapper {
    flex-direction: column;
    padding: 4vw 2vw;
  }
  .left,
  .right {
    max-width: 100%;
    padding: 0;
  }
  .image {
    margin-top: 2rem;
    width: 100%;
    max-width: none;
    min-width: 0;
  }

  .featuresWrapper {
    flex-direction: column;
    gap: 24px;
    padding: 0 1vw;
  }
  .featureBox {
    width: 100%;
    min-width: 0;
  }
}



@media (max-width: 600px) {
  .container {
    padding: 0 4vw;
  }
  .infoSection {
    flex-direction: column;
    gap: 12px;
  }
}

.contactBoxes {
  display: flex;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
  margin-top: 80px;
  align-items: center;
  margin-bottom: 64px;
}

.contactBox {
  flex: 1 1 0;
  min-width: 0;
  max-width: 500px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 28px 20px 20px 20px;
  text-align: center;
}

.boxTitle {
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a1a1a;
  text-align: left;
  width: 100%; 
}

.boxDesc {
  font-size: 2.5rem;
  color: #555;
  margin-bottom: 8px;
  text-align: justify;
}

.boxEmail {
  color: #2a7ae4;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.05rem;
  word-break: break-all;
}

.boxEmail:hover {
  text-decoration: underline;
  color: #174ea6;
}

.boxContent {
  text-align: left;
  font-size: 1.4rem;
  color: #333;
  line-height: 1.7;
}

.boxContent p {
  margin: 0 0 12px 0;
}

.boxContent ul {
  margin: 0 0 12px 18px;
  padding: 0;
}

.boxContent li {
  margin-bottom: 6px;
  font-weight: 600;
}

.emailCode {
  display: inline-block;
  background: #f4f6f8;
  color: #2563eb;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  font-size: 1.08rem;
  border-radius: 6px;
  padding: 4px 10px;
  margin-top: 4px;
  word-break: break-all;
}

@media (max-width: 1100px) {
  .contactBoxes {
    flex-direction: column;
    gap: 18px;
    align-items: center;
    flex-wrap: wrap;
  }
  .contactBox {
    width: 100%;
    max-width: 420px;
  }
}

.cardBox {
  margin-top: 48px;
  background: #3a536b;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.cardImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.cardContent {
  background: #fff;
  padding: 32px 28px 24px 28px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
}

.cardTitle {
  color: #2a3a5e;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: left;
} 

#contact {
      padding-top: 60px;
      padding-bottom: 60px;

    }
    .footer-area-inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 40px;
      color: #fff;
    }
    .footer-widget-wrapper {
      line-height: 1.6;
    }
    /* Logo / Info */
    .footer-logo span {
      font-size: 56px;
      font-weight: 700;
      color: #fff;
      display: block;
      margin-bottom: 12px;
    }
    .footer-info-text {
      margin: 0;
      font-size: 1rem;
      color: #ccc;
    }

    /* Cards container: force a horizontal row */
    .cards-container {
      display: flex;
      gap: 24px;
      justify-content: flex-start;
      /* remove wrapping so they're always side by side */
      flex-wrap: nowrap;
    }
    .card {
      flex: 1 1 0;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      color: #333;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease;
      min-width: 320px; /* ensure a minimum width */
    }
    .card:hover {
      transform: translateY(-4px);
    }
    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }
    .card-content {
      padding: 24px;
      flex: 1;
    }
    .card-title {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1.625rem;
      line-height: 1.2;
      color: #2C7BFF;
    }
    .box-content p {
      margin-bottom: 12px;
      font-size: 1rem;
      color: #555;
    }
    .box-content ul {
      margin-left: 20px;
      margin-bottom: 16px;
      color: #555;
      font-size: 0.975rem;
      line-height: 1.4;
    }
    .box-content ul li {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
    .box-content ul svg {
      margin-right: 10px;
      min-width: 20px;
      min-height: 20px;
    }
    .email-code {
      display: inline-block;
      background: #f5f5f5;
      padding: 6px 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.975rem;
      color: #333;
      text-decoration: none;
      margin-top: 8px;
    }

    /* Adjustments for “Need help with the app?” card */
    .card--support .card-title {
      color: #2C7BFF;
    }

    /* Copyright area */
    .copyright-area {
      margin-top: 48px;
    }
    .copyright-area-inner {
      text-align: center;
    }
    .copyright-area-inner p {
      margin: 0;
      font-size: 0.9rem;
      color: #ccc;
    }
    .copyright-area-inner a {
      color: #fff;
      text-decoration: underline;
      font-weight: 500;
    }

    /* On very small screens, allow horizontal scrolling */
    @media (max-width: 800px) {
      .cards-container {
        overflow-x: auto;
        padding-bottom: 8px;
      }
      .card {
        /* keep the same min-width so they remain side by side */
        flex: 0 0 320px;
      }
    }

  </style>




  <!-- All CSS files -->

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-ZK6YaQr/qwA8sXYOQoC6jYabB3KlHxA7WqA2BoWWelMuXLHAtK3TjvdzZ6tG0l9K5HApHRCZCGvDx8uHFY0+KQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/all.min.css">
  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/swiper-bundle.min.css">
  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/progressbar.css">
  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/meanmenu.min.css">
  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/magnific-popup.css">
  <link rel="stylesheet" href="https://crowdytheme.com/html/arolax/assets/css/master-ai-agency.css">


</head>


<body class="font-heading-instumentsans-medium">

  <!-- Preloader -->
  <div id="preloader">
    <div id="container" class="container-preloader">
      <div class="animation-preloader">
        <div class="spinner"></div>
        <div class="txt-loading">
          <span data-text="E" class="characters">E</span>
          <span data-text="D" class="characters">D</span>
          <span data-text="U" class="characters">U</span>
          <span data-text="4" class="characters">4</span>
          <span data-text="A" class="characters">A</span>
          <span data-text="L" class="characters">L</span>
          <span data-text="L" class="characters">L</span>
        </div>
      </div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
    </div>
  </div>

  <!-- Cursor Animation -->
  <div class="cursor1"></div>
  <div class="cursor2"></div>

  <!-- Sroll to top -->
  <div class="progress-wrap">
    <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
      <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"></path>
    </svg>
  </div>


  <!-- search modal start -->
  <div class="modal fade" id="search-template" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="search-template" aria-hidden="true">
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <form action="#" class="form-search">
            <input type="text" placeholder="Search">
            <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- search modal end -->

  <!-- Header area start -->
  <header class="header-area">
    <div class="container large">
      <div class="header-area__inner">
        <div class="header__logo">
          <a href="#">
   
            <span style="font-size:30px;font-weight:bold; color:#000">EDU4ALL</span>
          </a>
        </div>
        <div class="header__nav pos-center">
          <nav class="main-menu">
            <ul>
              <li>
                <a href="#">Home</a>
               
              </li>
              <li>
<a href="#" onclick="scrollToWhatWeDo(); return false;">What we do?</a>
</li>
              <li>
<a href="#" onclick="scrollToSDGS(); return false;">SDGS</a>
               
              </li>

              <li><a href="" onclick="scrollToContact(); return false;">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div class="header__button">
          <a href="/login" target="_parent" class="wc-btn wc-btn-primary">Login</a>
        </div>
        <div class="header__navicon d-xl-none">
          <button onclick="showCanvas3()" class="open-offcanvas">
            <i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </div>
  </header>
  <!-- Header area end -->

  <div class="has-smooth" id="has_smooth"></div>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <div class="body-wrapper body-ai-agency">

        <!-- overlay switcher close  -->
        <div class="overlay-switcher-close"></div>

        <main>

          <!-- hero area start  -->
          <div class="container large">
            <section class="hero-area">
              <div class="container">
                <div class="hero-area-inner">
                  <div class="shape-1">
                    <img class="show-light" src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-74.webp" alt="image">
                    <img class="show-dark" src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-74-light.webp" alt="image">
                  </div>
                  <div class="section-header">
                    <div class="customer-wrapper-box">
                      <div class="customer-wrapper">
                        <div class="thumb img_anim_reveal">
                          <img class="show-light" src="${logo}" alt="image" width="300">
                          <img class="show-dark" src="${logo}" alt="image" width="300">
                        </div>
                        <p class="text has_fade_anim" data-fade-from="left"><span class="text-underline">  
                            250M+</span> kids worldwide are still missing out on a proper education.</p>
                      </div>
                    </div>
                    <div class="section-title-wrapper">
                      <div class="title-wrapper">
                        <h2 class="section-title has_fade_anim" data-fade-from="left" data-duration="0.75"
                          data-delay="0.30" style="font-family: 'Fredericka the Great', serif;">Our Goal is delivering equal education.</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="section-content">
                <div class="info-box">
                  <div class="thumb has_fade_anim" data-fade-from="left" data-duration="0.75" data-delay="0.60">
                    <span style="font-family: 'Fredericka the Great', serif;color: #000;font-size:60px">Edu4All</span>
                  </div>
                  <div class="text-wrapper has_fade_anim" data-fade-from="left" data-duration="0.75" data-delay="0.60">
                    <p class="text" style="font-family: 'Fredericka the Great', serif;
">Every child deserves access to quality education, no matter where they are born. Delivering equal education means breaking barriers like poverty, gender, and geography, so that all children have the same chance to learn, grow, and build a better future.
                    </p>
                  </div>
                  <div class="btn-wrapper has_fade_anim" data-fade-from="left" data-duration="0.75" data-delay="0.60"
                    data-on-scroll="0">
                    <a href="/register" target="_parent"  class="wc-btn wc-btn-primary btn-text-flip ai-fill-btn"> <span
                        data-text="Join Now">Join Now</span></a>
                  </div>
                </div>
                <div class="feature-content">
                  <div class="bg cf_image overflow-hidden">
                    <img src="${hero}" data-speed="0.9" alt="image">
                  </div>
                  <div class="feature-list-wrapper">
                    <div class="feature-list">
                      <div class="feature-list-item">
                        <span class="icon">
                          <img src="https://crowdytheme.com/html/arolax/assets/imgs/icon/check-3.webp" alt="icon image">
                        </span>
                        <p class="text">Shaping bright futures together...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <!-- hero area end  -->

          <!-- about area start  -->
          <section class="about-area" id="what-we-do">
            <div class="container">
              <div class="about-area-inner section-spacing">
                <div class="section-content">
                  <div class="section-title-wrapper">
                    <div class="title-wrapper">
                      <h2 class="section-title has_text_move_anim">Empowering Young Minds Through Innovative Learning</h2>
                    </div>
                  </div>
                  <div class="content-last">
                    <div class="text-wrapper">
                      <p class="text has_text_move_anim" data-delay="0.30">We believe that every child deserves equal access to quality education, regardless of their background. By integrating cutting-edge technology with compassionate teaching, we aim to bridge the educational divide. Our platform supports the Sustainable Development Goals by focusing on primary education, ensuring that no child is left behind.</p>
                      <p class="text has_text_move_anim" data-delay="0.30">At Edu4All, university students serve as mentors, creating interactive online classes and sharing valuable educational resources. Students can easily join live sessions, access learning materials, and engage in a collaborative educational environment. Together, we bridge the gap in primary education, making learning accessible and engaging for all.</p>
                    </div>
                    <div class="btn-wrapper has_fade_anim" data-fade-from="top" data-fade-offset="70"
                      data-ease="bounce">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- about area end  -->



          <!-- info area start  -->
          <section class="info-area">
            <div class="container">
              <div class="info-area-inner section-spacing">
                <div class="area-shape-1 has_fade_anim" data-fade-from="left" data-duration="2" data-delay="0.3"
                  data-fade-offset="80" data-ease="bounce">
                  <img src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-75.webp" alt="image">
                </div>
                <div class="info-points">
                  <div class="shape-1">
                    <img class="show-light" src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-77.webp" alt="image">
                    <img class="show-dark" src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-77-dark.webp" alt="image">
                  </div>
                  <div class="bg">
                    <img src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-76.webp" alt="image">
                  </div>
    
                </div>
                <div class="infos-wrapper-box">
                  <div class="infos-wrapper">
                    <div class="info-box">
                      <div class="content">
                        <h2 class="title has_fade_anim" data-fade-from="left">Online Sessions</h2>
                        <p class="text has_text_move_anim">Engage in live, interactive classes led by university mentors, providing real-time learning experiences for students.
                        </p>
                      </div>
                    </div>
                    <div class="info-box">
                      <div class="content">
                        <h2 class="title has_fade_anim">Educational Resources</h2>
                        <p class="text has_text_move_anim">Access a wealth of educational materials, from lecture notes to study guides, all curated by experienced mentors.</p>
                      </div>
                    </div>
                    <div class="info-box">
                      <div class="content">
                        <h2 class="title has_fade_anim">Discussion Forums</h2>
                        <p class="text has_text_move_anim">Participate in vibrant discussion forums where students can ask questions and mentors provide insightful answers, fostering a collaborative learning environment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- info area end  -->



                     <!-- About Section -->
          <div class="wrapper">
            <div class="left">
              <h1 class="heading">Hi, we're Edu4all.</h1>
              <p class="text">
                Our mission is to empower rural primary students with high-quality education through university volunteer mentors. We believe education is an inalienable right and that no technical or geographic barrier should limit a child's potential.
              </p>
            </div>
            <div class="right">
              <img
                src="${about}"
                alt="About us illustration"
                class="image"
              />
            </div>
          </div>

          <!-- Features Section -->
          <div class="featuresWrapper">
            <!-- Problem & Motivation -->
            <div class="featureBox">
              <div class="featureIcon" style="background: rgba(44, 123, 255, 0.12);">
                <!-- Network/Connection icon -->
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="20" height="20" rx="4" stroke="#2C7BFF" stroke-width="2.2"/>
                  <circle cx="12" cy="12" r="2" fill="#2C7BFF"/>
                  <circle cx="24" cy="12" r="2" fill="#2C7BFF"/>
                  <circle cx="12" cy="24" r="2" fill="#2C7BFF"/>
                  <circle cx="24" cy="24" r="2" fill="#2C7BFF"/>
                  <line x1="14" y1="12" x2="22" y2="12" stroke="#2C7BFF" stroke-width="1.5"/>
                  <line x1="12" y1="14" x2="12" y2="22" stroke="#2C7BFF" stroke-width="1.5"/>
                  <line x1="24" y1="14" x2="24" y2="22" stroke="#2C7BFF" stroke-width="1.5"/>
                  <line x1="14" y1="24" x2="22" y2="24" stroke="#2C7BFF" stroke-width="1.5"/>
                </svg>
              </div>
              <h2 class="featureTitle">Problem &amp; Motivation</h2>
              <p class="featureText">
                Rural primary students in remote areas commonly face severe shortages of essential learning materials, chronic teacher deficits, and unstable connectivity, widening the rural–urban education gap.
              </p>
            </div>

            <!-- Our Solution -->
            <div class="featureBox">
              <div class="featureIcon" style="background: rgba(255, 180, 44, 0.12);">
                <!-- Team/Social icon -->
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="14" r="5" fill="#FFB42C"/>
                  <ellipse cx="18" cy="25" rx="9" ry="5" fill="#FFB42C" fill-opacity="0.7"/>
                </svg>
              </div>
              <h2 class="featureTitle">Our Solution</h2>
              <p class="featureText">
                Edu4all connects rural students with university mentors for Q&amp;A, video tutoring, and cultural guidance, offering downloadable PDFs in an ad-free interface for seamless offline learning.
              </p>
            </div>

            <!-- Impact & SDG Alignment -->
            <div class="featureBox">
              <div class="featureIcon" style="background: rgba(44, 201, 115, 0.12);">
                <!-- Earth/Achievement/Sustainability icon -->
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="10" stroke="#2CC973" stroke-width="2.2" fill="#2CC973" fill-opacity="0.15"/>
                  <path d="M12 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#2CC973" stroke-width="2" stroke-linecap="round"/>
                  <path d="M18 12v12" stroke="#2CC973" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h2 class="featureTitle">Impact &amp; SDG Alignment</h2>
              <p class="featureText">
                By bridging the rural-urban education gap to boost literacy and school progression in rural communities, Edu4all directly supports UN SDG4 (Quality Education) and SDG10 (Reduced Inequalities).
              </p>
            </div>
          </div>


           <!-- feature area start  -->
          <div class="container large" id="sdgs">
            <section class="feature-area">
              <div class="container">
                <div class="feature-area-inner section-spacing">
                  <div class="section-header">
                    <div class="section-title-wrapper">
                      <div class="title-wrapper">
                        <h2 class="section-title has_text_move_anim">Sustainable Development Goals by focusing
 on primary education</h2>
                      </div>
                    </div>
                  </div>
                  <div class="section-content">
  <div class="feature-thumb">
  <div class="thumb">
    <img src="${sdgs}" alt="image" style="filter: brightness(0.4);">
  </div>
  <div class="info pos-center">
    <img src="https://crowdytheme.com/html/arolax/assets/imgs/shape/img-s-78.webp" alt="image">

  </div>
  <div class="btn-wrapper">
    <a href="https://sdgs.un.org/goals" class="wc-btn wc-btn-underline btn-text-flip"> 
      <span data-text="VISIT">VISIT</span>
    </a>
  </div>
</div>

                    <div class="features-wrapper-box">
                      <div class="features-wrapper">
                        <div class="feature-box has_fade_anim" data-fade-from="left" data-fade-offset="70">
                          <div class="thumb">
                            <img src="${sdgs4}" alt="feature icon">
                          </div>
                          <div class="content">
                            <h3 class="title">Equal Education</h3>
                            <p class="text">Live classes and free resources connect mentors to students everywhere, making quality education accessible to all.</p>
                          </div>
                        </div>
                        <div class="feature-box has_fade_anim" data-fade-from="left" data-fade-offset="70">
                          <div class="thumb">
                            <img src="${sdgs10}" alt="feature icon">
                          </div>
                          <div class="content">
                            <h3 class="title">Reduced Inequalities</h3>
                            <p class="text">Our app supports students from all backgrounds, giving equal access to learning and growth.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <!-- feature area end  -->

        </main>

<!-- footer area start -->
<div class="container large" id="contact">
  <footer class="footer-area py-5 text-light">
    <div class="container">
      <div class="row g-4">
        <!-- Left section: Logo & Info -->
        <div class="col-md-4">
          <div class="footer-logo mb-3">
            <span
              style="font-size: 56px; font-weight: 700; color: #fff; display: block;"
              >EDU4ALL</span
            >
          </div>
          <p class="mb-0" style="font-size: 1rem; color: #ccc;">
            We value equal education for every child world-wide.
          </p>
        </div>

        <!-- Right section: Two Bootstrap cards -->
        <div class="col-md-8">
          <div class="row g-4">
            <!-- Card 1: Join as Volunteer Mentor -->
            <div class="col-md-6">
              <div class="card h-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                  class="card-img-top"
                  alt="Teaching"
                  style="height: 200px; object-fit: cover;"
                />
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-primary mb-3">
                    Join us as a volunteer mentor?
                  </h5>
                  <div class="flex-grow-1">
                    <p class="mb-2" style="font-size: 0.95rem; color: #555;">
                      We're looking for university students eager to support rural
                      learners.
                    </p>
                    <p class="mb-2" style="font-size: 0.95rem; color: #555;">
                      To apply, please prepare the following:
                    </p>
                    <ul class="ps-3 mb-3" style="font-size: 0.9rem; color: #555; line-height: 1.4;">
                      <li class="d-flex align-items-start mb-1">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          class="me-2 flex-shrink-0"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="14"
                            height="14"
                            rx="2.5"
                            stroke="#2563eb"
                            stroke-width="1.5"
                          />
                          <path
                            d="M6 7h8M6 10h8M6 13h5"
                            stroke="#2563eb"
                            stroke-width="1.2"
                            stroke-linecap="round"
                          />
                        </svg>
                        <strong>Proof of university enrollment</strong>
                      </li>
                      <li class="d-flex align-items-start mb-1">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          class="me-2 flex-shrink-0"
                        >
                          <path
                            d="M10 2l7 4-7 4-7-4 7-4z"
                            stroke="#2563eb"
                            stroke-width="1.5"
                          />
                          <path
                            d="M3 6v4c0 3.314 2.686 6 6 6s6-2.686 6-6V6"
                            stroke="#2563eb"
                            stroke-width="1.5"
                          />
                          <path
                            d="M7 16v2h6v-2"
                            stroke="#2563eb"
                            stroke-width="1.2"
                          />
                        </svg>
                        <strong>Your field of study</strong>
                      </li>
                      <li class="d-flex align-items-start">
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          class="me-2 flex-shrink-0"
                        >
                          <rect
                            x="3"
                            y="5"
                            width="14"
                            height="10"
                            rx="2"
                            stroke="#2563eb"
                            stroke-width="1.5"
                          />
                          <path
                            d="M7 5V3h6v2"
                            stroke="#2563eb"
                            stroke-width="1.2"
                          />
                          <path
                            d="M7 15v2h6v-2"
                            stroke="#2563eb"
                            stroke-width="1.2"
                          />
                        </svg>
                        <strong>Subjects you are willing to teach</strong>
                      </li>
                    </ul>
                    <p class="mb-1" style="font-size: 0.95rem; color: #555;">
                      Send the above information to us at:
                    </p>
                    <a
                      href="mailto:volunteer@edu4all.com"
                      class="d-inline-block bg-light px-2 py-1 rounded text-decoration-none"
                      style="font-family: monospace; font-size: 0.9rem; color: #333;"
                      >volunteer@edu4all.com</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 2: App Support -->
            <div class="col-md-6">
              <div class="card h-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80"
                  class="card-img-top"
                  alt="Support"
                  style="height: 200px; object-fit: cover;"
                />
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title text-primary mb-3">
                    Need help with the app?
                  </h5>
                  <div class="flex-grow-1">
                    <p class="mb-3" style="font-size: 0.95rem; color: #555;">
                      Experiencing issues or have questions and suggestions about using
                      Edu4all? Our support team is here to help. Please reach out to:
                    </p>
                    <a
                      href="mailto:support@edu4all.com"
                      class="d-inline-block bg-light px-2 py-1 rounded text-decoration-none"
                      style="font-family: monospace; font-size: 0.9rem; color: #333;"
                      >support@edu4all.com</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- /.col-md-6 cards -->
          </div>
          <!-- /.row (cards) -->
        </div>
        <!-- /.col-md-8 -->
      </div>
      <!-- /.row (logo + cards) -->

      <!-- Copyright -->
      <div class="row mt-5">
        <div class="col-12 text-center">
          <p class="mb-0" style="font-size: 0.9rem; color: #ccc;">
            © 2025 <a href="#" class="text-light text-decoration-underline">Edu4All</a> Group 3
          </p>
        </div>
      </div>
    </div>
  </footer>
</div>
<!-- footer area end -->




      </div>
    </div>
  </div>



  <!-- All JS files -->
  <script src="https://crowdytheme.com/html/arolax/assets/js/jquery-3.6.0.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/bootstrap.bundle.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/jquery.magnific-popup.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/swiper-bundle.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/counter.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/progressbar.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/gsap.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/ScrollSmoother.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/ScrollToPlugin.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/ScrollTrigger.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/SplitText.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/jquery.meanmenu.min.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/backToTop.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/main.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/error-handling.js"></script>
  <script src="https://crowdytheme.com/html/arolax/assets/js/offcanvas.js"></script>

  <script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize ScrollSmoother if not already initialized
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2
    });

    // Expose scroll function
    window.scrollToWhatWeDo = function () {
      const target = document.getElementById('what-we-do');
      if (target) {
        smoother.scrollTo(target, true); // true = animate
      }
    };
    window.scrollToSDGS = function () {
      const target = document.getElementById('sdgs');
      if (target) {
        smoother.scrollTo(target, true); // true = animate
      }
    };
    window.scrollToContact = function () {
      const target = document.getElementById('contact');
      if (target) {
        smoother.scrollTo(target, true); // true = animate
      }
    };
  });
</script>

  <script>

    // client slider 
    if ('.client-slider-active') {
      var client_slider_active = new Swiper(".client-slider-active", {
        slidesPerView: 'auto',
        loop: true,
        autoplay: true,
        spaceBetween: 110,
        speed: 3000,
        autoplay: {
          delay: 1,
        },
      });
    }

    // project slider
    if (('.project-slider').length) {
      var project_slider = new Swiper(".project-slider", {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 40,
        speed: 1800,
        watchSlidesProgress: true,
        navigation: {
          prevEl: ".project-button-prev",
          nextEl: ".project-button-next",
        },
        pagination: {
          el: '.project-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          // when window width is >= px
          576: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          992: {
            slidesPerView: 3,
          },
          1201: {
            slidesPerView: 3,
          },
          1367: {
            slidesPerView: 4,
          },
        }
      });
    }


    // testimonial slider
    if (('.testimonial-slider').length) {
      var testimonial_slider = new Swiper(".testimonial-slider", {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 60,
        speed: 1800,
        watchSlidesProgress: true,
        navigation: {
          prevEl: ".testimonial-button-prev",
          nextEl: ".testimonial-button-next",
        },
      });
    }


    // text slider 
    if ('.text-slider-active') {
      var text_slider_active = new Swiper(".text-slider-active", {
        slidesPerView: 'auto',
        loop: true,
        autoplay: true,
        spaceBetween: 30,
        speed: 10000,
        autoplay: {
          delay: 1,
        },
      });
    }

  </script>

</body>


<!-- Mirrored from crowdytheme.com/html/arolax/ai-agency.html by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 30 May 2025 20:08:30 GMT -->
</html>`;

  return (
    <iframe
      title="Legacy Arolax"
      srcDoc={html}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
    />
  );
};

export default Home;
