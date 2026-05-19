// ===========================
// Common JS - Studio Ueji
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // --- Mobile Menu Toggle ---
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.header-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('open');
      nav.classList.toggle('open');
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all in same list
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Fade In Animation ---
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header?.offsetHeight || 60;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Target Tabs (Profile Page) ---
  document.querySelectorAll('.target-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.target-tabs-wrapper');
      if (!group) return;
      group.querySelectorAll('.target-tab').forEach(t => t.classList.remove('active'));
      group.querySelectorAll('.target-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // --- Form Modal ---
  window.openForm = (formId) => {
    const overlay = document.getElementById(formId);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeForm = (formId) => {
    const overlay = document.getElementById(formId);
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close on overlay click
  document.querySelectorAll('.form-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.form-overlay.active').forEach(overlay => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
});
