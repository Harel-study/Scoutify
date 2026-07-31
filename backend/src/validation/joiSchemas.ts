/**
 * @module validation/joiSchemas
 *
 * Defines Joi validation schemas for incoming API requests.
 * Ensures data integrity and type safety for user authentication,
 * profiles, jobs, posts, and chat messages.
 */
import Joi from 'joi';

/**
 * Defines the validation schema for registering a new user.
 *
 * Enforces constraints on username length, password minimum length,
 * and restricts the role to allowed user types.
 */
export const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .lowercase()
    .trim(),
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim(),
  password: Joi.string()
    .min(6)
    .required(),
  role: Joi.string()
    .valid('player', 'team', 'staff')
    .required()
});

/**
 * Defines the validation schema for user authentication.
 *
 * Requires a formatted username and a password.
 */
export const loginSchema = Joi.object({
  username: Joi.string().required().lowercase().trim(),
  password: Joi.string().required()
});

/**
 * Defines the validation schema for Google OAuth verification.
 *
 * Requires an ID token from Google and optionally accepts a role
 * if a new user registration is needed during the OAuth flow.
 */
export const googleLoginSchema = Joi.object({
  idToken: Joi.string().required(),
  role: Joi.string().valid('player', 'team', 'staff') // Required only if register is needed
});

/**
 * Defines the validation schema for updating a player's profile.
 *
 * Restricts position to specific soccer roles, enforces physical attributes
 * within reasonable bounds, and defines valid contract statuses.
 */
export const playerProfileUpdateSchema = Joi.object({
  position: Joi.string().valid('Goalkeeper', 'Center Back', 'Left-Back', 'Right-Back', 'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder', 'Left Winger', 'Right Winger', 'Striker'),
  heightCm: Joi.number().min(100).max(250).allow(null, ''),
  weightKg: Joi.number().min(30).max(150).allow(null, ''),
  preferredFoot: Joi.string().valid('Left', 'Right', 'Both'),
  currentTeam: Joi.string().allow('', null).trim(),
  contractStatus: Joi.string().valid('Free-Agent', 'Under-Contract', 'Loan', 'Retired', 'Transfer Listed', 'Trial'),
  isLookingForJob: Joi.boolean(),
  bio: Joi.string().max(500).allow('', null).trim(),
  deleteCv: Joi.boolean()
});

/**
 * Defines the validation schema for updating a team's profile.
 *
 * Enforces formatting for email and string lengths for the biography.
 */
export const teamProfileUpdateSchema = Joi.object({
  name: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  biography: Joi.string().max(1000).allow('', null).trim(),
  recruiting: Joi.boolean(),
  deleteCv: Joi.boolean()
});

/**
 * Defines the validation schema for updating a staff member's profile.
 *
 * Ensures reasonable values for years of experience and validates
 * arrays of certifications.
 */
export const staffProfileUpdateSchema = Joi.object({
  roleDescription: Joi.string().required().trim(),
  experienceYears: Joi.number().min(0).max(80).allow(null, ''),
  certifications: Joi.array().items(Joi.string().trim()).default([]),
  currentTeam: Joi.string().allow('', null).trim(),
  isLookingForJob: Joi.boolean(),
  bio: Joi.string().max(500).allow('', null).trim(),
  deleteCv: Joi.boolean()
});

/**
 * Defines the validation schema for creating or updating a job posting.
 *
 * Restricts job types to predefined categories and ensures
 * all required descriptive fields are provided.
 */
export const jobSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  jobType: Joi.string().valid('Full-Time', 'Part-Time', 'Shift-work', 'Contract', 'Temporary', 'Internship').required(),
  status: Joi.boolean().default(true)
});

/**
 * Defines the validation schema for creating a social post.
 *
 * Ensures post content is provided and handles optional targeting
 * and location fields.
 */
export const postSchema = Joi.object({
  content: Joi.string().required().trim(),
  targetRole: Joi.string().allow('', null).trim(),
  location: Joi.string().allow('', null).trim()
});

/**
 * Defines the validation schema for sending a chat message.
 *
 * Requires a valid receiver ID and non-empty message content.
 */
export const chatSchema = Joi.object({
  receiverId: Joi.string().required(),
  content: Joi.string().required().trim()
});
