import { Router } from "express";
import { Limiter } from "../utils";
import { authMiddleware, checkOrgPermission } from "../middleware";
import asyncHandler from "../middleware/asyncHandler";
import admincontroller from "../controllers/admincontroller";
import { UserType } from "../types";
import { OrgRole } from "../models/user-organization";
import { validateData } from "../middleware/validationMiddleware";
import { orgUpdateSchema } from "../schemas/organization";
import { adminLogSchema } from "../schemas/admin";

const adminRoute = Router();

const admin = new admincontroller.AdminOrganisationController();
const adminLog = new admincontroller.AdminLogController();

adminRoute.patch(
  "/orgs/:id",
  validateData(orgUpdateSchema),
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  asyncHandler(admin.updateOrg),
);

adminRoute.delete(
  "/orgs/:org_id/delete",
  validateData(orgUpdateSchema),
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  asyncHandler(admin.deleteOrganization),
);

adminRoute.get("/admin/logs", validateData(adminLogSchema), adminLog.getLogs);

export { adminRoute };
