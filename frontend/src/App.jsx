import React, { useEffect } from 'react'; // 👈 Add useEffect
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { socket } from './socket'; // 👈 Import our socket instance
import { useDispatch } from 'react-redux'; // 👈 Import useDispatch
import { apiSlice } from './redux/api/apiSlice'; // 👈 Import apiSlice

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect(); // Connect to the WebSocket server when the app loads

    // Listener for when any work is updated (like, comment, etc.)
    const handleWorkUpdate = (updatedWork) => {
      console.log('Received work update:', updatedWork);
      
      
      // Update the cache for the main 'getWorks' query (for the home feed)
      dispatch(apiSlice.util.invalidateTags(['Work']));

    };

    socket.on('workUpdated', handleWorkUpdate);

    // Cleanup function when the App component unmounts
    return () => {
      socket.off('workUpdated', handleWorkUpdate);
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Navbar />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;