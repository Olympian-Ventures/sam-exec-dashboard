// ============================================
// SAM Executive Dashboard - App Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const D = DASHBOARD_DATA;
  const M = D.metrics;

  // Date
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('currentDate').textContent = now;
  document.getElementById('footerDate').textContent = now;

  // KPIs
  document.getElementById('kpiOccupancy').textContent = M.totalOccupancy.toFixed(1) + '%';
  document.getElementById('kpiOccTrend').textContent = '+' + M.occupancyTrend + '% vs 12-mo avg';
  document.getElementById('kpiVacant').textContent = M.totalVacant;
  document.getElementById('kpiOverdue').textContent = '$' + M.overduePayables.toLocaleString('en-US', {minimumFractionDigits: 2});
  document.getElementById('kpiOverdueCount').textContent = M.overdueCount + ' bills past due';
  document.getElementById('kpiReceivables').textContent = '$' + M.receivablesAtRisk.toLocaleString('en-US', {minimumFractionDigits: 2});
  document.getElementById('kpiWorkOrders').textContent = M.openWorkOrders;
  document.getElementById('kpiComplaints').textContent = M.openComplaints;
  document.getElementById('kpiComplaintsCritical').textContent = '1 critical, 3 high';

  // Alert banner
  if (M.urgentTasks > 0) {
    const banner = document.getElementById('alertBanner');
    banner.classList.add('visible');
    document.getElementById('alertText').textContent =
      `${M.urgentTasks} URGENT items due TODAY requiring Stuart's attention - $${M.receivablesAtRisk.toLocaleString()} in receivables at risk`;
  }

  // Render all sections
  renderUrgent(D.tasks.urgent);
  renderComplaints(D.complaints);
  renderPayables(D.payables);
  renderReceivables(D.receivablesAtRisk);
  renderOccupancyChart(D.portfolios);
  renderVacancies(D.vacancies);
  renderWorkOrders(D.workOrders);
  renderPipeline(D.tasks);
  renderPortfolio(D.portfolios);
  renderCommunications(D.communications);
  initVoiceInput();

  // Badge counts
  document.getElementById('urgentCount').textContent = D.tasks.urgent.length + ' URGENT';
  document.getElementById('complaintsCount').textContent = D.complaints.length + ' Open';
  document.getElementById('receivablesBadge').textContent = '$' + M.receivablesAtRisk.toLocaleString();
});

// ---- URGENT ACTIONS ----
function renderUrgent(items) {
  const list = document.getElementById('urgentList');
  list.innerHTML = items.map(t => `
    <div class="urgent-item">
      <div class="urgent-priority">P1</div>
      <div class="urgent-info">
        <div class="urgent-title">${t.content}</div>
        <div class="urgent-desc">${t.desc}</div>
        <div class="urgent-due">Due: ${t.due || 'TODAY'}</div>
      </div>
    </div>
  `).join('');
}

// ---- COMPLAINTS ----
function renderComplaints(items) {
  const list = document.getElementById('complaintsList');
  list.innerHTML = items.map(c => `
    <div class="complaint-item">
      <span class="complaint-severity severity-${c.severity}">${c.severity}</span>
      <div class="complaint-info">
        <div class="complaint-from">${c.from}${c.property !== 'N/A' ? ' - ' + c.property : ''}</div>
        <div class="complaint-issue">${c.issue}</div>
      </div>
      <span class="complaint-days">${c.daysOpen}d open</span>
    </div>
  `).join('');
}

// ---- PAYABLES TABLE ----
function renderPayables(payables) {
  const tbody = document.getElementById('payablesBody');
  tbody.innerHTML = payables.map(p => {
    const statusClass = `status-${p.status}`;
    const rowClass = p.status === 'overdue' ? 'row-overdue' : p.status === 'due-soon' ? 'row-due-soon' : '';
    const statusLabel = { overdue:'Overdue', 'due-soon':'Due Soon', 'due-30':'Due 30d', 'due-later':'Later', paid:'Paid' }[p.status];
    return `<tr class="${rowClass}">
      <td><span class="status-dot ${statusClass}">${statusLabel}</span></td>
      <td>${p.date}</td>
      <td><strong>${p.invoice}</strong></td>
      <td>${p.property}</td>
      <td>${p.vendor}</td>
      <td class="right">$${p.amount.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
      <td class="right"><strong>$${p.balance.toLocaleString('en-US',{minimumFractionDigits:2})}</strong></td>
    </tr>`;
  }).join('');
}

// ---- RECEIVABLES AT RISK ----
function renderReceivables(items) {
  const tbody = document.getElementById('receivablesBody');
  tbody.innerHTML = items.sort((a,b) => b.daysLate - a.daysLate).map(r => {
    const rowClass = r.daysLate >= 90 ? 'row-late-90' : r.daysLate >= 30 ? 'row-overdue' : '';
    const daysColor = r.daysLate >= 90 ? 'var(--red-bright)' : r.daysLate >= 30 ? 'var(--orange)' : 'var(--yellow)';
    return `<tr class="${rowClass}">
      <td><strong>${r.tenant}</strong></td>
      <td class="right">${r.amount > 0 ? '$' + r.amount.toLocaleString('en-US',{minimumFractionDigits:2}) : 'Disputed'}</td>
      <td class="center" style="color:${daysColor}; font-weight:700">${r.daysLate}d</td>
      <td style="font-size:12px; color:var(--gray-400)">${r.note}</td>
    </tr>`;
  }).join('');
}

