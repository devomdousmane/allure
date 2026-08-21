import { NextResponse } from "next/server";
import {
  labelForInterest,
  labelForTimeSlot,
  labelForVisitType,
  TIME_SLOTS,
  VISIT_TYPES,
} from "@/lib/appointment";
import { isValidEmail, sendSiteEmail } from "@/lib/mail";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";

type AppointmentBody = {
  name?: string;
  phone?: string;
  email?: string;
  visitType?: string;
  preferredDate?: string;
  preferredTime?: string;
  interest?: string;
  message?: string;
  company?: string;
  source?: string;
};

const emailOk = (value: string) => isValidEmail(value);
const dateOk = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const visitTypeOk = (value: string) =>
  VISIT_TYPES.some((t) => t.value === value);
const timeOk = (value: string) => TIME_SLOTS.some((t) => t.value === value);

export async function POST(request: Request) {
  const limited = await rateLimit(`appointment:${clientIp(request)}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    const { body, init } = tooManyRequests(limited.retryAfter);
    return NextResponse.json(body, init);
  }

  let body: AppointmentBody;
  try {
    body = (await request.json()) as AppointmentBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const visitType = (body.visitType ?? "").trim();
  const preferredDate = (body.preferredDate ?? "").trim();
  const preferredTime = (body.preferredTime ?? "").trim();
  const interest = (body.interest ?? "").trim();
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
  if (!visitTypeOk(visitType)) {
    return NextResponse.json(
      { error: "Choisissez un type de rendez-vous." },
      { status: 400 }
    );
  }
  if (!dateOk(preferredDate)) {
    return NextResponse.json(
      { error: "Indiquez une date valide." },
      { status: 400 }
    );
  }
  if (!timeOk(preferredTime)) {
    return NextResponse.json(
      { error: "Choisissez un créneau horaire." },
      { status: 400 }
    );
  }

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const chosen = new Date(`${preferredDate}T12:00:00`);
  if (Number.isNaN(chosen.getTime()) || chosen < tomorrow) {
    return NextResponse.json(
      { error: "La date doit être au plus tôt demain." },
      { status: 400 }
    );
  }

  const visitLabel = labelForVisitType(visitType);
  const timeLabel = labelForTimeSlot(preferredTime);
  const interestLabel = labelForInterest(interest);

  const sent = await sendSiteEmail({
    logLabel: "appointment",
    replyTo: email,
    subject: `[Allure] RDV — ${name} · ${preferredDate} ${preferredTime}`,
    text: [
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `Email : ${email}`,
      `Type : ${visitLabel}`,
      `Date souhaitée : ${preferredDate}`,
      `Créneau : ${timeLabel}`,
      `Typologie : ${interestLabel}`,
      `Source : ${source}`,
      "",
      "Précisions :",
      message || "(aucune)",
    ].join("\n"),
  });

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: sent.status });
  }

  return NextResponse.json({ ok: true });
}
