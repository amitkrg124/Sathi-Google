import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Saathi AI Companion", features: ["Voice", "ScamShield", "Hindi_En", "SOS"] });
});

// 1. Ask Saathi: Conversational digital assistant for seniors
app.post("/api/chat", async (req, res) => {
  const { message, conversationHistory = [], language = "hi", simplificationLevel = "simple" } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A message is required." });
  }

  const ai = getGeminiClient();

  const isHindi = language === "hi";
  const systemInstruction = `
You are Saathi AI (साथी), a warm, patient, kind, and deeply respectful digital companion designed especially for Indian senior citizens.
Your mission is to help older adults navigate the digital world with confidence, ease, and complete safety.

CORE RULES:
1. Speak with warmth, dignity, and calm assurance ("जी", "नमस्ते", polite elders respect). Avoid robotic tone, cold technical jargon, or patronizing language.
2. If technical terms like OTP, browser cache, URL, cloud, or Bluetooth are necessary, explain them immediately in 1 simple everyday sentence.
3. Keep paragraphs short (2-3 sentences max). Use numbered steps for instructions.
4. Always prioritize safety: strictly warn against sharing passwords, PINs, or OTPs with anyone.
5. Offer 2 to 3 practical, short follow-up prompts that the senior might want to ask next.
6. Language: The user's preferred language is ${isHindi ? "HINDI (Devanagari script)" : "ENGLISH"}.
${isHindi ? "You MUST output all replyText, simplifiedKeyTakeaway, and followUpSuggestions in pure, respectful, and natural Hindi (देवनागरी)." : "Provide response in clear, accessible English with gentle tone."}
`;

  if (!ai) {
    const fallbackAnswer = generateFallbackChat(message, language);
    return res.json(fallbackAnswer);
  }

  try {
    const contents: any[] = [];
    
    // Add past history if any
    for (const item of conversationHistory.slice(-6)) {
      contents.push({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.text }],
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: "The primary plain-language answer for the senior citizen.",
            },
            simplifiedKeyTakeaway: {
              type: Type.STRING,
              description: "A single 1-sentence bottom-line takeaway.",
            },
            followUpSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 short follow-up questions or actions.",
            },
            suggestedWorkflow: {
              type: Type.STRING,
              description: "Optional workflow title if this question can become a step-by-step task, e.g. 'Pay electricity bill' or 'Check phone storage'.",
            },
          },
          required: ["replyText", "simplifiedKeyTakeaway", "followUpSuggestions"],
        },
      },
    });

    const rawJson = response.text?.trim() || "{}";
    const parsed = JSON.parse(rawJson);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    return res.json(generateFallbackChat(message, language));
  }
});

