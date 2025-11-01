import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import { socket } from './socket';
import { apiSlice } from './redux/api/apiSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    const handleWorkUpdate = (updatedWork) => {
      console.log('[Socket.IO] Received work update:', updatedWork._id);
      dispatch(apiSlice.util.invalidateTags(['Work']));
    };

    socket.on('workUpdated', handleWorkUpdate);

    // Cleanup function
    return () => {
      socket.off('workUpdated', handleWorkUpdate);
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;