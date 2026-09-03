import { Router } from "express";
import { validateCardController } from "../controllers/card.controller";

const router = Router();

router.post("/validate", validateCardController);

export default router;
