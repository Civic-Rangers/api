import express from "express";
import multer from "multer";
import { createSpot } from "../controllers/spots.controller";
import { isAuthenticated } from "../utils/auth";

const upload = multer();
const router = express.Router();

router.post("/", isAuthenticated, upload.single("photo_id"), createSpot);

export default router;
