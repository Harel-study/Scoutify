import React from 'react';
import { MapPin, Briefcase, Footprints, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  profile: any;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const navigate = useNavigate();

  // Deduce details based on role/type
  const type = profile.type || (profile.position ? 'player' : profile.roleDescription ? 'staff' : 'team');
  let name = 'Unknown Profile';
  let title = '';
  let subTitle = '';
  let avatar = '';
  let bio = profile.bio || profile.biography || '';
  let isLooking = false;
  let targetId = '';

  if (type === 'player') {
    name = profile.userID?.username || profile.userID?.email || 'Athlete';
    title = `Player • ${profile.position}`;
    subTitle = profile.currentTeam ? `Plays for ${profile.currentTeam}` : 'Free Agent';
    avatar = profile.profileImage || '';
    isLooking = profile.isLookingForJob;
    targetId = profile.userID?._id || profile.userID || '';
  } else if (type === 'team') {
    name = profile.name || 'Athletic Club';
    title = 'Sports Club';
    subTitle = `${profile.city || 'Unknown Location'}`;
    isLooking = profile.recruiting; // Map recruiting status to looking badge
    targetId = profile.userID?._id || profile.userID || profile._id || '';
  } else if (type === 'staff') {
    name = profile.userID?.username || profile.userID?.email || 'Staff member';
    title = `Staff • ${profile.roleDescription}`;
    subTitle = profile.currentTeam ? `At ${profile.currentTeam}` : 'Available';
    avatar = profile.profileImage || '';
    isLooking = profile.isLookingForJob;
    targetId = profile.userID?._id || profile.userID || '';
  }

  const handleMessageClick = () => {
    if (targetId) {
      navigate(`/messages?user=${targetId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5 rounded-2xl transition duration-200 hover:shadow-md flex flex-col justify-between h-full animate-slide-up">
      <div>
        {/* Top Info */}
        <div className="flex items-center space-x-3.5">
          {avatar ? (
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border border-dark-200 dark:border-dark-600" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-extrabold flex items-center justify-center text-sm uppercase">
              {name[0]}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-dark-900 dark:text-white truncate">
              {name}
            </h3>
            <p className="text-[11px] font-semibold text-brand-500 mt-0.5">{title}</p>
          </div>
        </div>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] font-medium text-dark-400">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {subTitle}
          </span>
          {type === 'player' && (
            <span className="flex items-center bg-dark-100 dark:bg-dark-700/50 text-dark-600 dark:text-dark-300 px-2 py-0.5 rounded">
              <Footprints className="w-3.5 h-3.5 mr-1" />
              {profile.preferredFoot} Foot
            </span>
          )}
          {type === 'staff' && profile.experienceYears !== undefined && (
            <span className="flex items-center bg-dark-100 dark:bg-dark-700/50 text-dark-600 dark:text-dark-300 px-2 py-0.5 rounded">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              {profile.experienceYears} Years Exp
            </span>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-dark-500 dark:text-dark-300 mt-3.5 line-clamp-3 leading-relaxed">
          {bio || 'No biography details provided.'}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-dark-150 dark:border-dark-700 flex items-center justify-between">
        <div>
          {isLooking ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-500">
              {type === 'team' ? 'Recruiting' : 'Open to Offers'}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-dark-100 dark:bg-dark-700 text-dark-500">
              {type === 'team' ? 'Not Recruiting' : 'Inactive'}
            </span>
          )}
        </div>

        {targetId && (
          <button
            onClick={handleMessageClick}
            className="flex items-center space-x-1 text-xs text-brand-500 hover:text-brand-600 font-bold transition duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default ProfileCard;
