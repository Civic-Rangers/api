import express, { Request, Response } from "express";
import { createUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/", createUser);

export default router;
