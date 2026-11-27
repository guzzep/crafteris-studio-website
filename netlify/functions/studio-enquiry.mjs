import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

// Native Netlify rate limit: applies across function instances.
export const config = {
  path: "/.netlify/functions/studio-enquiry",
  rateLimit: { action: "rate_limit", windowLimit: 3, windowSize: 180, aggregateBy: ["ip", "domain"] },
};

const inbox = "info@crafteris.com";
const sender = "Crafteris Studio <studio@crafteris.com>";
const response = (status, data) => Response.json(data, { status, headers: {"Cache-Control": "no-store"} });
const clean = (value) => typeof value === "string" ? value.trim() : "";
const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/i;

async function sendEmail(key, reference, kind, payload) {
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", "Idempotency-Key": "studio-enquiry/" + reference + "/" + kind },
      body: JSON.stringify({ from: sender, ...payload }),
      signal: AbortSignal.timeout(7000),
    });
    if (!result.ok) {
      console.error("Studio enquiry email failed", { reference, kind, status: result.status });
      return false;
    }
    return true;
  } catch {
    console.error("Studio enquiry email request failed", { reference, kind });
    return false;
  }
}

export default async function handler(request) {
  if (request.method !== "POST") return response(405, {error: "Method not allowed."});
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response(415, {error: "Invalid request."});
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return response(403, {error: "Invalid request origin."});
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 20000) return response(413, {error: "Message too large."});
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw Error("Invalid body");
  } catch { return response(400, {error: "Invalid enquiry."}); }
  if (clean(body.website)) return response(200, {ok: true});
  const names = clean(body.names);
  const email = clean(body.email).toLowerCase();
  const phone = clean(body.phone);
  const reason = clean(body.reason) || "General enquiry";
  const message = clean(body.message);
  const group_size = body.group_size ?? null;
  if (!names || names.length > 120 || email.length > 254 || !emailPattern.test(email) || phone.length > 50 || reason.length > 120 || message.length < 10 || message.length > 3000 || (message.match(/(https?:\/\/|www\.)/gi) || []).length > 3 || (group_size !== null && (!Number.isSafeInteger(group_size) || group_size < 1 || group_size > 100000))) {
    return response(400, {error: "Please check your contact details and message."});
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) {
    console.error("Studio enquiry database configuration missing");
    return response(503, {error: "Enquiries are temporarily unavailable. Please email info@crafteris.com."});
  }
  const reference = randomUUID();
  try {
    const supabase = createClient(url, publishable, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await supabase.from("contact_enquiries").insert({names,email,phone:phone || null,reason,group_size,message,is_read:false});
    if (error) {
      console.error("Studio enquiry database insert failed", {reference, code: error.code});
      return response(503, {error: "We couldn't save your message. Please try again or email info@crafteris.com."});
    }
  } catch {
    console.error("Studio enquiry database request failed", {reference});
    return response(503, {error: "We couldn't save your message. Please try again or email info@crafteris.com."});
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Studio enquiry saved; Resend API key unavailable", {reference});
    return response(200, {ok:true});
  }
  await Promise.all([
    sendEmail(key, reference, "studio", {
      to: [inbox], reply_to: email, subject: "New Crafteris Studio website enquiry",
      text: ["New enquiry from the Crafteris Studio website.", "", "Name: " + names, "Email: " + email, "Phone: " + (phone || "Not provided"), "Enquiry type: " + reason, "Group size: " + (group_size ?? "Not provided"), "", message, "", "The enquiry is also available in the website admin dashboard."].join("\n"),
    }),
    sendEmail(key, reference, "customer", {
      to: [email], reply_to: inbox, subject: "We have received your Crafteris Studio enquiry",
      text: "Thank you for contacting Crafteris Studio – Home to GlassXpressions.\n\nWe have received your enquiry and our studio team will get back to you as soon as possible.\n\nThis acknowledgement is not a booking confirmation.\n\nCrafteris Studio – Home to GlassXpressions\n314, Fleur de Lys Road, Birkirkara, BKR 9067, Malta\n+356 7798 1366\ninfo@crafteris.com",
    }),
  ]);
  return response(200, {ok:true});
}
