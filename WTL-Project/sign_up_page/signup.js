document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const videoContainer = document.getElementById('video-container');
  const startVideoBtn = document.getElementById('start-video-btn');
  const captureBtn = document.getElementById('capture-btn');
  const video = document.getElementById('video');
  let videoStream = null;
  let capturedFaceImage = null;

  // Start camera
  startVideoBtn.addEventListener('click', () => {
    videoContainer.style.display = 'block';
    startVideoCapture();
  });

  // Capture face
  captureBtn.addEventListener('click', () => {
    capturedFaceImage = captureFace();
    alert("Face captured successfully!");
    stopVideoCapture();
  });

  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !email || !password || !capturedFaceImage) {
      alert("Please fill all fields and capture your face.");
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
      alert("Account already exists with this email.");
      return;
    }

    const newUser = { username, email, password, faceImage: capturedFaceImage };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert("Sign-up successful! Redirecting to homepage...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });

  function startVideoCapture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoStream = stream;
          video.srcObject = stream;
        })
        .catch(err => {
          alert('Unable to access camera: ' + err);
        });
    }
  }

  function captureFace() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }

  function stopVideoCapture() {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
      videoContainer.style.display = 'none';
    }
  }

  // Enhanced voice recognition and NLP
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    let voices = speechSynthesis.getVoices();
    if (!voices.length) {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        setVoiceAndSpeak(voices, utterance, text);
      };
    } else {
      setVoiceAndSpeak(voices, utterance, text);
    }
  }

  function setVoiceAndSpeak(voices, utterance, text) {
    const indianFemale = voices.find(voice =>
      voice.name.includes("Google हिन्दी") ||
      voice.name.includes("Google UK English Female") ||
      (voice.lang === "en-IN" && voice.name.toLowerCase().includes("female"))
    );
    if (indianFemale) utterance.voice = indianFemale;
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }

  // Advanced NLP processor for natural language understanding
  function processNaturalLanguage(text) {
    text = text.toLowerCase().trim();
    
    // Username patterns
    const usernamePatterns = [
      /(?:my username is|username is|set username to|enter username|username|my name is|name is)\s*(.+?)(?:\s+and|\s+email|\s+password|$)/,
      /(?:call me|i am|i'm)\s*(.+?)(?:\s+and|\s+email|\s+password|$)/
    ];
    
    // Email patterns
    const emailPatterns = [
      /(?:my email is|email is|set email to|enter email|email)\s*(.+?)(?:\s+and|\s+password|$)/,
      /(?:email address is|my email address is)\s*(.+?)(?:\s+and|\s+password|$)/,
      /(.+@.+\..+)/ // Direct email format
    ];
    
    // Password patterns
    const passwordPatterns = [
      /(?:my password is|password is|set password to|enter password|password)\s*(.+)/,
      /(?:and password|with password)\s*(.+)/
    ];

    // Action patterns
    const submitPatterns = [
      /(?:submit|sign up|register|create account|finish|done|complete)/
    ];

    const resetPatterns = [
      /(?:clear|reset|empty|delete|start over)/
    ];

    const cameraPatterns = [
      /(?:capture face|take photo|camera|start camera|open camera|face capture)/
    ];

    const confirmCapturePatterns = [
      /(?:capture|take picture|snap|confirm|done|ready)/
    ];

    // Check for username input
    for (let pattern of usernamePatterns) {
      const match = text.match(pattern);
      if (match) {
        const username = match[1].trim().replace(/\s+/g, '');
        document.getElementById("username").value = username;
        speak("Username set to " + username);
        return true;
      }
    }

    // Check for email input
    for (let pattern of emailPatterns) {
      const match = text.match(pattern);
      if (match) {
        let email = match[1].trim();
        // Clean up spoken email
        email = email
          .replace(/\s*(at|@)\s*/g, '@')
          .replace(/\s*(dot|\.)\s*/g, '.')
          .replace(/\s+/g, '')
          .replace(/gmail$/, 'gmail.com')
          .replace(/yahoo$/, 'yahoo.com')
          .replace(/hotmail$/, 'hotmail.com')
          .replace(/outlook$/, 'outlook.com');
        
        document.getElementById("email").value = email;
        speak("Email set to " + email);
        return true;
      }
    }

    // Check for password input
    for (let pattern of passwordPatterns) {
      const match = text.match(pattern);
      if (match) {
        const password = match[1].trim().replace(/\s+/g, '');
        document.getElementById("password").value = password;
        speak("Password set");
        return true;
      }
    }

    // Check for camera actions
    for (let pattern of cameraPatterns) {
      if (pattern.test(text)) {
        document.getElementById('start-video-btn').click();
        speak("Starting camera for face capture");
        return true;
      }
    }

    // Check for capture confirmation
    if (videoContainer.style.display !== 'none' && videoStream) {
      for (let pattern of confirmCapturePatterns) {
        if (pattern.test(text)) {
          document.getElementById('capture-btn').click();
          speak("Face captured successfully");
          return true;
        }
      }
    }

    // Check for submit action
    for (let pattern of submitPatterns) {
      if (pattern.test(text)) {
        document.querySelector("button[type='submit']").click();
        speak("Submitting registration");
        return true;
      }
    }

    // Check for reset action
    for (let pattern of resetPatterns) {
      if (pattern.test(text)) {
        document.getElementById('signup-form').reset();
        capturedFaceImage = null;
        speak("Form cleared");
        return true;
      }
    }

    // Theme switching
    if (text.includes('dark') || text.includes('night')) {
      document.body.style.backgroundColor = '#000';
      document.body.style.color = '#fff';
      speak("Dark mode activated");
      return true;
    }
    
    if (text.includes('light') || text.includes('day')) {
      document.body.style.backgroundColor = '#f4f7fc';
      document.body.style.color = '#000';
      speak("Light mode activated");
      return true;
    }

    // Navigation
    if (text.includes('login') || text.includes('sign in') || text.includes('already have account')) {
      speak("Redirecting to login page");
      window.location.href = 'login.html';
      return true;
    }

    // Help system
    if (text.includes('help') || text.includes('guide') || text.includes('commands')) {
      speak("You can say: my username is john, my email is john at gmail dot com, my password is secret, capture face, then say submit. You can also say clear to reset.");
      return true;
    }

    return false;
  }

  // Initialize voice recognition if available
  if (typeof annyang !== 'undefined' && annyang) {
    // Simple command structure for backwards compatibility
    const commands = {
      'write username *tag': function(tag) {
        processNaturalLanguage('username ' + tag);
      },
      'write email *tag': function(tag) {
        processNaturalLanguage('email ' + tag);
      },
      'write password *tag': function(tag) {
        processNaturalLanguage('password ' + tag);
      },
      'capture face': function() {
        processNaturalLanguage('capture face');
      },
      'confirm capture': function() {
        processNaturalLanguage('capture');
      },
      'submit': function() {
        processNaturalLanguage('submit');
      },
      'sign up': function() {
        processNaturalLanguage('sign up');
      },
      'reset': function() {
        processNaturalLanguage('reset');
      },
      'clear': function() {
        processNaturalLanguage('clear');
      },
      'help': function() {
        processNaturalLanguage('help');
      },
      'guide me': function() {
        processNaturalLanguage('help');
      },
      'night mode': function() {
        processNaturalLanguage('night mode');
      },
      'day mode': function() {
        processNaturalLanguage('day mode');
      },
      'go to login': function() {
        processNaturalLanguage('login');
      }
    };

    annyang.addCommands(commands);

    // Enhanced result callback for natural language processing
    annyang.addCallback('result', function(phrases) {
      const bestPhrase = phrases[0];
      console.log('Voice input:', bestPhrase);
      
      // Try to process with NLP first
      if (!processNaturalLanguage(bestPhrase)) {
        // If NLP doesn't handle it, try to extract individual components
        const words = bestPhrase.toLowerCase().split(' ');
        
        // Look for email addresses in the phrase
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const emailMatch = bestPhrase.match(emailRegex);
        if (emailMatch) {
          document.getElementById("email").value = emailMatch[0];
          speak("Email detected and set");
          return;
        }
        
        console.log('NLP did not process command, trying pattern matching');
      }
    });

    // Error handling
    annyang.addCallback('error', function(error) {
      console.log('Voice recognition error:', error);
    });

    annyang.start();
    speak("Voice assistant ready for sign up. Say help for commands.");
  }
});