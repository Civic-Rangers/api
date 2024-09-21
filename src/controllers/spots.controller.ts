import { Response } from "express";
import fs from "fs";
import path from "path";
import Spot from "../models/spot.model";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import User from "../models/user.model";
import Application, { IApplication } from "../models/application.model";
import { uploadImage } from "../utils/uploadImage";

export const createSpot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    const user_data = req.user;
    if (file) {
      const url = await uploadImage(file);
      req.body.photo_id = url;
    } else {
      return res.status(400).json({ message: "File is required" });
    }
    const { spaces, description, suggestions } = req.body;
    if (!spaces || !description || !suggestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSpot = new Spot({
      user_id: user_data?._id,
      spaces,
      status: "available",
      photo_id: req.body.photo_id,
      description,
      suggestions,
    });
    const spot = await Spot.create(newSpot);
    res.status(201).json(spot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

interface CalculateDistanceRequest {
  currentLocation: {
    lon: number;
    lat: number;
  };
  target: {
    lon: number;
    lat: number;
  };
}

const calculateDistance = async ({
  currentLocation,
  target,
}: CalculateDistanceRequest) => {
  const response = await fetch(
    `http://router.project-osrm.org/route/v1/driving/${currentLocation.lon},${currentLocation.lat};${target.lon},${target.lat}?overview=false`
  );
  const data = await response.json();
  const distance = data.routes[0].distance;
  return { distance: (distance / 1609.34).toFixed(2) + " miles" };
};

export const getSpotsNearAddress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user_id = req.user?._id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userLocation = {
      lon: user.lon,
      lat: user.lat,
    };

    const spots = await Spot.find({ status: "available" }).populate("user_id");
    if (spots.length === 0) {
      return res.status(404).json("No spots found");
    }
    const spotsWithDistance = await Promise.all(
      spots.map(async (spot) => {
        const distance = await calculateDistance({
          currentLocation: userLocation,
          target: {
            lon: spot.user_id.lon,
            lat: spot.user_id.lat,
          },
        });
        return { ...spot.toObject(), distance: distance.distance };
      })
    );

    spotsWithDistance.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );

    res.status(200).json(spotsWithDistance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const aprovedApplication = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { spot_id, application_id } = req.body;
    if (!application_id || !spot_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await Application.findById(application_id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const spot = await Spot.findById(spot_id);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }
    const vacancy =
      (spot.spaces ?? 0) - (spot.application_accepted?.length ?? 0);

    if (vacancy <= 0) {
      spot.status = "full";
      spot.save();
      return res.status(400).json({ message: "No vacancy available" });
    } else {
      spot.application_pending = spot.application_pending || [];
      spot.application_pending = spot.application_pending.filter(
        (id) => id.toString() !== (application._id as string).toString()
      );

      spot.application_accepted = spot.application_accepted || [];
      spot.application_accepted.push(
        application._id as unknown as IApplication
      );
      await spot.save();

      application.status = "accepted";
      await application.save();
      res.status(201).json({ message: "Application approved" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectApplication = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { spot_id, application_id } = req.body;
    if (!application_id || !spot_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await Application.findById(application_id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const spot = await Spot.findById(spot_id);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    spot.application_pending = spot.application_pending || [];
    spot.application_pending = spot.application_pending.filter(
      (id) => id.toString() !== (application._id as string).toString()
    );

    application.status = "rejected";
    await application.save();
    await spot.save();
    res.status(201).json({ message: "Application rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
