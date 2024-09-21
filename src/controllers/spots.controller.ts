import { Response } from "express";
import fs from "fs";
import path from "path";
import Spot from "../models/spot.model";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import User from "../models/user.model";

export const createSpot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    const user_data = req.user;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (file) {
      const { buffer, originalname } = file;

      const fileExtension = path.extname(originalname).toLowerCase();

      if (
        fileExtension !== ".jpg" &&
        fileExtension !== ".jpeg" &&
        fileExtension !== ".png"
      ) {
        return res.status(400).json({ error: "Invalid file type" });
      }
      const filename = `${uniqueSuffix}`;
      const uploadPath = path.join(
        __dirname,
        "../static",
        `${filename}${fileExtension}`
      );

      fs.writeFileSync(uploadPath, buffer);
      req.body.photo_id = filename;
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
      photo_id: uniqueSuffix,
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
