import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PinInput from '../components/PinInput';
import { UserIcon } from '../components/icons';

const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const user = { id: crypto.randomUUID(), name: name.trim() };
    sessionStorage.setItem('chithi-plus-user', JSON.stringify(user));

    navigate(`/room/${pin}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto mb-6 bg-cyan-500/20 rounded-full h-16 w-16 flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Join a Room</h2>
        <p className="text-gray-400 mb-6">Enter your name and a 4-digit PIN to join or create a chat room.</p>
        
        <form onSubmit={handleJoin} className="flex flex-col gap-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder="Enter your name"
            required
            autoFocus
          />
          <PinInput length={4} onComplete={setPin} />
          {error && <p className="text-red-500 animate-pulse">{error}</p>}
          <button 
            type="submit"
            className="w-full mt-2 px-8 py-3 bg-cyan-500 text-white font-bold text-lg rounded-full hover:bg-cyan-600 transition-transform transform hover:scale-105 duration-300 ease-in-out shadow-lg shadow-cyan-500/30"
          >
            Join / Create Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinPage;
