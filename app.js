document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const elements = {
        startButton: document.getElementById('start'),
        stopButton: document.getElementById('stop'),
        output: document.getElementById('output'),
        listeningIndicator: document.getElementById('listeningIndicator'),
        healthTipsButton: document.getElementById('healthTips'),
        bookAppointmentButton: document.getElementById('bookAppointment'),
        symptomCheckerButton: document.getElementById('symptomChecker'),
        contactSupportButton: document.getElementById('contactSupport'),
        aboutUsButton: document.getElementById('aboutUs'),
        languageButtons: {
            'en-US': document.getElementById('englishButton'),
            'hi-IN': document.getElementById('hindiButton'),
            'te-IN': document.getElementById('teluguButton')
        }
    };

    // Variables
    let recognition;
    let isListening = false;
    let expectingFollowUp = false;
    let currentLanguage = 'en-US'; // Default language

    // Initialize Speech Recognition
    function initSpeechRecognition() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false; // Set to true for continuous listening
            recognition.interimResults = false; // Set to true for interim results
            recognition.lang = currentLanguage;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.trim();
                elements.output.textContent = transcript;
                if (expectingFollowUp) {
                    handleFollowUpResponse(transcript.toLowerCase());
                } else {
                    respond(transcript.toLowerCase());
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                elements.output.textContent = `Error: ${event.error}`;
                elements.listeningIndicator.textContent = '🔴 Error';
            };

            recognition.onend = () => {
                if (isListening) {
                    recognition.start();
                }
                updateListeningStatus(false);
            };
        } else {
            elements.output.textContent = 'Speech recognition not supported in this browser.';
        }
    }

    // Update Listening Status
    function updateListeningStatus(listening) {
        isListening = listening;
        elements.listeningIndicator.textContent = listening ? '🟢 Listening' : '🔴 Not Listening';
        if (!listening) elements.output.textContent = 'Stopped listening.';
    }

    // Event Listeners for Language Selection
    Object.keys(elements.languageButtons).forEach((lang) => {
        elements.languageButtons[lang].addEventListener('click', () => {
            currentLanguage = lang;
            updateLanguageSettings();
        });
    });

    function updateLanguageSettings() {
        if (recognition) {
            recognition.lang = currentLanguage;
        }
        greetUser();
    }

    // Initialize Speech Recognition
    initSpeechRecognition();

    // Event Listeners for Start/Stop buttons
    elements.startButton.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
            updateListeningStatus(true);
            greetUser();
        }
    });

    elements.stopButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            updateListeningStatus(false);
        }
    });

    // Example Health Tips Button
    elements.healthTipsButton.addEventListener('click', () => {
        const tips = {
            'en-US': "Remember to stay hydrated, get regular exercise, and eat a balanced diet.",
            'hi-IN': "भरपूर पानी पिएं, नियमित व्यायाम करें, और संतुलित आहार लें।",
            'te-IN': "పుష్కలంగా నీరు తాగండి, క్రమం తప్పని వ్యాయామం చేయండి, మరియు సమతుల్య ఆహారం తీసుకోండి."
        };
        speak(tips[currentLanguage]);
    });

    // Event Listeners for other actions
    elements.bookAppointmentButton.addEventListener('click', () => {
        speak({
            'en-US': "Booking an appointment with your preferred doctor. Please hold on...",
            'hi-IN': "आपके पसंदीदा डॉक्टर के साथ अपॉइंटमेंट बुक किया जा रहा है। कृपया प्रतीक्षा करें...",
            'te-IN': "మీకు ఇష్టమైన డాక్టర్‌తో అపాయింట్మెంట్ బుక్ చేస్తోంది. దయచేసి వేచి ఉండండి..."
        }[currentLanguage]);
    });

    elements.contactSupportButton.addEventListener('click', () => {
        speak({
            'en-US': "Connecting you to customer support. Please wait...",
            'hi-IN': "आपको ग्राहक सहायता से जोड़ा जा रहा है। कृपया प्रतीक्षा करें...",
            'te-IN': "మీకు కస్టమర్ సపోర్ట్‌ను కనెక్ట్ చేస్తోంది. దయచేసి వేచి ఉండండి..."
        }[currentLanguage]);
    });

    elements.aboutUsButton.addEventListener('click', () => {
        speak({
            'en-US': "We are committed to providing you with the best healthcare assistance. How can we help you today?",
            'hi-IN': "हम आपको सर्वश्रेष्ठ स्वास्थ्य देखभाल सहायता प्रदान करने के लिए प्रतिबद्ध हैं। आज हम आपकी कैसे मदद कर सकते हैं?",
            'te-IN': "మేము మీకు ఉత్తమ ఆరోగ్య సహాయాన్ని అందించడానికి కట్టుబడి ఉన్నాము. ఈ రోజు మిమ్మల్ని ఎలా సాయపడగలను?"
        }[currentLanguage]);
    });

    // Responding to Symptoms
    elements.symptomCheckerButton.addEventListener('click', () => {
        speak("Please describe your symptoms, and I can provide some advice.");
        expectingFollowUp = true;
    });

    function respond(message) {
        const responses = {
            'fever': {
                'en-US': "It seems you have a fever. Rest, stay hydrated, and take paracetamol if necessary. If the fever persists, consult a doctor.",
                'hi-IN': "ऐसा लगता है कि आपको बुखार है। आराम करें, हाइड्रेटेड रहें, और पेरासिटामोल लें। यदि बुखार बना रहता है, तो डॉक्टर से परामर्श करें।",
                'te-IN': "మీకు జ్వరం ఉన్నట్లుగా కనిపిస్తోంది. విశ్రాంతి తీసుకోండి, తగినంత నీటిని త్రాగండి, మరియు అవసరమైతే పారా సిటమాల్ తీసుకోండి. జ్వరం కొనసాగితే, డాక్టర్‌ను సంప్రదించండి."
            },
            'headache': {
                'en-US': "For a headache, rest in a dark room, stay hydrated, and take ibuprofen. If the pain persists, seek medical advice.",
                'hi-IN': "सिरदर्द के लिए, एक अंधेरे कमरे में आराम करें, हाइड्रेटेड रहें, और इबुप्रोफेन लें। यदि दर्द बना रहता है, तो चिकित्सा सलाह लें।",
                'te-IN': "తలనొప్పి కోసం, చీకటి గదిలో విశ్రాంతి తీసుకోండి, తగినంత నీటిని త్రాగండి, మరియు ఇబుప్రోఫెన్ తీసుకోండి. నొప్పి కొనసాగితే, వైద్య సలహా పొందండి."
            }
        };

        const match = Object.keys(responses).find(key => message.includes(key));
        if (match) {
            speak(responses[match][currentLanguage]);
        } else {
            speak({
                'en-US': "I didn't quite catch that. Could you please repeat?",
                'hi-IN': "मैंने वह सही से नहीं सुना। क्या आप कृपया दोहरा सकते हैं?",
                'te-IN': "నేను దాన్ని సరైన విధంగా పట్టుకోలేదు. దయచేసి మళ్లీ చెప్తారా?"
            }[currentLanguage]);
        }
    }

    // Handling Follow-Up Responses
    function handleFollowUpResponse(message) {
        // Example responses
        const followUpResponses = {
            'yes': {
                'en-US': "Great! How else can I assist you?",
                'hi-IN': "अद्भुत! मैं आपकी और कैसे मदद कर सकता हूँ?",
                'te-IN': "చాలా మంచి! నేను మిమ్మల్ని ఇంకేం సహాయం చేయగలనా?"
            },
            'no': {
                'en-US': "Okay, let me know if you need anything else.",
                'hi-IN': "ठीक है, यदि आपको किसी और चीज़ की आवश्यकता हो तो बताएं।",
                'te-IN': "సరే, మీరు మరేదైనా అవసరం ఉంటే నాకు తెలియజేయండి."
            }
        };

        const response = followUpResponses[message];
        if (response) {
            speak(response[currentLanguage]);
        } else {
            speak({
                'en-US': "I'm not sure how to respond to that. Can you please clarify?",
                'hi-IN': "मुझे इस पर प्रतिक्रिया देने के बारे में यकीन नहीं है। क्या आप कृपया स्पष्ट कर सकते हैं?",
                'te-IN': "నేను దీనికి ఎలా స్పందించాలో నాకు తెలియదు. దయచేసి స్పష్టత ఇవ్వగలరు?"
            }[currentLanguage]);
        }

        expectingFollowUp = false;
    }

    // Function to speak text
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage;
        window.speechSynthesis.speak(utterance);
    }

    // Greet User
    function greetUser() {
        const greetings = {
            'en-US': "Hello! How can I assist you today?",
            'hi-IN': "नमस्ते! मैं आपकी आज कैसे सहायता कर सकता हूँ?",
            'te-IN': "హలో! నేను ఈ రోజు మీకు ఎలా సహాయం చేయగలను?"
        };
        speak(greetings[currentLanguage]);
    }
});

