export type Language = 'en' | 'hi';

export interface AppTranslations {
  appName: string;
  appTagline: string;
  seniorCopilot: string;
  safeMode: string;
  safeModeActive: string;
  talkToSaathi: string;
  tapToSpeak: string;
  listening: string;
  thinking: string;
  speaking: string;
  processing: string;
  mute: string;
  stopVoice: string;
  contrast: string;
  home: string;
  dailyOverview: string;
  askSaathi: string;
  voiceQuestions: string;
  explainAnything: string;
  scamShieldSms: string;
  helpMeDoIt: string;
  guidedTaskCoach: string;
  dailyBrief: string;
  morningDigest: string;
  reminders: string;
  medicinesBills: string;
  trustedCircle: string;
  familySupport: string;
  emergencySos: string;
  emergencySub: string;
  settings: string;
  accessibilityVoice: string;
  navHome: string;
  navHomeSub: string;
  navAsk: string;
  navAskSub: string;
  navExplain: string;
  navExplainSub: string;
  navTasks: string;
  navTasksSub: string;
  navDaily: string;
  navDailySub: string;
  navReminders: string;
  navRemindersSub: string;
  navCircle: string;
  navCircleSub: string;
  navSettings: string;
  navSettingsSub: string;
  navSos: string;
  navSosSub: string;
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;
  welcomeHeadline: string;
  welcomeSub: string;
  listenBrief: string;
  listenAudioBrief: string;
  viewBrief: string;
  whatToDo: string;
  tapCardToStart: string;
  cardTalkTitle: string;
  cardTalkDesc: string;
  cardTalkAction: string;
  cardExplainTitle: string;
  cardExplainDesc: string;
  cardExplainAction: string;
  cardTaskTitle: string;
  cardTaskDesc: string;
  cardTaskAction: string;
  todayReminders: string;
  settingsTitle: string;
  settingsSub: string;
  languageChoice: string;
  emergencySosTitle: string;
  emergencySosSub: string;
  emergencySosButton: string;
  emergencyTriggerBtn: string;
  dialHelplines: string;
  nationalEmergency: string;
  nationalAmbulance: string;
  elderlineHelpline: string;
  cyberFraudHelpline: string;
  policeHelpline: string;
  locateMe: string;
  locatingGps: string;
  locationReady: string;
  shareViaWhatsapp: string;
  shareViaSms: string;
  playSiren: string;
  stopSiren: string;
  sirenNotice: string;
  medicalCardTitle: string;
  bloodGroup: string;
  chronicConditions: string;
  emergencyDoctor: string;
  preferredHospital: string;
  safeCheckHeader: string;
  stepByStepHeader: string;
  cancelEmergency: string;
  alertCountdown: string;
  secondsRemaining: string;
  voiceAssistantTitle: string;
  voiceAssistantSub: string;
  repeatAloud: string;
  slowVoice: string;
  switchToText: string;
}

