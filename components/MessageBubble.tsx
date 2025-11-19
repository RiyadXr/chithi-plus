import React from 'react';
import { Message } from '../types';
import { UserIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  if (!message) return null;
  
  const { sender, text, timestamp } = message;

  const alignment = isOwnMessage ? 'items-end' : 'items-start';
  const bubbleColor = isOwnMessage ? 'bg-cyan-600' : 'bg-gray-600';
  const bubbleShape = isOwnMessage ? 'rounded-t-xl rounded-bl-xl' : 'rounded-t-xl rounded-br-xl';
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const Avatar = () => {
    if(isOwnMessage) return null;
    return (
       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
          <UserIcon className="h-6 w-6 text-gray-300" />
        </div>
    )
  }

  return (
    <div className={`flex flex-col ${alignment}`}>
      <div className={`flex gap-3 max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar />
        <div className="flex flex-col">
           {!isOwnMessage && <span className="text-sm text-gray-400 mb-1 ml-2">{sender.name}</span>}
          <div className={`${bubbleColor} ${bubbleShape} px-4 py-3`}>
            <p className="text-white whitespace-pre-wrap">{text}</p>
          </div>
        </div>
      </div>
       <span className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'mr-3 text-right' : 'ml-12'}`}>{time}</span>
    </div>
  );
};

export default MessageBubble;