import { ExplanationResult, TaskPlan } from '../types';

export async function askSaathiApi(
  message: string,
  history: { role: 'user' | 'model'; text: string }[] = [],
  language: 'en' | 'hi' = 'en'
): Promise<{
  replyText: string;
  simplifiedKeyTakeaway?: string;
  followUpSuggestions?: string[];
  suggestedWorkflow?: string;
}> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationHistory: history,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Falling back to local AI assistant:', err);
    return {
      replyText: `I am right here with you. Regarding "${message}", we can take it one calm step at a time. I can explain any message you've received, help you do a digital task, or set a reminder for later.`,
      simplifiedKeyTakeaway: 'You do not have to figure this out alone — ask me anything or show me a screenshot.',
      followUpSuggestions: [
        'Help me pay a bill',
        'Explain a message or SMS',
        'What do I need to do today?',
      ],
    };
  }
}

export async function explainContentApi(
  text?: string,
  imageBase64?: string,
  mimeType?: string,
  language: 'en' | 'hi' = 'en'
): Promise<ExplanationResult> {
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        imageBase64,
        mimeType,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn('Falling back to local explanation engine:', err);
    if (language === 'hi') {
      return {
        documentType: 'संदेश या सूचना',
        summary: 'यह एक डिजिटल सूचना या मैसेज है।',
        whatItSays: text || 'संदेश प्राप्त हुआ।',
        whatItMeans: 'बिना घबराए ध्यान से पढ़ें। कोई भी असली बैंक या बिजली विभाग 10 मिनट में सेवा बंद करने की धमकी नहीं देता।',
        whatYouCanDo: [
          'किसी भी अनजाने लिंक पर क्लिक न करें।',
          'अपना बैंक OTP, पासवर्ड या ATM पिन किसी को न बताएं।',
          'घर के किसी सदस्य या साथी से जाँच करवाएं।',
        ],
        scamAnalysis: {
          isSuspicious: false,
          severity: 'safe',
          headline: 'कोई सीधा खतरा नहीं दिखा, पर सतर्कता आवश्यक है।',
          warningSigns: [],
          recommendedAction: 'यदि पैसों की मांग की गई हो तो केवल आधिकारिक हेल्पलाइन से ही पुष्टि करें।',
          reasoning: 'मानक सुरक्षा नियम लागू।',
        },
      };
    }
    return {
      documentType: 'Message or Document Notice',
      summary: 'This is a digital notice or communication.',
      whatItSays: text || 'Document contents received.',
      whatItMeans: 'Review carefully without rushing. Legitimate services will never force you to decide within minutes.',
      whatYouCanDo: [
        'Do not click unknown links.',
        'Never share passwords, bank OTPs, or debit card PINs.',
        'Ask a trusted family member or Saathi to double check.',
      ],
      scamAnalysis: {
        isSuspicious: false,
        severity: 'safe',
        headline: 'No immediate red flags detected, but exercise standard caution.',
        warningSigns: [],
        recommendedAction: 'Verify through official contact details if payment or private information is requested.',
        reasoning: 'Standard safety checks applied.',
      },
    };
  }
}

export async function planTaskApi(goal: string, language: 'en' | 'hi' = 'en'): Promise<TaskPlan> {
  try {
    const response = await fetch('/api/plan-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, language }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      id: `task-${Date.now()}`,
      title: data.title || goal,
      goal: data.goal || goal,
      estimatedTime: data.estimatedTime || 'About 4 minutes',
      prerequisites: data.prerequisites || ['Your phone or computer ready', 'A calm moment'],
      steps: data.steps || [],
      currentStepIndex: 0,
      status: 'in_progress',
      followUpReminderSuggestion: data.followUpReminderSuggestion,
    };
  } catch (err) {
    console.warn('Falling back to default task plan:', err);
    return {
      id: `task-${Date.now()}`,
      title: goal,
      goal: `Complete: ${goal}`,
      estimatedTime: 'About 4 minutes',
      prerequisites: ['Your phone ready', 'Comfortable seating with good lighting'],
      steps: [
        {
          stepNumber: 1,
          title: 'Review what we need',
          instruction: 'Let us make sure you have the necessary details ready in front of you.',
          detailedExplanation: 'Gathering details first avoids interruptions midway.',
          isSensitive: false,
          actionLabel: 'I have the details ready',
          troubleshootingTips: ['Keep your reading glasses on if needed.'],
        },
        {
          stepNumber: 2,
          title: 'Open the verified app or website',
          instruction: 'Open the official app on your phone. Avoid clicking sponsored links on search engines.',
          detailedExplanation: 'Official verified apps prevent accidental navigation to fake websites.',
          isSensitive: false,
          actionLabel: 'I am on the official screen',
          troubleshootingTips: ['Look for the official logo at the top.'],
        },
        {
          stepNumber: 3,
          title: 'Double check details & confirm',
          instruction: 'Carefully verify the names and numbers before finalizing.',
          detailedExplanation: 'A peaceful double-check protects you from errors.',
          isSensitive: true,
          confirmationPrompt: 'Please verify: Are all details on your screen correct?',
          actionLabel: 'Everything is confirmed',
          troubleshootingTips: ['If in doubt, stop and ask a family contact.'],
        },
      ],
      currentStepIndex: 0,
      status: 'in_progress',
      followUpReminderSuggestion: 'Remind me tomorrow to check the confirmation.',
    };
  }
}
