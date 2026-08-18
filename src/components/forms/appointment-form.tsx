"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INTEREST_OPTIONS,
  TIME_SLOTS,
  VISIT_TYPES,
  minAppointmentDate,
} from "@/lib/appointment";

type AppointmentFormProps = {
  className?: string;
  source?: string;
  /** Préremplit le type de visite (ex. chantier depuis /avancement). */
  defaultVisitType?: string;
  /** Préremplit l’intérêt typologie (ex. fiche appartement). */
  defaultInterest?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "border-allure-petrol/15 bg-allure-sand text-allure-ink placeholder:text-allure-ink/40 [color-scheme:light] dark:border-white/15 dark:bg-allure-petrol-deep dark:text-allure-sand dark:placeholder:text-allure-sand/40 dark:[color-scheme:dark]";

const selectClass = cn(
  fieldClass,
  "h-11 w-full appearance-none rounded-full border px-5 py-2 font-sans text-sm outline-none transition-colors",
  "focus-visible:border-allure-gold focus-visible:ring-3 focus-visible:ring-allure-gold/25",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

const optionClass =
  "bg-allure-sand text-allure-ink dark:bg-allure-petrol-deep dark:text-allure-sand";

export function AppointmentForm({
  className,
  source = "website",
  defaultVisitType = "showroom",
  defaultInterest = "",
}: AppointmentFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const minDate = useMemo(() => minAppointmentDate(), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      visitType: String(data.get("visitType") ?? "").trim(),
      preferredDate: String(data.get("preferredDate") ?? "").trim(),
      preferredTime: String(data.get("preferredTime") ?? "").trim(),
      interest: String(data.get("interest") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      source,
    };

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          json.error ??
            "Une erreur est survenue. Réessayez ou contactez-nous par téléphone."
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "Impossible d’envoyer la demande. Vérifiez votre connexion ou appelez-nous."
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-4", className)}
      noValidate
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          name="name"
          required
          placeholder="Prénom & nom"
          autoComplete="name"
          className={fieldClass}
          disabled={status === "loading"}
        />
        <Input
          name="phone"
          type="tel"
          required
          placeholder="Téléphone"
          autoComplete="tel"
          className={fieldClass}
          disabled={status === "loading"}
        />
      </div>

      <Input
        name="email"
        type="email"
        required
        placeholder="Email"
        autoComplete="email"
        className={fieldClass}
        disabled={status === "loading"}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-allure-ink/45 dark:text-allure-sand/45">
            Type de rendez-vous
          </span>
          <select
            name="visitType"
            required
            defaultValue={defaultVisitType}
            className={selectClass}
            disabled={status === "loading"}
          >
            {VISIT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value} className={optionClass}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-allure-ink/45 dark:text-allure-sand/45">
            Typologie d’intérêt
          </span>
          <select
            name="interest"
            defaultValue={defaultInterest}
            className={selectClass}
            disabled={status === "loading"}
          >
            {INTEREST_OPTIONS.map((opt) => (
              <option
                key={opt.value || "none"}
                value={opt.value}
                className={optionClass}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-allure-ink/45 dark:text-allure-sand/45">
            Date souhaitée
          </span>
          <Input
            name="preferredDate"
            type="date"
            required
            min={minDate}
            className={fieldClass}
            disabled={status === "loading"}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-allure-ink/45 dark:text-allure-sand/45">
            Créneau
          </span>
          <select
            name="preferredTime"
            required
            defaultValue=""
            className={selectClass}
            disabled={status === "loading"}
          >
            <option value="" disabled className={optionClass}>
              Choisir un créneau
            </option>
            {TIME_SLOTS.map((slot) => (
              <option
                key={slot.value}
                value={slot.value}
                className={optionClass}
              >
                {slot.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Textarea
        name="message"
        placeholder="Précisions (nombre de personnes, questions, contrainte horaire…)"
        rows={3}
        className={fieldClass}
        disabled={status === "loading"}
      />

      {status === "success" && (
        <p
          role="status"
          className="rounded-lg bg-allure-petrol/10 px-4 py-3 font-sans text-sm text-allure-petrol dark:bg-allure-gold/15 dark:text-allure-gold"
        >
          Demande envoyée. Nous confirmons votre créneau sous 24h ouvrables.
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg bg-red-500/10 px-4 py-3 font-sans text-sm text-red-700 dark:text-red-300"
        >
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="btn-cta mt-2"
      >
        {status === "loading" ? "Envoi…" : "Planifier un rendez-vous"}
      </Button>
    </form>
  );
}
