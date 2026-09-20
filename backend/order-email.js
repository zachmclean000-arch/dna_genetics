import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const recipient =
  process.env.ORDER_NOTIFICATION_EMAIL || "sales@dnnagenetics.com";
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.resolve(backendDirectory, "../frontend/public");
const uploadsDirectory = path.resolve(backendDirectory, "uploads");
const paymentLabels = {
  zelle: "Zelle",
  chime: "Chime",
  bitcoin: "Bitcoin",
  "apple-pay-gift-card": "Apple Pay gift card",
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
const money = (value) => `$${Number(value || 0).toFixed(2)}`;

function localAsset(publicPath) {
  if (typeof publicPath !== "string") return null;
  let root;
  let relative;
  if (publicPath.startsWith("/assets/")) {
    root = publicDirectory;
    relative = publicPath.slice(1);
  } else if (publicPath.startsWith("/uploads/")) {
    root = uploadsDirectory;
    relative = publicPath.slice("/uploads/".length);
  } else return null;
  const resolved = path.resolve(root, relative);
  const fromRoot = path.relative(root, resolved);
  if (
    fromRoot.startsWith("..") ||
    path.isAbsolute(fromRoot) ||
    !existsSync(resolved)
  )
    return null;
  return resolved;
}

function addressText(contact) {
  return [
    contact.address,
    contact.address2,
    contact.city,
    contact.region,
    contact.postalCode,
    contact.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function buildOrderEmail(order) {
  const contact = order.contact;
  const shortReference = order.id.slice(0, 8).toUpperCase();
  const payment = paymentLabels[contact.paymentMethod] || contact.paymentMethod;
  const attachments = [];
  const logo = localAsset("/assets/images/logo/site-logo.webp");
  if (logo)
    attachments.push({
      filename: path.basename(logo),
      path: logo,
      cid: "campaign-logo@dna-genetics",
    });

  const productRows = order.items
    .map((item, index) => {
      const imagePath = localAsset(item.image);
      const cid = `product-${index}@dna-genetics`;
      if (imagePath)
        attachments.push({
          filename: path.basename(imagePath),
          path: imagePath,
          cid,
        });
      const thumbnail = imagePath
        ? `<img src="cid:${cid}" width="76" height="76" alt="" style="display:block;width:76px;height:76px;object-fit:cover;border-radius:8px;background:#101010">`
        : '<div style="width:76px;height:76px;border-radius:8px;background:#ece8df;color:#245442;font-size:11px;font-weight:700;line-height:76px;text-align:center">PRODUCT</div>';
      const pack = item.size
        ? `<div style="color:#777;font-size:13px;margin-top:5px">${escapeHtml(item.size)}-seed pack</div>`
        : "";
      return `<tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e0d7;width:88px;vertical-align:top">${thumbnail}</td>
        <td style="padding:16px 10px;border-bottom:1px solid #e5e0d7;vertical-align:top">
          <div style="font-size:15px;line-height:1.4;font-weight:700;color:#202020">${escapeHtml(item.name)}</div>
          ${pack}<div style="color:#777;font-size:13px;margin-top:5px">Quantity: ${item.quantity}</div>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #e5e0d7;text-align:right;vertical-align:top;white-space:nowrap;font-weight:700;color:#202020">${money(item.price * item.quantity)}</td>
      </tr>`;
    })
    .join("");

  const itemText = order.items
    .map(
      (item) =>
        `${item.quantity} x ${item.name}${item.size ? ` (${item.size}-seed pack)` : ""} - ${money(item.price * item.quantity)}`,
    )
    .join("\n");
  const text = [
    `DNA GENETICS ${order.id}`,
    "",
    `Name: ${contact.firstName} ${contact.lastName}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone}`,
    `Address: ${addressText(contact)}`,
    `Selected payment method: ${payment}`,
    `Order note: ${contact.orderNote || "None"}`,
    "",
    itemText,
    `Subtotal: ${money(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? "FREE" : money(order.shipping)}`,
    `Total: ${money(order.total)}`,
    "",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>@media(max-width:620px){.email-shell{width:100%!important}.email-pad{padding-left:20px!important;padding-right:20px!important}.two-col,.two-col td{display:block!important;width:100%!important}.two-col td+td{padding-left:0!important;padding-top:12px!important}}</style></head>
<body style="margin:0;padding:0;background:#eeeae2;font-family:Arial,Helvetica,sans-serif;color:#202020">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eeeae2"><tr><td align="center" style="padding:24px 10px">
<table role="presentation" class="email-shell" width="620" cellspacing="0" cellpadding="0" style="width:620px;max-width:620px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.08)">
  <tr><td style="height:8px;background:#f5ca3c"></td></tr>
  <tr><td class="email-pad" style="padding:24px 34px;background:#174d3c">
    <table role="presentation" width="100%"><tr>
      <td>${logo ? '<img src="cid:campaign-logo@dna-genetics" width="88" alt="DNA Genetics" style="display:block;width:88px;height:auto;background:#fff;border-radius:6px;padding:5px">' : '<div style="color:#fff;font-size:22px;font-weight:800">DNA GENETICS</div>'}</td>
      <td align="right" style="color:#dce9e3;font-size:12px;line-height:1.5">DNA GENETICS<br><strong style="color:#fff">ORDER #${escapeHtml(shortReference)}</strong></td>
    </tr></table>
  </td></tr>
  <tr><td class="email-pad" style="padding:32px 34px 16px">
    <div style="display:inline-block;background:#fff3c8;color:#715a00;border-radius:20px;padding:7px 12px;font-size:12px;font-weight:700;letter-spacing:.4px">ORDER RECEIVED</div>
    <h1 style="margin:16px 0 8px;font-size:28px;line-height:1.2;color:#174d3c">Your order</h1>
  </td></tr>
  <tr><td class="email-pad" style="padding:12px 34px 8px">
    <table role="presentation" class="two-col" width="100%"><tr>
      <td width="50%" style="background:#f8f6f1;border-radius:8px;padding:18px;vertical-align:top">
        <div style="color:#174d3c;font-size:12px;font-weight:800;letter-spacing:.7px;margin-bottom:11px">CUSTOMER</div>
        <div style="font-size:15px;font-weight:700;margin-bottom:7px">${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</div>
        <div style="font-size:14px;line-height:1.7;color:#555"><a href="mailto:${escapeHtml(contact.email)}" style="color:#174d3c">${escapeHtml(contact.email)}</a><br>${escapeHtml(contact.phone)}</div>
      </td>
      <td width="50%" style="padding-left:12px;vertical-align:top"><div style="background:#f8f6f1;border-radius:8px;padding:18px">
        <div style="color:#174d3c;font-size:12px;font-weight:800;letter-spacing:.7px;margin-bottom:11px">POSTAL ADDRESS</div>
        <div style="font-size:14px;line-height:1.65;color:#555">${escapeHtml(addressText(contact))}</div>
      </div></td>
    </tr></table>
  </td></tr>
  <tr><td class="email-pad" style="padding:24px 34px 0"><h2 style="margin:0;font-size:19px;color:#174d3c">Order summary</h2></td></tr>
  <tr><td class="email-pad" style="padding:0 34px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${productRows}</table></td></tr>
  <tr><td class="email-pad" style="padding:18px 34px 8px"><table role="presentation" width="100%" style="font-size:14px;line-height:2">
    <tr><td style="color:#666">Subtotal</td><td align="right">${money(order.subtotal)}</td></tr>
    <tr><td style="color:#666">Shipping</td><td align="right">${order.shipping === 0 ? '<strong style="color:#174d3c">FREE</strong>' : money(order.shipping)}</td></tr>
    <tr><td style="border-top:2px solid #174d3c;padding-top:8px;font-size:17px;font-weight:800">Total</td><td align="right" style="border-top:2px solid #174d3c;padding-top:8px;font-size:20px;font-weight:800;color:#174d3c">${money(order.total)}</td></tr>
  </table></td></tr>
  <tr><td class="email-pad" style="padding:20px 34px"><table role="presentation" width="100%"><tr><td style="background:#fff8df;border-left:4px solid #f5ca3c;padding:16px 18px;font-size:14px;line-height:1.6">
    <strong style="color:#174d3c">Selected payment option:</strong> ${escapeHtml(payment)}<br>
    <strong style="color:#174d3c">Order note:</strong> ${escapeHtml(contact.orderNote || "None")}
  </td></tr></table></td></tr>
  <tr><td class="email-pad" style="padding:22px 34px;background:#174d3c;color:#dce9e3;text-align:center;font-size:12px;line-height:1.6">
    <strong style="color:#fff">A member of the team will be in touch .</strong><br> DNA GENETICS
  </td></tr>
</table></td></tr></table></body></html>`;

  return {
    subject: `DNA GENETICS order ${shortReference}`,
    text,
    html,
    attachments,
  };
}

export function buildOrderStatusEmail(order, status) {
  const labels = {
    in_progress: "ORDER IN PROGRESS",
    completed: "ORDER COMPLETED",
  };
  const headings = {
    in_progress: "Your order is currently in progress",
    completed: "Your order has been completed",
  };
  const label = labels[status];
  const heading = headings[status];
  if (!label || !heading) throw Error("Unsupported email status.");
  const email = buildOrderEmail(order);
  const reference = order.id.slice(0, 8).toUpperCase();
  return {
    ...email,
    subject: `DNA GENETICS order ${reference}: ${heading}`,
    text: `${heading}.\n\n${email.text}`,
    html: email.html
      .replace("ORDER RECEIVED", label)
      .replace(">Your order</h1>", `>${heading}</h1>`),
  };
}

export function buildContactEmail(contact) {
  const name = `${contact.firstName} ${contact.lastName}`;
  const subject = contact.subject.replace(/[\r\n]+/g, " ");
  return {
    subject: `DNA GENETICS contact: ${subject}`,
    text: [
      "New website contact message",
      "",
      `Name: ${name}`,
      `Email: ${contact.email}`,
      `Subject: ${contact.subject}`,
      "",
      contact.message,
    ].join("\n"),
    html: `<!doctype html><html lang="en"><body style="margin:0;background:#eeeae2;font-family:Arial,Helvetica,sans-serif;color:#202020">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 10px">
      <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="height:8px;background:#f5ca3c"></td></tr>
        <tr><td style="padding:24px 32px;background:#174d3c;color:#fff"><strong style="font-size:21px">DNA GENETICS</strong><div style="margin-top:5px;color:#dce9e3">New contact message</div></td></tr>
        <tr><td style="padding:28px 32px">
          <h1 style="margin:0 0 20px;color:#174d3c;font-size:24px">${escapeHtml(contact.subject)}</h1>
          <p style="line-height:1.7"><strong>From:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}" style="color:#174d3c">${escapeHtml(contact.email)}</a></p>
          <div style="margin-top:22px;padding:20px;background:#f8f6f1;border-left:4px solid #f5ca3c;line-height:1.7;white-space:pre-wrap">${escapeHtml(contact.message)}</div>
        </td></tr>
      </table></td></tr></table>
    </body></html>`,
    attachments: [],
  };
}

async function deliverEmail(email, replyTo) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;
  if (!user || !pass) return { sent: false, reason: "not-configured" };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `DNA Genetics <${user}>`,
    to: recipient,
    replyTo,
    ...email,
  });
  return { sent: true };
}

export async function sendOrderNotification(order) {
  return deliverEmail(buildOrderEmail(order), order.contact.email);
}

export async function sendOrderStatusNotification(order, status) {
  return deliverEmail(buildOrderStatusEmail(order, status), order.contact.email);
}

export async function sendContactNotification(contact) {
  return deliverEmail(buildContactEmail(contact), contact.email);
}
