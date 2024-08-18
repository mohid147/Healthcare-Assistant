// script.js

// Elements
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
let lastTranscript = '';
let expectingFollowUp = false;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    if (transcript.trim() && transcript !== lastTranscript) {
      lastTranscript = transcript;
      output.textContent = transcript;

      if (event.results[0].isFinal) {
        if (expectingFollowUp) {
          handleFollowUpResponse(transcript.toLowerCase());
        } else {
          respond(transcript);
        }
      }
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    output.textContent = `Error: ${event.error}`;
    listeningIndicator.textContent = '🔴 Error';
  };

  recognition.onend = () => {
    if (isListening) {
      recognition.start(); // Restart recognition if stopped unexpectedly
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
  } else {
    console.log('Already listening...');
  }
});

stopButton.addEventListener('click', () => {
  if (isListening) {
    recognition.stop();
    isListening = false;
    output.textContent = 'Stopped listening.';
    listeningIndicator.textContent = '🔴 Not Listening';
  } else {
    console.log('Not listening...');
  }
});

healthTipsButton.addEventListener('click', () => {
  const tips = "Here are some general health tips: 1) Drink plenty of water. 2) Get regular exercise. 3) Eat a balanced diet.";
  speak(tips);
});

bookAppointmentButton.addEventListener('click', () => {
  const appointmentMessage = "I can help you book an appointment. Please provide the details.";
  speak(appointmentMessage);
});

symptomCheckerButton.addEventListener('click', () => {
  const symptomCheckerMessage = "Describe your symptoms, and I can provide some advice.";
  speak(symptomCheckerMessage);
  expectingFollowUp = true;
});

contactSupportButton.addEventListener('click', () => {
  const contactSupportMessage = "You can reach out to our support team via email at support@healthcareassistant.com.";
  speak(contactSupportMessage);
});

aboutUsButton.addEventListener('click', () => {
  const aboutUsMessage = "We are dedicated to providing reliable health information and assistance.";
  speak(aboutUsMessage);
});

// Functions
function greetUser() {
  const greeting = "Hi, I am your healthcare assistant. How can I help you today?";
  speak(greeting);
  const emotionalGreeting = Math.random() > 0.5 ? "I hope you're having a great day!" : "I’m here to help, no matter how you’re feeling.";
  output.textContent += ` ${emotionalGreeting}`;
}

function respond(message) {
  // Use NLP to analyze the message and extract keywords
  const parsedMessage = analyzeMessage(message); // Placeholder for NLP function

  let response = "I didn't quite catch that. Could you please repeat?";

  // Improved response logic based on keywords
  if (parsedMessage.intent === 'symptom_check') {
    // Handle symptom checking logic
    response = handleSymptomCheck(parsedMessage.symptoms);
  } else if (parsedMessage.intent === 'appointment') {
    // Handle appointment booking logic
    response = handleAppointmentBooking(parsedMessage.details);
  } else {
    // Handle general queries or provide informative responses
    response = handleGeneralQuery(parsedMessage.keywords);
  }

  speak(response);
  setTimeout(() => {
    const followUp = "Is there anything else I can assist you with?";
    speak(followUp);
    expectingFollowUp = true;
  }, 1000);
}

function handleSymptomCheck(symptoms) {
  // Use medical knowledge base or API to provide relevant information
  // Placeholder for medical knowledge integration
  return "Based on your symptoms, you might have [possible conditions]. Please consult a doctor for diagnosis and treatment.";
}

function handleAppointmentBooking(details) {
  // Integrate with appointment scheduling system
  // Placeholder for appointment scheduling integration
  return "Your appointment has been booked for [date and time].";
}

function handleGeneralQuery(keywords) {
  // Provide informative responses based on keywords
  // Placeholder for general query handling
  return "Here's some information about [topic related to keywords].";
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
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
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