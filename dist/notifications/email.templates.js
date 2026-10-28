"use strict";
// ============================================================
// Storely Email Templates
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountSuspendedTemplate = exports.paymentConfirmedTemplate = exports.orderStatusUpdatedTemplate = exports.paymentFailedTemplate = exports.paymentReceivedTemplate = exports.storeSuspendedTemplate = exports.userAdminMessageTemplate = exports.userWarnedTemplate = exports.userBannedTemplate = exports.adminMessageTemplate = exports.newOrderTemplate = void 0;
/**
 * New order notification — sent to the seller when a customer places an order.
 */
const newOrderTemplate = ({ businessName, order }) => {
    const itemRows = order.items
        .map((item) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${item.itemName}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">₦${Number(item.subtotal).toLocaleString()}</td>
        </tr>
      `)
        .join("");
    return {
        subject: `New Order Received — ${businessName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
        <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">You have a new order! 🎉</h1>
          <p style="color: #e0d4f7; margin: 8px 0 0;">Someone just purchased from ${businessName}</p>
        </div>

        <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
          <h2 style="font-size: 16px; margin: 0 0 16px;">Customer Details</h2>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${order.customerName}</p>
          <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customerPhone}</p>
          ${order.customerEmail ? `<p style="margin: 4px 0;"><strong>Email:</strong> ${order.customerEmail}</p>` : ""}
          ${order.deliveryAddress ? `<p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ""}

          <h2 style="font-size: 16px; margin: 24px 0 12px;">Order Summary</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 8px 12px; text-align: left;">Item</th>
                <th style="padding: 8px 12px; text-align: center;">Qty</th>
                <th style="padding: 8px 12px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #8A2BE2;">₦${Number(order.totalAmount).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 24px; padding: 12px 16px; background: #fff8e1; border-left: 4px solid #FF6B6B; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          </div>
        </div>

        <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #888;">Log in to your Storely dashboard to manage this order.</p>
        </div>
      </div>
    `,
    };
};
exports.newOrderTemplate = newOrderTemplate;
/**
 * Admin message notification — sent to the seller by admin.
 */
const adminMessageTemplate = ({ subject, message, businessName, }) => ({
    subject: `Message from Storely Admin: ${subject}`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Message from Storely Admin</h1>
        <p style="color: #e0d4f7; margin: 8px 0 0;">Regarding ${businessName}</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <h2 style="font-size: 16px; margin: 0 0 16px;">${subject}</h2>
        <p style="font-size: 15px; line-height: 1.5;">${message}</p>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">If you have any questions, please contact support.</p>
      </div>
    </div>
  `,
});
exports.adminMessageTemplate = adminMessageTemplate;
/**
 * User banned notification — sent to the user when account is banned.
 */
const userBannedTemplate = ({ userName, reason, noteToUser }) => ({
    subject: `Account Banned — Storely`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #D32F2F, #B71C1C); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Account Banned</h1>
        <p style="color: #ffebee; margin: 8px 0 0;">Your Storely account has been banned.</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <h2 style="font-size: 16px; margin: 0 0 16px;">Reason for Ban</h2>
        <p style="font-size: 15px; line-height: 1.5;">${reason}</p>

        <h2 style="font-size: 16px; margin: 24px 0 16px;">Note from Admin</h2>
        <p style="font-size: 15px; line-height: 1.5;">${noteToUser}</p>

        <div style="margin-top: 24px; padding: 12px 16px; background: #fff8e1; border-left: 4px solid #D32F2F; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px;">If you believe this is an error, please contact support.</p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">Powered by Storely</p>
      </div>
    </div>
  `,
});
exports.userBannedTemplate = userBannedTemplate;
/**
 * User warned notification — sent to the user when warned.
 */
const userWarnedTemplate = ({ userName, reason, noteToUser }) => ({
    subject: `Account Warning — Storely`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #FF9800, #F57C00); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Account Warning</h1>
        <p style="color: #fff8e1; margin: 8px 0 0;">Your Storely account has received a warning.</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <h2 style="font-size: 16px; margin: 0 0 16px;">Reason for Warning</h2>
        <p style="font-size: 15px; line-height: 1.5;">${reason}</p>

        <h2 style="font-size: 16px; margin: 24px 0 16px;">Note from Admin</h2>
        <p style="font-size: 15px; line-height: 1.5;">${noteToUser}</p>

        <div style="margin-top: 24px; padding: 12px 16px; background: #fff8e1; border-left: 4px solid #FF9800; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px;">Please review your account activity to avoid further actions.</p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">Powered by Storely</p>
      </div>
    </div>
  `,
});
exports.userWarnedTemplate = userWarnedTemplate;
/**
 * User admin message notification — sent to the user by admin.
 */
const userAdminMessageTemplate = ({ userName, subject, message, }) => ({
    subject: `Message from Storely Admin: ${subject}`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Message from Storely Admin</h1>
        <p style="color: #e0d4f7; margin: 8px 0 0;">Hello ${userName}</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <h2 style="font-size: 16px; margin: 0 0 16px;">${subject}</h2>
        <p style="font-size: 15px; line-height: 1.5;">${message}</p>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">If you have any questions, please contact support.</p>
      </div>
    </div>
  `,
});
exports.userAdminMessageTemplate = userAdminMessageTemplate;
/**
 * Store suspended notification — sent to the seller when their store is suspended by admin.
 */
const storeSuspendedTemplate = ({ businessName, reason, noteToSeller, }) => ({
    subject: `Account Suspended — ${businessName}`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #FF6B6B, #D32F2F); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Account Suspended</h1>
        <p style="color: #ffebee; margin: 8px 0 0;">Your Storely account for ${businessName} has been suspended.</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <h2 style="font-size: 16px; margin: 0 0 16px;">Reason for Suspension</h2>
        <p style="font-size: 15px; line-height: 1.5;">${reason}</p>

        <h2 style="font-size: 16px; margin: 24px 0 16px;">Note from Admin</h2>
        <p style="font-size: 15px; line-height: 1.5;">${noteToSeller}</p>

        <div style="margin-top: 24px; padding: 12px 16px; background: #fff8e1; border-left: 4px solid #FF6B6B; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px;">If you believe this is an error, please contact support immediately.</p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">Powered by Storely</p>
      </div>
    </div>
  `,
});
exports.storeSuspendedTemplate = storeSuspendedTemplate;
/**
 * Payment received notification — sent to the seller when a payment is confirmed.
 */
const paymentReceivedTemplate = ({ businessName, order }) => ({
    subject: `Payment Received — ₦${Number(order.totalAmount).toLocaleString()} from ${order.customerName}`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Payment Confirmed ✅</h1>
        <p style="color: #e0d4f7; margin: 8px 0 0;">${businessName}</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <p style="font-size: 15px;">You have received a payment from <strong>${order.customerName}</strong>.</p>

        <div style="background: #f0faf5; border: 1px solid #3CE2C2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #555;">Amount Received</p>
          <p style="margin: 8px 0 0; font-size: 32px; font-weight: bold; color: #0F6E56;">₦${Number(order.totalAmount).toLocaleString()}</p>
        </div>

        <p style="margin: 4px 0; font-size: 14px;"><strong>Customer:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> ${order.customerPhone}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Order ID:</strong> ${order.id}</p>
        ${order.deliveryAddress ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Delivery:</strong> ${order.deliveryAddress}</p>` : ""}

        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          This order is now marked as <strong>Processing</strong>. Log in to your dashboard to fulfil it.
        </p>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">Powered by Storely</p>
      </div>
    </div>
  `,
});
exports.paymentReceivedTemplate = paymentReceivedTemplate;
/**
 * Failed payment notification — sent to the seller.
 */
const paymentFailedTemplate = ({ businessName, order }) => ({
    subject: `Payment Failed — Order from ${order.customerName}`,
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
      <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Payment Failed ❌</h1>
        <p style="color: #e0d4f7; margin: 8px 0 0;">${businessName}</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
        <p style="font-size: 15px;">A payment from <strong>${order.customerName}</strong> was not successful.</p>

        <div style="background: #fff5f5; border: 1px solid #FF6B6B; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #555;">Order Amount</p>
          <p style="margin: 8px 0 0; font-size: 32px; font-weight: bold; color: #FF6B6B;">₦${Number(order.totalAmount).toLocaleString()}</p>
        </div>

        <p style="margin: 4px 0; font-size: 14px;"><strong>Customer:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Phone:</strong> ${order.customerPhone}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Order ID:</strong> ${order.id}</p>

        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          The customer has been prompted to retry their payment. No action is needed from you right now.
        </p>
      </div>

      <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #888;">Powered by Storely</p>
      </div>
    </div>
  `,
});
exports.paymentFailedTemplate = paymentFailedTemplate;
/**
 * Order status update — sent to the customer when the seller updates their order.
 */
