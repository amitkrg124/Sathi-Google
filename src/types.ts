export type TextSize = 'normal' | 'large' | 'extra-large';
export type VoiceSpeed = 'slow' | 'normal' | 'gentle';
export type Severity = 'safe' | 'caution' | 'danger';

export interface UserPreferences {
  userName: string;
  textSize: TextSize;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceSpeed: VoiceSpeed;
  autoPlayVoice: boolean;
  language: 'en' | 'hi';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  timestamp: string;
  simplifiedKeyTakeaway?: string;
  followUpSuggestions?: string[];
  suggestedWorkflow?: string;
}

export interface ScamAnalysis {
  isSuspicious: boolean;
  severity: Severity;
  headline: string;
  warningSigns: string[];
  recommendedAction: string;
  reasoning: string;
}

export interface ExplanationResult {
  documentType: string;
  summary: string;
  whatItSays: string;
  whatItMeans: string;
  whatYouCanDo: string[];
  scamAnalysis: ScamAnalysis;
  suggestedTaskTitle?: string;
  sourceTextOrImage?: string;
}

export interface TaskStep {
  stepNumber: number;
  title: string;
  instruction: string;
  detailedExplanation: string;
  isSensitive: boolean;
  confirmationPrompt?: string;
  actionLabel: string;
  troubleshootingTips?: string[];
}

export interface TaskPlan {
  id: string;
  title: string;
  goal: string;
  estimatedTime: string;
  prerequisites: string[];
  steps: TaskStep[];
  currentStepIndex: number;
  status: 'not_started' | 'in_progress' | 'waiting_confirmation' | 'completed';
  completedAt?: string;
  followUpReminderSuggestion?: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: 'health' | 'bill' | 'family' | 'task';
  time: string;
  date: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'none';
  completed: boolean;
  linkedTaskId?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  permissions: 'safety_alerts' | 'tasks_only' | 'full_sharing';
  lastSharedAt?: string;
}

export interface ShareConfirmationData {
  contact: TrustedContact;
  title: string;
  summary: string;
  type: 'safety_concern' | 'task_summary';
  details: string;
}

export interface EmergencyMedicalProfile {
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  criticalMedications: string[];
  primaryDoctorName: string;
  primaryDoctorPhone: string;
  preferredHospital: string;
  insurancePolicyNumber?: string;
}

export interface EmergencySosState {
  isActive: boolean;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  address?: string;
  mapsUrl?: string;
  isSirenPlaying: boolean;
}