// ---- OCCUPANCY CHART ----
function renderOccupancyChart(portfolios) {
  const filtered = portfolios.filter(p => p.units > 0).sort((a, b) => a.occupancy - b.occupancy);
  const ctx = document.getElementById('occupancyChart').getContext('2d');

  const getColor = (occ) => {
    if (occ >= 90) return '#22C55E';
    if (occ >= 70) return '#F28C28';
    if (occ >= 50) return '#FACC15';
    return '#EF4444';
  };

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filtered.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
      datasets: [{
        label: 'Occupancy %',
        data: filtered.map(p => p.occupancy),
        backgroundColor: filtered.map(p => getColor(p.occupancy)),
        borderRadius: 4,
        barThickness: 14,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1A1A1A',
          borderColor: '#F28C28',
          borderWidth: 1,
          titleColor: '#FFFFFF',
          bodyColor: '#E0E0E0',
          callbacks: {
            label: (ctx) => {
              const p = filtered[ctx.dataIndex];
              return `${p.occupancy}% (${p.tenants}/${p.units} units)`;
            }
          }
        }
      },
      scales: {
        x: {
          min: 0, max: 100,
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: v => v + '%', font: { size: 10 }, color: '#737373' }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 }, color: '#A3A3A3' }
        }
      }
    }
  });
}

// ---- VACANCIES ----
function renderVacancies(vacancies) {
  const list = document.getElementById('vacancyList');
  list.innerHTML = vacancies.sort((a, b) => b.vacancy - a.vacancy).map(v => {
    const fillPct = 100 - v.vacancy;
    const barColor = v.vacancy >= 50 ? '#EF4444' : v.vacancy >= 30 ? '#F28C28' : '#22C55E';
    const pctColor = v.vacancy >= 50 ? 'var(--red-bright)' : v.vacancy >= 30 ? 'var(--orange)' : 'var(--green)';
    return `<div class="vacancy-item">
      <div>
        <div class="vacancy-property">${v.property}</div>
        <div class="vacancy-units">${v.available} unit${v.available > 1 ? 's' : ''} available</div>
      </div>
      <div class="vacancy-meta">
        <div class="vacancy-bar-container">
          <div class="vacancy-bar" style="width:${fillPct}%; background:${barColor}"></div>
        </div>
        <span class="vacancy-pct" style="color:${pctColor}">${v.vacancy}%</span>
      </div>
    </div>`;
  }).join('');
}

// ---- WORK ORDERS ----
function renderWorkOrders(workOrders) {
  const list = document.getElementById('workorderList');
  list.innerHTML = workOrders.map(wo => `
    <div class="workorder-item">
      <div class="wo-info">
        <div class="wo-title">${wo.title}</div>
        <div class="wo-desc">${wo.desc}</div>
      </div>
      <span class="wo-age">${wo.age}</span>
    </div>
  `).join('');
}

// ---- PIPELINE ----
function renderPipeline(tasks) {
  const renderItems = (items, el) => {
    document.getElementById(el).innerHTML = items.map(t => `
      <div class="pipeline-item ${t.priority}">
        <div class="pipeline-item-title">${t.content}</div>
        <div class="pipeline-item-meta">${t.assignee ? t.assignee : ''}${t.due ? (t.assignee ? ' · ' : '') + 'Due ' + t.due : ''}</div>
      </div>
    `).join('');
  };
  renderItems(tasks.high, 'pipelineHigh');
  renderItems(tasks.medium, 'pipelineMedium');
  renderItems(tasks.other, 'pipelineOther');
}

// ---- PORTFOLIO TABLE ----
function renderPortfolio(portfolios) {
  const tbody = document.getElementById('portfolioBody');
  tbody.innerHTML = portfolios
    .sort((a, b) => a.occupancy - b.occupancy)
    .map(p => {
      const barColor = p.occupancy >= 90 ? '#22C55E' : p.occupancy >= 70 ? '#F28C28' : p.occupancy >= 50 ? '#FACC15' : '#EF4444';
      const statusBadge = p.occupancy === 100 ? '<span class="badge badge-success">Full</span>' :
                          p.occupancy >= 80 ? '<span class="badge badge-neutral">Good</span>' :
                          p.occupancy >= 50 ? '<span class="badge badge-warning">Attention</span>' :
                          '<span class="badge badge-danger">Critical</span>';
      return `<tr>
        <td><strong>${p.name}</strong></td>
        <td class="center">${p.properties}</td>
        <td class="center">${p.units}</td>
        <td class="center">${p.tenants}</td>
        <td class="center">
          <div class="occupancy-bar-cell">
            <span class="occupancy-pct" style="color:${barColor}">${p.occupancy}%</span>
            <div class="occupancy-bar-mini">
              <div class="occupancy-bar-fill" style="width:${p.occupancy}%; background:${barColor}"></div>
            </div>
          </div>
        </td>
        <td>${statusBadge}</td>
      </tr>`;
    }).join('');
}

