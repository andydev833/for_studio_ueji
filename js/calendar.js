// ===========================
// Calendar Component
// ===========================
// バニラJS製。月表示・空き日程・時間帯選択・第1〜第3希望対応

class StudioCalendar {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;

    this.mode = options.mode || 'shooting'; // 'shooting' | 'consultation'
    this.label = options.label || (this.mode === 'consultation' ? '相談日を選ぶ' : '撮影日を選ぶ');
    this.slotTimes = options.slotTimes || ['10:00', '13:00', '15:00'];
    this.closedDays = options.closedDays || [];
    this.blockedDates = (options.blockedDates || []).map(d => d.replace(/-/g, ''));
    this.maxPreferences = options.maxPreferences || 1;
    this.onSelect = options.onSelect || (() => {});

    this.today = new Date();
    this.currentMonth = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    this.selections = []; // [{date, time, pref}]

    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.container.classList.add('cal-container');

    // Header
    const header = document.createElement('div');
    header.className = 'cal-header';
    header.innerHTML = `
      <button class="cal-nav cal-prev" type="button">‹</button>
      <span class="cal-title">${this._formatMonth(this.currentMonth)}</span>
      <button class="cal-nav cal-next" type="button">›</button>
    `;
    this.container.appendChild(header);

    header.querySelector('.cal-prev').onclick = () => this._changeMonth(-1);
    header.querySelector('.cal-next').onclick = () => this._changeMonth(1);

    // Label
    const label = document.createElement('div');
    label.className = 'cal-label';
    label.textContent = this.label;
    this.container.appendChild(label);

    // Day names
    const dayNames = document.createElement('div');
    dayNames.className = 'cal-days';
    ['日', '月', '火', '水', '木', '金', '土'].forEach(d => {
      const span = document.createElement('span');
      span.textContent = d;
      span.className = 'cal-day-name';
      dayNames.appendChild(span);
    });
    this.container.appendChild(dayNames);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'cal-grid';
    this._buildGrid(grid);
    this.container.appendChild(grid);

    // Time slot area
    this.timeArea = document.createElement('div');
    this.timeArea.className = 'cal-time-area';
    this.container.appendChild(this.timeArea);

    // Selection summary
    this.summary = document.createElement('div');
    this.summary.className = 'cal-summary';
    this._updateSummary();
    this.container.appendChild(this.summary);
  }

  _buildGrid(grid) {
    const y = this.currentMonth.getFullYear();
    const m = this.currentMonth.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('span');
      empty.className = 'cal-cell cal-empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-cell';
      cell.textContent = d;

      const dateStr = `${y}${String(m + 1).padStart(2, '0')}${String(d).padStart(2, '0')}`;
      const isPast = date < new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
      const isClosed = this.closedDays.includes(date.getDay());
      const isBlocked = this.blockedDates.includes(dateStr);

      if (isPast || isClosed || isBlocked) {
        cell.classList.add('cal-disabled');
        cell.disabled = true;
      } else {
        cell.classList.add('cal-available');
        cell.onclick = () => this._selectDate(date);
      }

      // Highlight selected
      const sel = this.selections.find(s => s.date.toDateString() === date.toDateString());
      if (sel) {
        cell.classList.add('cal-selected');
        if (this.maxPreferences > 1) {
          cell.dataset.pref = sel.pref;
        }
      }

      if (date.getDay() === 0) cell.classList.add('cal-sunday');
      if (date.getDay() === 6) cell.classList.add('cal-saturday');

      grid.appendChild(cell);
    }
  }

  _selectDate(date) {
    this.selectedDate = date;
    this._showTimeSlots(date);
    this.render(); // Re-render to update highlights
    this._showTimeSlots(date); // Re-show after render
  }

  _showTimeSlots(date) {
    this.timeArea.innerHTML = '';
    this.timeArea.classList.add('cal-time-visible');

    const title = document.createElement('div');
    title.className = 'cal-time-title';
    title.textContent = `${date.getMonth() + 1}月${date.getDate()}日の${this.mode === 'consultation' ? '相談' : '撮影'}枠`;
    this.timeArea.appendChild(title);

    const slots = document.createElement('div');
    slots.className = 'cal-time-slots';

    const periods = { '午前': [], '午後': [], '夕方': [] };
    this.slotTimes.forEach(t => {
      const h = parseInt(t.split(':')[0]);
      if (h < 12) periods['午前'].push(t);
      else if (h < 16) periods['午後'].push(t);
      else periods['夕方'].push(t);
    });

    Object.entries(periods).forEach(([label, times]) => {
      if (times.length === 0) return;
      const group = document.createElement('div');
      group.className = 'cal-time-group';
      group.innerHTML = `<span class="cal-time-label">${label}</span>`;
      times.forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-time-btn';
        btn.textContent = t;
        const existing = this.selections.find(
          s => s.date.toDateString() === date.toDateString() && s.time === t
        );
        if (existing) btn.classList.add('cal-time-selected');
        btn.onclick = () => this._selectTimeSlot(date, t);
        group.appendChild(btn);
      });
      slots.appendChild(group);
    });

    this.timeArea.appendChild(slots);
  }

  _selectTimeSlot(date, time) {
    const existingIdx = this.selections.findIndex(
      s => s.date.toDateString() === date.toDateString() && s.time === time
    );

    if (existingIdx >= 0) {
      this.selections.splice(existingIdx, 1);
      this._reindex();
    } else if (this.selections.length < this.maxPreferences) {
      this.selections.push({
        date, time,
        pref: this.selections.length + 1,
        dateStr: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      });
    } else if (this.maxPreferences === 1) {
      this.selections = [{
        date, time, pref: 1,
        dateStr: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
      }];
    }

    this._showTimeSlots(date);
    this._updateSummary();
    this.onSelect(this.getSelections());
    // Update grid highlights
    const grid = this.container.querySelector('.cal-grid');
    if (grid) {
      grid.innerHTML = '';
      this._buildGrid(grid);
    }
  }

  _reindex() {
    this.selections.forEach((s, i) => { s.pref = i + 1; });
  }

  _updateSummary() {
    if (!this.summary) return;
    if (this.selections.length === 0) {
      this.summary.innerHTML = '<p class="cal-summary-empty">日程を選択してください</p>';
      return;
    }
    const prefLabels = ['第1希望', '第2希望', '第3希望'];
    this.summary.innerHTML = this.selections.map(s => {
      const label = this.maxPreferences > 1 ? `<span class="cal-pref-badge">${prefLabels[s.pref - 1]}</span>` : '';
      return `<div class="cal-summary-item">${label} ${s.dateStr} ${s.time}</div>`;
    }).join('');
  }

  getSelections() {
    return this.selections.map(s => ({
      date: s.dateStr,
      time: s.time,
      preference: s.pref,
    }));
  }

  _changeMonth(delta) {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + delta, 1
    );
    this.render();
  }

  _formatMonth(date) {
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
  }
}

window.StudioCalendar = StudioCalendar;
