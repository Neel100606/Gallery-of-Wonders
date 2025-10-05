import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';

// We will create the Navbar component in a later step
// import Navbar from './components/layout/Navbar';

const App = () => {
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