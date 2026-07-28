import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { fetchFeed, createPost } from '../store/slices/feedSlice';
import { FeedCard } from '../components/FeedCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { Send, Image, MapPin, Tag, X, FileText } from 'lucide-react';

export const Feed: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector((state: RootState) => state.feed);

  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [showMetadataInputs, setShowMetadataInputs] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(''); // Non-image documents don't get previewed as images
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (location) formData.append('location', location);
      if (targetRole) formData.append('targetRole', targetRole);
      if (file) formData.append('media', file);

      await dispatch(createPost(formData)).unwrap();
      
      // Reset inputs
      setContent('');
      setLocation('');
      setTargetRole('');
      handleRemoveFile();
      setShowMetadataInputs(false);
    } catch (err: any) {
      alert(err || 'Failed to publish post');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Post Composer Box */}
      {user && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5 rounded-2xl shadow-sm space-y-4 transition duration-200"
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-extrabold flex items-center justify-center shrink-0">
              {(user.username || user.email)[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a trial offer, training clip, career update, or scout shoutout..."
                rows={3}
                className="w-full bg-transparent text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Attachment Preview */}
          {file && (
            <div className="relative rounded-xl overflow-hidden border border-dark-200 dark:border-dark-700 max-w-md bg-dark-50 dark:bg-dark-900/50 p-2 flex items-center justify-between">
              {filePreview ? (
                <img src={filePreview} alt="Upload preview" className="h-20 w-20 object-cover rounded-lg" />
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <FileText className="w-8 h-8 text-brand-500" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-dark-800 dark:text-dark-200 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[10px] text-dark-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-dark-900/80 hover:bg-dark-900 text-white p-1 rounded-full transition duration-150"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Metadata Inputs (Location, Target Role) */}
          {showMetadataInputs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-dark-50 dark:bg-dark-900/30 rounded-xl animate-fade-in border border-dark-150 dark:border-dark-700">
              <div>
                <label className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-dark-500" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Manchester, UK"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs theme-input"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block mb-1">Target Position/Role</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 w-4 h-4 text-dark-500" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Center Back, Striker"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-xs theme-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Toolbar / Action */}
          <div className="flex items-center justify-between border-t border-dark-150 dark:border-dark-700 pt-3">
            <div className="flex items-center space-x-2">
              {/* Media Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-dark-500 hover:text-brand-500 dark:text-dark-400 dark:hover:text-brand-400 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700 transition duration-150"
                title="Add Image, Video, or Document"
              >
                <Image className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
                className="hidden"
              />

              {/* Toggle Metadata Inputs */}
              <button
                type="button"
                onClick={() => setShowMetadataInputs(!showMetadataInputs)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-150 ${
                  showMetadataInputs || location || targetRole
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Tags</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={creating || (!content.trim() && !file)}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-dark-800 disabled:text-dark-500 active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-xl transition duration-200 flex items-center space-x-1.5 shadow-md shadow-brand-500/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{creating ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Feed List */}
      <div className="space-y-4">
        {loading && posts.length === 0 ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-dark-400 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-2xl">
            No updates posted yet. Be the first to share an update!
          </div>
        ) : (
          posts.map((post) => <FeedCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};
export default Feed;
