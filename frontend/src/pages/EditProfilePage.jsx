import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProfileQuery, useUpdateProfileMutation } from '../redux/api/usersApiSlice';
import { setCredentials } from '../redux/features/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const EditProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch();
  
  const { data: user, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Access environment variables from Vite
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setProfileImage(user.profileImage);
    }
  }, [user]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    try {
      toast.info('Uploading image...');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setProfileImage(data.secure_url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed.');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const updatedData = { name, email, bio, profileImage };
      if (password) {
        updatedData.password = password;
      }
      
      const res = await updateProfile(updatedData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully!');
      refetch();
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return ( <div className="flex justify-center items-center h-screen"><Loader /></div> );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h1>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <form onSubmit={submitHandler} className="space-y-6">
            
            <div className="flex items-center space-x-6">
                <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
                <div>
                    <label htmlFor="image-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Change Image</label>
                    <input type="file" id="image-upload" accept="image/*" onChange={uploadFileHandler} className="hidden" />
                </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 pt-4 border-t border-gray-200">Update Password</h2>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <button type="submit" disabled={isUpdating} className="w-full py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed">
              {isUpdating ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;