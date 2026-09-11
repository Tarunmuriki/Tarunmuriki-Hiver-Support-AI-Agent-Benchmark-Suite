import { IntentDefinition } from '../types';

export const APPLE_INTENT_TAXONOMY: IntentDefinition[] = [
  {
    id: 'device_issue',
    name: 'Device & Hardware Issue',
    description: 'Hardware failures, device won\'t turn on, black screen, swollen battery, speaker or camera malfunction.',
    example: 'My iPhone 14 won\'t turn on and screen is completely black after charging overnight.',
    active: true,
  },
  {
    id: 'account_issue',
    name: 'Apple ID & Account Access',
    description: 'Apple ID locked for security reasons, two-factor auth lockouts, iCloud sign-in barriers, family sharing issues.',
    example: 'I can\'t access my Apple ID and it says account locked for security reasons.',
    active: true,
  },
  {
    id: 'billing_payment',
    name: 'Billing & Payment Disputes',
    description: 'Unknown recurring credit card charges from apple.com/bill, double charges, payment method declined.',
    example: 'Why was I charged twice for $9.99 on my credit card from Apple Store?',
    active: true,
  },
  {
    id: 'subscription',
    name: 'Subscriptions & Renewals',
    description: 'Managing or cancelling subscriptions for Apple Music, Apple TV+, iCloud+, or third-party App Store subscriptions.',
    example: 'I want to cancel my Apple Music subscription before it renews tomorrow.',
    active: true,
  },
  {
    id: 'app_issue',
    name: 'App Store & App Behavior',
    description: 'App Store unable to connect, pending download loops, specific app freeze or third-party app crashes.',
    example: 'The App Store isn\'t working and keeps saying "Cannot connect to App Store".',
    active: true,
  },
  {
    id: 'order_purchase',
    name: 'Apple Store Orders & Shipments',
    description: 'Online hardware orders, delivery date tracking, trade-in kit status, in-store pickup readiness.',
    example: 'Where is my order? Ordered a MacBook Pro 5 days ago and no tracking update.',
    active: true,
  },
  {
    id: 'refund_return',
    name: 'Refunds & Product Returns',
    description: 'Requests for refund on accidental in-app purchases, Apple hardware 14-day return window procedures.',
    example: 'Can I get a refund for an accidental subscription purchase my kid made?',
    active: true,
  },
  {
    id: 'password_security',
    name: 'Password & Security Threats',
    description: 'Forgot Apple ID password, suspect phishing text, suspicious login attempt in another country.',
    example: 'I forgot my password and my trusted phone number is no longer active.',
    active: true,
  },
  {
    id: 'technical_troubleshooting',
    name: 'Software Troubleshooting & iOS',
    description: 'iOS update boot loops, Wi-Fi / Bluetooth dropping, CarPlay disconnects, system freezing, AirDrop not discovering.',
    example: 'My iPhone keeps crashing and rebooting every 10 minutes since updating to iOS 17.',
    active: true,
  },
  {
    id: 'other_escalation',
    name: 'Unclear / Out of Scope Escalation',
    description: 'Ambiguous queries, non-Apple third-party peripherals, abusive threats, or complex enterprise inquiries.',
    example: 'Need legal assistance regarding an unfulfilled enterprise deployment.',
    active: true,
  },
];
