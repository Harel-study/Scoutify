import Joi from 'joi';

// Register payload validation
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('player', 'team', 'staff').required()
});

// Login payload validation
export const loginSchema = Joi.object({
  username: Joi.string().required().lowercase().trim(),
  password: Joi.string().required()
});

// Google OAuth verification payload validation
export const googleLoginSchema = Joi.object({
  idToken: Joi.string().required(),
  role: Joi.string().valid('player', 'team', 'staff') // Required only if register is needed
});

// Player profile update validation
export const playerProfileUpdateSchema = Joi.object({
  position: Joi.string().valid('Goalkeeper', 'Center Back', 'Left-Back', 'Right-Back', 'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder', 'Left Winger', 'Right Winger', 'Striker'),
  heightCm: Joi.number().min(100).max(250).allow(null, ''),
  weightKg: Joi.number().min(30).max(150).allow(null, ''),
  preferredFoot: Joi.string().valid('Left', 'Right', 'Both'),
  currentTeam: Joi.string().allow('', null).trim(),
  contractStatus: Joi.string().valid('Free-Agent', 'Under-Contract', 'Loan', 'Retired', 'Transfer Listed', 'Trial'),
  isLookingForJob: Joi.boolean(),
  bio: Joi.string().max(500).allow('', null).trim()
});

// Team profile update validation
export const teamProfileUpdateSchema = Joi.object({
  name: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  biography: Joi.string().max(1000).allow('', null).trim(),
  recruiting: Joi.boolean()
});

// Staff profile update validation
export const staffProfileUpdateSchema = Joi.object({
  roleDescription: Joi.string().required().trim(),
  experienceYears: Joi.number().min(0).max(80).allow(null, ''),
  certifications: Joi.array().items(Joi.string().trim()).default([]),
  currentTeam: Joi.string().allow('', null).trim(),
  isLookingForJob: Joi.boolean(),
  bio: Joi.string().max(500).allow('', null).trim()
});

// Job creation/update validation
export const jobSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  jobType: Joi.string().valid('Full-Time', 'Part-Time', 'Shift-work', 'Contract', 'Temporary', 'Internship').required(),
  status: Joi.boolean().default(true)
});

// Post creation validation
export const postSchema = Joi.object({
  content: Joi.string().required().trim(),
  targetRole: Joi.string().allow('', null).trim(),
  location: Joi.string().allow('', null).trim()
});

// Chat message validation
export const chatSchema = Joi.object({
  receiverId: Joi.string().required(),
  content: Joi.string().required().trim()
});
