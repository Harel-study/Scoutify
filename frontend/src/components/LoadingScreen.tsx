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

          {/* Bouncing & Spinning Realistic 3D B&W Soccer Ball */}
          <div className="soccer-ball-bouncing-wrapper">
            <div className="soccer-ball-spinning-inner">
              <svg
                className="soccer-ball-svg"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Leather Bump Texture Filter */}
                  <filter id="leatherNoise" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
                    <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
                  </filter>

                  {/* Main 3D Sphere Radial Shading */}
                  <radialGradient id="sphere3DGrad" cx="30%" cy="25%" r="70%" fx="25%" fy="20%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="55%" stopColor="#F1F5F9" />
                    <stop offset="85%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#64748B" />
                  </radialGradient>

                  {/* Black Leather Panel 3D Cushion Gradient */}
                  <radialGradient id="blackPanelGrad" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="65%" stopColor="#0F172A" />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>

                  {/* Spherical Edge Occlusion Shadow */}
                  <radialGradient id="edgeOcclusionGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="65%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="92%" stopColor="#0F172A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
                  </radialGradient>
                </defs>

                {/* Outer 3D Sphere Base */}
                <circle cx="50" cy="50" r="46" fill="url(#sphere3DGrad)" stroke="#1E293B" strokeWidth="2.5" />

                {/* Leather Grain Texture */}
                <circle cx="50" cy="50" r="46" fill="#000000" opacity="0.03" filter="url(#leatherNoise)" />

                {/* Curved Spherical Pentagonal Leather Panels */}
                {/* Central Curved Pentagon */}
                <path
                  d="M 50,28 Q 59,33 63,42 Q 59,52 56,60 Q 44,60 41,52 Q 37,42 41,33 Q 45,30 50,28 Z"
                  fill="url(#blackPanelGrad)"
                  stroke="#0F172A"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Top Curved Pentagon */}
                <path
                  d="M 50,4 Q 56,11 58,16 Q 52,23 50,28 Q 44,23 42,16 Q 44,11 50,4 Z"
                  fill="url(#blackPanelGrad)"
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Top-Right Curved Pentagon */}
                <path
                  d="M 82,22 Q 86,30 88,38 Q 78,41 74,45 Q 67,37 63,42 Q 68,31 72,28 Q 77,24 82,22 Z"
                  fill="url(#blackPanelGrad)"
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Bottom-Right Curved Pentagon */}
                <path
                  d="M 76,76 Q 66,83 62,85 Q 58,74 56,60 Q 67,54 74,53 Q 78,64 76,76 Z"
                  fill="url(#blackPanelGrad)"
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Bottom-Left Curved Pentagon */}
                <path
                  d="M 24,76 Q 22,64 26,53 Q 33,54 41,60 Q 40,74 38,85 Q 34,83 24,76 Z"
                  fill="url(#blackPanelGrad)"
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Top-Left Curved Pentagon */}
                <path
                  d="M 18,22 Q 23,24 28,28 Q 33,31 37,42 Q 33,37 26,45 Q 22,41 12,38 Q 14,30 18,22 Z"
                  fill="url(#blackPanelGrad)"
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Curved Spherical Seam Lines (Hexagon Borders) */}
                <g stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none">
                  <path d="M 58,16 Q 66,21 72,28" />
                  <path d="M 42,16 Q 34,21 28,28" />
                  <path d="M 74,45 Q 80,48 86,54" />
                  <path d="M 74,53 Q 68,47 63,42" />
                  <path d="M 26,45 Q 20,48 14,54" />
                  <path d="M 26,53 Q 32,47 37,42" />
                  <path d="M 56,60 Q 48,68 41,60" />
                  <path d="M 62,85 Q 50,94 38,85" />
                  <path d="M 88,38 Q 94,48 90,60" />
                  <path d="M 12,38 Q 6,48 10,60" />
                </g>

                {/* Spherical Occlusion Shadow */}
                <circle cx="50" cy="50" r="46" fill="url(#edgeOcclusionGrad)" pointerEvents="none" />

                {/* Rim Highlight Specular Arc */}
                <path
                  d="M 10,40 A 44 44 0 0 1 50,6"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.65"
                  fill="none"
                />

                {/* Primary Gloss Specular Highlight */}
                <ellipse cx="32" cy="24" rx="10" ry="5.5" fill="#FFFFFF" opacity="0.75" transform="rotate(-30 32 24)" />
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
