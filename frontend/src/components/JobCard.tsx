/**
 * @module JobCard
 *
 * Displays an individual job posting.
 * Handles polymorphic job poster profiles, job details formatting,
 * and user interactions such as applying for or deleting a job.
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { applyToJob, deleteJob, type IJob } from '../store/slices/jobSlice';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Trash2, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  /** @type {IJob} The job listing data to render, including title, description, and poster info. */
  job: IJob;
}

/**
 * Renders a single job listing card.
 *
 * Automatically resolves the job poster's profile and displays the job's
 * meta-information (type, location, date). Allows the listing owner to delete it,
 * and other users to submit an application.
 *
 * @param  {JobCardProps}       props  The component props.
 * @returns {React.ReactElement}  The rendered job card component.
 */
export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  let posterName = 'Unknown Poster';
  let posterId = '';
  let avatarInitial = 'J';

  if (job.profileModel === 'Team') {
    const teamProf = job.profileId as any;
    posterName = teamProf.name || 'Unknown Club';
    avatarInitial = posterName[0];
    posterId = teamProf.userID?._id || teamProf.userID || '';
  } else if (job.profileModel === 'User') {
    const userObj = job.profileId as any;
    posterName = userObj.username || userObj.email || 'Unknown Staff';
    avatarInitial = posterName[0].toUpperCase();
    posterId = userObj._id || '';
  }

  const isOwner = user && user.id === posterId;

  const handleApply = async () => {
    if (!user) return;
    setApplying(true);
    try {
      await dispatch(applyToJob(job._id)).unwrap();
      setApplied(true);
    } catch (err: any) {
      alert(err || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      dispatch(deleteJob(job._id));
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 p-6 rounded-2xl transition duration-200 hover:shadow-md animate-slide-up">
      <div className="flex justify-between items-start">
        <div className="space-y-1 flex-1 pr-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400">
            {job.jobType}
          </span>
          <h3 className="text-base font-bold text-dark-900 dark:text-white mt-1">
            {job.title}
          </h3>
          <p className="text-xs font-semibold text-dark-500 dark:text-dark-400">
            posted by <span className="text-dark-700 dark:text-dark-200">{posterName}</span>
          </p>
        </div>

        <div className="w-11 h-11 bg-dark-50 dark:bg-dark-900 rounded-xl flex items-center justify-center font-extrabold text-dark-500 dark:text-brand-400 shrink-0">
          {avatarInitial}
        </div>
      </div>

      <p className="text-xs text-dark-600 dark:text-dark-300 mt-4 leading-relaxed line-clamp-3">
        {job.description}
      </p>

      {/* Meta */}
      <div className="flex items-center space-x-4 mt-5 text-[11px] font-medium text-dark-400">
        <span className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1 text-dark-400" />
          {job.city}
        </span>
        <span className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1 text-dark-400" />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between border-t border-dark-150 dark:border-dark-700 mt-5 pt-4">
        {isOwner ? (
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1.5 text-xs text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-xl transition duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Listing</span>
          </button>
        ) : (
          user && (
            <button
              onClick={handleApply}
              disabled={applied || applying}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                applied
                  ? 'bg-green-500/10 text-green-500 cursor-default'
                  : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 active:scale-95'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </>
              ) : (
                <span>{applying ? 'Applying...' : 'Apply Now'}</span>
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
};
export default JobCard;
