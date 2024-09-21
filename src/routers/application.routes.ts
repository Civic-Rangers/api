import express from "express";
import { createApplication } from "../controllers/application.controller";
import { isAuthenticated } from "../utils/auth";

const router = express.Router();

router.post("/", isAuthenticated, createApplication);

export default router;
