import { useState } from 'react';
import ScheduleSession from '../components/ScheduleSession';
import StickyNavbar from '../components/StickyNavbar';
import ViewSessions from '../components/ViewSessions';
import '../styles/MentorDashboard.css';

export default function Sessions() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <>
      <div className="ocean">
        <div className="wave" />
        <div className="wave" />
      </div>

      <StickyNavbar />

      <div className="container py-5 d-flex justify-content-center">
        <div className="glass-card">
        

          <nav className="tab-nav mb-4">
            <button
              className={`tab-btn${activeTab === 'schedule' ? ' active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule Sessions
            </button>
            <button
              className={`tab-btn${activeTab === 'view' ? ' active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              View Sessions
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === 'schedule' ? (
              <ScheduleSession />
            ) : (
              <ViewSessions />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
