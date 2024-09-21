import { Response } from "express";
import fs from "fs";
import path from "path";
import Spot from "../models/spot.model";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export const createSpot = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    const user_id = req.user?._id;
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
      user_id,
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
