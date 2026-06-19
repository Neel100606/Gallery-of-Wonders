import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Your backend URL
export const socket = io(URL, {
  autoConnect: false // We will connect manually in App.jsx
});