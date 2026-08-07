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
import {
  applyToJob,
  deleteJob,
  type IJob,
} from '../store/slices/jobSlice';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../utils/axios';

interface JobCardProps {
  job: IJob;
}

interface Applicant {
  _id: string;
  username?: string;
  email?: string;
  role: 'player' | 'team' | 'staff';
}

/**
 * Renders a single job listing card.
 */
export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [applied, setApplied] = useState(job.hasApplied ?? false);
  const [applying, setApplying] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  let posterName = 'Unknown Poster';
  let posterId = '';
  let avatarInitial = 'J';

  if (job.profileModel === 'Team') {
    const teamProfile = job.profileId as any;

    posterName = teamProfile.name || 'Unknown Club';
    avatarInitial = posterName.charAt(0).toUpperCase();
    posterId =
      teamProfile.userID?._id ||
      teamProfile.userID ||
      '';
  } else if (job.profileModel === 'User') {
    const userProfile = job.profileId as any;

    posterName =
      userProfile.username ||
      userProfile.email ||
      'Unknown Staff';

    avatarInitial = posterName.charAt(0).toUpperCase();
    posterId = userProfile._id || '';
  }

  const isOwner = Boolean(user && user.id === posterId);

  const handleOpenProfile = () => {
    if (!posterId) return;

    navigate(`/profile/${posterId}`);
  };

  const handleApply = async () => {
    if (!user || applied || applying) return;

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

  const handleToggleApplicants = async () => {
    if (showApplicants) {
      setShowApplicants(false);
      return;
    }

    setLoadingApplicants(true);

    try {
      const response = await api.get(
        `/jobs/${job._id}/applicants`
      );

      setApplicants(response.data.applicants ?? []);
      setShowApplicants(true);
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          'Failed to load applicants'
      );
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleMessageApplicant = (applicantId: string) => {
    navigate(`/messages?user=${applicantId}`);
  };

  const handleOpenApplicantProfile = (
    applicantId: string
  ) => {
    navigate(`/profile/${applicantId}`);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job listing?'
    );

    if (confirmed) {
      void dispatch(deleteJob(job._id));
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
            posted by{' '}
            <button
              type="button"
              onClick={handleOpenProfile}
              className="text-dark-700 dark:text-dark-200 font-semibold hover:underline cursor-pointer"
            >
              {posterName}
            </button>
          </p>
        </div>

        <div className="w-11 h-11 bg-dark-50 dark:bg-dark-900 rounded-xl flex items-center justify-center font-extrabold text-dark-500 dark:text-brand-400 shrink-0">
          {avatarInitial}
        </div>
      </div>

      <p className="text-xs text-dark-600 dark:text-dark-300 mt-4 leading-relaxed line-clamp-3">
        {job.description}
      </p>

      <div className="flex items-center space-x-4 mt-5 text-[11px] font-medium text-dark-400">
        <span className="flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {job.city}
        </span>

        <span className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between border-t border-dark-150 dark:border-dark-700 mt-5 pt-4">
        {isOwner ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleApplicants}
              disabled={loadingApplicants}
              className="flex items-center space-x-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-500/10 px-3 py-2 rounded-xl transition duration-200 disabled:opacity-50"
            >
              <Users className="w-4 h-4" />

              <span>
                {loadingApplicants
                  ? 'Loading...'
                  : showApplicants
                    ? 'Hide Applicants'
                    : 'View Applicants'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center space-x-1.5 text-xs text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-xl transition duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Listing</span>
            </button>
          </div>
        ) : (
          user && (
            <button
              type="button"
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
                <span>
                  {applying ? 'Applying...' : 'Apply Now'}
                </span>
              )}
            </button>
          )
        )}
      </div>

      {/* Applicants list — owner only */}
      {isOwner && showApplicants && (
        <div className="mt-4 pt-4 border-t border-dark-150 dark:border-dark-700 space-y-3">
          <h4 className="text-xs font-bold text-dark-900 dark:text-white">
            Applicants
          </h4>

          {applicants.length === 0 ? (
            <p className="text-xs text-dark-400">
              No applications have been submitted yet.
            </p>
          ) : (
            applicants.map((applicant) => {
              const applicantName =
                applicant.username ||
                applicant.email ||
                'Unknown applicant';

              return (
                <div
                  key={applicant._id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenApplicantProfile(
                        applicant._id
                      )
                    }
                    className="min-w-0 text-left"
                  >
                    <p className="text-xs font-bold text-dark-900 dark:text-white truncate hover:underline">
                      {applicantName}
                    </p>

                    <p className="text-[10px] text-brand-500 capitalize">
                      {applicant.role}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleMessageApplicant(applicant._id)
                    }
                    className="flex items-center gap-1.5 shrink-0 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
export default JobCard;