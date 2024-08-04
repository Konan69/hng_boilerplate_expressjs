// admin conroller
import { Request, Response } from "express";
import { AdminLogService } from "../services";
import { sendJsonResponse } from "../helpers";
import asyncHandler from "../middleware/asyncHandler";

class AdminOrganisationController {}

class AdminUserController {}

class AdminLogController {
  static getLogs = asyncHandler(async (req: Request, res: Response) => {
    const data = await AdminLogService.getPaginatedLogs(req);
    sendJsonResponse(res, 200, "success", data);
  });
}

export { AdminOrganisationController, AdminUserController, AdminLogController };
