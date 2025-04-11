import express from "express";
import {
  generateFinalTranscript,
  generateFirstTranscript,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/createFirstTranscript", generateFirstTranscript);
router.post("/generateResponse", generateFinalTranscript);

export default router;
