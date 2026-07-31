/**
 * @module Controllers/profileController
 *
 * Handles fetching, updating, and searching user profiles.
 * Manages the distinct profile types (Player, Team, Staff) dynamically based on user roles.
 */
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import PlayerProfile from '../models/PlayerProfile.js';
import Team from '../models/Team.js';
import StaffProfile from '../models/StaffProfile.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import {
  playerProfileUpdateSchema,
  teamProfileUpdateSchema,
  staffProfileUpdateSchema
} from '../validation/joiSchemas.js';

/**
 * Retrieves the profile of the currently authenticated user.
 *
 * Determines the correct profile model (Player, Team, or Staff) based on
 * the user's role and populates the linked user account information.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the authenticated user.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the profile is returned or passes errors to next().
 */
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { id, role } = req.user;

    let profile: any = null;

    if (role === 'player') {
      profile = await PlayerProfile.findOne({ userID: id }).populate('userID', 'username email role');
    } else if (role === 'team') {
      profile = await Team.findOne({ userID: id }).populate('userID', 'username email role');
    } else if (role === 'staff') {
      profile = await StaffProfile.findOne({ userID: id }).populate('userID', 'username email role');
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
};

/**
 * Updates the profile of the currently authenticated user.
 *
 * Validates the incoming data against role-specific Joi schemas, handles
 * profile image uploads via Cloudinary, and updates the corresponding
 * profile document.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the profile data and optional file upload.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the profile is updated or passes errors to next().
 */
export const updateMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { id, role } = req.user;

    let updateData = req.body;
    let profileImageUrl = '';
    let cvFileUrl = '';
    let cvFileName = '';

    // Handle file uploads if present
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    
    if (files?.profileImage && files.profileImage.length > 0) {
      profileImageUrl = await uploadToCloudinary(files.profileImage[0].buffer, 'avatars');
    }
    
    if (files?.cvFile && files.cvFile.length > 0) {
      cvFileUrl = await uploadToCloudinary(files.cvFile[0].buffer, 'cvs');
      cvFileName = files.cvFile[0].originalname;
    }

    if (role === 'player') {
      // Validate
      const { error, value } = playerProfileUpdateSchema.validate(updateData);
      if (error) return res.status(400).json({ message: error.details[0].message });

      if (profileImageUrl) {
        value.profileImage = profileImageUrl;
      }
      if (cvFileUrl) {
        value.cvUrl = cvFileUrl;
        value.cvName = cvFileName;
      }
      if (updateData.deleteCv === 'true' || updateData.deleteCv === true) {
        value.cvUrl = '';
        value.cvName = '';
      }
      delete value.deleteCv;

      const updated = await PlayerProfile.findOneAndUpdate(
        { userID: id },
        { $set: value },
        { new: true, runValidators: true }
      ).populate('userID', 'username email role');

      return res.status(200).json({ message: 'Player profile updated successfully', profile: updated });
    }

    if (role === 'team') {
      // Validate
      const { error, value } = teamProfileUpdateSchema.validate(updateData);
      if (error) return res.status(400).json({ message: error.details[0].message });

      // If a team profile picture is supported, we can add a logo field or map to generic logo
      if (profileImageUrl) {
         // Teams don't currently have profileImage in schema, but we can add it later or ignore
      }
      if (cvFileUrl) {
        value.cvUrl = cvFileUrl;
        value.cvName = cvFileName;
      }
      if (updateData.deleteCv === 'true' || updateData.deleteCv === true) {
        value.cvUrl = '';
        value.cvName = '';
      }
      delete value.deleteCv;
      const updated = await Team.findOneAndUpdate(
        { userID: id },
        { $set: value },
        { new: true, runValidators: true }
      ).populate('userID', 'username email role');

      return res.status(200).json({ message: 'Team profile updated successfully', profile: updated });
    }

    if (role === 'staff') {
      // Validate
      const { error, value } = staffProfileUpdateSchema.validate(updateData);
      if (error) return res.status(400).json({ message: error.details[0].message });

      if (profileImageUrl) {
        value.profileImage = profileImageUrl;
      }
      if (cvFileUrl) {
        value.cvUrl = cvFileUrl;
        value.cvName = cvFileName;
      }
      if (updateData.deleteCv === 'true' || updateData.deleteCv === true) {
        value.cvUrl = '';
        value.cvName = '';
      }
      delete value.deleteCv;

      const updated = await StaffProfile.findOneAndUpdate(
        { userID: id },
        { $set: value },
        { new: true, runValidators: true }
      ).populate('userID', 'username email role');

      return res.status(200).json({ message: 'Staff profile updated successfully', profile: updated });
    }

    res.status(400).json({ message: 'Invalid user role' });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetches a profile by a specified User ID.
 *
 * Looks up the base user first to determine their role (Player, Team, or Staff)
 * in order to query the correct profile collection. Fallbacks to searching the
 * Team collection directly in case a Team ID was provided instead of a User ID.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing the target user ID in params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when the targeted profile is returned or passes errors to next().
 */
