import { io } from 'socket.io-client';

const URL = 'http://localhost:5000'; // Your backend URL
export const socket = io(URL, {
  autoConnect: false // We will connect manually in App.jsx
});