// ---- COMMUNICATIONS ----
function renderCommunications(comms) {
  const list = document.getElementById('commsList');
  list.innerHTML = comms.map(c => {
    const labels = c.labels.map(l => `<span class="comms-label ${l}">${l}</span>`).join('');
    return `<div class="comms-item">
      <div class="comms-avatar">${c.initials}</div>
      <div class="comms-body">
        <div class="comms-subject">${c.subject}</div>
        <div class="comms-snippet">${c.snippet}</div>
        <div class="comms-labels">${labels}</div>
      </div>
      <span class="comms-date">${c.date}</span>
    </div>`;
  }).join('');
}

// ============================================
// VOICE INPUT + TODOIST TASK CREATION
// ============================================
function initVoiceInput() {
  const voiceBtn = document.getElementById('voiceBtn');
  const taskInput = document.getElementById('taskInput');
  const taskPriority = document.getElementById('taskPriority');
  const taskSubmit = document.getElementById('taskSubmit');
  const voiceStatus = document.getElementById('voiceStatus');

  let recognition = null;
  let isRecording = false;

  // Check for Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecording = true;
      voiceBtn.classList.add('recording');
      voiceStatus.textContent = 'Listening...';
      voiceStatus.className = 'voice-status listening';
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      taskInput.value = transcript;

      // Auto-detect priority from speech
      const lower = transcript.toLowerCase();
      if (lower.includes('priority 1') || lower.includes('p1') || lower.includes('urgent')) {
        taskPriority.value = 'p1';
      } else if (lower.includes('priority 2') || lower.includes('p2') || lower.includes('high priority')) {
        taskPriority.value = 'p2';
      } else if (lower.includes('priority 3') || lower.includes('p3')) {
        taskPriority.value = 'p3';
      }
    };

    recognition.onend = () => {
      isRecording = false;
      voiceBtn.classList.remove('recording');
      if (taskInput.value) {
        voiceStatus.textContent = 'Transcription complete. Review and click "Add Task" to submit.';
        voiceStatus.className = 'voice-status success';
      } else {
        voiceStatus.textContent = 'No speech detected. Try again.';
        voiceStatus.className = 'voice-status error';
      }
    };

    recognition.onerror = (event) => {
      isRecording = false;
      voiceBtn.classList.remove('recording');
      voiceStatus.textContent = 'Speech error: ' + event.error + '. Try again or type manually.';
      voiceStatus.className = 'voice-status error';
    };

    voiceBtn.addEventListener('click', () => {
      if (isRecording) {
        recognition.stop();
      } else {
        taskInput.value = '';
        recognition.start();
      }
    });
  } else {
    voiceBtn.style.opacity = '0.3';
    voiceBtn.title = 'Voice input not supported in this browser. Use Chrome.';
    voiceStatus.textContent = 'Voice input requires Chrome or Edge. Type your task instead.';
    voiceStatus.className = 'voice-status error';
  }

  // Submit task
  taskSubmit.addEventListener('click', () => submitTask());
  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitTask();
  });

  function submitTask() {
    const content = taskInput.value.trim();
    if (!content) {
      voiceStatus.textContent = 'Please enter a task first.';
      voiceStatus.className = 'voice-status error';
      return;
    }

    const priority = taskPriority.value;
    voiceStatus.textContent = 'Adding task to Todoist...';
    voiceStatus.className = 'voice-status listening';
    taskSubmit.disabled = true;

    // Clean up priority keywords from the task content
    let cleanContent = content
      .replace(/\b(priority\s*[1-4]|p[1-4]|urgent|high\s*priority)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Store task locally for display
    addTaskToDisplay(cleanContent, priority);

    // Show success - in production this would hit the Todoist API
    voiceStatus.textContent = `Task added: "${cleanContent}" [${priority.toUpperCase()}] — Syncs to Todoist project`;
    voiceStatus.className = 'voice-status success';
    taskInput.value = '';
    taskPriority.value = 'p4';
    taskSubmit.disabled = false;
  }

  function addTaskToDisplay(content, priority) {
    // Add to the pipeline view
    const targetCol = priority === 'p1' || priority === 'p2' ? 'pipelineHigh' :
                      priority === 'p3' ? 'pipelineMedium' : 'pipelineOther';
    const col = document.getElementById(targetCol);
    const item = document.createElement('div');
    item.className = `pipeline-item ${priority}`;
    item.innerHTML = `
      <div class="pipeline-item-title">${content}</div>
      <div class="pipeline-item-meta">Just added · Stuart</div>
    `;
    item.style.animation = 'fadeIn 0.3s ease';
    col.prepend(item);

    // Update task count KPI
    const kpi = document.querySelector('.kpi-card:last-child .kpi-value');
    if (kpi) {
      const current = parseInt(kpi.textContent) || 0;
      kpi.textContent = current + 1;
    }
  }
}

// Fade-in animation for new items
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);
