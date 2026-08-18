/** Types de visite & créneaux — formulaire rendez-vous. */

export const APPOINTMENT_PATH = "/rendez-vous" as const;

export const VISIT_TYPES = [
  {
    value: "showroom",
    label: "Showroom / présentation plans",
  },
  {
    value: "residence",
    label: "Visite de la résidence",
  },
  {
    value: "chantier",
    label: "Visite chantier",
  },
  {
    value: "visio",
    label: "Entretien en visioconférence",
  },
] as const;

export const TIME_SLOTS = [
  { value: "09:00", label: "09h00 – 10h00" },
  { value: "10:00", label: "10h00 – 11h00" },
  { value: "11:00", label: "11h00 – 12h00" },
  { value: "14:00", label: "14h00 – 15h00" },
  { value: "15:00", label: "15h00 – 16h00" },
  { value: "16:00", label: "16h00 – 17h00" },
  { value: "17:00", label: "17h00 – 18h00" },
] as const;

export const INTEREST_OPTIONS = [
  { value: "", label: "Pas encore décidé" },
  { value: "studio", label: "Studio" },
  { value: "type-a", label: "Type A" },
  { value: "type-b", label: "Type B" },
  { value: "type-c", label: "Type C" },
  { value: "type-d", label: "Type D" },
] as const;

export type VisitTypeValue = (typeof VISIT_TYPES)[number]["value"];
export type TimeSlotValue = (typeof TIME_SLOTS)[number]["value"];

export function labelForVisitType(value: string) {
  return VISIT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function labelForTimeSlot(value: string) {
  return TIME_SLOTS.find((t) => t.value === value)?.label ?? value;
}

export function labelForInterest(value: string) {
  if (!value) return "Non précisé";
  return INTEREST_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

/** Date minimale = demain (évite RDV le jour même sans validation manuelle). */
export function minAppointmentDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
