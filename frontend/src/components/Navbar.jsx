import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('discover');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  // Set active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveTab('discover');
    else if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/dashboard')) setActiveTab('dashboard');
  }, [location]);

  // Only show search bar for logged-in users on specific pages
  const showSearchBar = userInfo && (location.pathname === '/' || location.pathname.startsWith('/search'));

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
    }
  };

  const NavigationTabs = () => (
    <div className="hidden md:flex items-center space-x-1 bg-gray-800 rounded-xl p-1">
      {[
        { id: 'discover', label: 'Discover', path: '/', icon: '🌌' },
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { id: 'profile', label: 'Profile', path: '/profile', icon: '👤' },
      ].map((tab) => (
        <Link
          key={tab.id}
          to={tab.path}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab.id
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 w-full bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="text-xl font-bold text-white font-serif">
                  GalleryWonders
                </span>
              </Link>

              {userInfo && <NavigationTabs />}
            </div>

            {/* Search Bar - Only for logged-in users */}
            {showSearchBar && (
              <div className="flex-1 max-w-xl mx-8">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Search works..."
                  />
                </form>
              </div>
            )}

            {/* If user is not logged in and we're not showing search bar, add spacer for centering */}
            {!userInfo && !showSearchBar && (
              <div className="flex-1"></div>
            )}

            {/* Actions Section */}
            <div className="flex items-center space-x-3">
              {userInfo ? (
                <>
                  {/* Create Button */}
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Create
                  </button>


                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800"
                    >
                      <img
                        src={userInfo.profileImage}
                        alt="profile"
                        className="h-8 w-8 rounded-lg object-cover border border-gray-700"
                      />
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg border border-gray-700 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-semibold text-white">{userInfo.name}</p>
                          <p className="text-xs text-gray-400 truncate">{userInfo.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          View Profile
                        </Link>

                        <Link
                          to="/dashboard"
                          className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>

                        <div className="border-t border-gray-700 mt-2 pt-2">
                          <button
                            onClick={logoutHandler}
                            className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-white px-4 py-2 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {userInfo && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900">
            <div className="flex justify-around py-3">
              {[
                { id: 'discover', label: 'Discover', path: '/', icon: '🌌' },
                { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: '📊' },
                { id: 'profile', label: 'Profile', path: '/profile', icon: '👤' },
              ].map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg text-xs ${activeTab === tab.id
                      ? 'text-white bg-gray-800'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>

      {/* Spacer */}
      <div className={`${userInfo ? 'h-16 md:h-16' : 'h-16'}`}></div>

      <CreateWorkModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </>
  );
};

export default Navbar;