import { Reminder, TrustedContact, UserPreferences, TaskPlan, EmergencyMedicalProfile } from '../types';

export const DEFAULT_PREFERENCES: UserPreferences = {
  userName: 'Amit',
  textSize: 'large', // Senior-friendly default
  highContrast: false,
  reducedMotion: false,
  voiceSpeed: 'normal',
  autoPlayVoice: false,
  language: 'hi', // Set Hindi / Indian bilingual as warm accessible default
};

export const DEFAULT_MEDICAL_PROFILE: EmergencyMedicalProfile = {
  bloodGroup: 'B Positive (B+)',
  allergies: ['Penicillin (Moderate)'],
  chronicConditions: ['Type 2 Diabetes', 'Hypertension (High BP)'],
  criticalMedications: ['Amlodipine 5mg (Morning)', 'Metformin 500mg (Post-dinner)'],
  primaryDoctorName: 'Dr. Ashok Sharma (Cardiologist)',
  primaryDoctorPhone: '+91 98110 77412',
  preferredHospital: 'Apollo Hospital, Indiranagar / AIIMS',
  insurancePolicyNumber: 'STAR-HEALTH-SENIOR-7489201',
};

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Take Blood Pressure Medicine (Amlodipine 5mg)',
    category: 'health',
    time: '09:00 AM',
    date: 'Today',
    recurring: 'daily',
    completed: true,
  },
  {
    id: 'rem-2',
    title: 'Call daughter Priya to confirm Sunday lunch',
    category: 'family',
    time: '05:30 PM',
    date: 'Today',
    recurring: 'none',
    completed: false,
  },
  {
    id: 'rem-3',
    title: 'Check electricity bill due before late penalty',
    category: 'bill',
    time: '11:00 AM',
    date: 'Tomorrow',
    recurring: 'monthly',
    completed: false,
    linkedTaskId: 'task-electricity',
  },
  {
    id: 'rem-4',
    title: 'Dr. Sharma Cardiology Routine Checkup',
    category: 'health',
    time: '10:30 AM',
    date: 'Sep 22, 2026',
    recurring: 'none',
    completed: false,
  },
];

export const INITIAL_CONTACTS: TrustedContact[] = [
  {
    id: 'contact-1',
    name: 'Rahul Gupta',
    relationship: 'Son',
    phone: '+91 98201 45890',
    email: 'rahul.gupta@example.com',
    permissions: 'safety_alerts',
    lastSharedAt: '2 days ago',
  },
  {
    id: 'contact-2',
    name: 'Priya Sharma',
    relationship: 'Daughter',
    phone: '+91 98450 12398',
    email: 'priya.s@example.com',
    permissions: 'full_sharing',
  },
  {
    id: 'contact-3',
    name: 'Dr. Ashok Sharma',
    relationship: 'Family Physician',
    phone: '+91 98110 77412',
    email: 'clinic.drsharma@example.com',
    permissions: 'safety_alerts',
  },
];

export interface SampleScenario {
  id: string;
  title: string;
  category: 'bank_sms' | 'utility_bill' | 'courier_scam' | 'doctor_rx';
  tag: string;
  badgeColor: string;
  previewText: string;
  fullContent: string;
  isScam: boolean;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'scenario-bank-scam',
    title: 'Urgent Bank Block Alert (SMS)',
    category: 'bank_sms',
    tag: 'High Risk Alert',
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    previewText: 'Dear Customer, your SBI account will be BLOCKED today. Update your PAN card immediately...',
    fullContent: `From: VM-SBIBNK-ALERT
Date: Today, 11:23 AM

Dear Customer, Your SBI Bank NetBanking and ATM Card will be DEACTIVATED today at 5:00 PM due to pending KYC verification. 
Please update your PAN & Aadhaar immediately to prevent permanent suspension:
http://sbi-kyc-secure-update.online/login?acc=verify
Do not ignore. Call: 98765-43210 immediately.`,
    isScam: true,
  },
  {
    id: 'scenario-electric-bill',
    title: 'Electricity Board Bill Notice (SMS)',
    category: 'utility_bill',
    tag: 'Official Notice',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    previewText: 'MSEDCL Bill Alert: Bill for CA 102948572 for ₹640 is generated. Due date: 24-Sep-2026...',
    fullContent: `From: JD-MSEDCL
Date: Yesterday, 3:15 PM

MSEDCL Consumer Alert:
Dear Consumer (AMIT GUPTA),
Your electricity bill for Consumer Account No: 102948572 has been generated.
Bill Amount: ₹640.00
Prompt Payment Discount Date: 20-Sep-2026 (₹630.00)
Due Date: 24-Sep-2026
View or pay securely at official portal: mahadiscom.in or via approved BBPS / UPI apps.`,
    isScam: false,
  },
  {
    id: 'scenario-courier-scam',
    title: 'Customs Courier Package Fee (SMS)',
    category: 'courier_scam',
    tag: 'Suspicious Request',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    previewText: 'IndiaPost: Your parcel has arrived at distribution center but is held due to incomplete address...',
    fullContent: `From: +91 78921 00412
Date: Today, 08:45 AM

[India Post Alert] Your international parcel #IN94827104 can not be delivered due to missing house number.
Pay re-delivery fee of ₹25 within 24 hours to schedule redelivery:
https://indiapost-parcel-redelivery.top/pay
Failure to pay will result in parcel return to sender.`,
    isScam: true,
  },
  {
    id: 'scenario-doctor-appointment',
    title: 'Clinic Appointment Confirmation',
    category: 'doctor_rx',
    tag: 'Verified Clinic',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    previewText: 'Apollo Clinic: Appointment confirmed with Dr. Sharma on 22-Sep-2026 at 10:30 AM...',
    fullContent: `From: AD-APOLLO
Date: 17-Sep-2026, 6:00 PM

Dear Amit Gupta,
Your appointment with Dr. Ashok Sharma (Cardiology) is confirmed for Tuesday, 22-Sep-2026 at 10:30 AM at Apollo Indiranagar.
Please arrive 15 minutes prior for vitals check. Carry your previous blood test reports and list of current medicines.
For rescheduling, call clinic reception: 080-25251100.`,
    isScam: false,
  },
];

