document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
  
      // Check if user exists with matching email and password
      const user = users.find(user => user.email === email && user.password === password);
  
      if (user) {
        // Store the logged-in user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        alert("Login successful!");
        window.location.href = "accounts.html";  // Redirect to accounts page
      } else {
        alert("Invalid email or password.");
      }
    });

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
      
      // Email patterns
      const emailPatterns = [
        /(?:my email is|email is|set email to|enter email|email)\s*(.+)/,
        /(?:login with|sign in with)\s*(.+?)(?:\s+password|\s+and|$)/,
        /(.+@.+\..+)/  // Direct email format
      ];
      
      // Password patterns
      const passwordPatterns = [
        /(?:my password is|password is|set password to|enter password|password)\s*(.+)/,
        /(?:and password|with password|password)\s*(.+)/
      ];

      // Login action patterns
      const loginPatterns = [
        /(?:login|log in|sign in|submit|enter|go)/,
        /(?:let me in|access|authenticate)/
      ];

      // Reset patterns
      const resetPatterns = [
        /(?:clear|reset|empty|delete)/
      ];

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
            .replace(/hotmail$/, 'hotmail.com');
          
          document.getElementById("email").value = email;
          speak("Email set to " + email);
          return true;
        }
      }

      // Check for password input
      for (let pattern of passwordPatterns) {
        const match = text.match(pattern);
        if (match) {
          const password = match[1].trim();
          document.getElementById("password").value = password;
          speak("Password entered");
          return true;
        }
      }

      // Check for login action
      for (let pattern of loginPatterns) {
        if (pattern.test(text)) {
          document.querySelector("button[type='submit']").click();
          speak("Attempting to log in");
          return true;
        }
      }

      // Check for reset action
      for (let pattern of resetPatterns) {
        if (pattern.test(text)) {
          document.getElementById('login-form').reset();
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
      if (text.includes('sign up') || text.includes('register') || text.includes('create account')) {
        speak("Redirecting to sign up page");
        window.location.href = 'html2.html';
        return true;
      }

      // Help system
      if (text.includes('help') || text.includes('guide') || text.includes('commands')) {
        speak("You can say: my email is john at gmail dot com, my password is secret, then say login. You can also say clear to reset, or sign up to create an account.");
        return true;
      }

      return false;
    }

    // Initialize voice recognition if available
    if (typeof annyang !== 'undefined' && annyang) {
      // Simple command structure for backwards compatibility
      const commands = {
        'write email *tag': function(tag) {
          processNaturalLanguage('email ' + tag);
        },
        'write password *tag': function(tag) {
          processNaturalLanguage('password ' + tag);
        },
        'login': function() {
          processNaturalLanguage('login');
        },
        'submit': function() {
          processNaturalLanguage('submit');
        },
        'clear': function() {
          processNaturalLanguage('clear');
        },
        'reset': function() {
          processNaturalLanguage('reset');
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
        'go to sign up': function() {
          processNaturalLanguage('sign up');
        }
      };

      annyang.addCommands(commands);

      // Enhanced result callback for natural language processing
      annyang.addCallback('result', function(phrases) {
        const bestPhrase = phrases[0];
        console.log('Voice input:', bestPhrase);
        
        // Try to process with NLP first
        if (!processNaturalLanguage(bestPhrase)) {
          // If NLP doesn't handle it, fall back to command matching
          console.log('NLP did not process command, trying pattern matching');
        }
      });

      // Error handling
      annyang.addCallback('error', function(error) {
        console.log('Voice recognition error:', error);
      });

      annyang.start();
      speak("Voice assistant ready. Say help for commands.");
    }
  });