export const TRANSLATIONS: Record<Language, AppTranslations> = {
  en: {
    appName: 'Saathi AI',
    appTagline: 'Ask. Understand. Do it yourself.',
    seniorCopilot: 'Senior Companion',
    safeMode: 'Safe Mode Active',
    safeModeActive: 'Safe Mode Active',
    talkToSaathi: 'Talk to Saathi',
    tapToSpeak: 'Tap to Speak',
    listening: 'Listening to you...',
    thinking: 'Saathi is thinking...',
    speaking: 'Saathi speaking...',
    processing: 'Saathi is thinking...',
    mute: 'Mute Voice',
    stopVoice: 'Stop Voice',
    contrast: 'Contrast',
    home: 'Home',
    dailyOverview: 'Daily Overview',
    askSaathi: 'Ask Saathi',
    voiceQuestions: 'Voice & Questions',
    explainAnything: 'Explain Anything',
    scamShieldSms: 'Scam Shield & SMS',
    helpMeDoIt: 'Help Me Do It',
    guidedTaskCoach: 'Guided Task Coach',
    dailyBrief: 'Daily Brief',
    morningDigest: 'Morning Digest',
    reminders: 'Reminders',
    medicinesBills: 'Medicines & Bills',
    trustedCircle: 'Trusted Circle',
    familySupport: 'Family Support',
    emergencySos: 'Emergency SOS',
    emergencySub: '112, 108 & Elderline',
    settings: 'Settings',
    accessibilityVoice: 'Accessibility & Voice',
    navHome: 'Home',
    navHomeSub: 'Daily Overview',
    navAsk: 'Ask Saathi',
    navAskSub: 'Voice & Questions',
    navExplain: 'Explain Anything',
    navExplainSub: 'Scam Shield & SMS',
    navTasks: 'Help Me Do It',
    navTasksSub: 'Guided Task Coach',
    navDaily: 'Daily Brief',
    navDailySub: 'Morning Digest',
    navReminders: 'Reminders',
    navRemindersSub: 'Medicines & Bills',
    navCircle: 'Trusted Circle',
    navCircleSub: 'Family Support',
    navSettings: 'Settings',
    navSettingsSub: 'Accessibility & Voice',
    navSos: 'Emergency SOS',
    navSosSub: '112, 108 & Elderline 14567',
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    welcomeHeadline: 'How can I assist you today?',
    welcomeSub: 'Understand confusing messages, complete digital tasks safely at your own pace, and avoid scams.',
    listenBrief: "Listen to Today's Audio Brief",
    listenAudioBrief: "Listen to Today's Audio Brief",
    viewBrief: 'View Daily Brief',
    whatToDo: 'What would you like to do today?',
    tapCardToStart: 'Tap any card to begin',
    cardTalkTitle: 'Talk to Saathi',
    cardTalkDesc: 'Speak naturally or ask questions. Saathi explains everything in simple words with zero jargon.',
    cardTalkAction: 'Tap to Speak',
    cardExplainTitle: 'Explain Anything',
    cardExplainDesc: 'Upload a screenshot, bill, or SMS. Find out what it says, what it means, and check for scam signs.',
    cardExplainAction: 'Check a Message or Bill',
    cardTaskTitle: 'Help Me Do It',
    cardTaskDesc: 'Step-by-step guidance to pay utility bills, book railway seats, or use apps without feeling lost.',
    cardTaskAction: 'Start or Resume Task',
    todayReminders: "Today's Reminders",
    settingsTitle: 'Settings & Accessibility',
    settingsSub: 'Customize language, reading sizes, speech speed, high contrast, and emergency medical ID.',
    languageChoice: 'Choose Language (भाषा चुनें)',
    emergencySosTitle: 'Emergency Help & SOS',
    emergencySosSub: 'Immediate access to Indian helplines, live GPS location, siren alert, and family contacts.',
    emergencySosButton: 'Emergency SOS (112 / 108)',
    emergencyTriggerBtn: 'EMERGENCY SOS',
    dialHelplines: 'Indian Emergency Helplines',
    nationalEmergency: '112 — All Emergency (Police/Fire/Medical)',
    nationalAmbulance: '108 — Free National Ambulance Service',
    elderlineHelpline: '14567 — Elderline (National Senior Helpline)',
    cyberFraudHelpline: '1930 — Cyber & Online Financial Fraud',
    policeHelpline: '100 — Police Assistance',
    locateMe: 'Find My Current GPS Location',
    locatingGps: 'Locating via satellite...',
    locationReady: 'Location detected. Tap to view on Google Maps.',
    shareViaWhatsapp: 'Send SOS to Family on WhatsApp',
    shareViaSms: 'Send Emergency SMS',
    playSiren: 'Sound Loud Room Alarm',
    stopSiren: 'Turn Off Alarm',
    sirenNotice: 'Loud alarm will sound from phone speakers to alert family or neighbours nearby.',
    medicalCardTitle: 'Emergency Medical ID',
    bloodGroup: 'Blood Group',
    chronicConditions: 'Health Conditions',
    emergencyDoctor: 'Family Doctor',
    preferredHospital: 'Preferred Hospital',
    safeCheckHeader: 'Scam & Message Safety Shield',
    stepByStepHeader: 'Guided Step-by-Step Walkthrough',
    cancelEmergency: 'Cancel Countdown',
    alertCountdown: 'Activating Emergency Dispatch in',
    secondsRemaining: 'seconds',
    voiceAssistantTitle: 'Voice Assistant — Saathi',
    voiceAssistantSub: 'Speak naturally or tap a question below',
    repeatAloud: 'Repeat Aloud',
    slowVoice: 'Slow Voice (0.8x)',
    switchToText: 'Type your question instead',
  },
  hi: {
    appName: 'साथी AI',
    appTagline: 'पूछें। समझें। बिना झिझक काम करें।',
    seniorCopilot: 'वरिष्ठ नागरिक सहायक',
    safeMode: 'सुरक्षा मोड सक्रिय',
    safeModeActive: 'सुरक्षा मोड सक्रिय',
    talkToSaathi: 'साथी से बोलकर पूछें',
    tapToSpeak: 'बोलने के लिए दबाएं',
    listening: 'आपकी बात सुन रहे हैं...',
    thinking: 'साथी सोच रहा है...',
    speaking: 'साथी बोल रहा है...',
    processing: 'साथी सोच रहा है...',
    mute: 'आवाज़ बंद करें',
    stopVoice: 'आवाज़ रोकें',
    contrast: 'कंट्रास्ट',
    home: 'होम',
    dailyOverview: 'आज का सारांश',
    askSaathi: 'साथी से पूछें',
    voiceQuestions: 'आवाज़ और प्रश्न',
    explainAnything: 'संदेश समझें',
    scamShieldSms: 'स्कैम शील्ड व SMS जाँच',
    helpMeDoIt: 'कदम-दर-कदम मदद',
    guidedTaskCoach: 'डिजिटल कार्य सहायक',
    dailyBrief: 'दैनिक सारांश',
    morningDigest: 'सुबह की मुख्य बातें',
    reminders: 'रिमाइंडर',
    medicinesBills: 'दवाइयाँ व बिल',
    trustedCircle: 'विश्वसनीय परिवार',
    familySupport: 'बच्चों व अपनों से संपर्क',
    emergencySos: 'आपातकालीन SOS',
    emergencySub: '112, 108 व एल्डरलाइन',
    settings: 'सेटिंग्स',
    accessibilityVoice: 'फ़ॉन्ट व आवाज़ गति',
    navHome: 'होम पेज',
    navHomeSub: 'आज का सारांश',
    navAsk: 'साथी से पूछें',
    navAskSub: 'आवाज़ और प्रश्न',
    navExplain: 'संदेश समझें',
    navExplainSub: 'स्कैम शील्ड व SMS जाँच',
    navTasks: 'कदम-दर-कदम मदद',
    navTasksSub: 'डिजिटल कार्य सहायक',
    navDaily: 'दैनिक सारांश',
    navDailySub: 'सुबह की मुख्य बातें',
    navReminders: 'रिमाइंडर',
    navRemindersSub: 'दवाइयाँ व बिल',
    navCircle: 'विश्वसनीय परिवार',
    navCircleSub: 'बच्चों व अपनों से संपर्क',
    navSettings: 'सेटिंग्स',
    navSettingsSub: 'फ़ॉन्ट व आवाज़ गति',
    navSos: 'आपातकालीन SOS',
    navSosSub: '112, 108 व एल्डरलाइन 14567',
    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    welcomeHeadline: 'आज मैं आपकी क्या सहायता करूँ?',
    welcomeSub: 'अनजाने मैसेज समझें, बिजली बिल या ट्रेन टिकट खुद भरें, और किसी भी धोखाधड़ी से सुरक्षित रहें।',
    listenBrief: 'आज की आवाज़ में जानकारी सुनें',
    listenAudioBrief: 'आज की आवाज़ में जानकारी सुनें',
    viewBrief: 'दैनिक दिनचर्या देखें',
    whatToDo: 'आज आप क्या करना चाहेंगे?',
    tapCardToStart: 'शुरू करने के लिए किसी भी कार्ड पर टैप करें',
    cardTalkTitle: 'साथी से बोलकर पूछें',
    cardTalkDesc: 'आराम से बोलें या प्रश्न पूछें। साथी बिना किसी तकनीकी शब्दों के सरल भाषा में सब कुछ समझाता है।',
    cardTalkAction: 'बोलने के लिए दबाएं',
    cardExplainTitle: 'संदेश या बिल समझें',
    cardExplainDesc: 'स्क्रीनशॉट, बिल या SMS दिखाएं। जानें इसका क्या अर्थ है और क्या इसमें कोई धोखाधड़ी है।',
    cardExplainAction: 'मैसेज या बिल की जांच करें',
    cardTaskTitle: 'कदम-दर-कदम मदद',
    cardTaskDesc: 'बिजली बिल भरना, ट्रेन टिकट देखना या कोई भी ऐप चलाना अब बहुत आसान और सुरक्षित है।',
    cardTaskAction: 'कार्य शुरू या जारी रखें',
    todayReminders: 'आज के रिमाइंडर',
    settingsTitle: 'सेटिंग्स व सुगमता',
    settingsSub: 'भाषा, फॉन्ट आकार, आवाज़ गति, हाई कंट्रास्ट और आपातकालीन मेडिकल आईडी सेट करें।',
    languageChoice: 'भाषा चुनें (Choose Language)',
    emergencySosTitle: 'आपातकालीन सहायता (SOS)',
    emergencySosSub: 'भारतीय आपातकालीन हेल्पलाइन, तुरंत GPS लोकेशन, लाउड सायरन और परिवार को संदेश।',
    emergencySosButton: 'आपातकालीन SOS (112 / 108)',
    emergencyTriggerBtn: 'आपातकालीन SOS दबाएं',
    dialHelplines: 'भारतीय आपातकालीन हेल्पलाइन नंबर',
    nationalEmergency: '112 — राष्ट्रीय आपातकाल (पुलिस, एम्बुलेंस, फायर)',
    nationalAmbulance: '108 — राष्ट्रीय एम्बुलेंस सेवा',
    elderlineHelpline: '14567 — एल्डरलाइन (वरिष्ठ नागरिक हेल्पलाइन)',
    cyberFraudHelpline: '1930 — साइबर व बैंक धोखाधड़ी हेल्पलाइन',
    policeHelpline: '100 — पुलिस सहायता',
    locateMe: 'मेरी वर्तमान GPS लोकेशन पता करें',
    locatingGps: 'लोकेशन तलाशी जा रही है...',
    locationReady: 'लोकेशन मिल गई। गूगल मैप्स पर देखें।',
    shareViaWhatsapp: 'व्हाट्सएप पर तुरंत SOS भेजें',
    shareViaSms: 'इमरजेंसी SMS भेजें',
    playSiren: 'कमरे में लाउड सायरन बजाएं',
    stopSiren: 'सायरन बंद करें',
    sirenNotice: 'अगर आप गिर गए हैं या उठ नहीं पा रहे, तो यह सायरन घर में दूसरों का ध्यान खींचेगा।',
    medicalCardTitle: 'आपातकालीन मेडिकल कार्ड',
    bloodGroup: 'रक्त समूह (Blood Group)',
    chronicConditions: 'स्वास्थ्य स्थिति',
    emergencyDoctor: 'पारिवारिक डॉक्टर',
    preferredHospital: 'पसंदीदा अस्पताल',
    safeCheckHeader: 'संदेश सुरक्षा व स्कैम शील्ड',
    stepByStepHeader: 'सरल चरण-दर-चरण मार्गदर्शन',
    cancelEmergency: 'रद्द करें (गलती से दब गया)',
    alertCountdown: 'आपातकालीन अलर्ट सक्रिय होने में',
    secondsRemaining: 'सेकंड',
    voiceAssistantTitle: 'आवाज़ सहायक — साथी',
    voiceAssistantSub: 'आराम से बोलें या नीचे दिए किसी प्रश्न पर टैप करें',
    repeatAloud: 'दोबारा सुनें',
    slowVoice: 'धीमी आवाज़ में बोलें (0.8x)',
    switchToText: 'टाइप करके पूछें',
  },
};
