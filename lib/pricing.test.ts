import { calculateQuote } from '../lib/pricing';

export function runPricingUnitTests() {
  const tests: { name: string; fn: () => boolean }[] = [];

  tests.push({
    name: '1. Standard Same-day Metro (0-10km, 2kg)',
    fn: () => {
      const res = calculateQuote({
        service: 'sameday',
        distanceKm: 5,
        weightKg: 2,
        parcelType: 'small',
      });
      // Base $16 + Fuel 8.5% ($1.36) + GST 10% ($1.74) = $19.10
      return res.total === 19.10 && !res.hasRuleConflict;
    },
  });

  tests.push({
    name: '2. Next-day Interstate (>60km, 8kg medium box)',
    fn: () => {
      const res = calculateQuote({
        service: 'nextday',
        distanceKm: 720,
        weightKg: 8,
        parcelType: 'medium',
        isInterstate: true,
      });
      return res.total > 70 && res.lines.some((l) => l.ruleId === 'PR-15');
    },
  });

  tests.push({
    name: '3. F-004 Overlap Bug Detection (24.8km, unpatched mode)',
    fn: () => {
      const res = calculateQuote({
        service: 'sameday',
        distanceKm: 24.8,
        weightKg: 4,
        parcelType: 'small',
        proposedFixApplied: false,
      });
      return res.hasRuleConflict === true && res.lines.some((l) => l.hasConflict);
    },
  });

  tests.push({
    name: '4. F-004 Proposed Fix Mode (24.8km, patched mode)',
    fn: () => {
      const res = calculateQuote({
        service: 'sameday',
        distanceKm: 24.8,
        weightKg: 4,
        parcelType: 'small',
        proposedFixApplied: true,
      });
      return res.hasRuleConflict === false && !res.lines.some((l) => l.hasConflict);
    },
  });

  tests.push({
    name: '5. Heavy Freight Van Lift Surcharge (>30kg)',
    fn: () => {
      const res = calculateQuote({
        service: 'sameday',
        distanceKm: 12,
        weightKg: 35,
        parcelType: 'pallet',
      });
      return res.lines.some((l) => l.ruleId === 'PR-11' && l.amount === 24.0);
    },
  });

  console.log('Running Meridian Pricing Engine Unit Tests...');
  let passed = 0;
  for (const t of tests) {
    try {
      const ok = t.fn();
      if (ok) {
        console.log(`  ✓ Passed: ${t.name}`);
        passed++;
      } else {
        console.error(`  ✗ Failed: ${t.name}`);
      }
    } catch (e) {
      console.error(`  ✗ Error in ${t.name}:`, e);
    }
  }

  console.log(`Results: ${passed}/${tests.length} tests passed.\n`);
  return passed === tests.length;
}

// Auto-run if executed directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('pricing.test')) {
  runPricingUnitTests();
}
