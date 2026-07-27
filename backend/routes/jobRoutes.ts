import { Router } from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobController';

import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

// Apply JWT authentication to all job endpoints
router.use(authenticateJWT);

router.get('/', getAllJobs);
router.post('/', authorizeRoles('team', 'staff'), createJob);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;