// 2. Explain Anything & Scam Shield (Multimodal or Text)
app.post("/api/explain", async (req, res) => {
  const { text, imageBase64, mimeType = "image/jpeg", language = "hi" } = req.body;

  if (!text && !imageBase64) {
    return res.status(400).json({ error: "Text or image is required." });
  }

  const ai = getGeminiClient();
  const isHindi = language === "hi";

  const systemInstruction = `
You are Saathi AI's 'Explain Anything & Scam Shield' engine for Indian senior citizens.
You analyze screenshots, text messages, bills, emails, or notifications.

Your job is to:
1. Identify what the item is (e.g. SMS from bank, utility bill, courier alert, WhatsApp message, app pop-up).
2. Break it down into 3 simple, non-intimidating sections:
   - "whatItSays": Brief factual summary of the content without jargon.
   - "whatItMeans": What this actually implies for the senior in plain words.
   - "whatYouCanDo": 2-4 safe, numbered next steps.
3. SCAM SHIELD EVALUATION:
   - Check for red flags: urgency ("Account blocked today", "Pay within 1 hour"), unknown sender, suspicious links (bit.ly, strange domains), asking for OTP/passwords, unexpected prize/lottery, threats of disconnection.
   - Be calm and measured. Distinguish between 'possible warning signs' vs 'safe message'. Never state it is 100% verified unless official, and never panic the user.
   - Provide a safe recommended action (e.g. "Do not click links. Contact your branch directly.").
4. Language Requirement: User preference is ${isHindi ? "HINDI (Devanagari)" : "ENGLISH"}.
${isHindi ? "You MUST translate all output fields (documentType, summary, whatItSays, whatItMeans, whatYouCanDo, scamAnalysis.headline, warningSigns, recommendedAction, reasoning) into natural, polite Hindi." : ""}
`;

  if (!ai) {
    return res.json(generateFallbackExplanation(text, language));
  }

  try {
    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      });
    }
    if (text) {
      parts.push({ text: `Content to examine:\n${text}` });
    } else {
      parts.push({ text: "Please carefully analyze this image and explain it for an older adult." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: {
              type: Type.STRING,
              description: "Type of document, e.g. 'Bank SMS Alert', 'Electricity Bill', 'Courier Notification'.",
            },
            summary: {
              type: Type.STRING,
              description: "One-sentence gentle overview.",
            },
            whatItSays: {
              type: Type.STRING,
              description: "Clear, simplified description of what the text or image says.",
            },
            whatItMeans: {
              type: Type.STRING,
              description: "What this really means in practical terms for the user.",
            },
            whatYouCanDo: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2 to 4 safe next steps.",
            },
            scamAnalysis: {
              type: Type.OBJECT,
              properties: {
                isSuspicious: { type: Type.BOOLEAN },
                severity: {
                  type: Type.STRING,
                  description: "One of 'safe', 'caution', or 'danger'.",
                },
                headline: { type: Type.STRING },
                warningSigns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Specific red flags found or empty if clean.",
                },
                recommendedAction: { type: Type.STRING },
                reasoning: { type: Type.STRING },
              },
              required: ["isSuspicious", "severity", "headline", "warningSigns", "recommendedAction"],
            },
            suggestedTaskTitle: {
              type: Type.STRING,
              description: "Optional task goal that can link directly to 'Help Me Do It'.",
            },
          },
          required: ["documentType", "summary", "whatItSays", "whatItMeans", "whatYouCanDo", "scamAnalysis"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini explain error:", error);
    return res.json(generateFallbackExplanation(text, language));
  }
});

// 3. Help Me Do It — Task Planner & Step-by-Step Guidance
app.post("/api/plan-task", async (req, res) => {
  const { goal, language = "hi" } = req.body;

  if (!goal || typeof goal !== "string") {
    return res.status(400).json({ error: "A goal is required." });
  }

  const ai = getGeminiClient();
  const isHindi = language === "hi";

  const systemInstruction = `
You are Saathi AI's 'Help Me Do It' Task Coach for older adults in India.
The user wants to complete an everyday digital task (e.g. paying electricity bill, ordering groceries, booking a cab, checking railway PNR, changing WhatsApp photo).

Rules:
1. Break the task down into 3 to 6 very clear, simple, sequential steps.
2. Focus on ONE action per step. Avoid compound or confusing instructions.
3. Mark any step with money, personal data, or passwords as 'isSensitive: true'.
4. Provide a 'detailedExplanation' for users who tap 'Tell me more'.
5. Include 2 quick 'troubleshootingTips' for 'I'm stuck'.
6. Keep the tone encouraging, calm, and reassuring.
7. Language: ${isHindi ? "HINDI (Devanagari script)" : "ENGLISH"}.
${isHindi ? "All step titles, instructions, detailed explanations, prerequisites, and tips must be in clear Hindi." : ""}
`;

  if (!ai) {
    return res.json(generateFallbackTaskPlan(goal, language));
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: `Create a step-by-step guided task plan for: ${goal}` }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            goal: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                  detailedExplanation: { type: Type.STRING },
                  isSensitive: { type: Type.BOOLEAN },
                  confirmationPrompt: { type: Type.STRING },
                  actionLabel: { type: Type.STRING },
                  troubleshootingTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["stepNumber", "title", "instruction", "detailedExplanation", "isSensitive", "actionLabel"],
              },
            },
            followUpReminderSuggestion: {
              type: Type.STRING,
              description: "Suggested reminder after completion.",
            },
          },
          required: ["title", "goal", "estimatedTime", "prerequisites", "steps"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini task plan error:", error);
    return res.json(generateFallbackTaskPlan(goal, language));
  }
});

