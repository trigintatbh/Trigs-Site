import React from 'react';
import { Link } from 'react-router-dom';

import notFoundImage from '../assets/404.png';
import WaveText from '../components/WaveText'; 

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 bg-none text-gray-100 rounded-lg shadow-xl m-4">
      <h1 className="text-9xl font-extrabold mb-8">
        <WaveText text="404" />
      </h1>

      <img
        src={notFoundImage}
        alt="Page Not Found"
        className="max-w-xs md:max-w-sm lg:max-w-md h-auto rounded-lg shadow-md mb-8"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://placehold.co/400x300/333333/FFFFFF?text=Image+Not+Found';
          console.error("Failed to load 404.png. Displaying placeholder.");
        }}
      />

      <p className="text-2xl md:text-3xl font-semibold text-center mb-4">
        <WaveText text="Oops! The page you're looking for doesn't exist." />
      </p>

      <p className="text-lg text-center mb-8 max-w-lg">
        It might have been moved, deleted, or{' '}
        <span style={{ whiteSpace: 'nowrap' }}>
          <WaveText text="never existed" />
        </span>
        {' '}in the first place. Don't worry, you can always go back to the{' '}
        <span style={{ whiteSpace: 'nowrap' }}>
          <WaveText text="homepage." />
        </span>
      </p>

      <Link
        to="/"
        className="px-8 py-3 bg-violet-600 text-white font-bold rounded-full shadow-lg hover:bg-violet-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;