import React from 'react';
import styles from './ContactUs.module.css';

const ContactUs = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        We've been waiting<br />for you.
      </h1>
      <p className={styles.description}>
        We'd love to hear from you!
      </p>
      <div className={styles.contactBoxes}>
        <div className={styles.cardBox}>
          <img className={styles.cardImage} src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80" alt="Teaching" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Join us as a volunteer mentor?</h3>
            <div className={styles.boxContent}>
              <p>We're looking for university students eager to support rural learners.</p>
              <p>To apply, please prepare the following:</p>
              <ul>
                <li><span style={{verticalAlign: 'middle', marginRight: 8}}><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2.5" stroke="#2563eb" strokeWidth="1.5"/><path d="M6 7h8M6 10h8M6 13h5" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round"/></svg></span><b>Proof of university enrollment</b></li>
                <li><span style={{verticalAlign: 'middle', marginRight: 8}}><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2l7 4-7 4-7-4 7-4z" stroke="#2563eb" strokeWidth="1.5"/><path d="M3 6v4c0 3.314 2.686 6 6 6s6-2.686 6-6V6" stroke="#2563eb" strokeWidth="1.5"/><path d="M7 16v2h6v-2" stroke="#2563eb" strokeWidth="1.2"/></svg></span><b>Your field of study</b></li>
                <li><span style={{verticalAlign: 'middle', marginRight: 8}}><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#2563eb" strokeWidth="1.5"/><path d="M7 5V3h6v2" stroke="#2563eb" strokeWidth="1.2"/><path d="M7 15v2h6v-2" stroke="#2563eb" strokeWidth="1.2"/></svg></span><b>Subjects you are willing to teach</b></li>
              </ul>
              <p>Send the above information to us at:</p>
              <code className={styles.emailCode}>volunteer@edu4all.com</code>
            </div>
          </div>
        </div>
        <div className={styles.cardBox}>
          <img className={styles.cardImage} src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80" alt="Support" />
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>Need help with the app?</h3>
            <div className={styles.boxContent}>
              <p>Experiencing issues or have questions and suggestions about using Edu4all? Our support team is here to help. Please reach out to:</p>
              <code className={styles.emailCode}>support@edu4all.com</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 