export type FaultType =
  | "engine"
  | "brake"
  | "ac"
  | "electrical"
  | "suspension"
  | "transmission"
  | "body"
  | "battery";

export const faultCatalog: {
  id: FaultType;
  label: string;
  description: string;
  labourBase: number;
  partsBase: number;
  confidence: string;
}[] = [
  {
    id: "engine",
    label: "Engine trouble",
    description: "Knocking, overheating, warning lights, oil leaks",
    labourBase: 35000,
    partsBase: 45000,
    confidence: "Inspection still needed because engine faults can widen fast.",
  },
  {
    id: "brake",
    label: "Brake issue",
    description: "Squeaking, poor response, worn pads, rotor concerns",
    labourBase: 15000,
    partsBase: 25000,
    confidence: "Usually accurate when the symptoms clearly point to pads or discs.",
  },
  {
    id: "ac",
    label: "AC / cooling cabin issue",
    description: "Weak cooling, gas leak, noisy compressor",
    labourBase: 12000,
    partsBase: 18000,
    confidence: "Gas leaks and compressor issues may shift the final cost upward.",
  },
  {
    id: "electrical",
    label: "Electrical fault",
    description: "Dashboard warning, lights, wiring, sensor errors",
    labourBase: 18000,
    partsBase: 22000,
    confidence: "Electrical faults vary a lot depending on sensor and wiring depth.",
  },
  {
    id: "suspension",
    label: "Suspension / steering",
    description: "Rough ride, noise, alignment pull, worn arms or shocks",
    labourBase: 18000,
    partsBase: 30000,
    confidence: "Estimate improves after a lift inspection of shocks and bushes.",
  },
  {
    id: "transmission",
    label: "Transmission problem",
    description: "Gear slipping, delayed shifts, fluid leak",
    labourBase: 40000,
    partsBase: 60000,
    confidence: "Transmission estimates are broad because internal damage is hard to see early.",
  },
  {
    id: "body",
    label: "Body / exterior damage",
    description: "Bumper crack, dent, broken light, panel damage",
    labourBase: 20000,
    partsBase: 28000,
    confidence: "Photo upload helps body damage estimates more than most fault types.",
  },
  {
    id: "battery",
    label: "Battery / charging issue",
    description: "Car won’t start, weak crank, alternator suspicion",
    labourBase: 8000,
    partsBase: 20000,
    confidence: "Battery and alternator checks are usually estimated tightly.",
  },
];

export const severityLevels = [
  { value: 1, label: "Minor" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Major" },
];

const premiumBrands = ["Mercedes-Benz", "BMW", "Lexus"];

export function estimateRepairCost({
  make,
  year,
  faultId,
  severity,
  hasPhoto,
}: {
  make?: string;
  year?: number;
  faultId?: FaultType;
  severity: number;
  hasPhoto?: boolean;
}) {
  const fault = faultCatalog.find((item) => item.id === faultId) || faultCatalog[0];
  const premiumMultiplier = make && premiumBrands.includes(make) ? 1.18 : 1;
  const ageMultiplier = year && year < 2014 ? 1.12 : 1;
  const severityMultiplier = 0.78 + severity * 0.32;
  const photoAdjustment = hasPhoto && fault.id === "body" ? 0.94 : 1;

  const labour = Math.round(
    fault.labourBase * premiumMultiplier * ageMultiplier * severityMultiplier * photoAdjustment
  );
  const parts = Math.round(
    fault.partsBase * premiumMultiplier * ageMultiplier * severityMultiplier * photoAdjustment
  );

  const total = labour + parts;
  const low = Math.round(total * 0.88);
  const high = Math.round(total * 1.2);

  return {
    labour,
    parts,
    total,
    low,
    high,
    note: fault.confidence,
  };
}
