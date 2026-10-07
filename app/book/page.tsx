'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemoStore } from '../../store/useDemoStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Toggle } from '../../components/ui/Toggle';
import { FindingPin } from '../../components/audit/FindingPin';
import {
  Check,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Smartphone,
  Mail,
  Camera,
} from 'lucide-react';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createBooking, addToast } = useDemoStore();

  // Query params prefill
  const qFrom = searchParams.get('from') || 'Richmond';
  const qTo = searchParams.get('to') || 'Docklands';
  const qService = (searchParams.get('service') as any) || 'sameday';
  const qPrice = parseFloat(searchParams.get('price') || '38.60');

  // Stepper: 0: Details, 1: Parcel, 2: Payment, 3: Review, 4: Confirmed
  const [step, setStep] = useState(0);

  // Step 1: Details
  const [senderName, setSenderName] = useState('Harlow & Finch Architects');
  const [senderPhone, setSenderPhone] = useState('03 9421 8800');
  const [pickupAddress, setPickupAddress] = useState(`Level 2, 88 Swan Street, ${qFrom} VIC 3121`);
  const [recipientName, setRecipientName] = useState('A. Whitlock');
  const [recipientPhone, setRecipientPhone] = useState('0412 881 920');
  const [deliveryAddress, setDeliveryAddress] = useState(`Tower 4, 727 Collins Street, ${qTo} VIC 3008`);
  const [accessNotes, setAccessNotes] = useState('Check in at Level 1 concierge desk for security pass.');

  // Step 2: Parcel
  const [parcelDesc, setParcelDesc] = useState('Architectural sample specifications binder');
  const [declaredValue, setDeclaredValue] = useState('450');
  const [isFragile, setIsFragile] = useState(true);
  const [sigRequired, setSigRequired] = useState(true);
  const [photoSelected, setPhotoSelected] = useState(false);

  // Step 3: Payment
  const [accountType, setAccountType] = useState<'business' | 'card'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [cardError, setCardError] = useState('');

  // Step 4: Submission
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJobId, setCreatedJobId] = useState('');

  // Accordion state on confirmation
  const [notificationOpen, setNotificationOpen] = useState(true);

  async function handleFinalSubmit() {
    // Check card declined simulation
    if (cardNumber.endsWith('0002')) {
      setCardError('Payment gateway error: Card declined (insufficient funds simulation).');
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    setCardError('');

    try {
      const newJob = await createBooking({
        customerName: senderName,
        customerEmail: 'studio@harlowfinch.com.au',
        customerPhone: senderPhone,
        fromSuburb: qFrom,
        fromAddress: pickupAddress,
        toSuburb: qTo,
        toAddress: deliveryAddress,
        service: qService,
        price: qPrice,
        parcel: {
          description: parcelDesc,
          type: 'medium',
          weightKg: 6.5,
          dimensions: '42 × 30 × 15 cm',
          isFragile,
          signatureRequired: sigRequired,
        },
      });

      setIsSubmitting(false);
      setCreatedJobId(newJob.id);
      setStep(4); // Confirmed
    } catch (err: any) {
      setIsSubmitting(false);
      addToast({
        type: 'error',
        title: 'Booking Failed (Simulation)',
        message: err.message || 'Server error occurred.',
      });
    }
  }

  return (
    <div className="max-w-[880px] mx-auto px-6 py-10 font-sans">
      {/* Finding Pins for Booking */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent">
            Consignment Dispatch Booking
          </span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-0.5">
            {step === 4 ? 'Booking Confirmed' : 'Complete your consignment'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <FindingPin findingId="F-007" label="Database Transactions" />
          <FindingPin findingId="F-010" label="Stripe Webhook Verification" />
        </div>
      </div>

      {/* Stepper Progress Bar */}
      {step < 4 && (
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium pb-2 border-b border-border">
            {[
              { id: 0, label: '1. Addresses' },
              { id: 1, label: '2. Parcel Details' },
              { id: 2, label: '3. Payment' },
              { id: 3, label: '4. Review' },
            ].map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 ${
                  step >= s.id ? 'text-primary font-semibold' : 'text-text-muted'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${
                    step > s.id
                      ? 'bg-primary text-surface-elevated'
                      : step === s.id
                      ? 'border border-primary text-primary'
                      : 'border border-border text-text-muted'
                  }`}
                >
                  {step > s.id ? '✓' : s.id + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 0: DETAILS */}
      {step === 0 && (
        <div className="bg-surface rounded-md border border-border p-6 space-y-6 shadow-1 animate-in fade-in">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Consignor (Pickup Origin)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Sender Business / Contact Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
              <Input
                label="Contact Phone Number"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Pickup Street Address & Unit"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <h3 className="text-sm font-semibold text-ink mb-3">Consignee (Delivery Destination)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Recipient Full Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <Input
                label="Recipient Mobile (for SMS ETA)"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Delivery Street Address & Unit"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Access & Delivery Notes (Intercom, Gate, Concierge)"
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              variant="primary"
              onClick={() => setStep(1)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Next: Parcel Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 1: PARCEL */}
      {step === 1 && (
        <div className="bg-surface rounded-md border border-border p-6 space-y-6 shadow-1 animate-in fade-in">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Consignment Specifications</h3>
            <div className="space-y-4">
              <Input
                label="Description of Goods"
                value={parcelDesc}
                onChange={(e) => setParcelDesc(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Declared Transit Value ($ AUD)"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(e.target.value)}
                  hint="Covered under standard freight warranty up to $1,000"
                />
                <div className="flex flex-col justify-center space-y-3 pt-2">
                  <Toggle
                    label="Fragile handling required"
                    checked={isFragile}
                    onChange={setIsFragile}
                  />
                  <Toggle
                    label="Physical signature required on drop"
                    checked={sigRequired}
                    onChange={setSigRequired}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload Mock */}
          <div className="pt-4 border-t border-border/60">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Item Photo Attachment (Optional)
            </label>
            <div
              onClick={() => setPhotoSelected(!photoSelected)}
              className="border-2 border-dashed border-border-strong hover:border-primary rounded-md p-6 text-center cursor-pointer transition-colors bg-surface-elevated"
            >
              {photoSelected ? (
                <div className="flex items-center justify-center gap-3 text-xs text-primary font-medium">
                  <FileCheck className="w-5 h-5 text-success" />
                  <span>architectural_samples_crate.jpg attached (420 KB)</span>
                  <span className="text-text-muted text-[10px]">(Click to remove)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-xs text-text-muted">
                  <Camera className="w-6 h-6 text-text-muted" />
                  <span className="font-medium text-ink">Upload reference photo of consignment</span>
                  <span className="text-[11px]">Click to simulate camera capture or file select</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Next: Payment
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT */}
      {step === 2 && (
        <div className="bg-surface rounded-md border border-border p-6 space-y-6 shadow-1 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Billing & Settlement</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAccountType('card')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  accountType === 'card'
                    ? 'bg-primary text-surface-elevated'
                    : 'bg-surface-sunken text-text-secondary'
                }`}
              >
                Credit Card
              </button>
              <button
                type="button"
                onClick={() => setAccountType('business')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  accountType === 'business'
                    ? 'bg-primary text-surface-elevated'
                    : 'bg-surface-sunken text-text-secondary'
                }`}
              >
                Business Account
              </button>
            </div>
          </div>

          {cardError && (
            <div className="p-3 rounded bg-error-tint border border-error text-xs text-error flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{cardError}</span>
            </div>
          )}

          {accountType === 'card' ? (
            <div className="space-y-4">
              <Input
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                iconPrefix={<CreditCard className="w-4 h-4" />}
                hint="Demo card: use 4242 4242 4242 4242 or end with 0002 to test decline."
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expires"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
                <Input
                  label="CVC / CVV"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-surface-elevated rounded border border-border space-y-2 text-xs">
              <span className="font-semibold text-ink block flex items-center gap-1.5">
                <Building className="w-4 h-4 text-primary" />
                Active Corporate Account: Harlow & Finch (ACT-4402)
              </span>
              <p className="text-text-secondary">
                Consignment will be invoiced to standard 30-day corporate terms. Invoice will be issued at end of billing cycle.
              </p>
            </div>
          )}

          <div className="p-3 bg-surface-sunken rounded text-xs text-text-secondary flex justify-between items-center">
            <span>Authorisation Total:</span>
            <span className="font-serif text-xl font-normal text-ink">${qPrice.toFixed(2)} AUD</span>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setStep(3)}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Next: Review & Confirm
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW */}
      {step === 3 && (
        <div className="bg-surface rounded-md border border-border p-6 space-y-6 shadow-1 animate-in fade-in">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-4">Summary & Confirmation</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-surface-elevated p-3.5 rounded border border-border">
                <span className="text-text-muted block text-[11px] mb-1">Pickup Route</span>
                <span className="font-medium text-ink block">{senderName}</span>
                <span className="text-text-secondary block mt-0.5">{pickupAddress}</span>
              </div>
              <div className="bg-surface-elevated p-3.5 rounded border border-border">
                <span className="text-text-muted block text-[11px] mb-1">Destination</span>
                <span className="font-medium text-ink block">{recipientName}</span>
                <span className="text-text-secondary block mt-0.5">{deliveryAddress}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-surface-elevated rounded border border-border text-xs flex items-center justify-between">
              <div>
                <span className="font-medium text-ink block">
                  Service: {qService.toUpperCase()} Metro Courier
                </span>
                <span className="text-text-muted text-[11px]">
                  {parcelDesc} · {isFragile ? 'Fragile' : 'Standard'} · Signature Required
                </span>
              </div>
              <span className="font-serif text-2xl text-ink font-normal">
                ${qPrice.toFixed(2)} AUD
              </span>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <span>
                I agree to the Standard Terms of Carriage and confirm the declared goods contain no hazardous or prohibited materials.
              </span>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              variant="accent"
              size="lg"
              disabled={!termsAgreed}
              isLoading={isSubmitting}
              onClick={handleFinalSubmit}
              iconRight={<Check className="w-4 h-4" />}
            >
              Confirm and Dispatch Consignment
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRMATION */}
      {step === 4 && (
        <div className="bg-surface-elevated rounded-lg border border-border p-8 space-y-6 shadow-2 text-center animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-success-tint text-success flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-text-muted">
              Booking Succeeded
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
              Booked. {createdJobId}
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm max-w-md mx-auto mt-2">
              Your courier is assigned automatically approximately 30 minutes before pickup. Consignment has entered the dispatch queue.
            </p>
          </div>

          {/* Customer Notification Preview Accordion */}
          <div className="text-left bg-surface rounded-md border border-border p-4 max-w-lg mx-auto">
            <div
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Customer Notifications Sent</span>
              </span>
              <span className="text-text-muted text-[11px]">
                {notificationOpen ? 'Collapse ▴' : 'Preview ▾'}
              </span>
            </div>

            {notificationOpen && (
              <div className="mt-3 pt-3 border-t border-border/60 space-y-2 text-xs">
                <div className="p-2.5 bg-surface-sunken rounded font-mono text-[11px] text-text-secondary">
                  <strong className="text-ink block mb-0.5">SMS to {recipientPhone}:</strong>
                  "Meridian: Booking {createdJobId} confirmed for {qTo}. Driver will arrive about 14:20. Track: mrd.co/{createdJobId.replace('MRD-', '')}"
                </div>
                <div className="p-2.5 bg-surface-sunken rounded text-[11px] text-text-secondary">
                  <strong className="text-ink block mb-0.5">Email to studio@harlowfinch.com.au:</strong>
                  "Booking confirmed: Consignment note #{createdJobId} issued for ${qPrice.toFixed(2)} AUD."
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border">
            <Link href={`/track/${createdJobId}`}>
              <Button variant="primary" iconRight={<ArrowRight className="w-4 h-4" />}>
                Track Consignment #{createdJobId}
              </Button>
            </Link>
            <Link href="/ops/jobs">
              <Button variant="secondary">
                View in Ops Dispatch Queue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-[880px] mx-auto px-6 py-20 text-center text-xs text-text-muted">
          Loading booking portal...
        </div>
      }
    >
      <BookContent />
    </React.Suspense>
  );
}
