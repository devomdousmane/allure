import { Resend } from "resend";
import { SITE } from "@/lib/site";

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendSiteEmail(options: {
  subject: string;
  text: string;
  replyTo?: string;
  logLabel?: string;
}): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Résidence Allure <onboarding@resend.dev>";
  const label = options.logLabel ?? "mail";

  if (!apiKey) {
    console.error(`[${label}] RESEND_API_KEY manquant`);
    return {
      ok: false,
      status: 503,
      error: `Le service d’envoi n’est pas configuré. Appelez-nous au ${SITE.phone}.`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
    });

    if (error) {
      console.error(`[${label}] Resend error`, error);
      return {
        ok: false,
        status: 502,
        error: "L’envoi a échoué. Réessayez dans un instant.",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error(`[${label}] unexpected`, err);
    return {
      ok: false,
      status: 500,
      error: "Erreur serveur. Réessayez plus tard.",
    };
  }
}
