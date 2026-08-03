import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import { MapPin, Briefcase, Footprints, Shield, User, Camera, Save, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  // Form Fields
  const [playerFields, setPlayerFields] = useState({
    position: 'Central Midfielder',
    heightCm: '',
    weightKg: '',
    preferredFoot: 'Both',
    currentTeam: '',
    contractStatus: 'Free-Agent',
    isLookingForJob: true,
    bio: '',
  });

  const [teamFields, setTeamFields] = useState({
    name: '',
    city: '',
    email: '',
    biography: '',
    recruiting: false,
  });

  const [staffFields, setStaffFields] = useState({
    roleDescription: '',
    experienceYears: '',
    currentTeam: '',
    isLookingForJob: true,
    bio: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);
  const [deleteCv, setDeleteCv] = useState(false);
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  const fetchMyProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/profiles/me');
      const data = response.data.profile;
      setProfile(data);

      // Initialize form fields
      if (user?.role === 'player') {
        setPlayerFields({
          position: data.position || 'Central Midfielder',
          heightCm: data.heightCm || '',
          weightKg: data.weightKg || '',
          preferredFoot: data.preferredFoot || 'Both',
          currentTeam: data.currentTeam || '',
          contractStatus: data.contractStatus || 'Free-Agent',
          isLookingForJob: data.isLookingForJob !== undefined ? data.isLookingForJob : true,
          bio: data.bio || '',
        });
        setImagePreview(data.profileImage || '');
      } else if (user?.role === 'team') {
        setTeamFields({
          name: data.name || '',
          city: data.city || '',
          email: data.email || '',
          biography: data.biography || '',
          recruiting: data.recruiting || false,
        });
      } else if (user?.role === 'staff') {
        setStaffFields({
          roleDescription: data.roleDescription || '',
          experienceYears: data.experienceYears || '',
          currentTeam: data.currentTeam || '',
          isLookingForJob: data.isLookingForJob !== undefined ? data.isLookingForJob : true,
          bio: data.bio || '',
        });
        setImagePreview(data.profileImage || '');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchMyProfile();
  }, [user, fetchMyProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(false);
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }
      if (selectedCvFile) {
        formData.append('cvFile', selectedCvFile);
      }
      if (deleteCv) {
        formData.append('deleteCv', 'true');
      }

      if (user?.role === 'player') {
        Object.entries(playerFields).forEach(([key, val]) => {
          formData.append(key, String(val));
        });
      } else if (user?.role === 'team') {
        Object.entries(teamFields).forEach(([key, val]) => {
          formData.append(key, String(val));
        });
      } else if (user?.role === 'staff') {
        Object.entries(staffFields).forEach(([key, val]) => {
          formData.append(key, String(val));
        });
      }

      const response = await api.put('/profiles/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(response.data.profile);
      setSuccess('Profile updated successfully!');
      setSelectedFile(null);
      setSelectedCvFile(null);
      setDeleteCv(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex-1 max-w-4xl mx-auto px-4 py-8"><ProfileSkeleton /></div>;
  if (!profile) return <div className="text-center py-12 text-red-500">Profile data missing.</div>;

  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
        Manage Profile
      </h1>

      {/* Messages */}
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-sm">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Card: Profile Overview */}
        <div className="md:col-span-1 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-3xl overflow-hidden shadow-sm">
          {/* Header color block */}
          <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-400"></div>
          
          <div className="px-5 pb-6 text-center relative flex flex-col items-center">
            {/* Avatar upload container */}
            {user?.role !== 'team' && (
              <div className="relative -mt-12 mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dark-800 shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-dark-700 text-dark-400 border-4 border-white dark:border-dark-800 shadow-md flex items-center justify-center font-extrabold text-2xl uppercase">
                    {(user?.username || user?.email || '')[0]}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            )}

            {user?.role === 'team' && (
              <div className="w-20 h-20 rounded-2xl bg-brand-100 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center font-extrabold text-2xl uppercase shadow-sm -mt-10 mb-4 border-2 border-white dark:border-dark-800">
                {teamFields.name[0] || (user?.username || user?.email || '')[0].toUpperCase()}
              </div>
            )}

            <h2 className="text-base font-bold text-dark-900 dark:text-white">
              {user?.role === 'team' ? teamFields.name || 'My Club' : (user?.username || user?.email)}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-50 dark:bg-brand-950/20 text-brand-500 uppercase mt-1">
              {user?.role} account
            </span>

            {/* Profile fields overview */}
            <div className="w-full text-left space-y-3.5 mt-6 text-xs text-dark-600 dark:text-dark-300 pt-4 border-t border-dark-150 dark:border-dark-700">
              {user?.role === 'player' && (
                <>
                  <div className="flex items-center space-x-2.5">
                    <User className="w-4 h-4 text-dark-500" />
                    <span>Position: <strong className="text-dark-800 dark:text-white">{playerFields.position}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Footprints className="w-4 h-4 text-dark-500" />
                    <span>Preferred Foot: <strong className="text-dark-800 dark:text-white">{playerFields.preferredFoot}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Shield className="w-4 h-4 text-dark-500" />
                    <span>Contract: <strong className="text-dark-800 dark:text-white">{playerFields.contractStatus}</strong></span>
                  </div>
                </>
              )}

              {user?.role === 'team' && (
                <>
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-dark-500" />
                    <span>Location: <strong className="text-dark-800 dark:text-white">{teamFields.city || 'Not set'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Briefcase className="w-4 h-4 text-dark-500" />
                    <span>Status: <strong className={teamFields.recruiting ? 'text-green-500' : 'text-red-500'}>
                      {teamFields.recruiting ? 'Actively Recruiting' : 'Not Recruiting'}
                    </strong></span>
                  </div>
                </>
              )}

              {user?.role === 'staff' && (
                <>
                  <div className="flex items-center space-x-2.5">
                    <User className="w-4 h-4 text-dark-500" />
                    <span>Role: <strong className="text-dark-800 dark:text-white">{staffFields.roleDescription || 'Not set'}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Briefcase className="w-4 h-4 text-dark-500" />
                    <span>Experience: <strong className="text-dark-800 dark:text-white">{staffFields.experienceYears ? `${staffFields.experienceYears} Years` : 'Not set'}</strong></span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Edit Form */}
        <div className="md:col-span-2 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-dark-900 dark:text-white mb-6">Profile Settings</h3>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            {/* Render forms tailored to role */}
            
            {/* Player Fields */}
            {user?.role === 'player' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Field Position</label>
                    <select
                      value={playerFields.position}
                      onChange={(e) => setPlayerFields({ ...playerFields, position: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-sm theme-select"
                    >
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Center Back">Center Back</option>
                      <option value="Left-Back">Left-Back</option>
                      <option value="Right-Back">Right-Back</option>
                      <option value="Defensive Midfielder">Defensive Midfielder</option>
                      <option value="Central Midfielder">Central Midfielder</option>
                      <option value="Attacking Midfielder">Attacking Midfielder</option>
                      <option value="Left Winger">Left Winger</option>
                      <option value="Right Winger">Right Winger</option>
                      <option value="Striker">Striker</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Preferred Foot</label>
                    <select
                      value={playerFields.preferredFoot}
                      onChange={(e) => setPlayerFields({ ...playerFields, preferredFoot: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl text-sm theme-select"
                    >
                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Height (cm)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={playerFields.heightCm}
                      onChange={(e) => setPlayerFields({ ...playerFields, heightCm: e.target.value })}
                      placeholder="e.g. 185"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Weight (kg)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={playerFields.weightKg}
                      onChange={(e) => setPlayerFields({ ...playerFields, weightKg: e.target.value })}
                      placeholder="e.g. 78"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Contract Status</label>
                    <select
                      value={playerFields.contractStatus}
                      onChange={(e) => setPlayerFields({ ...playerFields, contractStatus: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl text-sm theme-select"
                    >
                      <option value="Free-Agent">Free-Agent</option>
                      <option value="Under-Contract">Under-Contract</option>
                      <option value="Loan">Loan</option>
                      <option value="Retired">Retired</option>
                      <option value="Transfer Listed">Transfer Listed</option>
                      <option value="Trial">Trial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Current Club</label>
                    <input
                      type="text"
                      value={playerFields.currentTeam}
                      onChange={(e) => setPlayerFields({ ...playerFields, currentTeam: e.target.value })}
                      placeholder="e.g. Leeds Academy"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      id="looking-job-player"
                      type="checkbox"
                      checked={playerFields.isLookingForJob}
                      onChange={(e) => setPlayerFields({ ...playerFields, isLookingForJob: e.target.checked })}
                      className="w-4 h-4 accent-brand-500 text-brand-600 bg-dark-900 border-dark-750 rounded focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="looking-job-player" className="text-xs font-semibold text-dark-300 ml-2 cursor-pointer">
                      Actively seeking trial offers / new club
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-dark-300 block mb-1">Biography / Career Summary</label>
                  <textarea
                    rows={4}
                    value={playerFields.bio}
                    onChange={(e) => setPlayerFields({ ...playerFields, bio: e.target.value })}
                    placeholder="Describe your career statistics, key achievements, strengths, and goals..."
                    className="w-full px-3 py-2 rounded-xl text-sm theme-textarea"
                  />
                </div>
              </>
            )}

            {/* Team Fields */}
            {user?.role === 'team' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Club / Organization Name</label>
                    <input
                      type="text"
                      required
                      value={teamFields.name}
                      onChange={(e) => setTeamFields({ ...teamFields, name: e.target.value })}
                      placeholder="e.g. Manchester City FC"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">City / Location</label>
                    <input
                      type="text"
                      required
                      value={teamFields.city}
                      onChange={(e) => setTeamFields({ ...teamFields, city: e.target.value })}
                      placeholder="e.g. Manchester"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Public Contact Email</label>
                    <input
                      type="email"
                      required
                      value={teamFields.email}
                      onChange={(e) => setTeamFields({ ...teamFields, email: e.target.value })}
                      placeholder="recruitment@myclub.com"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      id="recruiting-team"
                      type="checkbox"
                      checked={teamFields.recruiting}
                      onChange={(e) => setTeamFields({ ...teamFields, recruiting: e.target.checked })}
                      className="w-4 h-4 accent-brand-500 text-brand-600 bg-dark-900 border-dark-750 rounded focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="recruiting-team" className="text-xs font-semibold text-dark-300 ml-2 cursor-pointer">
                      We are actively recruiting players & staff
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-dark-300 block mb-1">Club Biography</label>
                  <textarea
                    rows={4}
                    value={teamFields.biography}
                    onChange={(e) => setTeamFields({ ...teamFields, biography: e.target.value })}
                    placeholder="Tell job seekers about your club structure, league status, and developmental goals..."
                    className="w-full px-3 py-2 rounded-xl text-sm theme-textarea"
                  />
                </div>
              </>
            )}

            {/* Staff Fields */}
            {user?.role === 'staff' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Professional Role / Title</label>
                    <input
                      type="text"
                      required
                      value={staffFields.roleDescription}
                      onChange={(e) => setStaffFields({ ...staffFields, roleDescription: e.target.value })}
                      placeholder="e.g. Goalkeeper Coach / Physiotherapist"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Years of Experience</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={staffFields.experienceYears}
                      onChange={(e) => setStaffFields({ ...staffFields, experienceYears: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark-300 block mb-1">Current Club / Employer</label>
                    <input
                      type="text"
                      value={staffFields.currentTeam}
                      onChange={(e) => setStaffFields({ ...staffFields, currentTeam: e.target.value })}
                      placeholder="e.g. Middlesbrough Academy"
                      className="w-full px-3 py-2 rounded-xl text-sm theme-input"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      id="looking-job-staff"
                      type="checkbox"
                      checked={staffFields.isLookingForJob}
                      onChange={(e) => setStaffFields({ ...staffFields, isLookingForJob: e.target.checked })}
                      className="w-4 h-4 accent-brand-500 text-brand-600 bg-dark-900 border-dark-750 rounded focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="looking-job-staff" className="text-xs font-semibold text-dark-300 ml-2 cursor-pointer">
                      Actively looking for career opportunities
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-dark-300 block mb-1">Biography / Career Summary</label>
                  <textarea
                    rows={4}
                    value={staffFields.bio}
                    onChange={(e) => setStaffFields({ ...staffFields, bio: e.target.value })}
                    placeholder="Tell clubs about your experience, training methodologies, and certifications..."
                    className="w-full px-3 py-2 rounded-xl text-sm theme-textarea"
                  />
                </div>
              </>
            )}

            {/* CV Upload Section */}
            <div className="pt-4 border-t border-dark-150 dark:border-dark-700 mt-6">
              <label className="text-xs font-bold text-dark-300 block mb-2">Curriculum Vitae (CV)</label>
              
              {profile?.cvName && !deleteCv ? (
                <div className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl mb-3">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <FileText className="w-5 h-5 text-brand-500 shrink-0" />
                    <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-dark-900 dark:text-white truncate hover:underline">
                      {profile.cvName}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleteCv(true)}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                    title="Remove CV"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              {(deleteCv || !profile?.cvName) && (
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={cvFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedCvFile(file);
                    }}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => cvFileInputRef.current?.click()}
                    className="text-xs font-semibold px-4 py-2 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 text-dark-800 dark:text-white rounded-xl transition-colors"
                  >
                    Select CV File
                  </button>
                  {selectedCvFile && (
                    <span className="text-xs text-dark-500 dark:text-dark-400 truncate max-w-[200px]">
                      {selectedCvFile.name}
                    </span>
                  )}
                  {deleteCv && profile?.cvName && !selectedCvFile && (
                    <span className="text-xs text-red-500">CV marked for deletion upon save</span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-500 hover:bg-brand-600 disabled:bg-dark-800 disabled:text-dark-500 active:scale-95 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition duration-200 flex items-center space-x-1.5 shadow-lg shadow-brand-500/10"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
