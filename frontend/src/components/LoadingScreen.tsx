import React from 'react';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import './LoadingScreen.css';

export interface LoadingScreenProps {
  /**
   * Controls whether the overlay is active.
   */
  isVisible?: boolean;

  /**
   * Delay in milliseconds before showing the overlay (prevents flicker on fast loads).
   * Default is 100ms.
   */
  delay?: number;

  /**
   * Minimum duration in milliseconds the overlay remains visible once shown.
   * Default is 900ms.
   */
  minDuration?: number;

  /**
   * Primary loading message
   */
  message?: string;

  /**
   * Secondary description text
   */
  subtext?: string;

  /**
   * Visual theme mode ('dark' | 'light'). Defaults to 'dark'.
   */
  theme?: 'dark' | 'light';

  /**
   * Custom className for container override
   */
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isVisible = true,
  delay = 100,
  minDuration = 900,
  message = 'טוען נתונים...',
  subtext = 'אנא המתן רגע, המערכת מכינה את התוכן',
  theme = 'dark',
  className = '',
}) => {
  // Delay initial display by `delay` ms; once displayed, guarantee at least `minDuration` ms on screen
  const shouldRender = useDelayedLoading(isVisible, delay, minDuration);

  if (!shouldRender) return null;

  return (
    <div
      className={`loading-overlay ${theme === 'light' ? 'loading-overlay-light' : ''} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="loading-content">
        {/* Pitch & Soccer Ball Container */}
        <div className="pitch-ball-container">
          {/* Mini Green Soccer Pitch Surface (מגרש כדורגל) */}
          <div className="soccer-pitch-surface">
            <div className="pitch-center-line" />
            <div className="pitch-center-circle" />
          </div>

          {/* Synchronized Pitch Shadow */}
          <div className="pitch-ball-shadow" />

          {/* Bouncing & Spinning Classic Black & White Soccer Ball */}
          <div className="soccer-ball-bouncing-wrapper">
            <div className="soccer-ball-spinning-inner">
              <svg
                className="soccer-ball-svg"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle 3D Volume Gradient */}
                  <radialGradient id="ball3dShade" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#CBD5E1" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.55" />
                  </radialGradient>
                </defs>

                {/* Base White Ball Circle */}
                <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />

                {/* Classic Clean Pentagons & Hexagons (No person artifacts) */}
                <g fill="#0F172A" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round">
                  {/* Central Regular Pentagon */}
                  <polygon points="50,32 63,41 58,57 42,57 37,41" />

                  {/* 5 Outer Pentagons around Edge */}
                  <polygon points="50,4 58,14 50,22 42,14" />
                  <polygon points="82,24 88,36 74,42 70,30" />
                  <polygon points="74,74 62,82 56,68 68,62" />
                  <polygon points="26,74 32,62 44,68 38,82" />
                  <polygon points="18,24 30,30 26,42 12,36" />

                  {/* Seam Lines connecting Pentagons */}
                  <line x1="50" y1="22" x2="50" y2="32" strokeWidth="2.5" />
                  <line x1="70" y1="30" x2="63" y2="41" strokeWidth="2.5" />
                  <line x1="68" y1="62" x2="58" y2="57" strokeWidth="2.5" />
                  <line x1="44" y1="68" x2="42" y2="57" strokeWidth="2.5" />
                  <line x1="30" y1="30" x2="37" y2="41" strokeWidth="2.5" />

                  {/* Edge Boundary Seam Lines */}
                  <line x1="58" y1="14" x2="70" y2="30" strokeWidth="2.5" />
                  <line x1="42" y1="14" x2="30" y2="30" strokeWidth="2.5" />
                  <line x1="74" y1="42" x2="68" y2="62" strokeWidth="2.5" />
                  <line x1="56" y1="68" x2="44" y2="68" strokeWidth="2.5" />
                  <line x1="32" y1="62" x2="26" y2="42" strokeWidth="2.5" />
                </g>

                {/* 3D Depth Shadow Overlay */}
                <circle cx="50" cy="50" r="46" fill="url(#ball3dShade)" pointerEvents="none" />

                {/* Light Reflection Highlight */}
                <ellipse cx="34" cy="25" rx="9" ry="5" fill="#FFFFFF" opacity="0.75" transform="rotate(-30 34 25)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="loading-message loading-pulse">{message}</h3>
        {subtext && <p className="loading-subtext">{subtext}</p>}
      </div>
    </div>
  );
};

export default LoadingScreen;
