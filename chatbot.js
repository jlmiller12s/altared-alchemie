// Altared Alchemie AI Chatbot
(function() {
  'use strict';

  // Chatbot configuration
  const config = {
    botName: 'Altared AI Assistant',
    primaryColor: '#39FF39',
    backgroundColor: '#0A2D0A',
    textColor: '#FFFFFF',
    placeholderMessages: [
      'Hi! I\'m the Altared Alchemie AI assistant. How can I help you today?',
      'Feel free to ask me about our services, pricing, or how we can help transform your business with AI.'
    ]
  };

  // Predefined responses for common questions
  const responses = {
    'services': {
      keywords: ['service', 'services', 'offer', 'what do you do', 'help with'],
      answer: 'We offer several AI services:\n\n• Custom AI Websites - Lightning-fast development\n• AI Chatbot Integration - Smart customer support\n• AI Avatar Clones - Video content at scale\n• AI Training & Consulting - Team workshops\n\nWould you like to know more about any specific service?'
    },
    'pricing': {
      keywords: ['price', 'pricing', 'cost', 'how much', 'expensive', 'budget'],
      answer: 'Our pricing is tailored to your specific needs and project scope. We offer:\n\n• Strategy calls (Free 15-min consultation)\n• Pilot programs (Starting at $2,500)\n• Custom projects ($5,000 - $90,000+)\n\nWould you like to schedule a free consultation to discuss your project?'
    },
    'contact': {
      keywords: ['contact', 'reach', 'email', 'phone', 'call', 'schedule', 'meeting'],
      answer: 'I\'d be happy to help you get in touch!\n\n📧 Email: jlmiller12s@gmail.com\n🔗 LinkedIn: linkedin.com/company/altaredalchemie\n\nYou can also:\n• <a href="/contact.html#schedule" target="_blank">Schedule a free 15-min consultation</a>\n• <a href="/pilot.html" target="_blank">Start a pilot project</a>\n\nWhat works best for you?'
    },
    'website': {
      keywords: ['website', 'web design', 'web development', 'site'],
      answer: 'Our Custom AI Websites service includes:\n\n✓ Lightning-fast development (days, not months)\n✓ AI-powered copywriting and design\n✓ Mobile-responsive and accessible (WCAG AA)\n✓ Save $5,000-$10,000+ vs traditional agencies\n\nWant to see examples or start your own project?'
    },
    'chatbot': {
      keywords: ['chatbot', 'chat bot', 'ai chat', 'customer support'],
      answer: 'Our AI Chatbot Integration service provides:\n\n✓ 24/7 automated customer support\n✓ Lead capture and qualification\n✓ Seamless integration with your tools\n✓ Custom training on your business\n\nInterested in adding a smart chatbot to your website?'
    },
    'avatar': {
      keywords: ['avatar', 'video', 'clone', 'ai avatar', 'content creation'],
      answer: 'AI Avatar Clones let you:\n\n✓ Create video content at scale\n✓ Maintain consistent messaging\n✓ Save hours of recording time\n✓ Personalize content for different audiences\n\nPerfect for content creators, trainers, and brands. Want to learn more?'
    },
    'training': {
      keywords: ['training', 'workshop', 'consulting', 'learn', 'teach'],
      answer: 'Our AI Training & Consulting includes:\n\n✓ Team workshops (custom curriculum)\n✓ Strategy guidance and roadmapping\n✓ Hands-on implementation support\n✓ Ongoing optimization assistance\n\nWe help your team leverage AI effectively. Interested?'
    },
    'pilot': {
      keywords: ['pilot', 'trial', 'test', 'start'],
      answer: 'Our pilot programs are perfect for getting started!\n\n• Quick audit of your needs (1-2 weeks to start)\n• Low-risk way to experience our services\n• Typically 4-8 weeks duration\n• Can scale into larger engagements\n\n<a href="/pilot.html" target="_blank">Start a pilot program</a> or would you like to discuss options first?'
    },
    'about': {
      keywords: ['about', 'who are you', 'your company', 'experience'],
      answer: 'Altared Alchemie is a faith-driven AI consultancy with 10+ years of expertise.\n\nWe help businesses, churches, and creators:\n• Build modern, AI-powered solutions\n• Automate workflows and save time\n• Scale content without sacrificing quality\n\nOur work is grounded in integrity, excellence, and ethical AI use. Want to learn more?'
    },
    'default': {
      keywords: [],
      answer: 'Thanks for your question! While I can help with general information, I\'d recommend:\n\n• <a href="/contact.html#schedule" target="_blank">Schedule a free 15-min consultation</a> for personalized answers\n• Email us at jlmiller12s@gmail.com\n• Check out our <a href="/resources.html" target="_blank">resources page</a>\n\nIs there anything else I can help you with?'
    }
  };

  // Greeting responses
  const greetings = {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answers: [
      'Hi there! 👋 How can I help you today?',
      'Hello! Welcome to Altared Alchemie. What can I assist you with?',
      'Hey! Great to see you. What would you like to know?'
    ]
  };

  // Create chatbot HTML
  function createChatbot() {
    const chatbotHTML = `
      <div id="aa-chatbot-container" class="aa-chatbot-hidden">
        <!-- Floating Button -->
        <button id="aa-chatbot-toggle" aria-label="Open chat">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="10" r="1" fill="currentColor"/>
            <circle cx="15" cy="10" r="1" fill="currentColor"/>
          </svg>
        </button>

        <!-- Chat Window -->
        <div id="aa-chatbot-window" class="aa-chatbot-window-hidden">
          <div class="aa-chatbot-header">
            <div class="aa-chatbot-header-content">
              <div class="aa-chatbot-avatar">AI</div>
              <div>
                <div class="aa-chatbot-title">${config.botName}</div>
                <div class="aa-chatbot-status">
                  <span class="aa-chatbot-status-dot"></span>
                  Online
                </div>
              </div>
            </div>
            <button id="aa-chatbot-close" aria-label="Close chat">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div id="aa-chatbot-messages" class="aa-chatbot-messages">
            <!-- Messages will be inserted here -->
          </div>

          <div class="aa-chatbot-quick-actions" id="aa-chatbot-quick-actions">
            <button class="aa-chatbot-quick-btn" data-message="What services do you offer?">Services</button>
            <button class="aa-chatbot-quick-btn" data-message="What are your prices?">Pricing</button>
            <button class="aa-chatbot-quick-btn" data-message="How do I contact you?">Contact</button>
          </div>

          <div class="aa-chatbot-input-container">
            <input 
              type="text" 
              id="aa-chatbot-input" 
              placeholder="Type your message..."
              aria-label="Chat message"
            />
            <button id="aa-chatbot-send" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div class="aa-chatbot-footer">
            Powered by Altared Alchemie AI
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  // Add message to chat
  function addMessage(message, isBot = false) {
    const messagesContainer = document.getElementById('aa-chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `aa-chatbot-message ${isBot ? 'aa-chatbot-message-bot' : 'aa-chatbot-message-user'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'aa-chatbot-message-content';
    messageContent.innerHTML = message.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Get bot response
  function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (greetings.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return greetings.answers[Math.floor(Math.random() * greetings.answers.length)];
    }
    
    // Check for specific topics
    for (const [key, data] of Object.entries(responses)) {
      if (key === 'default') continue;
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.answer;
      }
    }
    
    // Default response
    return responses.default.answer;
  }

  // Handle user message
  function handleUserMessage(message) {
    if (!message.trim()) return;
    
    // Add user message
    addMessage(message, false);
    
    // Clear input
    const input = document.getElementById('aa-chatbot-input');
    input.value = '';
    
    // Show typing indicator
    setTimeout(() => {
      const response = getBotResponse(message);
      addMessage(response, true);
    }, 500);
  }

  // Initialize chatbot
  function initChatbot() {
    createChatbot();
    
    const toggle = document.getElementById('aa-chatbot-toggle');
    const close = document.getElementById('aa-chatbot-close');
    const send = document.getElementById('aa-chatbot-send');
    const input = document.getElementById('aa-chatbot-input');
    const window = document.getElementById('aa-chatbot-window');
    const container = document.getElementById('aa-chatbot-container');
    
    // Toggle chat window
    toggle.addEventListener('click', () => {
      container.classList.remove('aa-chatbot-hidden');
      window.classList.remove('aa-chatbot-window-hidden');
      toggle.style.display = 'none';
      
      // Add welcome message if no messages yet
      const messagesContainer = document.getElementById('aa-chatbot-messages');
      if (messagesContainer.children.length === 0) {
        addMessage(config.placeholderMessages[0], true);
        setTimeout(() => {
          addMessage(config.placeholderMessages[1], true);
        }, 800);
      }
      
      input.focus();
    });
    
    // Close chat window
    close.addEventListener('click', () => {
      window.classList.add('aa-chatbot-window-hidden');
      setTimeout(() => {
        container.classList.add('aa-chatbot-hidden');
        toggle.style.display = 'flex';
      }, 300);
    });
    
    // Send message on button click
    send.addEventListener('click', () => {
      handleUserMessage(input.value);
    });
    
    // Send message on Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleUserMessage(input.value);
      }
    });
    
    // Quick action buttons
    const quickActions = document.querySelectorAll('.aa-chatbot-quick-btn');
    quickActions.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.getAttribute('data-message');
        handleUserMessage(message);
        
        // Hide quick actions after first use
        const actionsContainer = document.getElementById('aa-chatbot-quick-actions');
        actionsContainer.style.display = 'none';
      });
    });
  }

  // Start chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();

