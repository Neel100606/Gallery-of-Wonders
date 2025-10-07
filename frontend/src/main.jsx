import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App.jsx';
import './index.css';
import store from './redux/store.js';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import WorkDetailPage from './pages/WorkDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 👈 Import ProtectedRoute
import EditProfilePage from './pages/EditProfilePage.jsx'; // 👈 Import the new page
import CollectionDetailPage from './pages/CollectionDetailPage.jsx'; 
import SearchPage from './pages/SearchPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; 

// Create the router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/search/:keyword" element={<SearchPage />} /> 
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/work/:id" element={<WorkDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} /> {/* 👈 For the current user */}
      <Route path="/profile/:userId" element={<ProfilePage />} /> {/* 👈 For other users */}
      <Route path="/collection/:id" element={<CollectionDetailPage />} />

      <Route path="" element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} /> {/* 👈 Add this line */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);