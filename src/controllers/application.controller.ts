import { Response } from "express";
import Application, { IApplication } from "../models/application.model";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import Spot from "../models/spot.model";

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user_id = req.user?._id;
    const { spot_id, message, vehicle_type } = req.body;
    if (!spot_id || !message || !vehicle_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const spot = await Spot.findById(spot_id);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const vacancy =
      (spot.spaces ?? 0) - (spot.application_accepted?.length ?? 0);

    if (vacancy <= 0) {
      return res.status(400).json({ message: "No vacancy available" });
    }

    const newApplication = new Application({
      user_id,
      spot_id,
      message,
      vehicle_type,
    });

    const application: IApplication = await Application.create(newApplication);

    spot.application_pending = spot.application_pending || [];
    spot.application_pending.push(application._id as unknown as IApplication);
    spot.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicationById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicationsByUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const spot = await Spot.findOne({ user_id: req.user?._id });
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const applications = await Application.find({
      spot_id: spot?._id,
      status: "pending",
    });

    if (!applications) {
      return res.status(404).json({ message: "Applications not found" });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
