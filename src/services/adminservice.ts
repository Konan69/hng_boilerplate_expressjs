import { Request } from "express";
import AppDataSource from "../data-source";
import { ResourceNotFound, Conflict } from "../middleware";
import { Log } from "../models/log";
import { adminLogSchema } from "../schemas/admin";

export class AdminOrganisationService {}

export class AdminUserService {}

export class AdminLogService {
  static async getPaginatedLogs(req: Request): Promise<{
    logs: Log[];
    totalLogs: number;
    totalPages: number;
    currentPage: number;
  }> {
    const validation = adminLogSchema.safeParse(req.query);
    if (!validation.success) {
      throw new Conflict(
        "Validation failed: " +
          validation.error.errors.map((e) => e.message).join(", "),
      );
    }
    const { page = 1, limit = 10, sort = "desc", offset = 0 } = req.query;
    const logRepository = AppDataSource.getRepository(Log);

    if (!logRepository) {
      throw new ResourceNotFound("Logs Table not found");
    }

    const [logs, totalLogs] = await logRepository.findAndCount({
      order: { id: sort === "asc" ? "ASC" : "DESC" },
      skip: Number(offset),
      take: Number(limit),
    });

    const totalPages = Math.ceil(totalLogs / Number(limit)) || 1;

    if (!logs.length) {
      throw new ResourceNotFound("no Logs found");
    }

    return {
      logs,
      totalLogs,
      totalPages,
      currentPage: Number(page),
    };
  }
}
