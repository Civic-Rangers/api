import express from "express";
import { isAuthenticated } from "../utils/auth";
import {
  createApplication,
  getApplicationById,
  getApplicationsByUser,
} from "../controllers/application.controller";

const router = express.Router();

router.post("/", isAuthenticated, createApplication);
router.get("/", isAuthenticated, getApplicationById);
router.get("/current", isAuthenticated, getApplicationsByUser);

export default router;
