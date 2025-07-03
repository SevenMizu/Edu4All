import { ZoomMtg } from '@zoom/meetingsdk';
import { useEffect } from 'react';

const ZoomMeeting = ({ meetingNumber, userName, userEmail, signature, password }) => {
  useEffect(() => {
    // Preload and prepare the SDK
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    const sdkKey = process.env.REACT_APP_ZOOM_API_KEY;
console.log("sssss"+ meetingNumber);
    // Initialize the Zoom SDK
    ZoomMtg.init({
      leaveUrl: window.location.origin,
      success: () => {
        console.log('Zoom SDK initialized');

        // Join the meeting using the signature received from the backend
        ZoomMtg.join({
          sdkKey,
          signature, // Use the signature passed from the backend
          meetingNumber: meetingNumber.toString(),
          userName,
          userEmail,
          passWord: password || '',
          tk: '',

          success: () => {
            console.log('Joined Zoom meeting successfully');
          },
          error: (joinErr) => {
            console.error('Error joining Zoom meeting:', joinErr);
          }
        });
      },
      error: (initErr) => {
        console.error('Error initializing Zoom SDK:', initErr);
      }
    });
  }, [meetingNumber, userName, userEmail, signature, password]);

  return (
    <div
      id="meetingSDKElement"
      style={{ width: '100%', height: '100vh', position: 'relative' }}
    />
  );
};

export default ZoomMeeting;
