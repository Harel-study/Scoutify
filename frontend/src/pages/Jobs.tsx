import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { fetchJobs, createJob, type IJob } from '../store/slices/jobSlice';
import { JobCard } from '../components/JobCard';
import { JobSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { Search, Briefcase, MapPin, Plus, X } from 'lucide-react';

export const Jobs: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [jobType, setJobType] = useState<IJob['jobType']>('Full-Time');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs({}));
  }, [dispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: Record<string, string> = {};
    if (searchTerm) filters.title = searchTerm;
    if (cityFilter) filters.city = cityFilter;
    if (typeFilter) filters.jobType = typeFilter;
    dispatch(fetchJobs(filters));
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !city.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(createJob({ title, description, city, jobType })).unwrap();
      // Reset & Close
      setTitle('');
      setDescription('');
      setCity('');
      setJobType('Full-Time');
      setShowModal(false);
    } catch (err: any) {
      alert(err || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const isRecruiter = user && (user.role === 'team' || user.role === 'staff');

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Job Board
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Discover opportunities or post recruitment offers directly.
          </p>
        </div>

        {isRecruiter && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 self-start bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow-lg shadow-brand-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Job</span>
          </button>
        )}
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-3 shadow-sm"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords..."
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl theme-input"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-dark-500" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Search city..."
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl theme-input"
          />
        </div>

        <div className="relative">
          <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-dark-500" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl theme-select appearance-none"
          >
            <option value="" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">All Job Types</option>
            <option value="Full-Time" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Full-Time</option>
            <option value="Part-Time" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Part-Time</option>
            <option value="Shift-work" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Shift-work</option>
            <option value="Contract" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Contract</option>
            <option value="Temporary" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Temporary</option>
            <option value="Internship" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Internship</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2.5 rounded-xl transition duration-200"
        >
          Filter Listings
        </button>
      </form>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && jobs.length === 0 ? (
          <>
            <JobSkeleton />
            <JobSkeleton />
            <JobSkeleton />
          </>
        ) : error ? (
          <div className="col-span-full text-center py-12 text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-dark-400 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-2xl">
            No matching job listings found.
          </div>
        ) : (
          jobs.map((job) => <JobCard key={job._id} job={job} />)
        )}
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-dark-150 dark:border-dark-700 pb-3">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">Create New Job Posting</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-dark-500 hover:text-white p-1 rounded-lg hover:bg-dark-750"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-dark-300 block mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Academy Coach"
                  className="w-full px-4 py-2.5 text-sm rounded-xl theme-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-dark-300 block mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Middlesbrough"
                    className="w-full px-4 py-2.5 text-sm rounded-xl theme-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-dark-300 block mb-1">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl theme-select appearance-none"
                  >
                    <option value="Full-Time" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Full-Time</option>
                    <option value="Part-Time" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Part-Time</option>
                    <option value="Shift-work" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Shift-work</option>
                    <option value="Contract" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Contract</option>
                    <option value="Temporary" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Temporary</option>
                    <option value="Internship" className="bg-white dark:bg-dark-800 text-dark-900 dark:text-white">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-dark-300 block mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide contract details, player eligibility, key tasks, and candidate requirements..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl theme-textarea"
                />
              </div>

              <div className="flex justify-end space-x-3 border-t border-dark-150 dark:border-dark-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-dark-400 hover:bg-dark-750 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  {submitting ? 'Posting...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Jobs;
