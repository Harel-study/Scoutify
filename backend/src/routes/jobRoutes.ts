import { Router } from 'express';
import {
  createJob,
  listJobs,
  getJobDetails,
  updateJob,
  deleteJob,
  applyToJob
} from '../controllers/JobController.js';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Apply JWT authentication to all job endpoints
router.use(authenticateJWT);

router.get('/', listJobs);
router.post('/', authorizeRoles('team', 'staff'), createJob);
router.get('/:id', getJobDetails);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.post('/:id/apply', applyToJob);

export default router;
