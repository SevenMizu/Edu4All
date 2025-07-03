// src/components/ScheduleSession.jsx
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { scheduleSession } from '../api/sessionApi';
import ZoomMeeting from './ZoomMeeting';

const initialForm = {
  topic: '',
  description: '',
  startTime: null,   // JS Date object
  duration: '',
  password: '',
  waitingRoom: false,
};

export default function ScheduleSession() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = date => {
    setForm(f => ({ ...f, startTime: date }));
  };

  const handleScheduleSession = async () => {
    setError(null);
    setLoading(true);
    try {
      // Format to "YYYY-MM-DDTHH:MM:SS"
      const formattedStart = form.startTime
        .toISOString()
        .slice(0, 19);

      const payload = {
        topic:       form.topic,
        description: form.description,
        startTime:   formattedStart,
        duration:    Number(form.duration),
        password:    form.password,
        waitingRoom: form.waitingRoom,
      };

      const resp = await scheduleSession(payload);

      setMeetingDetails({
        meetingNumber:   resp.meetingNumber,
        meetingUrl:      resp.meetingUrl,
        meetingPassword: resp.meetingPassword,
        signature:       resp.signature,
        startTime:       formattedStart,
      });

      setForm(initialForm);
      setScheduled(true);
    } catch (err) {
      console.error(err);
      setError('Error scheduling session');
    } finally {
      setLoading(false);
    }
  };

  // 1) If inMeeting, render the SDK
  if (inMeeting && meetingDetails) {
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <button
          className="btn btn-link mb-3"
          onClick={() => setInMeeting(false)}
        >
          ← Back
        </button>
        <ZoomMeeting
          meetingNumber={meetingDetails.meetingNumber}
          userName="Mentor Name"
          userEmail="mentor@example.com"
          signature={meetingDetails.signature}
          password={meetingDetails.meetingPassword}
        />
      </div>
    );
  }

  // 2) If scheduled (but not started), show confirmation + “Start Now”
  if (scheduled && meetingDetails) {
    return (
      <div className="container py-4">
        <div className="alert alert-success">
          Meeting scheduled for{' '}
          <strong>
            {new Date(meetingDetails.startTime).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </strong>.
        </div>
        <button
          className="btn btn-primary me-2"
          onClick={() => setInMeeting(true)}
        >
          Start Now
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setScheduled(false)}
        >
          ← Back
        </button>
      </div>
    );
  }

  // 3) Otherwise, show the scheduling form
  return (
    <div className="container py-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleScheduleSession();
        }}
        className="row g-3 schedule-form"
      >
        {/* Topic */}
        <div className="col-md-6">
          <label htmlFor="topic" className="form-label">
            Topic
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            className="form-control"
            value={form.topic}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div className="col-md-6">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            className="form-control"
            value={form.description}
            onChange={handleInputChange}
          />
        </div>

        {/* Start Date & Time */}
        <div className="col-md-4">
          <label htmlFor="startTime" className="form-label">
            Start Date & Time
          </label>
          <DatePicker
            id="startTime"
            selected={form.startTime}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select date & time"
            className="form-control"
            minDate={new Date()}
            required
          />
        </div>

        {/* Waiting Room */}
        <div className="col-md-2 d-flex align-items-center align-self-center">
          <div className="form-check d-flex align-items-center mb-0">
            <input
              id="waitingRoom"
              name="waitingRoom"
              type="checkbox"
              className="form-check-input me-2"
              checked={form.waitingRoom}
              onChange={handleInputChange}
            />
            <label htmlFor="waitingRoom" className="form-check-label mb-0">
              Waiting Room
            </label>
          </div>
        </div>

        {/* Duration */}
        <div className="col-md-3">
          <label htmlFor="duration" className="form-label">
            Duration (min)
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            className="form-control"
            value={form.duration}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Password */}
        <div className="col-md-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="text"
            className="form-control"
            value={form.password}
            onChange={handleInputChange}
          />
        </div>

        {/* Submit */}
        <div className="col-12 text-end">
          <button
            type="submit"
            className="btn btn-outline-dark"
            disabled={loading}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Schedule Session
          </button>
        </div>
      </form>
    </div>
  );
}
