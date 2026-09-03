import { Router } from "express";
import { validateCardController } from "../controllers/card.controller";
import { validateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post("/validate", validateLimiter, validateCardController);

export default router;
