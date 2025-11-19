import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types';

// IMPORTANT: Replace this with your deployed Render backend URL after deployment.
// Example: https://chithi-plus-server.onrender.com
const SERVER_URL = 'http://localhost:3001';

export const useChatRoom = (pin: string | undefined, currentUser: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!pin || !currentUser) return;

    socketRef.current = io(SERVER_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        transports: ['websocket'],
    });
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log('Connected to server!');
      setIsConnected(true);
      socket.emit('joinRoom', { pin, user: currentUser });
    };

    const handleDisconnect = () => {
      console.log('Disconnected from server.');
      setIsConnected(false);
    };

    const handleRoomData = (data: { messages: Message[]; users: User[] }) => {
      setMessages(data.messages);
      setUsers(data.users);
    };

    const handleNewMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    
    const handleUserListUpdate = (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('roomData', handleRoomData);
    socket.on('newMessage', handleNewMessage);
    socket.on('userListUpdate', handleUserListUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('roomData', handleRoomData);
      socket.off('newMessage', handleNewMessage);
      socket.off('userListUpdate', handleUserListUpdate);
      socket.disconnect();
    };
  }, [pin, currentUser]);

  const sendMessage = (text: string) => {
    if (socketRef.current?.connected && currentUser && pin) {
      socketRef.current.emit('sendMessage', {
        pin,
        text,
        sender: currentUser,
      });
    } else {
        console.error("Cannot send message, socket not connected.");
    }
  };

  return { messages, users, isConnected, sendMessage };
};
