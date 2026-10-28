import { prisma } from "../../prisma/client";
import {
  Prisma,
  UserRole,
  UserStatus,
  PaymentStatus,
  TicketType,
  TicketStatus,
} from "@prisma/client";

type AdminActionType =
  | "BAN_USER"
  | "WARN_USER"
  | "SEND_MESSAGE_USER"
  | "SEND_MESSAGE_STORE"
  | "SUSPEND_STORE"
  | "VERIFY_STORE"
  | "CHANGE_PLAN_USER"
  | "CHANGE_PLAN_STORE"
  | "FORCE_PASSWORD_RESET";

type AdminActionEntityType = "USER" | "STORE" | "OTHER";

const logAdminAction = async ({
  adminId,
  action,
  entityType,
  entityId,
  details,
}: {
  adminId: string;
  action: AdminActionType;
  entityType: AdminActionEntityType;
  entityId?: string;
  details?: any;
}) => {
  return prisma.adminActionLog.create({
    data: {
      adminId,
      action,
      entityType,
      entityId,
      details,
    },
  });
};

export default { logAdminAction };
