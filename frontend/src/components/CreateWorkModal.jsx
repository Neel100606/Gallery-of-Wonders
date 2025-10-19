import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateWorkMutation, useAnalyzeImageMutation } from '../redux/api/worksApiSlice';

const CreateWorkModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Art');
  const [fileUrls, setFileUrls] = useState([]);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  
  const [createWork, { isLoading: isCreating }] = useCreateWorkMutation();
  const [analyzeContent, { isLoading: isAnalyzing }] = useAnalyzeImageMutation(); 

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    toast.info('Uploading image(s)...');
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        
        setFileUrls(prevUrls => [...prevUrls, data.secure_url]);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}.`);
      }
    }
    setIsUploading(false);
    toast.success('Image(s) uploaded successfully!');
  };

  const handleRemoveImage = (urlToRemove) => {
    setFileUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    toast.info('Image removed.');
  };
  
  const handleAiAnalysis = async () => {
    if (category === 'Writing') {
      if (description.length < 20) {
        toast.error('Please write more content (at least 20 words) to analyze.');
        return;
      }
      try {
        const result = await analyzeContent({ textContent: description }).unwrap();
        setSummary(result.caption);
        setTags(prevTags => [...new Set([...prevTags, ...result.tags])]);
        toast.success('AI analysis complete!');
      } catch (err) {
        toast.error('Failed to analyze text.');
      }
    } 
    else {
      if (fileUrls.length === 0) {
        toast.error('Please upload at least one image to analyze.');
        return;
      }
      try {
        const result = await analyzeContent({ imageUrl: fileUrls[0] }).unwrap();
        setDescription(result.caption);
        setTags(prevTags => [...new Set([...prevTags, ...result.tags])]);
        toast.success('Image analyzed successfully!');
      } catch (err) {
        toast.error('Failed to analyze image.');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAddCustomTag = () => {
    const newTag = customTag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setCustomTag('');
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please provide a title and content/description.');
      return;
    }
    if ((category === 'Art' || category === 'Photography' || category === 'Other') && fileUrls.length === 0) {
      toast.error('This category requires at least one image.');
      return;
    }
    const payload = { title, description, summary, category, tags, fileUrls: category === 'Writing' ? [] : fileUrls };
    try {
      await createWork(payload).unwrap();
      toast.success('Work created successfully!');
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create work.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSummary('');
    setCategory('Art');
    setFileUrls([]);
    setTags([]);
    setCustomTag('');
    setIsUploading(false);
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Create a New Work</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {category !== 'Writing' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload files</span>
                      <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              </div>
              {isUploading && <p className="text-sm text-indigo-600 mt-2">Uploading...</p>}
              {fileUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {fileUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-md border border-gray-200"/>
                      <button type="button" onClick={() => handleRemoveImage(url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              {category === 'Writing' ? 'Content' : 'Description'}
            </label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={category === 'Writing' ? "10" : "3"} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          {category === 'Writing' && (
             <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">AI Summary</label>
                {/* 👇 THIS TEXTAREA IS NOW EDITABLE */}
                <textarea 
                  id="summary" 
                  value={summary} 
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Click 'Generate with AI' or write your own summary..." 
                  rows="3" 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
             </div>
          )}

          <button 
            type="button" 
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="text-sm text-indigo-600 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : '✨ Generate Summary & Tags with AI'}
          </button>
          
          <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-indigo-600 hover:text-indigo-800">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <input 
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add your own tag"
                    className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="button" onClick={handleAddCustomTag} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
                    Add
                </button>
              </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>Art</option>
              <option>Photography</option>
              <option>Writing</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUploading || isAnalyzing} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-400">
              {isCreating ? 'Creating...' : 'Create Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkModal;