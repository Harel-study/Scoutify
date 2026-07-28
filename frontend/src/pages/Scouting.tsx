import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/axios';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import { Search } from 'lucide-react';

export const Scouting: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [role, setRole] = useState<'player' | 'team' | 'staff' | ''>('player');
  const [position, setPosition] = useState('');
  const [preferredFoot, setPreferredFoot] = useState('');
  const [recruiting, setRecruiting] = useState('');
  const [isLookingForJob, setIsLookingForJob] = useState('');

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query: Record<string, string> = {};
      if (role) query.role = role;
      if (position) query.position = position;
      if (preferredFoot) query.preferredFoot = preferredFoot;
      if (recruiting) query.recruiting = recruiting;
      if (isLookingForJob) query.isLookingForJob = isLookingForJob;

      const params = new URLSearchParams(query).toString();
      const response = await api.get(`/profiles/search?${params}`);
      setResults(response.data.results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search profiles');
    } finally {
      setLoading(false);
    }
  }, [role, position, preferredFoot, recruiting, isLookingForJob]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]); // Trigger search when dependencies change

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
          Scouting Hub
        </h1>
        <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
          Scout athletes, discover potential staff, or find active organizations.
        </p>
      </div>

      {/* Filter Options */}
      <form
        onSubmit={handleFilterSubmit}
        className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-5 rounded-2xl shadow-sm space-y-4"
      >
        <div className="flex border-b border-dark-150 dark:border-dark-750 pb-2">
          <button
            type="button"
            onClick={() => setRole('player')}
            className={`px-4 py-2 text-xs font-bold transition-all duration-150 border-b-2 -mb-2.5 ${
              role === 'player'
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-dark-500 hover:text-dark-300'
            }`}
          >
            Athletes
          </button>
          <button
            type="button"
            onClick={() => setRole('team')}
            className={`px-4 py-2 text-xs font-bold transition-all duration-150 border-b-2 -mb-2.5 ${
              role === 'team'
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-dark-500 hover:text-dark-300'
            }`}
          >
            Clubs / Teams
          </button>
          <button
            type="button"
            onClick={() => setRole('staff')}
            className={`px-4 py-2 text-xs font-bold transition-all duration-150 border-b-2 -mb-2.5 ${
              role === 'staff'
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-dark-500 hover:text-dark-300'
            }`}
          >
            Staff & Coaches
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Athlete Position Filter */}
          {role === 'player' && (
            <div>
              <label className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block mb-1">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs theme-select"
              >
                <option value="">All Positions</option>
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
          )}

          {/* Preferred Foot Filter */}
          {role === 'player' && (
            <div>
              <label className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block mb-1">Preferred Foot</label>
              <select
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs theme-select"
              >
                <option value="">Any Foot</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="Both">Both</option>
              </select>
            </div>
          )}

          {/* Team Recruiting Filter */}
          {role === 'team' && (
            <div>
              <label className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block mb-1">Recruitment Status</label>
              <select
                value={recruiting}
                onChange={(e) => setRecruiting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs theme-select"
              >
                <option value="">Any Status</option>
                <option value="true">Actively Recruiting</option>
                <option value="false">Not Recruiting</option>
              </select>
            </div>
          )}

          {/* Looking for Job Filter */}
          {(role === 'player' || role === 'staff') && (
            <div>
              <label className="text-[10px] font-bold text-dark-400 uppercase tracking-wider block mb-1">Job Seeking</label>
              <select
                value={isLookingForJob}
                onChange={(e) => setIsLookingForJob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs theme-select"
              >
                <option value="">Any Status</option>
                <option value="true">Actively Seeking Club</option>
                <option value="false">Not Looking</option>
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2.5 rounded-xl transition duration-150 flex items-center justify-center space-x-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </form>

      {/* Grid of profile results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && results.length === 0 ? (
          <>
            <ProfileSkeleton />
            <ProfileSkeleton />
            <ProfileSkeleton />
          </>
        ) : error ? (
          <div className="col-span-full text-center py-12 text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="col-span-full text-center py-12 text-dark-400 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-2xl">
            No profiles match the filter criteria.
          </div>
        ) : (
          results.map((prof) => (
            <ProfileCard key={prof._id} profile={prof} />
          ))
        )}
      </div>
    </div>
  );
};
export default Scouting;
