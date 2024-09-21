import { Request, Response } from "express";
import User from "../models/user.model";
import { createJwt } from "../utils/auth";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const correctPassword = await user.correctPassword(
      password,
      user.password as string
    );

    if (!correctPassword)
      return res.status(401).send({ message: "Invalid email or password" });

    const jwtToken = createJwt({ _id: user?._id as string });

    const userInfo = { user, access_token: jwtToken };
    if (user.password) {
      delete user.password;
    }
    return res.status(201).send(userInfo);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
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

    if (password.length < 8)
      return res
        .status(400)
        .send({ message: "Password must be at least 8 characters" });

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    } else {
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
    const user = await User.create(newUser);
    const jwtToken = createJwt({ _id: user._id as string });

    if (jwtToken) {
      const userInfo = { user, access_token: jwtToken };
      return res.status(201).send(userInfo);
    } else {
      return res.status(401).send({ message: "Unable to create user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
