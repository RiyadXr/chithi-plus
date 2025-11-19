
export interface User {
  id: string;
  name: string;
  isBot?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: number;
}

export interface ChatRoom {
  id: string; // This will be the PIN
  messages: Message[];
  users: User[];
}
