"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  className?: string;
  source?: string;
};

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "border-allure-petrol/15 bg-allure-sand text-allure-ink placeholder:text-allure-ink/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40";

export function ContactForm({ className, source = "website" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      message: String(data.get("message") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      source,
    };

    try {
      const res = await fetch("/api/contact", {
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
          json.error ?? "Une erreur est survenue. Réessayez ou contactez-nous par téléphone."
        );
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "Impossible d’envoyer le message. Vérifiez votre connexion ou appelez-nous."
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-4", className)}
      noValidate
    >
      {/* Honeypot anti-spam */}
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
          className={fieldClass}
          disabled={status === "loading"}
        />
        <Input
          name="phone"
          type="tel"
          required
          placeholder="Téléphone"
          className={fieldClass}
          disabled={status === "loading"}
        />
      </div>
      <Input
        name="email"
        type="email"
        required
        placeholder="Email"
        className={fieldClass}
        disabled={status === "loading"}
      />
      <Textarea
        name="message"
        required
        placeholder="Comment pouvons-nous vous aider ?"
        rows={4}
        className={fieldClass}
        disabled={status === "loading"}
      />

      {status === "success" && (
        <p
          role="status"
          className="rounded-lg bg-allure-petrol/10 px-4 py-3 font-sans text-sm text-allure-petrol dark:bg-allure-gold/15 dark:text-allure-gold"
        >
          Message envoyé. Notre équipe vous répond sous 24h.
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
        className="mt-2 rounded-full bg-allure-petrol text-white hover:bg-allure-petrol-deep dark:bg-white dark:text-allure-petrol-deep dark:hover:bg-white/90"
      >
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
