import { Request, Response } from 'express';
import Team from '../models/Teams';
/**
 * יצירת קבוצה חדשה
 */
export const createTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating team',
      error,
    });
  }
};
/**
 * קבלת כל הקבוצות
 */
export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching teams',
      error,
    });
  }
};
/**
 * קבלת קבוצה לפי ID
 */
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        message: 'Team not found',
      });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching team',
      error,
    });
  }
};
/**
 * עדכון קבוצה
 */
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!team) {
      return res.status(404).json({
        message: 'Team not found',
      });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating team',
      error,
    });
  }
};
/**
 * מחיקת קבוצה
 */
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: 'Team not found',
      });
    }
    res.status(200).json({
      message: 'Team deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting team',
      error,
    });
  }
};