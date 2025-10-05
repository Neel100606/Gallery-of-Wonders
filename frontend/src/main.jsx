import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import HomePage from './pages/HomePage.jsx'; // We'll create this next
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx'; 
import ProfilePage from './pages/ProfilePage.jsx'; // 👈 1. Import ProfilePage
import PrivateRoute from './components/PrivateRoute.jsx'; // 👈 2. Import PrivateRoute
import CreateWorkPage from './pages/CreateWorkPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import WorkDetailPage from './pages/WorkDetailPage.jsx';
import MyCollectionsPage from './pages/MyCollectionsPage'; 
import CollectionDetailPage from './pages/CollectionDetailPage';
import MyWorksPage from './pages/MyWorksPage'; 
import EditWorkPage from './pages/EditWorkPage'; 

// React Router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store.js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

       <Route path="/work/:id" element={<WorkDetailPage />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/work/create" element={<CreateWorkPage />} />
        <Route path="/my-collections" element={<MyCollectionsPage />} />
        <Route path="/collection/:id" element={<CollectionDetailPage />} />
        <Route path="/my-works" element={<MyWorksPage />} /> 
        <Route path="/work/edit/:id" element={<EditWorkPage />} />
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