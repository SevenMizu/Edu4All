import React from 'react';
import styles from './About.module.css';
import sampleImg from './about-sample.jpg';

const About = () => (
  <div className={styles.wrapper}>
    <div className={styles.left}>
      <h1 className={styles.heading}>Hi, we're Edu4all.</h1>
      <p className={styles.text}>
        Our mission is to empower rural primary students with high-quality education through university volunteer mentors. We believe education is an inalienable right and that no technical or geographic barrier should limit a child's potential.
      </p>
    </div>

    <div className={styles.right}>
      <img
        src={sampleImg}
        alt="About us illustration"
        className={styles.image}
      />
    </div>
  </div>
);

const FeatureSections = () => (
  <div className={styles.featuresWrapper}>
    <div className={styles.featureBox}>
      <div className={styles.featureIcon} style={{background: 'rgba(44, 123, 255, 0.12)'}}>
        {/* Network/Connection icon */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="20" height="20" rx="4" stroke="#2C7BFF" strokeWidth="2.2"/>
          <circle cx="12" cy="12" r="2" fill="#2C7BFF"/>
          <circle cx="24" cy="12" r="2" fill="#2C7BFF"/>
          <circle cx="12" cy="24" r="2" fill="#2C7BFF"/>
          <circle cx="24" cy="24" r="2" fill="#2C7BFF"/>
          <line x1="14" y1="12" x2="22" y2="12" stroke="#2C7BFF" strokeWidth="1.5"/>
          <line x1="12" y1="14" x2="12" y2="22" stroke="#2C7BFF" strokeWidth="1.5"/>
          <line x1="24" y1="14" x2="24" y2="22" stroke="#2C7BFF" strokeWidth="1.5"/>
          <line x1="14" y1="24" x2="22" y2="24" stroke="#2C7BFF" strokeWidth="1.5"/>
        </svg>
      </div>
      <h2 className={styles.featureTitle}>Problem & Motivation</h2>
      <p className={styles.featureText}>
        Rural primary students in remote areas commonly face severe shortages of essential learning materials, chronic teacher deficits, and unstable connectivity, widening the rural–urban education gap.
      </p>
    </div>

    <div className={styles.featureBox}>
      <div className={styles.featureIcon} style={{background: 'rgba(255, 180, 44, 0.12)'}}>
        {/* Team/Social icon */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="14" r="5" fill="#FFB42C"/>
          <ellipse cx="18" cy="25" rx="9" ry="5" fill="#FFB42C" fillOpacity="0.7"/>
        </svg>
      </div>
      <h2 className={styles.featureTitle}>Our Solution</h2>
      <p className={styles.featureText}>
      Edu4all connects rural students with university mentors for Q&A, video tutoring, and cultural guidance, offering downloadable PDFs in an ad-free interface for seamless offline learning.
      </p>
    </div>

    <div className={styles.featureBox}>
      <div className={styles.featureIcon} style={{background: 'rgba(44, 201, 115, 0.12)'}}>
        {/* Earth/Achievement/Sustainability icon */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="10" stroke="#2CC973" strokeWidth="2.2" fill="#2CC973" fillOpacity="0.15"/>
          <path d="M12 18c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#2CC973" strokeWidth="2" strokeLinecap="round"/>
          <path d="M18 12v12" stroke="#2CC973" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h2 className={styles.featureTitle}>Impact & SDG Alignment</h2>
      <p className={styles.featureText}>
        By bridging the rural-urban education gap to boost literacy and school progression in rural communities, Edu4all directly supports UN SDG4 (Quality Education) and SDG10 (Reduced Inequalities).
      </p>
    </div>
  </div>
);

export default function AboutPage() {
  return (
    <>
      <About />
      <FeatureSections />
    </>
  );
}
