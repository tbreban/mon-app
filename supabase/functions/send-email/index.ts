// supabase/functions/send-email/index.ts
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

Deno.serve(async (req) => {
  // Verify the request came from the database webhook. The webhook's
  // Authorization header must match "Bearer <FUNCTION_SECRET>" — set the
  // FUNCTION_SECRET secret to exactly the token the webhook sends (the value
  // after "Bearer " in the webhook's Authorization header).
  const authHeader = req.headers.get("Authorization");
  const secret = Deno.env.get("FUNCTION_SECRET");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Match TLS mode to the port: 465 = implicit TLS; 587/25 = STARTTLS (connect
  // in plaintext, then upgrade). Forcing implicit TLS on a STARTTLS port throws
  // "received corrupt message of type InvalidContentType".
  const port = Number(Deno.env.get("SMTP_PORT") ?? 465);
  const client = new SMTPClient({
    connection: {
      hostname: Deno.env.get("SMTP_HOST")!,
      port,
      tls: port === 465,
      auth: {
        username: Deno.env.get("SMTP_USER")!,
        password: Deno.env.get("SMTP_PASS")!,
      },
    },
  });

  try {
    const payload = await req.json();
    // Database Webhook payload shape: { type, table, record, old_record, schema }
    const row = payload.record;

    // Notification goes TO the GBA inbox (contact@gba-connect.fr), configured
    // in the CONTACT_TO env var. From must be a domain-authenticated sender
    // (SMTP_FROM) for SPF/DKIM — it cannot be the visitor's address. The
    // visitor's email is set as Reply-To so replying reaches them directly.
    const to = Deno.env.get("CONTACT_TO") ?? Deno.env.get("SMTP_FROM")!;
    const from = Deno.env.get("SMTP_FROM")!;

    const name = oneLine(`${row.prenom ?? ""} ${row.nom ?? ""}`.trim()) || "—";

    await client.send({
      from,
      to,
      replyTo: row.email,
      subject: `Nouveau message de contact — ${name} (${oneLine(row.motif ?? "")})`,
      content: "auto",                     // lets denomailer build text/plain
      html: `
        <h2>Nouveau message via le formulaire de contact</h2>
        <p><strong>Nom :</strong> ${escapeHtml(row.nom ?? "")}</p>
        <p><strong>Prénom :</strong> ${escapeHtml(row.prenom ?? "")}</p>
        <p><strong>Email :</strong> ${escapeHtml(row.email ?? "")}</p>
        <p><strong>Portable :</strong> ${escapeHtml(row.portable ?? "")}</p>
        <p><strong>Motif :</strong> ${escapeHtml(row.motif ?? "")}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(row.message ?? "").replace(/\n/g, "<br>")}</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send failed:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    // Close per-request: a reused SMTP connection across Edge isolates goes stale.
    await client.close().catch(() => {});
  }
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!
  ));
}

// Strip CR/LF so user-supplied values can't inject email headers via the subject.
function oneLine(s: string) {
  return s.replace(/[\r\n]+/g, " ").trim();
}
