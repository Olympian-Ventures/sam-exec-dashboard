// ============================================
// SAM AI Assistant - Voice-Powered Dashboard Q&A
// No API key needed - runs entirely in-browser
// ============================================

(function() {
  'use strict';

  const AI = {
    isOpen: false,
    isListening: false,
    recognition: null,
    history: [],
    hasBarked: false,

    // ---- INITIALIZATION ----
    init() {
      this.createWidget();
      this.bindEvents();
      this.initSpeechRecognition();
      // Page-load bark — a quick, cute "I'm here!" bark
      this.playBark();
      // Welcome message after a short delay
      setTimeout(() => {
        this.addMessage('ai', "Hey Stuart — I'm your SAM assistant. Ask me anything about the portfolio. Try:\n• \"Who hasn't paid?\"\n• \"What's our occupancy?\"\n• \"Any urgent tasks?\"\n\nYou can type or tap the mic to speak.");
      }, 600);
    },

    // ---- BARK SOUND (synthesized via Web Audio API) ----
    playBark() {
      if (this.hasBarked) return;
      this.hasBarked = true;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;

        // --- Bark 1: short, bright "yip" ---
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(600, now);
        osc1.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc1.connect(gain1).connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // --- Bark 2: slightly lower follow-up "ruff" ---
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(480, now + 0.18);
        osc2.frequency.exponentialRampToValueAtTime(240, now + 0.28);
        gain2.gain.setValueAtTime(0.0001, now + 0.17);
        gain2.gain.linearRampToValueAtTime(0.15, now + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(now + 0.17);
        osc2.stop(now + 0.32);

        // Bounce the FAB to draw the eye
        const fab = document.getElementById('aiFab');
        if (fab) {
          fab.classList.add('bark-bounce');
          setTimeout(() => fab.classList.remove('bark-bounce'), 600);
        }

        // Clean up
        setTimeout(() => ctx.close(), 1000);
      } catch(e) { /* silent fail if audio not available */ }
    },

    // ---- CREATE WIDGET HTML ----
    createWidget() {
      // Floating trigger button
      const fab = document.createElement('button');
      fab.id = 'aiFab';
      fab.className = 'ai-fab';
      fab.innerHTML = `<span class="dog-face"><svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <!-- Friendly front-facing husky -->
        <!-- Left ear outer -->
        <polygon points="8,4 4,24 20,24" fill="#5B8DB8"/>
        <!-- Left ear inner -->
        <polygon points="8,8 7,21 17,22" fill="#93C5FD"/>
        <!-- Right ear outer -->
        <polygon points="56,4 60,24 44,24" fill="#5B8DB8"/>
        <!-- Right ear inner -->
        <polygon points="56,8 57,21 47,22" fill="#93C5FD"/>
        <!-- Head (dark outer fur) -->
        <ellipse cx="32" cy="34" rx="24" ry="22" fill="#5B8DB8"/>
        <!-- Face mask (white/light center — classic husky pattern) -->
        <path d="M32,16 Q40,18 42,26 Q42,34 38,40 L34,48 Q32,50 30,48 L26,40 Q22,34 22,26 Q24,18 32,16 Z" fill="#DBEAFE"/>
        <!-- Forehead blaze (light stripe up center) -->
        <path d="M32,14 Q36,16 36,20 Q34,24 32,24 Q30,24 28,20 Q28,16 32,14 Z" fill="#EFF6FF"/>
        <!-- Left eye (icy blue, husky-style) -->
        <ellipse cx="24" cy="28" rx="4" ry="4.5" fill="white"/>
        <circle cx="24" cy="28" r="3" fill="#38BDF8"/>
        <circle cx="24" cy="28" r="1.5" fill="#0c4a6e"/>
        <circle cx="25.2" cy="26.8" r="1" fill="white"/>
        <!-- Right eye -->
        <ellipse cx="40" cy="28" rx="4" ry="4.5" fill="white"/>
        <circle cx="40" cy="28" r="3" fill="#38BDF8"/>
        <circle cx="40" cy="28" r="1.5" fill="#0c4a6e"/>
        <circle cx="41.2" cy="26.8" r="1" fill="white"/>
        <!-- Eyebrow markings (darker fur above eyes) -->
        <path d="M18,23 Q21,20 26,22" stroke="#3d7aab" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M46,23 Q43,20 38,22" stroke="#3d7aab" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <!-- Nose -->
        <ellipse cx="32" cy="38" rx="4" ry="3" fill="#1e3a5f"/>
        <ellipse cx="32" cy="37" rx="2" ry="1" fill="#3d6080" opacity="0.5"/>
        <!-- Mouth - friendly smile -->
        <path d="M28,42 Q30,45 32,43 Q34,45 36,42" stroke="#1e3a5f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <!-- Tongue peeking out -->
        <ellipse cx="32" cy="45" rx="2.5" ry="3" fill="#F87171">
          <animate attributeName="ry" values="3;3.8;3" dur="1s" repeatCount="indefinite"/>
        </ellipse>
        <!-- Cheek fluff -->
        <path d="M10,32 Q6,38 10,44 Q14,46 18,44" fill="#5B8DB8"/>
        <path d="M54,32 Q58,38 54,44 Q50,46 46,44" fill="#5B8DB8"/>
      </svg></span>`;
      fab.title = 'Ask SAM AI Agent';
      document.body.appendChild(fab);

      // Chat panel
      const panel = document.createElement('div');
      panel.id = 'aiPanel';
      panel.className = 'ai-panel';
      panel.innerHTML = `
        <div class="ai-panel-header">
          <div class="ai-panel-title">
            <span class="ai-logo">AI</span>
            <span>SAM AI Agent</span>
          </div>
          <button class="ai-close" id="aiClose">&times;</button>
        </div>
        <div class="ai-messages" id="aiMessages"></div>
        <div class="ai-input-area">
          <button class="ai-mic-btn" id="aiMicBtn" title="Hold or click to speak">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
          <input type="text" id="aiInput" class="ai-input" placeholder="Ask about payments, tenants, tasks..." autocomplete="off">
          <button class="ai-send-btn" id="aiSendBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      `;
      document.body.appendChild(panel);
    },

    // ---- BIND EVENTS ----
    bindEvents() {
      const fab = document.getElementById('aiFab');
      const close = document.getElementById('aiClose');
      const input = document.getElementById('aiInput');
      const send = document.getElementById('aiSendBtn');
      const mic = document.getElementById('aiMicBtn');

      fab.addEventListener('click', () => this.toggle());
      close.addEventListener('click', () => this.toggle());
      send.addEventListener('click', () => this.handleUserInput());
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleUserInput();
      });
      mic.addEventListener('click', () => this.toggleVoice());

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.toggle();
      });
    },

    // ---- TOGGLE PANEL ----
    toggle() {
      this.isOpen = !this.isOpen;
      const panel = document.getElementById('aiPanel');
      const fab = document.getElementById('aiFab');
      panel.classList.toggle('open', this.isOpen);
      fab.classList.toggle('active', this.isOpen);
      if (this.isOpen) {
        setTimeout(() => document.getElementById('aiInput').focus(), 300);
      }
    },

    // ---- SPEECH RECOGNITION ----
    initSpeechRecognition() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      this.recognition = new SR();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        document.getElementById('aiMicBtn').classList.add('recording');
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        document.getElementById('aiInput').value = transcript;
        // If final result, auto-submit
        if (event.results[event.results.length - 1].isFinal) {
          setTimeout(() => this.handleUserInput(), 300);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        document.getElementById('aiMicBtn').classList.remove('recording');
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        document.getElementById('aiMicBtn').classList.remove('recording');
      };
    },

    toggleVoice() {
      if (!this.recognition) {
        this.addMessage('ai', "Voice input requires Chrome or Edge. Please type your question instead.");
        return;
      }
      if (this.isListening) {
        this.recognition.stop();
      } else {
        document.getElementById('aiInput').value = '';
        this.recognition.start();
      }
    },

    // ---- HANDLE USER INPUT ----
    handleUserInput() {
      const input = document.getElementById('aiInput');
      const q = input.value.trim();
      if (!q) return;
      input.value = '';

      this.addMessage('user', q);

      // Slight delay for natural feel
      const typing = this.addMessage('ai', '...', true);
      setTimeout(() => {
        const answer = this.processQuery(q);
        typing.querySelector('.ai-msg-text').innerHTML = this.formatAnswer(answer);
        this.scrollToBottom();
      }, 400);
    },

    // ---- ADD MESSAGE TO CHAT ----
    addMessage(role, text, isTyping = false) {
      const container = document.getElementById('aiMessages');
      const msg = document.createElement('div');
      msg.className = `ai-msg ai-msg-${role}`;
      msg.innerHTML = `<div class="ai-msg-text">${isTyping ? '<span class="ai-typing">●●●</span>' : this.formatAnswer(text)}</div>`;
      container.appendChild(msg);
      this.scrollToBottom();
      return msg;
    },

    formatAnswer(text) {
      // Convert newlines and bullet points to HTML
      return text
        .replace(/\n/g, '<br>')
        .replace(/• /g, '&bull; ');
    },

    scrollToBottom() {
      const msgs = document.getElementById('aiMessages');
      msgs.scrollTop = msgs.scrollHeight;
    },

    // ============================================
    // QUERY PROCESSING ENGINE
    // ============================================
    processQuery(q) {
      const D = DASHBOARD_DATA;
      const lower = q.toLowerCase();

      // ---- WHO HASN'T PAID / UNPAID / OVERDUE RECEIVABLES ----
      if (this.matchesAny(lower, ['who hasn', 'hasn\'t paid', 'havent paid', 'not paid', 'unpaid', 'outstanding balance', 'receivable', 'owe', 'owes', 'delinquent', 'late on pay', 'past due rent', 'overdue rent'])) {
        const items = D.receivablesAtRisk.filter(r => r.amount > 0).sort((a,b) => b.amount - a.amount);
        if (items.length === 0) return "All receivables are current — no one is past due right now.";
        const total = items.reduce((s,r) => s + r.amount, 0);
        let resp = `There are ${items.length} accounts with outstanding balances totaling $${total.toLocaleString('en-US', {minimumFractionDigits:2})}:\n\n`;
        items.forEach(r => {
          resp += `• ${r.tenant} — $${r.amount.toLocaleString('en-US', {minimumFractionDigits:2})} (${r.daysLate} days late). ${r.note}\n`;
        });
        const worst = items[0];
        resp += `\nBiggest risk: ${worst.tenant} at $${worst.amount.toLocaleString('en-US', {minimumFractionDigits:2})}. I'd prioritize that follow-up.`;
        return resp;
      }

      // ---- OCCUPANCY ----
      if (this.matchesAny(lower, ['occupancy', 'how full', 'occupied', 'vacancy rate', 'how many vacant', 'empty units', 'available units'])) {
        const occ = D.metrics.totalOccupancy;
        const vacant = D.metrics.totalVacant;
        const low = D.portfolios.filter(p => p.units > 0 && p.occupancy < 70).sort((a,b) => a.occupancy - b.occupancy);
        let resp = `Overall portfolio occupancy is ${occ.toFixed(1)}% with ${vacant} vacant units across all properties.`;
        if (low.length > 0) {
          resp += `\n\nProperties that need attention (below 70%):\n`;
          low.forEach(p => {
            resp += `• ${p.name} — ${p.occupancy}% occupied (${p.units - p.tenants} vacancies)\n`;
          });
        }
        const topVacancy = D.vacancies.sort((a,b) => b.available - a.available)[0];
        resp += `\nHighest vacancy: ${topVacancy.property} with ${topVacancy.available} available units (${topVacancy.vacancy}% vacant).`;
        return resp;
      }

      // ---- URGENT TASKS ----
      if (this.matchesAny(lower, ['urgent', 'critical task', 'p1', 'priority 1', 'what do i need to do', 'what needs attention', 'most important', 'top priority', 'what should i focus'])) {
        const urgent = D.tasks.urgent;
        if (urgent.length === 0) return "No urgent tasks right now — you're all caught up!";
        let resp = `You have ${urgent.length} urgent (P1) items due today:\n\n`;
        urgent.forEach((t, i) => {
          resp += `${i+1}. ${t.content}\n   ${t.desc}\n\n`;
        });
        resp += "These all need attention today. Want me to go into detail on any of them?";
        return resp;
      }

      // ---- ALL TASKS / TASK COUNT ----
      if (this.matchesAny(lower, ['how many task', 'task count', 'task list', 'open task', 'all task', 'my tasks', 'task pipeline', 'what\'s on my plate'])) {
        const t = D.tasks;
        const total = t.urgent.length + t.high.length + t.medium.length + t.other.length;
        let resp = `You have ${total} open tasks:\n\n`;
        resp += `• ${t.urgent.length} Urgent (P1) — due today\n`;
        resp += `• ${t.high.length} High Priority (P2)\n`;
        resp += `• ${t.medium.length} Medium Priority (P3)\n`;
        resp += `• ${t.other.length} Other / Training (P4)\n`;
        resp += `\nThe ${t.urgent.length} urgent items should be your focus right now.`;
        return resp;
      }

      // ---- OVERDUE BILLS / PAYABLES ----
      if (this.matchesAny(lower, ['overdue bill', 'overdue payable', 'what bills', 'unpaid bill', 'bills due', 'payable', 'what do we owe', 'accounts payable'])) {
        const overdue = D.payables.filter(p => p.status === 'overdue');
        const dueSoon = D.payables.filter(p => p.status === 'due-soon');
        const totalOverdue = overdue.reduce((s,p) => s + p.balance, 0);
        const totalDueSoon = dueSoon.reduce((s,p) => s + p.balance, 0);
        let resp = `Bills summary:\n\n`;
        resp += `Overdue: ${overdue.length} bills totaling $${totalOverdue.toLocaleString('en-US', {minimumFractionDigits:2})}\n`;
        overdue.forEach(p => {
          resp += `• ${p.vendor} — $${p.balance.toLocaleString('en-US', {minimumFractionDigits:2})} (${p.description}, ${p.property})\n`;
        });
        resp += `\nDue Soon: ${dueSoon.length} bills totaling $${totalDueSoon.toLocaleString('en-US', {minimumFractionDigits:2})}\n`;
        dueSoon.forEach(p => {
          resp += `• ${p.vendor} — $${p.balance.toLocaleString('en-US', {minimumFractionDigits:2})} (${p.description})\n`;
        });
        resp += `\nTotal outstanding across all payables: $${D.metrics.totalOutstanding.toLocaleString('en-US', {minimumFractionDigits:2})}`;
        return resp;
      }

      // ---- WORK ORDERS / MAINTENANCE ----
      if (this.matchesAny(lower, ['work order', 'maintenance', 'repair', 'fix', 'broken', 'open ticket'])) {
        const wo = D.workOrders;
        let resp = `There are ${D.metrics.openWorkOrders} open work orders. Here are the active ones:\n\n`;
        wo.forEach(w => {
          resp += `• ${w.title} — ${w.desc} (${w.age})\n`;
        });
        const oldest = wo[wo.length - 1];
        resp += `\nOldest open: "${oldest.title}" from ${oldest.age}. That one might need a follow-up.`;
        return resp;
      }

      // ---- COMPLAINTS / ISSUES ----
      if (this.matchesAny(lower, ['complaint', 'issue', 'problem', 'upset', 'angry', 'escalat', 'tenant issue', 'owner issue'])) {
        const complaints = D.complaints;
        let resp = `There are ${complaints.length} open issues:\n\n`;
        complaints.forEach(c => {
          const sev = c.severity.toUpperCase();
          resp += `• [${sev}] ${c.from}${c.property !== 'N/A' ? ' (' + c.property + ')' : ''} — ${c.issue} (${c.daysOpen} days)\n`;
        });
        const critical = complaints.filter(c => c.severity === 'critical');
        if (critical.length > 0) {
          resp += `\n⚠ Critical: ${critical[0].from} — ${critical[0].issue}. This has been open ${critical[0].daysOpen} days and needs immediate resolution.`;
        }
        return resp;
      }

      // ---- SPECIFIC PROPERTY SEARCH ----
      if (this.matchesAny(lower, ['about', 'tell me about', 'what about', 'status of', 'info on', 'details on', 'how is'])) {
        return this.searchProperty(lower);
      }

      // ---- SPECIFIC TENANT / PERSON SEARCH ----
      if (this.matchesAny(lower, ['where am i on', 'status on', 'update on', 'what happened with', 'any update', 'follow up'])) {
        return this.searchEverything(lower);
      }

      // ---- YE OLD FASHIONED (common specific query) ----
      if (this.matchesAny(lower, ['ye old', 'old fashioned'])) {
        const r = D.receivablesAtRisk.find(x => x.tenant.toLowerCase().includes('ye old'));
        if (r) return `Ye Old Fashioned owes $${r.amount.toLocaleString('en-US', {minimumFractionDigits:2})}. It's been ${r.daysLate} days since the February rent was sent with no reply. This is the largest single outstanding balance. I'd recommend a direct call or in-person visit.`;
        return "I don't have current data on Ye Old Fashioned.";
      }

      // ---- STEPH TASKS ----
      if (this.matchesAny(lower, ['steph', 'stephanie'])) {
        const allTasks = [...D.tasks.urgent, ...D.tasks.high, ...D.tasks.medium, ...D.tasks.other];
        const stephTasks = allTasks.filter(t => t.assignee && t.assignee.toLowerCase().includes('steph'));
        if (stephTasks.length === 0) return "No tasks are currently assigned to Steph.";
        let resp = `Steph has ${stephTasks.length} assigned tasks:\n\n`;
        stephTasks.forEach(t => {
          resp += `• [${t.priority.toUpperCase()}] ${t.content}\n`;
        });
        return resp;
      }

      // ---- STUART TASKS ----
      if (this.matchesAny(lower, ['stuart', 'my task', 'assigned to me'])) {
        const allTasks = [...D.tasks.urgent, ...D.tasks.high, ...D.tasks.medium, ...D.tasks.other];
        const stuartTasks = allTasks.filter(t => t.assignee && t.assignee.toLowerCase().includes('stuart'));
        if (stuartTasks.length === 0) {
          // Unassigned = Stuart's responsibility
          const unassigned = allTasks.filter(t => !t.assignee);
          return `${unassigned.length} tasks are unassigned (defaulting to you). The ${D.tasks.urgent.length} urgent P1 items need immediate attention today.`;
        }
        let resp = `Stuart has ${stuartTasks.length} directly assigned tasks:\n\n`;
        stuartTasks.forEach(t => {
          resp += `• [${t.priority.toUpperCase()}] ${t.content}\n`;
        });
        return resp;
      }

      // ---- SUMMARY / OVERVIEW ----
      if (this.matchesAny(lower, ['summary', 'overview', 'dashboard', 'how are we doing', 'give me the rundown', 'big picture', 'snapshot', 'brief me', 'morning brief', 'catch me up'])) {
        const M = D.metrics;
        let resp = `Here's your morning brief:\n\n`;
        resp += `📊 Occupancy: ${M.totalOccupancy.toFixed(1)}% (+${M.occupancyTrend}% vs 12-mo avg)\n`;
        resp += `🏠 Vacant Units: ${M.totalVacant}\n`;
        resp += `💰 Receivables at Risk: $${M.receivablesAtRisk.toLocaleString('en-US', {minimumFractionDigits:2})} (8 accounts)\n`;
        resp += `📋 Overdue Bills: $${M.overduePayables.toLocaleString('en-US', {minimumFractionDigits:2})} (${M.overdueCount} bills)\n`;
        resp += `🔧 Open Work Orders: ${M.openWorkOrders}\n`;
        resp += `⚠ Open Complaints: ${M.openComplaints} (1 critical)\n`;
        resp += `📌 Urgent Tasks: ${M.urgentTasks} due today\n`;
        resp += `\nTop priority: The ${M.urgentTasks} urgent tasks are all due today, and the $${M.receivablesAtRisk.toLocaleString()} in receivables needs attention.`;
        return resp;
      }

      // ---- MONEY / FINANCIAL ----
      if (this.matchesAny(lower, ['how much', 'total', 'money', 'financial', 'revenue', 'cash', 'balance'])) {
        const M = D.metrics;
        let resp = `Financial snapshot:\n\n`;
        resp += `• Overdue Payables: $${M.overduePayables.toLocaleString('en-US', {minimumFractionDigits:2})} (${M.overdueCount} bills)\n`;
        resp += `• Due Soon: $${M.dueSoonTotal.toLocaleString('en-US', {minimumFractionDigits:2})} (${M.dueSoonCount} bills)\n`;
        resp += `• Total Outstanding Payables: $${M.totalOutstanding.toLocaleString('en-US', {minimumFractionDigits:2})}\n`;
        resp += `• Receivables at Risk: $${M.receivablesAtRisk.toLocaleString('en-US', {minimumFractionDigits:2})}\n`;
        return resp;
      }

      // ---- CHURCH CREEK ----
      if (this.matchesAny(lower, ['church creek'])) {
        const portfolio = D.portfolios.find(p => p.name.toLowerCase().includes('church creek'));
        if (portfolio) {
          return `Church Creek Landing: ${portfolio.properties} properties, ${portfolio.units} units, ${portfolio.tenants} tenants, ${portfolio.occupancy}% occupancy. This is one of the lower-performing portfolios and needs leasing attention.`;
        }
      }

      // ---- QUEENSBOROUGH ----
      if (this.matchesAny(lower, ['queensborough'])) {
        const portfolios = D.portfolios.filter(p => p.name.toLowerCase().includes('queensborough'));
        const complaint = D.complaints.find(c => c.property.toLowerCase().includes('queensborough'));
        let resp = `Queensborough portfolios:\n\n`;
        portfolios.forEach(p => {
          resp += `• ${p.name} — ${p.occupancy}% occupied, ${p.units} units, ${p.tenants} tenants\n`;
        });
        if (complaint) {
          resp += `\n⚠ Active issue: ${complaint.from} reported a ${complaint.issue} (${complaint.daysOpen} days open, ${complaint.severity} severity)`;
        }
        return resp;
      }

      // ---- FALLBACK: SEARCH EVERYTHING ----
      const searchResult = this.searchEverything(lower);
      if (searchResult !== null) return searchResult;

      // ---- TRULY UNKNOWN ----
      return "I'm not sure about that one. Try asking about:\n• Payments and receivables\n• Occupancy and vacancies\n• Tasks and priorities\n• Work orders and maintenance\n• Complaints and issues\n• A specific property or tenant name\n• \"Give me a summary\"";
    },

    // ---- SEARCH ACROSS ALL DATA ----
    searchEverything(query) {
      const D = DASHBOARD_DATA;
      const results = [];

      // Extract potential search terms (remove common words)
      const stopWords = ['about', 'tell', 'me', 'what', 'where', 'am', 'i', 'on', 'the', 'any', 'update', 'status', 'of', 'how', 'is', 'are', 'do', 'we', 'have', 'with', 'for', 'a', 'an', 'to', 'in', 'at', 'and', 'or', 'but', 'not', 'no', 'so', 'can', 'you', 'it', 'this', 'that', 'get', 'give', 'info', 'details'];
      const words = query.toLowerCase().split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);

      if (words.length === 0) return null;
      const searchStr = words.join(' ');

      // Search receivables
      D.receivablesAtRisk.forEach(r => {
        if (this.fuzzyMatch(searchStr, r.tenant) || this.fuzzyMatch(searchStr, r.note)) {
          results.push(`💰 Receivable: ${r.tenant} — $${r.amount.toLocaleString('en-US', {minimumFractionDigits:2})}, ${r.daysLate} days late. ${r.note}`);
        }
      });

      // Search complaints
      D.complaints.forEach(c => {
        if (this.fuzzyMatch(searchStr, c.from) || this.fuzzyMatch(searchStr, c.issue) || this.fuzzyMatch(searchStr, c.property)) {
          results.push(`⚠ Complaint: ${c.from} — ${c.issue} (${c.daysOpen} days, ${c.severity})`);
        }
      });

      // Search tasks
      const allTasks = [...D.tasks.urgent, ...D.tasks.high, ...D.tasks.medium, ...D.tasks.other];
      allTasks.forEach(t => {
        if (this.fuzzyMatch(searchStr, t.content) || this.fuzzyMatch(searchStr, t.desc || '')) {
          results.push(`📌 Task [${t.priority.toUpperCase()}]: ${t.content}${t.desc ? ' — ' + t.desc : ''}`);
        }
      });

      // Search payables
      D.payables.forEach(p => {
        if (this.fuzzyMatch(searchStr, p.vendor) || this.fuzzyMatch(searchStr, p.property) || this.fuzzyMatch(searchStr, p.description)) {
          results.push(`📋 Payable: ${p.vendor} — $${p.balance.toLocaleString('en-US', {minimumFractionDigits:2})} (${p.status}, ${p.property})`);
        }
      });

      // Search work orders
      D.workOrders.forEach(w => {
        if (this.fuzzyMatch(searchStr, w.title) || this.fuzzyMatch(searchStr, w.desc)) {
          results.push(`🔧 Work Order: ${w.title} — ${w.desc} (${w.age})`);
        }
      });

      // Search portfolios
      D.portfolios.forEach(p => {
        if (this.fuzzyMatch(searchStr, p.name)) {
          results.push(`🏠 Portfolio: ${p.name} — ${p.occupancy}% occupied, ${p.units} units, ${p.tenants} tenants`);
        }
      });

      // Search vacancies
      D.vacancies.forEach(v => {
        if (this.fuzzyMatch(searchStr, v.property)) {
          results.push(`🏗 Vacancy: ${v.property} — ${v.available} units available (${v.vacancy}% vacant)`);
        }
      });

      if (results.length > 0) {
        let resp = `Found ${results.length} result${results.length > 1 ? 's' : ''}:\n\n`;
        results.forEach(r => { resp += `${r}\n\n`; });
        return resp.trim();
      }

      return null;
    },

    // ---- SEARCH PROPERTY SPECIFICALLY ----
    searchProperty(query) {
      const result = this.searchEverything(query);
      if (result) return result;
      return "I couldn't find anything matching that in the current data. Try a property name, tenant name, or vendor.";
    },

    // ---- HELPER: FUZZY MATCH ----
    fuzzyMatch(search, text) {
      if (!text) return false;
      const s = search.toLowerCase();
      const t = text.toLowerCase();
      // Direct substring
      if (t.includes(s)) return true;
      // Check each search word
      const words = s.split(/\s+/);
      return words.some(w => w.length > 2 && t.includes(w));
    },

    // ---- HELPER: MATCH ANY PATTERN ----
    matchesAny(text, patterns) {
      return patterns.some(p => text.includes(p));
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AI.init());
  } else {
    AI.init();
  }
})();
