
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoIcon, ArrowRightIcon } from '../components/icons';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinAnonymously = () => {
    navigate('/join');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="mb-8">
        <LogoIcon className="h-24 w-24 text-cyan-400" />
      </div>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
        Welcome to <span className="text-cyan-400">Chithi+</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
        Jump into public chat rooms with a PIN, or log in to connect with friends. Your conversation, your way.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleJoinAnonymously}
          className="group flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500 text-white font-bold text-lg rounded-full hover:bg-cyan-600 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg shadow-cyan-500/30"
        >
          Join Chat Anonymously
          <ArrowRightIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </button>
        <button
          disabled
          className="px-8 py-4 bg-gray-700 text-gray-400 font-bold text-lg rounded-full cursor-not-allowed"
        >
          Login (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default HomePage;
