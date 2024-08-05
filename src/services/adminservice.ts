import { Repository } from "typeorm";
import { Request } from "express";
import AppDataSource from "../data-source";
import { Organization } from "../models/organization";
import { Conflict, HttpError, ResourceNotFound } from "../middleware";
import { User } from "../models";
import { Log } from "../models/log";
import { adminLogSchema } from "../schemas/admin";

export class AdminOrganisationService {
  public async update(
    org_id: string,
    payload: Organization,
  ): Promise<Organization> {
    const {
      name,
      email,
      industry,
      type,
      country,
      address,
      state,
      description,
    } = payload;

    const orgRepository = AppDataSource.getRepository(Organization);

    const oldOrg = await orgRepository.findOne({
      where: { id: org_id },
    });

    if (!oldOrg) {
      throw new HttpError(404, "Organization not found");
    }

    await orgRepository.update(org_id, {
      name,
      email,
      industry,
      type,
      country,
      address,
      state,
      description,
    });

    const newOrg = await orgRepository.findOne({
      where: { id: org_id },
    });
    return newOrg;
  }

  public async deleteOrganization(orgId: string): Promise<Organization> {
    const organizationRepository = AppDataSource.getRepository(Organization);
    const organization = await organizationRepository.findOne({
      where: { id: orgId },
    });

    if (!organization) {
      throw new HttpError(404, "Organization not found");
    }

    try {
      await organizationRepository.remove(organization);
    } catch (error) {
      throw new HttpError(500, "Deletion failed");
    }
    return organization; // deleted org
  }
}

export class AdminUserService {}

export class AdminLogService {
  public async getPaginatedLogs(req: Request): Promise<{
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
