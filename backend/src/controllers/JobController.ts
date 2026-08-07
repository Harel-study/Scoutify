/**
 * @module Controllers/jobController
 *
 * Handles job-related operations including creating, listing, updating,
 * deleting, and applying to job postings.
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import Job from '../models/Job.js';
import Team from '../models/Team.js';
import PlayerProfile from '../models/PlayerProfile.js';
import StaffProfile from '../models/StaffProfile.js';
import PersonalChat from '../models/PersonalChat.js';
import Notification from '../models/Notification.js';
import { jobSchema } from '../validation/joiSchemas.js';
import socketService from '../services/socketService.js';

/**
 * Creates a new job posting for a team or staff member.
 *
 * Validates the user role to ensure players cannot post jobs. If the user
 * is a team, it resolves the team profile ID to associate with the job.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing user and body data.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the job is created or passes errors to next().
 */
export const createJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id, role } = req.user;

    // Business Logic: Players cannot post jobs
    if (role === 'player') {
      return res.status(403).json({ message: 'Players are not permitted to create job listings' });
    }

    const { error, value } = jobSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, city, jobType } = value;

    let profileId = id;
    let profileModel: 'User' | 'Team' = 'User';

    if (role === 'team') {
      const team = await Team.findOne({ userID: id });
      if (!team) {
        return res.status(400).json({ message: 'Team profile not found. Please create a team profile first.' });
      }
      profileId = team._id.toString();
      profileModel = 'Team';
    }

    const job = new Job({
      profileId,
      profileModel,
      title,
      description,
      city,
      jobType,
      status: true
    });

    await job.save();
    res.status(201).json({ message: 'Job posting created successfully', job });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieves a list of job postings based on provided query filters.
 *
 * Supports filtering by title (case-insensitive partial match), city,
 * jobType, and status. Results are sorted by creation date descending.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing query parameters.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the jobs are retrieved or passes errors to next().
 */
export const listJobs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, city, jobType, status } = req.query;

    const query: any = {};
    if (title) query.title = new RegExp(title as string, 'i');
    if (city) query.city = new RegExp(city as string, 'i');
    if (jobType) query.jobType = jobType;
    if (status !== undefined) query.status = status === 'true';

    // Populate both Team and User profiles
    const jobs = await Job.find(query)
      .populate({ path: 'profileId', populate: { path: 'userID', select: 'username email role', strictPopulate: false } })
      .sort({ createdAt: -1 });
const userId = req.user?.id;
const jobsWithApplicationStatus = jobs.map((job) => {
  const jobObject = job.toObject();
  return {
    ...jobObject,
    hasApplied: userId
      ? (job.applications ?? []).some(
          (applicantId) => applicantId.toString() === userId
        )
      : false,
  };
});
res.status(200).json({
  jobs: jobsWithApplicationStatus
});
  } catch (err) {
    next(err);
  }
};

/**
 * Fetches the details of a specific job posting by its ID.
 *
 * Populates the profile and user information associated with the job.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the job ID in params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the job is retrieved or passes errors to next().
 */
export const getJobDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({ path: 'profileId', populate: { path: 'userID', select: 'username email role', strictPopulate: false } });

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    res.status(200).json({ job });
  } catch (err) {
    next(err);
  }
};

/**
 * Determines whether the requesting user owns the specified job posting.
 *
 * Resolves ownership either directly for user profiles or indirectly
 * by checking the associated team profile.
 *
 * @param {any} reqUser - The authenticated user object from the request.
 * @param {any} job - The job document to check ownership against.
 * @returns {Promise<boolean>} True if the user owns the job, false otherwise.
 */
const checkJobOwnership = async (reqUser: any, job: any): Promise<boolean> => {
  if (job.profileModel === 'User') {
    return job.profileId.toString() === reqUser.id;
  } else if (job.profileModel === 'Team') {
    const team = await Team.findById(job.profileId);
    return team ? team.userID.toString() === reqUser.id : false;
  }
  return false;
};

/**
 * Updates an existing job posting.
 *
 * Verifies that the user owns the job posting before applying updates
 * and validates the incoming payload against the job schema.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the job ID and update payload.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the job is updated or passes errors to next().
 */
export const updateJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job posting not found' });

    // Validate ownership
    const isOwner = await checkJobOwnership(req.user, job);
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not have permission to modify this listing' });
    }

    const { error, value } = jobSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Job posting updated successfully', job: updatedJob });
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes an existing job posting.
 *
 * Requires ownership verification before the job can be removed from the database.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the job ID.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the job is deleted or passes errors to next().
 */
export const deleteJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job posting not found' });

    // Validate ownership
    const isOwner = await checkJobOwnership(req.user, job);
    if (!isOwner) {
      return res.status(403).json({ message: 'You do not have permission to delete this listing' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job posting deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * Submits an application for a specific job posting.
 *
 * Prevents users from applying to their own jobs and sends a notification
 * to the job poster upon successful application.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the job ID in params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the application is submitted or passes errors to next().
 */
export const applyToJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.user;

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job posting not found' });

    // Resolve who receives the notification
    let receiverId: string | null = null;
    if (job.profileModel === 'User') {
      receiverId = job.profileId.toString();
    } else if (job.profileModel === 'Team') {
      const team = await Team.findById(job.profileId);
      if (team) receiverId = team.userID.toString();
    }

    if (!receiverId) {
      return res.status(400).json({ message: 'Unable to resolve job posting creator' });
    }

    // Prevent applying to your own job
    if (receiverId === id) {
      return res.status(400).json({ message: 'You cannot apply to your own job listing' });
    }
  const alreadyApplied = (job.applications ?? []).some(
    (applicantId) => applicantId.toString() === id
  );
  if (alreadyApplied) {
    return res.status(400).json({
      message: 'You have already applied to this job listing'
  });
}
  if (!job.applications) {
    job.applications = [];
  }
  job.applications.push(id as any);
  await job.save();
    // Create Notification
    const notification = new Notification({
      sender: id,
      receiver: receiverId,
      type: 'job_application',
      content: `A candidate has applied to your job listing: "${job.title}"`,
      sourceLink: `/jobs` // Or /messages to initiate chat
    });

    await notification.save();
    socketService.emitToUser(receiverId, 'newNotification', notification);

    // Fetch the applicant's profile to get their CV if it exists
    let cvLink = '';
    const playerProfile = await PlayerProfile.findOne({ userID: id });
    if (playerProfile && playerProfile.cvUrl) {
      cvLink = playerProfile.cvUrl;
    } else {
      const staffProfile = await StaffProfile.findOne({ userID: id });
      if (staffProfile && staffProfile.cvUrl) {
        cvLink = staffProfile.cvUrl;
      }
    }

    let messageContent = `Hi, I have applied to your job listing: "${job.title}".`;
    if (cvLink) {
      messageContent += ` You can view and download my CV here: ${cvLink}`;
    }

    const chat = new PersonalChat({
      sender: id,
      receiver: receiverId,
      content: messageContent
    });
    await chat.save();

    res.status(200).json({ message: 'Application submitted successfully. The poster has been notified.' });
  } catch (err) {
    next(err);
  }
};