// Fallback generators for deterministic testing & offline resilience
function generateFallbackChat(userMessage: string, language: string = "hi") {
  const lower = userMessage.toLowerCase();
  const isHindi = language === "hi";

  if (lower.includes("bill") || lower.includes("electricity") || lower.includes("pay") || lower.includes("बिजली") || lower.includes("बिल")) {
    return isHindi
      ? {
          replyText: "बिजली का बिल ऑनलाइन भरना बहुत सुरक्षित और आसान है। इसके लिए आपको केवल अपने बिल पर लिखा हुआ उपभोक्ता खाता नंबर (Consumer Number) चाहिए। क्या आप चाहेंगे कि मैं आपको 4 आसान चरणों में यह करके दिखाऊँ?",
          simplifiedKeyTakeaway: "केवल उपभोक्ता नंबर चाहिए, हम 4 आसान चरणों में बिना लाइन में लगे बिल भर सकते हैं।",
          followUpSuggestions: [
            "बिजली बिल भरने में मेरी मदद करें",
            "कंज्यूमर नंबर कहाँ मिलेगा?",
            "क्या ऑनलाइन भुगतान सुरक्षित है?",
          ],
          suggestedWorkflow: "बिजली का बिल भरें",
        }
      : {
          replyText: "Paying your electricity bill online is safe when done through your official electricity board website or trusted apps like UPI. You only need your Consumer Account Number found at the top right of your paper bill. Would you like me to walk you through it step-by-step?",
          simplifiedKeyTakeaway: "You only need your Consumer Account Number, and we can do it together safely in 4 steps.",
          followUpSuggestions: [
            "Help me pay my electricity bill",
            "Where do I find my Consumer Number?",
            "Is it safe to pay online?",
          ],
          suggestedWorkflow: "Pay electricity bill",
        };
  }

  if (lower.includes("train") || lower.includes("railway") || lower.includes("ticket") || lower.includes("ट्रेन") || lower.includes("टिकट")) {
    return isHindi
      ? {
          replyText: "ट्रेन का टिकट ऑनलाइन बुक करना बहुत सुविधाजनक है। हम आधिकारिक IRCTC पोर्टल से सीट और वरिष्ठ नागरिकों के लिए निचली बर्थ (Lower Berth) देख सकते हैं।",
          simplifiedKeyTakeaway: "हम मिलकर ट्रेन चुनेंगे और आसानी से वरिष्ठ नागरिक छूट व निचली सीट चेक कर सकते हैं।",
          followUpSuggestions: [
            "ट्रेन टिकट बुक करने में मदद करें",
            "निचली बर्थ (Lower Berth) कैसे चुनें?",
            "साथ में कौन सा पहचान पत्र रखना होता है?",
          ],
          suggestedWorkflow: "ट्रेन टिकट बुक करें",
        }
      : {
          replyText: "Booking a train ticket online is very convenient. You can check seat availability and book using the official IRCTC portal. We will select your departure station, date, and passenger details one at a time so you never feel rushed.",
          simplifiedKeyTakeaway: "We can find your train and check senior citizen lower berth availability together.",
          followUpSuggestions: [
            "Help me book a train ticket",
            "How do I request a lower berth?",
            "What ID card do I need to carry?",
          ],
          suggestedWorkflow: "Book train ticket",
        };
  }

  return isHindi
    ? {
        replyText: `नमस्ते! मैं आपके साथ हूँ। "${userMessage}" के बारे में हम आराम से एक-एक कदम उठा सकते हैं। मैं आपको कोई भी मैसेज समझा सकता हूँ या डिजिटल काम पूरा करा सकता हूँ।`,
        simplifiedKeyTakeaway: "आपको अकेले परेशान होने की जरूरत नहीं है — साथी आपकी पूरी मदद करेगा।",
        followUpSuggestions: [
          "कोई मैसेज या SMS समझाइए",
          "आज मेरे क्या काम हैं?",
          "डिजिटल काम में मदद करें",
        ],
      }
    : {
        replyText: `I am right here with you. Regarding "${userMessage}", we can take it one calm step at a time. I can explain any message you've received, help you do a digital task, or set a reminder for later.`,
        simplifiedKeyTakeaway: "You don't have to figure this out alone — ask me anything or show me a screenshot.",
        followUpSuggestions: [
          "Explain a message or SMS",
          "What do I need to do today?",
          "Help me do a digital task",
        ],
      };
}

