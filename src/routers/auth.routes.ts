import express from "express";
import { login, signUp } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signUp);

export default router;
