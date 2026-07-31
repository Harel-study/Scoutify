import type { Request, Response, NextFunction } from 'express';

import {
  getPreviousTeamEvents,
  getNextTeamEvents,
  getLeagueTable,
} from '../services/sportsService.js';

export const getLastMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teamId } = req.params;
    const events = await getPreviousTeamEvents(teamId);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { teamId } = req.params;
    const events = await getNextTeamEvents(teamId);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getStandings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { leagueId } = req.params;

    const season =
      typeof req.query.season === 'string'
        ? req.query.season
        : undefined;

    const table = await getLeagueTable(leagueId, season);

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};