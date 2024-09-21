import express from "express";
import multer from "multer";
import {
  aprovedApplication,
  createSpot,
  getSpotsNearAddress,
} from "../controllers/spots.controller";
import { isAuthenticated } from "../utils/auth";

const upload = multer();
const router = express.Router();

router.get("/", isAuthenticated, getSpotsNearAddress);
router.post("/", isAuthenticated, upload.single("photo_id"), createSpot);
router.patch("/aproved-application", isAuthenticated, aprovedApplication);

export default router;