export const getProfileById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const targetUserId = req.params.id;

    // Find target user first to know their role
    const user = await User.findById(targetUserId);
    if (!user) {
      // Also check if the ID points to a Team document directly
      const teamProfile = await Team.findById(targetUserId).populate('userID', 'username email role');
      if (teamProfile) {
        return res.status(200).json({ role: 'team', profile: teamProfile });
      }
      return res.status(404).json({ message: 'User or Team profile not found' });
    }

    let profile: any = null;

    if (user.role === 'player') {
      profile = await PlayerProfile.findOne({ userID: targetUserId }).populate('userID', 'username email role');
    } else if (user.role === 'team') {
      profile = await Team.findOne({ userID: targetUserId }).populate('userID', 'username email role');
    } else if (user.role === 'staff') {
      profile = await StaffProfile.findOne({ userID: targetUserId }).populate('userID', 'username email role');
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile details not found' });
    }

    res.status(200).json({ role: user.role, profile });
  } catch (err) {
    next(err);
  }
};

/**
 * Searches and filters profiles across all roles.
 *
 * Returns a mixed array of Player, Team, and Staff profiles matching
 * the provided query parameters, enabling cross-role scouting.
 *
 * @param {AuthenticatedRequest} req - The Express request object containing search filters in query params.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} Resolves when search results are returned or passes errors to next().
 */
export const searchProfiles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { role, position, contractStatus, preferredFoot, city, recruiting, isLookingForJob } = req.query;

    let results: any[] = [];

    if (role === 'player' || !role) {
      // Query player profiles
      const query: any = {};
      if (position) query.position = position;
      if (contractStatus) query.contractStatus = contractStatus;
      if (preferredFoot) query.preferredFoot = preferredFoot;
      if (isLookingForJob !== undefined) query.isLookingForJob = isLookingForJob === 'true';

      const players = await PlayerProfile.find(query).populate('userID', 'username email role');
      results = results.concat(players.map(p => ({ type: 'player', ...p.toObject() })));
    }

    if (role === 'team' || !role) {
      // Query team profiles
      const query: any = {};
      if (city) query.city = new RegExp(city as string, 'i');
      if (recruiting !== undefined) query.recruiting = recruiting === 'true';

      const teams = await Team.find(query).populate('userID', 'username email role');
      results = results.concat(teams.map(t => ({ type: 'team', ...t.toObject() })));
    }

    if (role === 'staff' || !role) {
      // Query staff profiles
      const query: any = {};
      if (isLookingForJob !== undefined) query.isLookingForJob = isLookingForJob === 'true';

      const staff = await StaffProfile.find(query).populate('userID', 'username email role');
      results = results.concat(staff.map(s => ({ type: 'staff', ...s.toObject() })));
    }

    res.status(200).json({ results });
  } catch (err) {
    next(err);
  }
};
