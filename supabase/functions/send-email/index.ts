// supabase/functions/send-email/index.ts
// Sends the contact-form notification via the Brevo transactional email HTTP
// API (https://api.brevo.com/v3/smtp/email). Using the HTTP API instead of raw
// SMTP avoids the TLS/STARTTLS issues denomailer hits on Supabase Edge.
//
// Required secrets: FUNCTION_SECRET (webhook auth), BREVO_API_KEY, SMTP_FROM
// (a sender verified in Brevo), CONTACT_TO (GBA inbox). The old SMTP_HOST/
// SMTP_PORT/SMTP_USER/SMTP_PASS secrets are no longer used.

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

  try {
    const apiKey = Deno.env.get("BREVO_API_KEY");
    if (!apiKey) throw new Error("BREVO_API_KEY is not set");

    const payload = await req.json();
    // Database Webhook payload shape: { type, table, record, old_record, schema }
    const row = payload.record;

    // From must be a sender verified in Brevo (SPF/DKIM); it cannot be the
    // visitor's address. To is the GBA inbox. The visitor's email is set as
    // Reply-To so replying reaches them directly.
    const fromEmail = Deno.env.get("SMTP_FROM")!;
    const toEmail = Deno.env.get("CONTACT_TO") ?? fromEmail;
    const name = oneLine(`${row.prenom ?? ""} ${row.nom ?? ""}`.trim()) || "—";

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: "Formulaire GBA Connect" },
        to: [{ email: toEmail }],
        replyTo: row.email ? { email: row.email, name } : undefined,
        subject: `Nouveau message de contact — ${name} (${oneLine(row.motif ?? "")})`,
        htmlContent: `
          <h2>Nouveau message via le formulaire de contact</h2>
          <p><strong>Nom :</strong> ${escapeHtml(row.nom ?? "")}</p>
          <p><strong>Prénom :</strong> ${escapeHtml(row.prenom ?? "")}</p>
          <p><strong>Email :</strong> ${escapeHtml(row.email ?? "")}</p>
          <p><strong>Portable :</strong> ${escapeHtml(row.portable ?? "")}</p>
          <p><strong>Motif :</strong> ${escapeHtml(row.motif ?? "")}</p>
          <p><strong>Message :</strong></p>
          <p>${escapeHtml(row.message ?? "").replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Brevo API ${res.status}: ${detail}`);
    }

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