export const PRESET_TASK_TEMPLATES = [
  {
    id: 'task-electricity',
    title: 'Pay My Electricity Bill',
    subtitle: 'Step-by-step guidance to pay without queues',
    icon: 'Zap',
    time: '4 minutes',
  },
  {
    id: 'task-train-ticket',
    title: 'Book a Train Ticket',
    subtitle: 'Check availability and senior citizen lower berth',
    icon: 'Train',
    time: '6 minutes',
  },
  {
    id: 'task-whatsapp-photo',
    title: 'Share Photos on WhatsApp',
    subtitle: 'Send family photos safely to your children',
    icon: 'MessageSquare',
    time: '3 minutes',
  },
  {
    id: 'task-medicine-refill',
    title: 'Order Monthly Medicines',
    subtitle: 'Upload prescription and choose home delivery',
    icon: 'Pill',
    time: '5 minutes',
  },
];

export const INITIAL_SAVED_TASKS: TaskPlan[] = [
  {
    id: 'task-electricity',
    title: 'Pay Electricity Bill',
    goal: 'Safely pay your electricity bill without waiting in long queues.',
    estimatedTime: 'About 4 minutes',
    prerequisites: [
      'Your paper electricity bill (to see Consumer Number: 102948572)',
      'Your phone or UPI payment app ready',
    ],
    status: 'in_progress',
    currentStepIndex: 1, // At step 2
    steps: [
      {
        stepNumber: 1,
        title: 'Find your Consumer Number',
        instruction: 'Look at your electricity bill. Your Consumer Number (CA Number) is printed in bold at the top right: 102948572.',
        detailedExplanation: 'This 9-digit number identifies your home meter. It guarantees the payment goes directly to your house account.',
        isSensitive: false,
        actionLabel: "I've checked my Consumer Number",
        troubleshootingTips: [
          'Look for "Consumer ID", "Account ID", or "CA No." on the bill.',
          'If you need help reading the bill, you can upload a photo to Explain Something.',
        ],
      },
      {
        stepNumber: 2,
        title: 'Open your trusted payment app',
        instruction: 'Unlock your phone and tap on Google Pay, PhonePe, or your Bank app on your home screen.',
        detailedExplanation: 'Always use apps already installed on your phone. Never download apps from links sent via SMS.',
        isSensitive: false,
        actionLabel: 'Payment app is open',
        troubleshootingTips: [
          'Look for the colorful GPay icon or your bank logo.',
          'Take your time unlocking your phone.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Verify the bill amount and your name',
        instruction: 'Tap Electricity, search for MSEDCL, and enter your Consumer Number. Check that the name shows "AMIT GUPTA" and amount is ₹640.',
        detailedExplanation: 'Checking the name and amount gives you 100% peace of mind before any money moves.',
        isSensitive: true,
        confirmationPrompt: 'Please confirm: Does the screen show AMIT GUPTA and ₹640.00?',
        actionLabel: 'Name and amount are verified',
        troubleshootingTips: [
          'If the amount shows ₹0, your bill is already paid.',
          'If you see an unfamiliar name, re-enter the 9 digits carefully.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Confirm payment and save receipt',
        instruction: 'Enter your 4 or 6-digit UPI PIN carefully to authorize the ₹640 payment.',
        detailedExplanation: 'Remember: Your UPI PIN is only entered when YOU are sending money, never to receive money.',
        isSensitive: true,
        confirmationPrompt: 'Ready to approve the payment? No one else should be watching your PIN.',
        actionLabel: 'Payment complete',
        troubleshootingTips: [
          'Take a screenshot of the green checkmark for your records.',
          'A confirmation SMS will also arrive from your bank shortly.',
        ],
      },
    ],
    followUpReminderSuggestion: 'Remind me on the 15th of next month to check the new electricity bill.',
  },
];
