export interface NotificationTemplate {
  id: string;
  event: string;
  channel: 'SMS' | 'Email';
  name: string;
  subject?: string;
  body: string;
  senderName: string;
}

export const SEED_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'TMPL-SMS-01',
    event: 'Booked',
    channel: 'SMS',
    name: 'Booking Confirmation (SMS)',
    body: 'Meridian: Your booking {{jobId}} has been confirmed. A courier will be assigned shortly. Track: {{trackingUrl}}',
    senderName: 'Meridian',
  },
  {
    id: 'TMPL-SMS-02',
    event: 'Driver assigned',
    channel: 'SMS',
    name: 'Courier Assigned (SMS)',
    body: 'Meridian: {{driverName}} has been assigned to your delivery {{jobId}}. ETA: {{eta}}. Track: {{trackingUrl}}',
    senderName: 'Meridian',
  },
  {
    id: 'TMPL-SMS-03',
    event: 'Picked up',
    channel: 'SMS',
    name: 'Parcel Picked Up (SMS)',
    body: 'Meridian: Your parcel {{jobId}} has been collected from {{fromSuburb}} and is in transit. ETA {{eta}}.',
    senderName: 'Meridian',
  },
  {
    id: 'TMPL-SMS-04',
    event: 'Delivered',
    channel: 'SMS',
    name: 'Proof of Delivery (SMS)',
    body: 'Meridian: Parcel {{jobId}} delivered at {{deliveredTime}}, signed by {{recipientName}}. View signed proof: {{trackingUrl}}',
    senderName: 'Meridian',
  },
  {
    id: 'TMPL-SMS-05',
    event: 'Exception',
    channel: 'SMS',
    name: 'Delivery Exception (SMS)',
    body: 'Meridian: We attempted delivery for {{jobId}} at {{attemptTime}} but were unable to complete. Please review instructions: {{trackingUrl}}',
    senderName: 'Meridian',
  },
  {
    id: 'TMPL-EML-01',
    event: 'Delivered',
    channel: 'Email',
    name: 'Signed POD Delivery Receipt (Email)',
    subject: 'Delivered: {{jobId}} signed by {{recipientName}} at {{deliveredTime}}',
    body: `Good day,

Your consignment {{jobId}} has been successfully delivered by Meridian Couriers.

Delivery Details:
• Recipient: {{recipientName}}
• Time: {{deliveredTime}} AEST
• Destination: {{toAddress}}
• Carrier: {{driverName}} ({{depot}} Depot)

Your signed proof of delivery and geotag confirmation are attached and accessible at your dedicated tracking portal:
{{trackingUrl}}

Thank you for choosing Meridian Couriers.
Meridian Logistics Dispatch Operations · Port Melbourne VIC`,
    senderName: 'Meridian Dispatch <dispatch@meridiancouriers.com.au>',
  },
  {
    id: 'TMPL-EML-02',
    event: 'Booked',
    channel: 'Email',
    name: 'Booking Receipt & Consignment Note (Email)',
    subject: 'Booking Confirmed: {{jobId}} — {{fromSuburb}} to {{toSuburb}}',
    body: `Hello {{customerName}},

We have received your consignment booking {{jobId}}.

Service: {{serviceName}}
Pickup: {{fromAddress}}
Destination: {{toAddress}}
Quoted total: {{totalAmount}} (inc. GST)

You can monitor your courier in real time once assigned:
{{trackingUrl}}

Kind regards,
Meridian Logistics Team`,
    senderName: 'Meridian Bookings <bookings@meridiancouriers.com.au>',
  },
];
