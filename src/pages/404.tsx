import React from 'react';
import { Link } from 'react-router-dom';

import notFoundImage from '../assets/404.png';
import WaveText from '../components/WaveText';

const NotFoundPage: React.FC = () => {
  return (
    <div className="page-container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-24 text-center gap-6 reveal">
      <h1 className="text-9xl font-extrabold">
        <WaveText text="404" />
      </h1>

      <img
        src={notFoundImage}
        alt="Page Not Found"
        className="max-w-xs md:max-w-sm h-auto rounded-2xl shadow-xl my-2"
        style={{ border: "none" }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://placehold.co/400x300/0a0a0a/f0f0f5?text=Image+Not+Found';
          console.error("Failed to load 404.png. Displaying placeholder.");
        }}
      />

      <p className="text-sm sm:text-xl md:text-2xl font-semibold whitespace-nowrap">
        <WaveText text="Oops! The page you're looking for doesn't exist." />
      </p>

      <p className="text-base max-w-lg" style={{ color: "var(--color-secondary-text)" }}>
        It might have been moved, deleted, or{' '}
        <span style={{ whiteSpace: 'nowrap' }}>
          <WaveText text="never existed" />
        </span>
        {' '}in the first place. Don't worry, you can always go back to the{' '}
        <span style={{ whiteSpace: 'nowrap' }}>
          <WaveText text="homepage." />
        </span>
      </p>

      <Link to="/" className="btn-card">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
