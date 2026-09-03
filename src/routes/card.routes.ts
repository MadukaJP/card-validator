import { Router } from "express";

const router = Router();

router.post("/validate", (_req, res) => {
  res.json({
    valid: false,
  });
});

export default router;