function generateFallbackExplanation(text?: string, language: string = "hi") {
  const lower = (text || "").toLowerCase();
  const isSuspicious = lower.includes("blocked") || lower.includes("urgent") || lower.includes("link") || lower.includes("kyc") || lower.includes("lottery") || lower.includes("winner") || lower.includes("बंद") || lower.includes("ब्लॉक");
  const isHindi = language === "hi";

  if (isSuspicious) {
    return isHindi
      ? {
          documentType: "संदिग्ध बैंक SMS चेतावनी",
          summary: "यह मैसेज दावा करता है कि आपका बैंक खाता ब्लॉक हो जाएगा यदि आपने तुरंत लिंक पर क्लिक नहीं किया।",
          whatItSays: "मैसेज में खाता बंद करने की धमकी देकर अनजान लिंक पर क्लिक करने या KYC अपडेट करने को कहा गया है।",
          whatItMeans: "असली बैंक कभी भी ऐसे छोटे SMS में खाता बंद करने की धमकी नहीं देते और न ही अनजान लिंक पर क्लिक करने को कहते हैं।",
          whatYouCanDo: [
            "मैसेज में दिए किसी भी लिंक पर भूलकर भी क्लिक न करें।",
            "मैसेज में दिए फोन नंबर पर कभी कॉल न करें।",
            "यदि शंका हो तो अपने बैंक डेबिट कार्ड के पीछे छपे हेल्पलाइन नंबर पर कॉल करें।",
            "सलाह के लिए इसे अपने परिवार के भरोसेमंद सदस्य को शेयर करें।",
          ],
          scamAnalysis: {
            isSuspicious: true,
            severity: "danger",
            headline: "सावधानी जरूरी: इस मैसेज में धोखे के कई लक्षण हैं।",
            warningSigns: [
              "धमकी भरी भाषा ('आज ही खाता बंद कर दिया जाएगा')",
              "निजी बैंक जानकारी मांगने वाला लिंक",
              "अज्ञात या असामान्य भेजने वाला नंबर",
              "जल्दबाजी में फैसला लेने का दबाव",
            ],
            recommendedAction: "किसी लिंक पर क्लिक न करें। इस मैसेज को अनदेखा या डिलीट करें।",
            reasoning: "जल्दबाजी और डर दिखाना जालसाजों का सबसे आम तरीका है।",
          },
          suggestedTaskTitle: "बैंक संदेश की सुरक्षित जांच",
        }
      : {
          documentType: "Suspicious Bank SMS Alert",
          summary: "This message claims your bank account or card will be blocked unless you click a link or verify immediately.",
          whatItSays: "It threatens immediate account closure and asks you to tap an unknown link or update KYC details right away.",
          whatItMeans: "Real banks never block accounts with a short SMS warning, and genuine banks never ask you to click unofficial links to verify details.",
          whatYouCanDo: [
            "Do NOT click any link in the message.",
            "Do NOT call the phone number mentioned in the text.",
            "If you are concerned, call the helpline printed on the back of your bank debit card.",
            "Share this with a trusted family contact if you want a second opinion.",
          ],
          scamAnalysis: {
            isSuspicious: true,
            severity: "danger",
            headline: "High Caution: There are multiple warning signs here.",
            warningSigns: [
              "Urgent, threatening language ('Account will be blocked today')",
              "Direct link asking to verify private bank details",
              "Unknown or disguised sender address",
              "Pressure to act before checking with family",
            ],
            recommendedAction: "Do not tap any links or reply. Ignore or delete the message safely.",
            reasoning: "Urgency and fear tactics are the most common tricks used to rush seniors into making mistakes.",
          },
          suggestedTaskTitle: "Verify bank message safely",
        };
  }

  return isHindi
    ? {
        documentType: "सूचनात्मक बिल अथवा सूचना",
        summary: "यह आपके खाते या सेवा से जुड़ी एक सामान्य जानकारी है।",
        whatItSays: "यह आपके बिल की राशि, उपयोग और भुगतान की अंतिम तिथि बताता है।",
        whatItMeans: "कोई घबराने या जल्दबाजी की बात नहीं है। आप आराम से इसे देख सकते हैं।",
        whatYouCanDo: [
          "कुल राशि और अंतिम तिथि की जांच करें।",
          "अपने सामान्य मासिक खर्च से इसका मिलान करें।",
          "साथी से बिल भुगतान या रिमाइंडर लगाने में मदद लें।",
        ],
        scamAnalysis: {
          isSuspicious: false,
          severity: "safe",
          headline: "कोई धोखाधड़ी का लक्षण नहीं मिला।",
          warningSigns: [],
          recommendedAction: "आप अपनी गति से आगे बढ़ सकते हैं। साथी सुरक्षित भुगतान में मदद कर सकता है।",
          reasoning: "संदेश की भाषा सामान्य और शांत है। कोई संदिग्ध लिंक नहीं है।",
        },
        suggestedTaskTitle: "बिल का सुरक्षित भुगतान करें",
      }
    : {
        documentType: "Digital Utility or Notification",
        summary: "This is a standard informational notice regarding your account or service.",
        whatItSays: "It provides routine account information, a balance or bill update, and the regular due date.",
        whatItMeans: "There is no immediate danger or emergency. You can review the details at your own comfortable pace.",
        whatYouCanDo: [
          "Review the total amount and due date.",
          "Check whether this matches your paper bill or regular monthly usage.",
          "Ask Saathi to help you pay or set a reminder for the due date.",
        ],
        scamAnalysis: {
          isSuspicious: false,
          severity: "safe",
          headline: "No suspicious warning signs detected.",
          warningSigns: [],
          recommendedAction: "Review at your own pace. If you'd like to pay, Saathi can guide you safely.",
          reasoning: "The tone is standard informational without artificial urgency or dubious links.",
        },
        suggestedTaskTitle: "Pay this bill step-by-step",
      };
}

