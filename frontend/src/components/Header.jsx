import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../redux/api/usersApiSlice.js';
import { logout } from '../redux/features/authSlice.js';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };
  
  const activeLinkStyle = {
    color: '#a855f7', // A nice purple color for the active link
    fontWeight: '600',
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold tracking-tight">
              Gallery of Wonders
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/gallery" style={({isActive}) => isActive ? activeLinkStyle : undefined} className="hover:text-purple-400 transition">Gallery</NavLink>
            <NavLink to="/about" style={({isActive}) => isActive ? activeLinkStyle : undefined} className="hover:text-purple-400 transition">About</NavLink>

            {userInfo ? (
              // Logged In User Links
              <div className="flex items-center space-x-4">
                {/* 👇 ADDED UPLOAD BUTTON FOR DESKTOP */}
                <Link to="/work/create" className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition">
                  Upload
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <span>{userInfo.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1" onMouseLeave={() => setIsProfileOpen(false)}>
                      <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</NavLink>
                      <button onClick={logoutHandler} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Logged Out Buttons
              <div className="flex items-center space-x-4">
                <NavLink to="/login" className="px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition">Sign In</NavLink>
                <NavLink to="/register" className="px-4 py-2 rounded-md text-sm font-medium bg-purple-600 hover:bg-purple-700 transition">Sign Up</NavLink>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/gallery" style={({isActive}) => isActive ? activeLinkStyle : undefined} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Gallery</NavLink>
            <NavLink to="/about" style={({isActive}) => isActive ? activeLinkStyle : undefined} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">About</NavLink>
            <hr className="border-gray-600 my-2"/>
            {userInfo ? (
              <>
                {/* 👇 ADDED UPLOAD LINK FOR MOBILE */}
                <NavLink to="/work/create" className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600 hover:bg-purple-700">Upload Work</NavLink>
                <NavLink to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">{userInfo.name}'s Profile</NavLink>
                <button onClick={logoutHandler} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Sign In</NavLink>
                <NavLink to="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;