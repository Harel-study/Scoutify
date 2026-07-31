import { Router } from 'express';

import {
  getLastMatches,
  getUpcomingMatches,
  getStandings,
} from '../controllers/sportsController.js';

console.log('SPORTS ROUTES FILE LOADED:', import.meta.url);

const router = Router();

router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sports router works',
  });
});

router.get('/results/:teamId', getLastMatches);
router.get('/upcoming/:teamId', getUpcomingMatches);
router.get('/standings/:leagueId', getStandings);

export default router;