import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/api/usersApiSlice.js';
import { logout } from '../redux/features/authSlice.js';
import CreateWorkModal from './CreateWorkModal';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  // Show search bar only on home and search pages
  const showSearchBar = location.pathname === '/' || location.pathname.startsWith('/search');

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo/Name */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold font-serif text-gray-800">
                Gallery of Wonders
              </Link>
            </div>

            {/* Conditional Search Form */}
            {showSearchBar && (
              <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search"
                    />
                  </form>
                </div>
              </div>
            )}

            {/* Right Side Links */}
            <div className="hidden md:block">
              <div className={`ml-4 flex items-center md:ml-6 ${!showSearchBar && 'flex-1 justify-end'}`}>
                {userInfo ? (
                  <div className="flex items-center space-x-4">
                    {/* Create Button */}
                    <button 
                      onClick={() => setCreateModalOpen(true)}
                      className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                      Create
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                      >
                        <img
                          src={userInfo.profileImage}
                          alt="profile"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span>{userInfo.name}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {isMenuOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            My Profile
                          </Link>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={logoutHandler}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    {/* Links for Guests */}
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CreateWorkModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </>
  );
};

export default Navbar;