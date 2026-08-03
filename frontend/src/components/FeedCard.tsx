import React from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { toggleLike, deletePost, addComment, type IPost } from '../store/slices/feedSlice';
import { useAuth } from '../context/AuthContext';
import { Heart, Trash2, MapPin, Tag, MessageCircle, Send } from 'lucide-react';

interface FeedCardProps {
  post: IPost;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');

  // Determine author name, avatar, and ID based on polymorphic structure
  let authorName = 'Unknown User';
  let avatarInitial = 'U';
  let avatarUrl = '';
  let authorUserId = '';

  if (post.profileModel === 'Team') {
    const teamProfile = post.profileId as any;
    authorName = teamProfile.name || 'Unknown Club';
    avatarInitial = authorName[0];
    authorUserId = teamProfile.userID?._id || teamProfile.userID || '';
  } else if (post.profileModel === 'User') {
    const userObj = post.profileId as any;
    authorName = userObj.username || userObj.email || 'Unknown User';
    avatarInitial = authorName[0].toUpperCase();
    authorUserId = userObj._id || '';
  }

  const isOwner = user && user.id === authorUserId;
  const isLiked = user && post.likes.includes(user.id);

  const handleLike = () => {
    dispatch(toggleLike(post._id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(post._id));
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({ postId: post._id, text: commentText.trim() }));
    setCommentText('');
  };

  return (
    <div className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5 rounded-2xl transition duration-200 hover:shadow-md animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={authorName} className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-extrabold flex items-center justify-center">
              {avatarInitial}
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-dark-900 dark:text-white leading-tight">
              {authorName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] font-semibold text-brand-500 capitalize">
                {post.profileModel === 'Team' ? 'Team Account' : 'Individual'}
              </span>
              <span className="text-[10px] text-dark-400">•</span>
              <span className="text-[10px] text-dark-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-1.5 text-dark-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition duration-200"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className="text-sm text-dark-800 dark:text-dark-200 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>

        {/* Media Attachments */}
        {post.media && post.media.length > 0 && (
          <div className="mt-4 rounded-xl overflow-hidden border border-dark-150 dark:border-dark-700 max-h-96">
            {post.media.map((med, index) => {
              if (med.type === 'image') {
                return (
                  <img
                    key={index}
                    src={med.url}
                    alt="Uploaded media"
                    className="w-full object-cover max-h-96"
                    loading="lazy"
                  />
                );
              } else if (med.type === 'video') {
                return (
                  <video
                    key={index}
                    src={med.url}
                    controls
                    className="w-full max-h-96"
                  />
                );
              } else if (med.type === 'document') {
                return (
                  <div key={index} className="p-4 bg-dark-50 dark:bg-dark-900/50 flex items-center space-x-2">
                    <span className="text-xs font-semibold text-brand-500">PDF Document:</span>
                    <a
                      href={med.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-600 hover:underline"
                    >
                      View Attachment
                    </a>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* Meta Labels */}
      <div className="flex flex-wrap gap-2 mt-4">
        {post.location && (
          <span className="inline-flex items-center text-[10px] font-semibold bg-dark-100 dark:bg-dark-700/50 text-dark-600 dark:text-dark-300 px-2 py-1 rounded-lg">
            <MapPin className="w-3 h-3 mr-1" />
            {post.location}
          </span>
        )}
        {post.targetRole && (
          <span className="inline-flex items-center text-[10px] font-semibold bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-lg">
            <Tag className="w-3 h-3 mr-1" />
            Looking for: {post.targetRole}
          </span>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="mt-4 pt-3 border-t border-dark-150 dark:border-dark-700 flex items-center space-x-2">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition duration-200 ${
            isLiked
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
              : 'text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length} Likes</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition duration-200 ${
            showComments
              ? 'bg-brand-500/10 text-brand-500 hover:bg-brand-500/20'
              : 'text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.length || 0} Comments</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-dark-150 dark:border-dark-700 animate-fade-in">
          {/* List Comments */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex space-x-2">
                  {comment.user.profileImage ? (
                    <img src={comment.user.profileImage} alt={comment.user.username} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {comment.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="bg-dark-50 dark:bg-dark-900/50 p-2.5 rounded-2xl rounded-tl-none flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-dark-900 dark:text-white">
                        {comment.user.username}
                      </span>
                      <span className="text-[10px] text-dark-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-dark-700 dark:text-dark-300">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-center text-dark-400 py-2">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Form */}
          {user && (
            <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-700 text-sm px-4 py-2 rounded-full focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:text-white transition-colors placeholder:text-dark-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 rounded-full bg-brand-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
export default FeedCard;
