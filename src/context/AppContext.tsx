import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserPreferences,
  Reminder,
  TrustedContact,
  TaskPlan,
  ChatMessage,
  ExplanationResult,
  ShareConfirmationData,
  EmergencyMedicalProfile,
} from '../types';
import {
  DEFAULT_PREFERENCES,
  INITIAL_REMINDERS,
  INITIAL_CONTACTS,
  INITIAL_SAVED_TASKS,
  DEFAULT_MEDICAL_PROFILE,
} from '../data/seedData';
import { VoiceService } from '../services/voice';

export type ScreenId =
  | 'home'
  | 'ask'
  | 'explain'
  | 'tasks'
  | 'daily_brief'
  | 'reminders'
  | 'trusted_circle'
  | 'settings'
  | 'emergency';

interface AppContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  medicalProfile: EmergencyMedicalProfile;
  updateMedicalProfile: (updates: Partial<EmergencyMedicalProfile>) => void;
  emergencyModalOpen: boolean;
  setEmergencyModalOpen: (open: boolean) => void;
  reminders: Reminder[];
  addReminder: (title: string, date?: string, time?: string, category?: Reminder['category'], linkedTaskId?: string) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  contacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id'>) => void;
  tasks: TaskPlan[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  getActiveTask: () => TaskPlan | undefined;
  updateTask: (task: TaskPlan) => void;
  completeTaskStep: (taskId: string) => void;
  previousTaskStep: (taskId: string) => void;
  markTaskComplete: (taskId: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  explanationResult: ExplanationResult | null;
  setExplanationResult: (res: ExplanationResult | null) => void;
  voiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  shareModalData: ShareConfirmationData | null;
  setShareModalData: (data: ShareConfirmationData | null) => void;
  isSpeaking: boolean;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  resetDemoData: () => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load preferences from localStorage or default
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('saathi_preferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('saathi_reminders');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    try {
      const saved = localStorage.getItem('saathi_contacts');
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [tasks, setTasks] = useState<TaskPlan[]>(() => {
    try {
      const saved = localStorage.getItem('saathi_tasks');
      return saved ? JSON.parse(saved) : INITIAL_SAVED_TASKS;
    } catch {
      return INITIAL_SAVED_TASKS;
    }
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>('task-electricity');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-welcome',
      sender: 'saathi',
      text: 'Namaste! I am Saathi, your calm digital companion. How can I help you today? You can speak, type, or show me a screenshot.',
      timestamp: 'Just now',
      simplifiedKeyTakeaway: 'Ask me anything about your phone, messages, bills, or reminders.',
      followUpSuggestions: [
        'Explain a message I received',
        'Help me pay my electricity bill',
        'What do I need to do today?',
      ],
    },
  ]);

  const [explanationResult, setExplanationResult] = useState<ExplanationResult | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [medicalProfile, setMedicalProfile] = useState<EmergencyMedicalProfile>(() => {
    try {
      const saved = localStorage.getItem('saathi_medical_profile');
      return saved ? JSON.parse(saved) : DEFAULT_MEDICAL_PROFILE;
    } catch {
      return DEFAULT_MEDICAL_PROFILE;
    }
  });
  const [shareModalData, setShareModalData] = useState<ShareConfirmationData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saathi_medical_profile', JSON.stringify(medicalProfile));
    } catch {}
  }, [medicalProfile]);

  const updateMedicalProfile = (updates: Partial<EmergencyMedicalProfile>) => {
    setMedicalProfile((prev) => ({ ...prev, ...updates }));
    showNotification('Emergency Medical Card updated.');
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saathi_preferences', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem('saathi_reminders', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem('saathi_contacts', JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem('saathi_tasks', JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const addReminder = (
    title: string,
    date = 'Today',
    time = '10:00 AM',
    category: Reminder['category'] = 'task',
    linkedTaskId?: string
  ) => {
    const newRem: Reminder = {
      id: `rem-${Date.now()}`,
      title,
      category,
      time,
      date,
      recurring: 'none',
      completed: false,
      linkedTaskId,
    };
    setReminders((prev) => [newRem, ...prev]);
    showNotification(`Reminder created: "${title}"`);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed;
          if (nextState) {
            showNotification(`Completed: "${r.title}"`);
          }
          return { ...r, completed: nextState };
        }
        return r;
      })
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showNotification('Reminder removed.');
  };

  const addContact = (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: `contact-${Date.now()}`,
    };
    setContacts((prev) => [...prev, newContact]);
    showNotification(`Added ${contact.name} to your Trusted Circle.`);
  };

  const getActiveTask = () => {
    return tasks.find((t) => t.id === activeTaskId) || tasks[0];
  };

  const updateTask = (updated: TaskPlan) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const completeTaskStep = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextIndex = t.currentStepIndex + 1;
          if (nextIndex >= t.steps.length) {
            return {
              ...t,
              currentStepIndex: t.steps.length - 1,
              status: 'completed',
              completedAt: 'Just now',
            };
          }
          return {
            ...t,
            currentStepIndex: nextIndex,
            status: 'in_progress',
          };
        }
        return t;
      })
    );
  };

  const previousTaskStep = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.currentStepIndex > 0) {
          return {
            ...t,
            currentStepIndex: t.currentStepIndex - 1,
            status: 'in_progress',
          };
        }
        return t;
      })
    );
  };

  const markTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
            completedAt: 'Just now',
          };
        }
        return t;
      })
    );
    showNotification('Task completed! Great job.');
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);

    if (msg.sender === 'saathi' && preferences.autoPlayVoice) {
      speak(msg.text);
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'chat-welcome-2',
        sender: 'saathi',
        text: 'Hello! I am right here. What would you like to talk about or work on?',
        timestamp: 'Just now',
        simplifiedKeyTakeaway: 'Ask any question or tap a suggestion below.',
        followUpSuggestions: [
          'What do I need to do today?',
          'Explain this message',
          'Help me do a digital task',
        ],
      },
    ]);
  };

  const speak = (text: string, onEnd?: () => void) => {
    setIsSpeaking(true);
    VoiceService.speak(
      text,
      preferences.voiceSpeed,
      () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      },
      () => {
        setIsSpeaking(true);
      },
      preferences.language
    );
  };

  const stopSpeaking = () => {
    VoiceService.stop();
    setIsSpeaking(false);
  };

  const resetDemoData = () => {
    VoiceService.stop();
    setIsSpeaking(false);
    setPreferences(DEFAULT_PREFERENCES);
    setReminders(INITIAL_REMINDERS);
    setContacts(INITIAL_CONTACTS);
    setTasks(INITIAL_SAVED_TASKS);
    setMedicalProfile(DEFAULT_MEDICAL_PROFILE);
    setActiveTaskId('task-electricity');
    setExplanationResult(null);
    clearChat();
    setCurrentScreen('home');
    showNotification('Demo data reset to initial showcase state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        preferences,
        updatePreferences,
        medicalProfile,
        updateMedicalProfile,
        emergencyModalOpen,
        setEmergencyModalOpen,
        reminders,
        addReminder,
        toggleReminder,
        deleteReminder,
        contacts,
        addContact,
        tasks,
        activeTaskId,
        setActiveTaskId,
        getActiveTask,
        updateTask,
        completeTaskStep,
        previousTaskStep,
        markTaskComplete,
        chatMessages,
        addChatMessage,
        clearChat,
        explanationResult,
        setExplanationResult,
        voiceModalOpen,
        setVoiceModalOpen,
        shareModalData,
        setShareModalData,
        isSpeaking,
        speak,
        stopSpeaking,
        resetDemoData,
        notificationMessage,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
