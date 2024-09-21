import express from "express";
import { createApplication } from "../controllers/application.controller";

const router = express.Router();

router.post("/", createApplication);

export default router;
