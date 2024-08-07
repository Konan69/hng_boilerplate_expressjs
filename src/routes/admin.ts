import { Router } from "express";
import { authMiddleware, checkOrgPermission } from "../middleware";
import {
  AdminOrganisationController,
  AdminLogController,
} from "../controllers";
import { UserType } from "../types";
import { OrgRole } from "../models/user-organization";
import { validateData } from "../middleware/validationMiddleware";
import { orgUpdateSchema } from "../schemas/organization";
import { adminLogSchema } from "../schemas/admin";

const adminRoute = Router();

const admin = new AdminOrganisationController();
const adminLog = new AdminLogController();

adminRoute.patch(
  "/orgs/:id",
  validateData({ body: orgUpdateSchema }),
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  admin.updateOrg,
);

adminRoute.delete(
  "/orgs/:org_id/delete",
  validateData({ body: orgUpdateSchema }),
  authMiddleware,
  checkOrgPermission([OrgRole.ADMIN], [UserType.SUPER_ADMIN]),
  admin.deleteOrganization,
);

adminRoute.get(
  "/admin/logs",
  validateData({ params: adminLogSchema }),
  adminLog.getLogs,
);

export { adminRoute };
