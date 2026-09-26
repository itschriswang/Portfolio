import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import '../styles/global.css';
import './work.css';
import WorkApp from './WorkApp';

// reducedMotion="user": framer-motion drops transform and layout animation
// for visitors who ask the OS for less motion (the tab swap and tile reveals).
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <WorkApp />
    </MotionConfig>
  </React.StrictMode>
);
