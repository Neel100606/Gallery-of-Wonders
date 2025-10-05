import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaThList, FaPaintBrush } from 'react-icons/fa';
import { useGetProfileQuery, useUpdateProfileMutation } from '../redux/api/usersApiSlice.js';
import { setCredentials } from '../redux/features/authSlice.js';

const Loader = () => ( <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div> );

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { data: user, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      toast.info('Uploading image...');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setProfileImage(data.secure_url);
      toast.success('Image ready. Click "Update Profile" to save all changes.');
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

  if (isLoading) return ( <div className="flex justify-center items-center min-h-screen bg-slate-100"><Loader /></div> );
  if (error) return ( <div className="flex justify-center items-center min-h-screen bg-slate-100 text-red-500">Error: {error?.data?.message || error.error}</div> );

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Your Profile</h1>
          
          <div className="mb-6 flex justify-center gap-4 flex-wrap">
            <Link 
              to="/my-collections" 
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold py-2 px-5 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <FaThList />
              View My Collections
            </Link>
            <Link 
              to="/my-works" 
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold py-2 px-5 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaPaintBrush />
              Manage My Works
            </Link>
          </div>
          
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-200" />
              <div className="text-center sm:text-left">
                <label htmlFor="image-upload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">Change Photo</label>
                <input type="file" id="image-upload" accept="image/*" onChange={uploadFileHandler} className="hidden" />
                <p className="text-xs text-slate-500 mt-2">Recommended: Square image (e.g., 400x400px)</p>
              </div>
            </div>

            <hr className="border-slate-200"/>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="4" maxLength="250" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"></textarea>
              <p className="text-right text-xs text-slate-500 mt-1">{bio ? bio.length : 0}/250</p>
            </div>
            
            <h2 className="text-xl font-semibold text-slate-800 pt-4 border-t border-slate-200">Update Password</h2>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
            </div>

            <button type="submit" disabled={isUpdating} className="w-full py-3 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50">
              {isUpdating ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

