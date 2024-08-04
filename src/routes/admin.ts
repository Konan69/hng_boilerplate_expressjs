import { Router } from "express";
import { validateData } from "../middleware/validationMiddleware";
import { adminLogSchema } from "../schemas/admin";
import { AdminLogController } from "../controllers";

const adminRoute = Router();

adminRoute.get(
  "/admin/logs",
  validateData(adminLogSchema),
  AdminLogController.getLogs,
);

export { adminRoute };
