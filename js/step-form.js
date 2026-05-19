// ===========================
// Step Form Engine
// ===========================
// ステップ形式フォーム。商品別ステップ定義対応。

class StepForm {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;

    this.steps = options.steps || [];
    this.productName = options.productName || '';
    this.config = options.config || {};
    this.onComplete = options.onComplete || (() => {});
    this.currentStep = 0;
    this.formData = {};

    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.container.className = 'sf-container';

    // Progress indicator
    const progress = document.createElement('div');
    progress.className = 'sf-progress';
    this.steps.forEach((step, i) => {
      const dot = document.createElement('div');
      dot.className = 'sf-dot';
      if (i < this.currentStep) dot.classList.add('sf-dot--done');
      if (i === this.currentStep) dot.classList.add('sf-dot--active');
      dot.innerHTML = `<span>${i + 1}</span>`;
      progress.appendChild(dot);
      if (i < this.steps.length - 1) {
        const line = document.createElement('div');
        line.className = 'sf-line';
        if (i < this.currentStep) line.classList.add('sf-line--done');
        progress.appendChild(line);
      }
    });
    this.container.appendChild(progress);

    // Step content
    const content = document.createElement('div');
    content.className = 'sf-content';
    const step = this.steps[this.currentStep];
    if (step && step.render) {
      step.render(content, this.formData, this);
    }
    this.container.appendChild(content);

    // Navigation
    const nav = document.createElement('div');
    nav.className = 'sf-nav';

    if (this.currentStep > 0 && !this.steps[this.currentStep].noBack) {
      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'btn btn-secondary sf-back';
      backBtn.textContent = '戻る';
      backBtn.onclick = () => this.prev();
      nav.appendChild(backBtn);
    }

    if (this.currentStep < this.steps.length - 1) {
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn btn-primary sf-next';
      nextBtn.textContent = this.steps[this.currentStep].nextLabel || '次へ';
      nextBtn.onclick = () => this.next();
      nav.appendChild(nextBtn);
    }

    this.container.appendChild(nav);
  }

  next() {
    const step = this.steps[this.currentStep];
    if (step.validate && !step.validate(this.formData)) return;
    if (step.collect) step.collect(this.formData);
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  goTo(stepIndex) {
    this.currentStep = stepIndex;
    this.render();
  }

  getData() {
    return { ...this.formData };
  }
}

// --- Helper: Build selection grid ---
function buildSelectionGrid(container, options) {
  const { title, items, fieldName, formData, multiple = false } = options;
  if (title) {
    const h = document.createElement('h3');
    h.className = 'sf-step-title';
    h.textContent = title;
    container.appendChild(h);
  }

  const grid = document.createElement('div');
  grid.className = 'sf-selection-grid';

  items.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sf-select-btn';
    btn.innerHTML = item.icon ? `<span class="sf-select-icon">${item.icon}</span>${item.label}` : item.label;

    const current = formData[fieldName];
    if (multiple) {
      if (Array.isArray(current) && current.includes(item.value)) btn.classList.add('sf-select-active');
    } else {
      if (current === item.value) btn.classList.add('sf-select-active');
    }

    btn.onclick = () => {
      if (multiple) {
        if (!formData[fieldName]) formData[fieldName] = [];
        const idx = formData[fieldName].indexOf(item.value);
        if (idx >= 0) formData[fieldName].splice(idx, 1);
        else formData[fieldName].push(item.value);
      } else {
        formData[fieldName] = item.value;
      }
      // Re-render buttons
      grid.querySelectorAll('.sf-select-btn').forEach(b => b.classList.remove('sf-select-active'));
      if (multiple) {
        (formData[fieldName] || []).forEach(v => {
          const active = Array.from(grid.querySelectorAll('.sf-select-btn')).find(
            b => b.dataset.value === v
          );
          if (active) active.classList.add('sf-select-active');
        });
      } else {
        btn.classList.add('sf-select-active');
      }
    };
    btn.dataset.value = item.value;
    grid.appendChild(btn);
  });

  container.appendChild(grid);
}

// --- Helper: Build form fields ---
function buildFormFields(container, fields, formData) {
  fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'sf-field';

    const label = document.createElement('label');
    label.className = 'sf-label';
    label.textContent = field.label;
    if (field.required) {
      const req = document.createElement('span');
      req.className = 'sf-required';
      req.textContent = '必須';
      label.appendChild(req);
    }
    group.appendChild(label);

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.className = 'form-textarea';
      input.rows = 4;
    } else if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-select';
      (field.options || []).forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value || opt;
        o.textContent = opt.label || opt;
        input.appendChild(o);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type || 'text';
      input.className = 'form-input';
    }
    input.name = field.name;
    input.placeholder = field.placeholder || '';
    if (formData[field.name]) input.value = formData[field.name];
    input.oninput = () => { formData[field.name] = input.value; };
    group.appendChild(input);

    container.appendChild(group);
  });
}

// --- Helper: Build confirm screen ---
function buildConfirmScreen(container, formData, labels) {
  const title = document.createElement('h3');
  title.className = 'sf-step-title';
  title.textContent = '入力内容の確認';
  container.appendChild(title);

  const table = document.createElement('div');
  table.className = 'sf-confirm-table';

  Object.entries(labels).forEach(([key, label]) => {
    if (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0)) return;
    const row = document.createElement('div');
    row.className = 'sf-confirm-row';
    const val = Array.isArray(formData[key]) ? formData[key].join(', ') : formData[key];
    row.innerHTML = `<span class="sf-confirm-label">${label}</span><span class="sf-confirm-value">${val}</span>`;
    table.appendChild(row);
  });

  container.appendChild(table);
}

// --- Helper: Build complete screen ---
function buildCompleteScreen(container, config) {
  container.innerHTML = `
    <div class="sf-complete">
      <div class="sf-complete-icon">✓</div>
      <h3 class="sf-complete-title">${config.completeTitle || '送信完了'}</h3>
      <p class="sf-complete-message">${config.completeMessage || 'お問い合わせありがとうございます。'}</p>
    </div>
  `;
}

window.StepForm = StepForm;
window.StepFormHelpers = { buildSelectionGrid, buildFormFields, buildConfirmScreen, buildCompleteScreen };
