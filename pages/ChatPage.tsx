import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatRoom } from '../hooks/useChatRoom';
import { User } from '../types';
import MessageBubble from '../components/MessageBubble';
import { SendIcon, CopyIcon, ArrowLeftIcon } from '../components/icons';

const ChatPage: React.FC = () => {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { messages, users, isConnected, sendMessage } = useChatRoom(pin, currentUser);

  const [messageText, setMessageText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('chithi-plus-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/join');
    }
  }, [navigate]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && currentUser && isConnected) {
      sendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleCopyPin = () => {
    if (!pin) return;
    navigator.clipboard.writeText(pin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  if (!currentUser) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-2rem)] max-w-7xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Sidebar for users */}
      <aside className="w-64 bg-gray-900/30 border-r border-gray-700 p-4 flex-col hidden md:flex">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Users ({users.length})</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          <ul>
            {users.map(user => (
              <li key={user.id} className={`p-2 rounded-md truncate ${user.id === currentUser.id ? 'text-cyan-400 font-semibold bg-cyan-500/10' : 'text-gray-300'}`}>
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className={`p-2 mt-2 text-sm rounded-md text-center font-semibold ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col bg-gray-800">
        <header className="flex items-center justify-between p-4 bg-gray-900/50 border-b border-gray-700">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-700">
            <ArrowLeftIcon className="h-6 w-6"/>
          </button>
          <h1 className="text-lg font-bold text-gray-300">
              Room PIN: <span className="text-cyan-400 tracking-widest">{pin}</span>
          </h1>
          <button onClick={handleCopyPin} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-700 rounded-full hover:bg-gray-600">
            <CopyIcon className="h-4 w-4" />
            {isCopied ? 'Copied!' : 'Copy PIN'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !isConnected && <div className="text-center text-gray-400">Connecting to chat room...</div>}
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.sender.id === currentUser.id} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-gray-900/50 border-t border-gray-700">
          <div className="flex items-center bg-gray-700 rounded-full">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-transparent px-5 py-3 text-white placeholder-gray-400 focus:outline-none"
              placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
              disabled={!isConnected}
            />
            <button type="submit" className="p-3 bg-cyan-500 rounded-full m-1 hover:bg-cyan-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors" disabled={!isConnected || !messageText.trim()}>
              <SendIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChatPage;
