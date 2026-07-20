import { NextResponse } from "next/server";
import { Resend } from "resend";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  company?: string;
  source?: string;
};

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot rempli = bot
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
  if (!email || !emailOk(email)) {
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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? SITE.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Résidence Allure <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY manquant");
    return NextResponse.json(
      {
        error:
          "Le service d’envoi n’est pas configuré. Appelez-nous au " +
          SITE.phone +
          ".",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
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

    if (error) {
      console.error("[contact] Resend error", error);
      return NextResponse.json(
        { error: "L’envoi a échoué. Réessayez dans un instant." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected", err);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 }
    );
  }
}