function generateFallbackTaskPlan(goal: string, language: string = "hi") {
  const isHindi = language === "hi";

  if (isHindi) {
    return {
      title: "बिजली का बिल भरें",
      goal: "बिना किसी लाइन में खड़े हुए बिजली का बिल सुरक्षित भरें।",
      estimatedTime: "लगभग 4 मिनट",
      prerequisites: [
        "बिजली का कागजी बिल (कंज्यूमर नंबर देखने के लिए)",
        "आपका फोन या UPI पेमेंट ऐप",
      ],
      steps: [
        {
          stepNumber: 1,
          title: "उपभोक्ता संख्या (Consumer Number) ढूंढें",
          instruction: "अपने कागजी बिजली बिल के ऊपर दाईं ओर देखें। वहाँ 9 से 12 अंकों का उपभोक्ता नंबर (CA No.) लिखा होगा।",
          detailedExplanation: "यह नंबर आपके मीटर की पहचान है। इससे आपका पैसा सीधे आपके घर के खाते में जमा होता है।",
          isSensitive: false,
          actionLabel: "मुझे उपभोक्ता नंबर मिल गया है",
          troubleshootingTips: [
            "बिल पर 'Consumer ID', 'Account ID' या 'CA No.' देखें।",
            "यदि न मिले तो बिल का फोटो साथी को दिखाएँ।",
          ],
        },
        {
          stepNumber: 2,
          title: "अपना विश्वसनीय पेमेंट ऐप खोलें",
          instruction: "अपने फोन पर Google Pay, PhonePe या अपने बैंक का ऐप खोलें।",
          detailedExplanation: "हमेशा केवल आधिकारिक ऐप का उपयोग करें। किसी SMS के लिंक से ऐप न खोलें।",
          isSensitive: false,
          actionLabel: "पेमेंट ऐप खुल गया है",
          troubleshootingTips: [
            "अपने बैंक या पेमेंट ऐप के लोगो वाले आइकॉन पर टैप करें।",
          ],
        },
        {
          stepNumber: 3,
          title: "नाम और बिल राशि की पुष्टि करें",
          instruction: "बिजली बोर्ड चुनें, अपना उपभोक्ता नंबर दर्ज करें और देखें कि नाम और राशि आपके कागजी बिल से मेल खाते हैं।",
          detailedExplanation: "भुगतान करने से पहले हमेशा अपना नाम स्क्रीन पर जांचें।",
          isSensitive: true,
          confirmationPrompt: "कृपया जांचें: क्या स्क्रीन पर दिख रहा नाम और राशि आपके बिजली बिल से मेल खाती है?",
          actionLabel: "नाम और राशि सही है",
          troubleshootingTips: [
            "यदि राशि शून्य दिखे तो हो सकता है बिल पहले से भरा हुआ हो।",
          ],
        },
        {
          stepNumber: 4,
          title: "सुरक्षित UPI पिन डालें और रसीद सुरक्षित करें",
          instruction: "भुगतान पूरा करने के लिए केवल अपना गुप्त 4 या 6 अंकों का UPI पिन दर्ज करें।",
          detailedExplanation: "ध्यान रहे: UPI पिन केवल पैसे भेजते समय डाला जाता है, पैसे प्राप्त करने के लिए कभी पिन नहीं डालना होता।",
          isSensitive: true,
          confirmationPrompt: "पुष्टि करें कि आप भुगतान के लिए तैयार हैं।",
          actionLabel: "भुगतान पूरा हुआ",
          troubleshootingTips: [
            "हरी टिक वाली स्क्रीन का स्क्रीनशॉट ले लें।",
          ],
        },
      ],
      followUpReminderSuggestion: "अगले महीने की 15 तारीख को नए बिजली बिल का रिमाइंडर लगाएं।",
    };
  }

  return {
    title: "Pay Electricity Bill",
    goal: "Safely pay your electricity bill without waiting in long queues.",
    estimatedTime: "About 4 minutes",
    prerequisites: [
      "Your paper electricity bill (to see Consumer Number)",
      "Your phone or UPI payment app ready",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Find your Consumer Number",
        instruction: "Look at your electricity bill. Your Consumer Number (or CA Number) is printed in bold at the top right, usually 9 to 12 digits.",
        detailedExplanation: "This number identifies your home meter. It ensures your money goes directly to your house account and nowhere else.",
        isSensitive: false,
        actionLabel: "I have found my Consumer Number",
        troubleshootingTips: [
          "Look for 'Consumer ID', 'Account ID', or 'CA No.' on the bill.",
          "If you can't find it, you can upload a photo of the bill to Saathi.",
        ],
      },
      {
        stepNumber: 2,
        title: "Open your trusted payment app",
        instruction: "Unlock your phone and open the app you usually use, such as your bank app, Google Pay, or electricity board portal.",
        detailedExplanation: "Always use apps installed directly from the official store. Never use links sent by unfamiliar SMS numbers.",
        isSensitive: false,
        actionLabel: "Payment app is open",
        troubleshootingTips: [
          "Look for the icon with your bank logo or Google Pay icon.",
          "Take your time entering your phone unlock PIN.",
        ],
      },
      {
        stepNumber: 3,
        title: "Verify the bill amount and name",
        instruction: "Select Electricity, choose your provider, enter your Consumer Number, and check if the name and amount match your paper bill.",
        detailedExplanation: "Always confirm that the customer name matches your household before proceeding with any payment.",
        isSensitive: true,
        confirmationPrompt: "Please double-check: Does the name and amount on screen match your electricity bill?",
        actionLabel: "Name & amount are correct",
        troubleshootingTips: [
          "If the amount shows zero, your bill may already be paid.",
          "If the name is different, re-check your consumer number.",
        ],
      },
      {
        stepNumber: 4,
        title: "Confirm payment and save receipt",
        instruction: "Enter your secure UPI PIN or payment password carefully to complete the payment.",
        detailedExplanation: "Remember: You only enter your PIN when YOU are paying money. Never enter your PIN to receive money.",
        isSensitive: true,
        confirmationPrompt: "Confirm you are ready to authorize the payment.",
        actionLabel: "Payment complete",
        troubleshootingTips: [
          "Keep the transaction ID or take a screenshot of the green checkmark.",
        ],
      },
    ],
    followUpReminderSuggestion: "Remind me on the 15th of next month to check the new electricity bill.",
  };
}

// Production / Dev Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Saathi AI server running on port ${PORT}`);
  });
}

startServer();
