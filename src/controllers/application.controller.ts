import { Response } from "express";
import Application from "../models/application.model";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { user_id, spot_id, message, vehicle_type } = req.body;
    const newApplication = new Application({
      user_id,
      spot_id,
      message,
      vehicle_type,
    });
    const application = await Application.create(newApplication);
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
