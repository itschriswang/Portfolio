import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './styles/global.css';
import App from './App';

// reducedMotion="user": under the OS reduce-motion setting framer-motion drops
// every transform and layout animation in the tree (opacity still fades), so no
// component has to remember to opt out on its own.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>
);
