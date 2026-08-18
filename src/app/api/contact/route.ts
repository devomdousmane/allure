import { NextResponse } from "next/server";
import { isValidEmail, sendSiteEmail } from "@/lib/mail";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  company?: string;
  source?: string;
};

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${clientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    const { body, init } = tooManyRequests(limited.retryAfter);
    return NextResponse.json(body, init);
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const source = (body.source ?? "website").trim();

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Indiquez votre prénom et nom." },
      { status: 400 }
    );
  }
  if (!phone || phone.length < 6) {
    return NextResponse.json(
      { error: "Indiquez un numéro de téléphone valide." },
      { status: 400 }
    );
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Indiquez une adresse email valide." },
      { status: 400 }
    );
  }
  if (!message || message.length < 10) {
    return NextResponse.json(
      { error: "Votre message est trop court." },
      { status: 400 }
    );
  }

  const sent = await sendSiteEmail({
    logLabel: "contact",
    replyTo: email,
    subject: `[Allure] Nouveau message — ${name}`,
    text: [
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Email : ${email}`,
      `Source : ${source}`,
      "",
      "Message :",
      message,
    ].join("\n"),
  });

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: sent.status });
  }

  return NextResponse.json({ ok: true });
}
