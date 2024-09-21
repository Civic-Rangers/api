import express from "express";
import { createSpot } from "../controllers/spots.controller";

const router = express.Router();

router.post("/", createSpot);

export default router;
