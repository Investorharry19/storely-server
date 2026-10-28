import { Resend } from "resend";

import {
  newOrderTemplate,
  paymentConfirmedTemplate,
  paymentFailedTemplate,
  orderStatusUpdatedTemplate,
  adminMessageTemplate,
  accountSuspendedTemplate,
  userBannedTemplate,
  userWarnedTemplate,
  userAdminMessageTemplate,
} from "./email.templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM: string | any = process.env.EMAIL_FROM; // e.g. "Storely <no-reply@storely.app>"

// ============================================================
// CORE SENDER
// ============================================================

const sendEmail = async ({ to, subject, html }: any) => {
  if (!to) return; // Silently skip if no email address available

  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err: any) {
    // Log but never throw — a failed email should never break the main request
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, err.message);
  }
};

// ============================================================
// NOTIFY SELLER — NEW ORDER
// Triggered when a customer places an order.
// ============================================================

export const notifySellerNewOrder = async ({
  sellerEmail,
  businessName,
  order,
}: any) => {
  const { subject, html } = newOrderTemplate({ businessName, order });
  await sendEmail({ to: sellerEmail, subject, html });
};

// ============================================================
// NOTIFY SELLER — PAYMENT CONFIRMED
// Triggered by Paystack webhook on charge.success.
// ============================================================

export const notifySellerPaymentConfirmed = async ({
  sellerEmail,
  businessName,
  order,
}: any) => {
  const { subject, html } = paymentConfirmedTemplate({ businessName, order });
  await sendEmail({ to: sellerEmail, subject, html });
};

// ============================================================
// NOTIFY SELLER — PAYMENT FAILED
// Triggered by Paystack webhook on charge.failed.
// ============================================================

export const notifySellerPaymentFailed = async ({
  sellerEmail,
  businessName,
  order,
}: any) => {
  const { subject, html } = paymentFailedTemplate({ businessName, order });
  await sendEmail({ to: sellerEmail, subject, html });
};

// ============================================================
// NOTIFY CUSTOMER — ORDER STATUS UPDATED
// Triggered when the seller manually updates order status.
// ============================================================

export const notifyCustomerOrderStatusUpdated = async ({
  customerEmail,
  businessName,
  order,
}: any) => {
  if (!customerEmail) return; // Customer email is optional in the PRD
  const { subject, html } = orderStatusUpdatedTemplate({ businessName, order });
  await sendEmail({ to: customerEmail, subject, html });
};

// ============================================================
// NOTIFY SELLER — ADMIN MESSAGE
// Triggered when admin sends a message to the seller.
// ============================================================

export const notifySellerAdminMessage = async ({
  sellerEmail,
  businessName,
  subject,
  message,
}: any) => {
  const { subject: emailSubject, html } = adminMessageTemplate({
    subject,
    message,
    businessName,
  });
  await sendEmail({ to: sellerEmail, subject: emailSubject, html });
};

// ============================================================
// NOTIFY SELLER — ACCOUNT SUSPENDED
// Triggered when admin suspends the seller's account.
// ============================================================

export const notifySellerAccountSuspended = async ({
  sellerEmail,
  businessName,
  reason,
  noteToSeller,
}: any) => {
  const { subject, html } = accountSuspendedTemplate({
    businessName,
    reason,
    noteToSeller,
  });
  await sendEmail({ to: sellerEmail, subject, html });
};

// ============================================================
// NOTIFY USER — ADMIN MESSAGE
// Triggered when admin sends a message to the user.
// ============================================================

export const notifyUserAdminMessage = async ({
  userEmail,
  userName,
  subject,
  message,
}: any) => {
  const { subject: emailSubject, html } = userAdminMessageTemplate({
    userName,
    subject,
    message,
  });
  await sendEmail({ to: userEmail, subject: emailSubject, html });
};

// ============================================================
// NOTIFY USER — BANNED
// Triggered when admin bans the user.
// ============================================================

export const notifyUserBanned = async ({
  userEmail,
  userName,
  reason,
  noteToUser,
}: any) => {
  const { subject, html } = userBannedTemplate({
    userName,
    reason,
    noteToUser,
  });
  await sendEmail({ to: userEmail, subject, html });
};

// ============================================================
// NOTIFY USER — WARNED
// Triggered when admin warns the user.
// ============================================================

export const notifyUserWarned = async ({
  userEmail,
  userName,
  reason,
  noteToUser,
}: any) => {
  const { subject, html } = userWarnedTemplate({
    userName,
    reason,
    noteToUser,
  });
  await sendEmail({ to: userEmail, subject, html });
};
