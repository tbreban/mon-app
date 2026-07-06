// supabase/functions/send-email/index.ts
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const client = new SMTPClient({
  connection: {
    hostname: Deno.env.get("SMTP_HOST")!,
    port: Number(Deno.env.get("SMTP_PORT") ?? 465),
    tls: true, // use implicit TLS (port 465). For STARTTLS on 587, see note below
    auth: {
      username: Deno.env.get("SMTP_USER")!,
      password: Deno.env.get("SMTP_PASS")!,
    },
  },
});

Deno.serve(async (req) => {
  // Verify the request came from your database/webhook
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("FUNCTION_SECRET")}`) {
    return new Response("Unauthorized", { status: 401 });
  }

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
