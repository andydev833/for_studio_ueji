// ===========================
// Tracking JS - Studio Ueji
// ===========================
// 分析要件用のトラッキングユーティリティ
// GA4やGTMを導入する際に活用できる構成

const StudioTracking = {
  // イベント送信
  sendEvent(category, action, label = '', value = 0) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Console log for development
    if (window.location.hostname === 'localhost') {
      console.log(`[Track] ${category} / ${action} / ${label}`, value);
    }
  },

  // CTAクリック計測
  trackCTA(buttonName, pageName) {
    this.sendEvent('cta_click', buttonName, pageName);
  },

  // フォーム到達計測
  trackFormOpen(formName) {
    this.sendEvent('form_open', formName);
  },

  // フォーム送信計測
  trackFormSubmit(formName) {
    this.sendEvent('form_submit', formName);
  },

  // ページビュー計測
  trackPageView(pageName) {
    this.sendEvent('page_view', pageName);
  },

  // セクション到達計測
  trackSectionView(sectionName) {
    this.sendEvent('section_view', sectionName);
  },
};

// CTA自動計測
document.addEventListener('DOMContentLoaded', () => {
  const pageName = document.body.dataset.page || 'unknown';

  // Track page view
  StudioTracking.trackPageView(pageName);

  // Track CTA clicks
  document.querySelectorAll('[data-track-cta]').forEach(btn => {
    btn.addEventListener('click', () => {
      StudioTracking.trackCTA(btn.dataset.trackCta, pageName);
    });
  });

  // Track section views
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionName = entry.target.dataset.trackSection;
        if (sectionName) {
          StudioTracking.trackSectionView(sectionName);
        }
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-track-section]').forEach(section => {
    sectionObserver.observe(section);
  });
});

export default StudioTracking;
