import { NextResponse } from "next/server";
import { isValidEmail, sendSiteEmail } from "@/lib/mail";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";

type NewsletterBody = {
  email?: string;
  company?: string;
};

export async function POST(request: Request) {
  const limited = await rateLimit(`newsletter:${clientIp(request)}`, {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    const { body, init } = tooManyRequests(limited.retryAfter);
    return NextResponse.json(body, init);
  }

  let body: NewsletterBody;
  try {
    body = (await request.json()) as NewsletterBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Indiquez une adresse email valide." },
      { status: 400 }
    );
  }

  const sent = await sendSiteEmail({
    logLabel: "newsletter",
    replyTo: email,
    subject: `[Allure] Inscription newsletter — ${email}`,
    text: [
      "Nouvelle inscription à l’avancement / disponibilités.",
      `Email : ${email}`,
      "Source : footer",
    ].join("\n"),
  });

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: sent.status });
  }

  return NextResponse.json({ ok: true });
}
