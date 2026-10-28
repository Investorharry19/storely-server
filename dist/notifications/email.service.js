"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUserWarned = exports.notifyUserBanned = exports.notifyUserAdminMessage = exports.notifySellerAccountSuspended = exports.notifySellerAdminMessage = exports.notifyCustomerOrderStatusUpdated = exports.notifySellerPaymentFailed = exports.notifySellerPaymentConfirmed = exports.notifySellerNewOrder = void 0;
const resend_1 = require("resend");
const email_templates_1 = require("./email.templates");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM; // e.g. "Storely <no-reply@storely.app>"
// ============================================================
// CORE SENDER
// ============================================================
const sendEmail = async ({ to, subject, html }) => {
    if (!to)
        return; // Silently skip if no email address available
    try {
        await resend.emails.send({ from: FROM, to, subject, html });
    }
    catch (err) {
        // Log but never throw — a failed email should never break the main request
        console.error(`[Email] Failed to send "${subject}" to ${to}:`, err.message);
    }
};
// ============================================================
// NOTIFY SELLER — NEW ORDER
// Triggered when a customer places an order.
// ============================================================
const notifySellerNewOrder = async ({ sellerEmail, businessName, order, }) => {
    const { subject, html } = (0, email_templates_1.newOrderTemplate)({ businessName, order });
    await sendEmail({ to: sellerEmail, subject, html });
};
exports.notifySellerNewOrder = notifySellerNewOrder;
// ============================================================
// NOTIFY SELLER — PAYMENT CONFIRMED
// Triggered by Paystack webhook on charge.success.
// ============================================================
const notifySellerPaymentConfirmed = async ({ sellerEmail, businessName, order, }) => {
    const { subject, html } = (0, email_templates_1.paymentConfirmedTemplate)({ businessName, order });
    await sendEmail({ to: sellerEmail, subject, html });
};
exports.notifySellerPaymentConfirmed = notifySellerPaymentConfirmed;
// ============================================================
// NOTIFY SELLER — PAYMENT FAILED
// Triggered by Paystack webhook on charge.failed.
// ============================================================
const notifySellerPaymentFailed = async ({ sellerEmail, businessName, order, }) => {
    const { subject, html } = (0, email_templates_1.paymentFailedTemplate)({ businessName, order });
    await sendEmail({ to: sellerEmail, subject, html });
};
exports.notifySellerPaymentFailed = notifySellerPaymentFailed;
// ============================================================
// NOTIFY CUSTOMER — ORDER STATUS UPDATED
// Triggered when the seller manually updates order status.
// ============================================================
const notifyCustomerOrderStatusUpdated = async ({ customerEmail, businessName, order, }) => {
    if (!customerEmail)
        return; // Customer email is optional in the PRD
    const { subject, html } = (0, email_templates_1.orderStatusUpdatedTemplate)({ businessName, order });
    await sendEmail({ to: customerEmail, subject, html });
};
exports.notifyCustomerOrderStatusUpdated = notifyCustomerOrderStatusUpdated;
// ============================================================
// NOTIFY SELLER — ADMIN MESSAGE
// Triggered when admin sends a message to the seller.
// ============================================================
const notifySellerAdminMessage = async ({ sellerEmail, businessName, subject, message, }) => {
    const { subject: emailSubject, html } = (0, email_templates_1.adminMessageTemplate)({
        subject,
        message,
        businessName,
    });
    await sendEmail({ to: sellerEmail, subject: emailSubject, html });
};
exports.notifySellerAdminMessage = notifySellerAdminMessage;
// ============================================================
// NOTIFY SELLER — ACCOUNT SUSPENDED
// Triggered when admin suspends the seller's account.
// ============================================================
const notifySellerAccountSuspended = async ({ sellerEmail, businessName, reason, noteToSeller, }) => {
    const { subject, html } = (0, email_templates_1.accountSuspendedTemplate)({
        businessName,
        reason,
        noteToSeller,
    });
    await sendEmail({ to: sellerEmail, subject, html });
};
exports.notifySellerAccountSuspended = notifySellerAccountSuspended;
// ============================================================
// NOTIFY USER — ADMIN MESSAGE
// Triggered when admin sends a message to the user.
// ============================================================
const notifyUserAdminMessage = async ({ userEmail, userName, subject, message, }) => {
    const { subject: emailSubject, html } = (0, email_templates_1.userAdminMessageTemplate)({
        userName,
        subject,
        message,
    });
    await sendEmail({ to: userEmail, subject: emailSubject, html });
};
exports.notifyUserAdminMessage = notifyUserAdminMessage;
// ============================================================
// NOTIFY USER — BANNED
// Triggered when admin bans the user.
// ============================================================
const notifyUserBanned = async ({ userEmail, userName, reason, noteToUser, }) => {
    const { subject, html } = (0, email_templates_1.userBannedTemplate)({
        userName,
        reason,
        noteToUser,
    });
    await sendEmail({ to: userEmail, subject, html });
};
exports.notifyUserBanned = notifyUserBanned;
// ============================================================
// NOTIFY USER — WARNED
// Triggered when admin warns the user.
// ============================================================
const notifyUserWarned = async ({ userEmail, userName, reason, noteToUser, }) => {
    const { subject, html } = (0, email_templates_1.userWarnedTemplate)({
        userName,
        reason,
        noteToUser,
    });
    await sendEmail({ to: userEmail, subject, html });
};
exports.notifyUserWarned = notifyUserWarned;
