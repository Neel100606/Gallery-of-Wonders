// src/App.jsx

import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'; // 👈 1. Import the Header
import Footer from './components/Footer';

const App = () => {
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col min-h-screen">
        <Header /> 
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer /> 
      </div>
    </>
  );
};

export default App;