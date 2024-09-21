import { Request, Response } from "express";
import User from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      address_street,
      address_state,
      address_zip,
      address_city,
      phone,
      email,
      dob,
      password,
      role,
      biography,
      photo_id,
    } = req.body;
    if (
      !first_name ||
      !last_name ||
      !address_street ||
      !address_state ||
      !address_zip ||
      !address_city ||
      !phone ||
      !email ||
      !dob ||
      !password ||
      !role
    ) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const newUser = new User({
      first_name,
      last_name,
      address_street,
      address_state,
      address_zip,
      address_city,
      phone,
      email,
      dob,
      password,
      role,
      biography,
      photo_id,
    });
    const user = await newUser.save();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
