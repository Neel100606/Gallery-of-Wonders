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
    toast.success('Images uploaded successfully!');
  };

  const handleRemoveImage = (urlToRemove) => {
    setFileUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
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
    } else {
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Create New Work</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Art">Art</option>
              <option value="Photography">Photography</option>
              <option value="Writing">Writing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* File Upload for non-writing categories */}
          {category !== 'Writing' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium">
                  Click to upload images
                </label>
                <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                  <p className="text-gray-400 text-sm mt-2">Uploading...</p>
                </div>
              )}
              
              {fileUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-300 mb-2">Uploaded images:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {fileUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter work title"
            />
          </div>

          {/* Description/Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {category === 'Writing' ? 'Content' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={category === 'Writing' ? 8 : 4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={category === 'Writing' ? 'Write your content here...' : 'Describe your work...'}
            />
          </div>

          {/* AI Analysis Button */}
          <button
            type="button"
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 disabled:text-gray-400 transition-colors"
          >
            <span>✨</span>
            <span>{isAnalyzing ? 'Analyzing...' : 'Generate Summary & Tags with AI'}</span>
          </button>

          {/* Summary for Writing */}
          {category === 'Writing' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="AI-generated summary will appear here..."
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1 border border-purple-500/30">
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-purple-400 hover:text-purple-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 disabled:from-purple-400 disabled:to-blue-300 transition-all duration-300 font-medium"
            >
              {isCreating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Work'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkModal;