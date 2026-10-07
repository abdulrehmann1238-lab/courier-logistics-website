export interface PricingInput {
  service: 'sameday' | 'nextday' | 'scheduled';
  weightKg: number;
  parcelType: 'document' | 'small' | 'medium' | 'large' | 'pallet';
  distanceKm: number;
  isInterstate?: boolean;
  proposedFixApplied?: boolean; // For demonstrating F-004 fix in simulator & audit
}

export interface PricingLine {
  ruleId: string;
  name: string;
  description: string;
  amount: number;
  hasConflict?: boolean;
}

export interface PricingResult {
  lines: PricingLine[];
  subtotal: number;
  fuelLevy: number;
  gst: number;
  total: number;
  eta: string;
  distanceKm: number;
  hasRuleConflict: boolean;
  conflictDescription?: string;
}

export function calculateQuote(input: PricingInput): PricingResult {
  const lines: PricingLine[] = [];
  let subtotal = 0;
  let hasRuleConflict = false;
  let conflictDescription: string | undefined;

  // 1. Base Service Price
  let basePrice = 16.0;
  let baseRuleId = 'PR-01';
  let etaText = 'Today by 17:00';

  if (input.service === 'nextday') {
    basePrice = 11.0;
    baseRuleId = 'PR-02';
    etaText = 'Tomorrow by 12:00';
  } else if (input.service === 'scheduled') {
    basePrice = 9.5;
    baseRuleId = 'PR-03';
    etaText = 'Scheduled pickup window';
  }

  lines.push({
    ruleId: baseRuleId,
    name: `Base ${input.service === 'sameday' ? 'Same-day' : input.service === 'nextday' ? 'Next-day' : 'Scheduled'} rate`,
    description: 'Standard dispatch allocation',
    amount: basePrice,
  });
  subtotal += basePrice;

  // 2. Distance Band
  const dist = Math.max(0, input.distanceKm);

  if (input.proposedFixApplied) {
    // Consolidated unambiguous rule set
    let distPrice = 0;
    let distRule = 'PR-04';
    let distDesc = 'Metro core (0–10km)';

    if (dist > 60) {
      distPrice = 34.0;
      distRule = 'PR-07';
      distDesc = 'Outer regional (>60km)';
    } else if (dist > 25) {
      distPrice = 19.0;
      distRule = 'PR-06';
      distDesc = 'Outer metro (>25–60km)';
    } else if (dist > 10) {
      distPrice = 8.5;
      distRule = 'PR-05';
      distDesc = 'Inner metro (>10–25km)';
    }

    lines.push({
      ruleId: distRule,
      name: `Distance band (${dist.toFixed(1)} km)`,
      description: distDesc,
      amount: distPrice,
    });
    subtotal += distPrice;
  } else {
    // Unpatched legacy behavior: overlap bug between 24km and 26km (Finding F-004)
    if (dist >= 24 && dist <= 26) {
      hasRuleConflict = true;
      conflictDescription = 'Rule PR-05 (10-26km) and PR-06 (24-60km) overlap between 24-26km, creating pricing ambiguity.';
      // Legacy code applied higher tier without clear boundary
      lines.push({
        ruleId: 'PR-05/06',
        name: `Distance band (${dist.toFixed(1)} km) [CONFLICT]`,
        description: 'Overlapping rule bounds: PR-05 (10–26km) vs PR-06 (24–60km)',
        amount: 19.0,
        hasConflict: true,
      });
      subtotal += 19.0;
    } else if (dist > 60) {
      lines.push({
        ruleId: 'PR-07',
        name: `Distance band (${dist.toFixed(1)} km)`,
        description: 'Outer regional zone',
        amount: 34.0,
      });
      subtotal += 34.0;
    } else if (dist > 25) {
      lines.push({
        ruleId: 'PR-06',
        name: `Distance band (${dist.toFixed(1)} km)`,
        description: 'Outer metro zone',
        amount: 19.0,
      });
      subtotal += 19.0;
    } else if (dist > 10) {
      lines.push({
        ruleId: 'PR-05',
        name: `Distance band (${dist.toFixed(1)} km)`,
        description: 'Inner metro zone',
        amount: 8.5,
      });
      subtotal += 8.5;
    } else {
      lines.push({
        ruleId: 'PR-04',
        name: `Distance band (${dist.toFixed(1)} km)`,
        description: 'Metro core base included (0–10km)',
        amount: 0.0,
      });
    }
  }

  // 3. Weight Surcharges
  const w = input.weightKg;
  let weightPrice = 0;
  let weightRule = 'PR-08';
  let weightDesc = 'Standard weight (<=5kg)';

  if (w > 30) {
    weightPrice = 24.0;
    weightRule = 'PR-11';
    weightDesc = 'Heavy freight (>30kg van required)';
  } else if (w > 15) {
    weightPrice = 11.5;
    weightRule = 'PR-10';
    weightDesc = 'Medium carton (>15–30kg)';
  } else if (w > 5) {
    weightPrice = 4.0;
    weightRule = 'PR-09';
    weightDesc = 'Standard parcel (>5–15kg)';
  }

  if (weightPrice > 0) {
    lines.push({
      ruleId: weightRule,
      name: `Weight surcharge (${w.toFixed(1)} kg)`,
      description: weightDesc,
      amount: weightPrice,
    });
    subtotal += weightPrice;
  }

  // 4. Volume Surcharge
  let volumePrice = 0;
  if (input.parcelType === 'medium') {
    volumePrice = 3.5;
  } else if (input.parcelType === 'large') {
    volumePrice = 7.0;
  } else if (input.parcelType === 'pallet') {
    volumePrice = 22.0;
  }

  if (volumePrice > 0) {
    lines.push({
      ruleId: 'PR-12',
      name: `Volume surcharge (${input.parcelType})`,
      description: 'Dimensional space allocation',
      amount: volumePrice,
    });
    subtotal += volumePrice;
  }

  // 5. Interstate Surcharge (if applicable)
  if (input.isInterstate) {
    const interstateRate = 18.5;
    lines.push({
      ruleId: 'PR-15',
      name: 'Interstate linehaul surcharge',
      description: 'Cross-border hub trunking',
      amount: interstateRate,
    });
    subtotal += interstateRate;
    etaText = input.service === 'sameday' ? 'Tomorrow 09:00 (Interstate Air)' : '2-3 business days';
  }

  // 6. Fuel Levy: 8.5%
  const fuelLevy = Math.round(subtotal * 0.085 * 100) / 100;
  lines.push({
    ruleId: 'PR-13',
    name: 'Fuel levy (8.5%)',
    description: 'Indexed fleet fuel adjustment',
    amount: fuelLevy,
  });

  // 7. GST: 10%
  const taxableTotal = subtotal + fuelLevy;
  const gst = Math.round(taxableTotal * 0.1 * 100) / 100;
  lines.push({
    ruleId: 'PR-14',
    name: 'Goods & Services Tax (GST 10%)',
    description: 'Statutory Australian GST',
    amount: gst,
  });

  const total = Math.round((taxableTotal + gst) * 100) / 100;

  return {
    lines,
    subtotal,
    fuelLevy,
    gst,
    total,
    eta: etaText,
    distanceKm: dist,
    hasRuleConflict,
    conflictDescription,
  };
}
