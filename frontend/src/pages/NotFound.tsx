import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container" role="main">
      {/* Glowing Ambient Background Orbs */}
      <div className="notfound-glow-orb-1" />
      <div className="notfound-glow-orb-2" />

      {/* Main Glassmorphism Card */}
      <div className="notfound-card">
        {/* Error Badge */}
        <div className="notfound-badge">
          <span>⚠️ 404 - PAGE NOT FOUND</span>
        </div>

        {/* 404 Display with ⚽ Soccer Ball as the '0' */}
        <div className="notfound-hero-404">
          <span className="notfound-digit">4</span>
          <span className="notfound-emoji-ball" role="img" aria-label="Soccer Ball">⚽</span>
          <span className="notfound-digit">4</span>
        </div>

        {/* Humorous Hebrew Gaming Headline */}
        <h1 className="notfound-title">
          אופס! הכדור יצא מתחומי המגרש
        </h1>

        {/* Short Explanation */}
        <p className="notfound-description">
          העמוד שחיפשת לא קיים, הוסר או שהועבר למיקום אחר במערכת.
        </p>

        {/* Action Buttons */}
        <div className="notfound-actions">
          <button
            onClick={() => navigate('/')}
            className="notfound-btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>חזרה למגרש הביתי</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="notfound-btn-secondary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>חזרה לעמוד הקודם</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
