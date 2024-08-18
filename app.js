const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const output = document.getElementById('output');
const listeningIndicator = document.getElementById('listeningIndicator');
const healthTipsButton = document.getElementById('healthTips');
const bookAppointmentButton = document.getElementById('bookAppointment');
const symptomCheckerButton = document.getElementById('symptomChecker');
const contactSupportButton = document.getElementById('contactSupport');
const aboutUsButton = document.getElementById('aboutUs');

// Variables
let recognition = null;
let isListening = false;
let expectingFollowUp = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = false; 
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        output.textContent = transcript;

        if (expectingFollowUp) {
            handleFollowUpResponse(transcript.toLowerCase());
        } else {
            respond(transcript.toLowerCase());
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        output.textContent = `Error: ${event.error}`;
        listeningIndicator.textContent = '🔴 Error';
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start(); // Restart if needed
        }
        listeningIndicator.textContent = '🔴 Not Listening';
    };
} else {
    output.textContent = 'Speech recognition not supported in this browser.';
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (!isListening) {
        recognition.start();
        isListening = true;
        output.textContent = 'Listening...';
        listeningIndicator.textContent = '🟢 Listening';
        greetUser();
    }
});

stopButton.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        isListening = false;
        output.textContent = 'Stopped listening.';
        listeningIndicator.textContent = '🔴 Not Listening';
    }
});

healthTipsButton.addEventListener('click', () => {
    speak("Here are some general health tips: 1) Drink plenty of water. 2) Get regular exercise. 3) Eat a balanced diet.");
});

bookAppointmentButton.addEventListener('click', () => {
    speak("I can help you book an appointment. Please provide the details.");
});

symptomCheckerButton.addEventListener('click', () => {
    speak("Describe your symptoms, and I can provide some advice.");
    expectingFollowUp = true;
});

contactSupportButton.addEventListener('click', () => {
    speak("You can reach out to our support team via email at support@healthcareassistant.com.");
});

aboutUsButton.addEventListener('click', () => {
    speak("We are dedicated to providing reliable health information and assistance.");
});

// Functions
function greetUser() {
    const greeting = "Hi, I am your healthcare assistant. How can I help you today?";
    speak(greeting);
    const emotionalGreeting = Math.random() > 0.5 ? "I hope you're having a great day!" : "I’m here to help, no matter how you’re feeling.";
    output.textContent += ` ${emotionalGreeting}`;
}

function respond(message) {
    let response = "I didn't quite catch that. Could you please repeat?";

    if (message.includes('fever')) {
        response = "For a fever, it's important to stay hydrated and rest. You can take over-the-counter medication like acetaminophen or ibuprofen. If the fever persists for more than a few days or is very high, please consult a doctor.";
    } else if (message.includes('headache')) {
        response = "For a headache, ensure you're drinking enough water and resting. Over-the-counter pain relievers like ibuprofen or acetaminophen can help. If headaches are frequent or severe, please see a healthcare provider.";
    } else if (message.includes('cold')) {
        response = "For a cold, rest and drink plenty of fluids. You can use over-the-counter medications to relieve symptoms like congestion and cough. If symptoms worsen or last longer than a week, consult a healthcare provider.";
    } else if (message.includes('injury')) {
        response = "For injuries, clean the wound, apply antiseptic, and keep it covered. If the injury is severe or you have concerns about infection, seek medical attention.";
    } else if (message.includes('cough')) {
        response = "For a cough, drinking warm fluids and using cough drops can help soothe your throat. If the cough persists for more than a few weeks or is accompanied by other symptoms like shortness of breath, consult a healthcare provider.";
    } else if (message.includes('nausea')) {
        response = "For nausea, try drinking clear fluids and eating bland foods. If nausea is persistent or accompanied by other symptoms like severe abdominal pain or vomiting, consult a healthcare provider.";
    } else if (message.includes('dizziness')) {
        response = "If you’re feeling dizzy, make sure you’re well-hydrated and try to rest. If dizziness is severe, frequent, or accompanied by other symptoms like fainting or a headache, seek medical advice.";
    } else if (message.includes('stomach pain')) {
        response = "For stomach pain, try resting and drinking clear fluids. Avoid heavy, greasy foods. If the pain is severe, persistent, or accompanied by other symptoms like vomiting or fever, consult a healthcare provider.";
    } else if (message.includes('shortness of breath')) {
        response = "Shortness of breath can be a serious symptom. Try to stay calm and rest. If it’s severe or persistent, seek medical attention immediately.";
    } else if (message.includes('chest pain')) {
        response = "Chest pain can be a sign of various conditions. If it’s severe, persistent, or accompanied by other symptoms like shortness of breath or pain radiating to the arm, seek medical attention immediately.";
    } else if (message.includes('fatigue')) {
        response = "Fatigue can be caused by many factors. Ensure you’re getting enough rest, eating a balanced diet, and managing stress. If fatigue is persistent or affecting your daily activities, consult a healthcare provider.";
    } else if (message.includes('appointment')) {
        response = "I can help with scheduling an appointment. Please provide details like date, time, and reason for the appointment.";
    } else if (message.includes('help')) {
        response = "Sure! What kind of help do you need? You can ask about first aid, health tips, or schedule an appointment.";
    }

    speak(response);
    setTimeout(() => {
        const followUp = "Is there anything else I can assist you with?";
        speak(followUp);
        expectingFollowUp = true;
    }, 1000);
}

function handleFollowUpResponse(transcript) {
    const lowerCaseTranscript = transcript.toLowerCase();

    if (lowerCaseTranscript.includes('yes')) {
        speak("Great! How else can I assist you today?");
        expectingFollowUp = false;
    } else if (lowerCaseTranscript.includes('no')) {
        speak("Alright, have a great day! If you need further assistance, feel free to ask.");
        expectingFollowUp = false;
    } else {
        speak("I didn't quite catch that. Could you please say 'yes' or 'no'?");
    }
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female');
    speech.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
    };
    window.speechSynthesis.speak(speech);
}

// Ensure voices are loaded before setting the voice
window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices available:', window.speechSynthesis.getVoices());
};