const orderStatusUpdatedTemplate = ({ businessName, order }) => {
    const statusMessages = {
        PROCESSING: {
            label: "Being Processed 🔄",
            message: "Your order is being prepared and will be on its way soon.",
        },
        COMPLETED: {
            label: "Completed ✅",
            message: "Your order has been completed. Thank you for shopping with us!",
        },
        CANCELLED: {
            label: "Cancelled ❌",
            message: "Unfortunately your order has been cancelled. Please contact the store for more information.",
        },
    };
    const { label, message } = statusMessages[order.status] || {
        label: order.status,
        message: "Your order status has been updated.",
    };
    return {
        subject: `Your Order is ${label} — ${businessName}`,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2E2E2E;">
        <div style="background: linear-gradient(135deg, #8A2BE2, #4B0082); padding: 32px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Order Update</h1>
          <p style="color: #e0d4f7; margin: 8px 0 0;">${businessName}</p>
        </div>

        <div style="background: #ffffff; padding: 24px; border: 1px solid #f0f0f0;">
          <p style="font-size: 15px;">Hi <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 15px;">${message}</p>

          <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${label}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Total:</strong> ₦${Number(order.totalAmount).toLocaleString()}</p>
          </div>

          <p style="font-size: 14px; color: #555;">
            If you have any questions, please contact the store directly.
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #888;">Powered by Storely</p>
        </div>
      </div>
    `,
    };
};
exports.orderStatusUpdatedTemplate = orderStatusUpdatedTemplate;
// empty emplates
const paymentConfirmedTemplate = ({ businessName, order, }) => { };
exports.paymentConfirmedTemplate = paymentConfirmedTemplate;
const accountSuspendedTemplate = ({ businessName, order, }) => { };
exports.accountSuspendedTemplate = accountSuspendedTemplate;
