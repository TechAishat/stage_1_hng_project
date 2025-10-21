const initNavigationToggle = () => {
  const navToggle = document.querySelector('[data-testid="test-nav-toggle"]');
  const navList = document.getElementById('primary-navigation');
  const siteNav = navToggle?.closest('.site-header__inner')?.querySelector('.site-nav');

  if (!navToggle || !navList) {
    return;
  }

  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav?.classList.remove('site-nav--visible');
  };

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    if (!isExpanded) {
      siteNav?.classList.add('site-nav--visible');
    } else {
      siteNav?.classList.remove('site-nav--visible');
    }
  });

  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 780) {
        closeNav();
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 780) {
      closeNav();
    }
  });
};

const initFooterYear = () => {
  const yearSpan = document.getElementById('footnote-year');

  if (!yearSpan) {
    return;
  }

  yearSpan.textContent = new Date().getFullYear();
};

const initCurrentTime = () => {
  const timeEl = document.getElementById('current-time');

  if (!timeEl) {
    return;
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const updateTime = () => {
    timeEl.textContent = formatTime(new Date());
  };

  updateTime();
  const timer = window.setInterval(updateTime, 60 * 1000);

  window.addEventListener(
    'beforeunload',
    () => {
      window.clearInterval(timer);
    },
    { once: true }
  );
};

const validateContactForm = (form) => {
  const nameInput = form.querySelector('[data-testid="test-contact-name"]');
  const emailInput = form.querySelector('[data-testid="test-contact-email"]');
  const subjectInput = form.querySelector('[data-testid="test-contact-subject"]');
  const messageInput = form.querySelector('[data-testid="test-contact-message"]');
  const successMessage = form.querySelector('[data-testid="test-contact-success"]');

  const errors = {
    name: form.querySelector('[data-testid="test-contact-error-name"]'),
    email: form.querySelector('[data-testid="test-contact-error-email"]'),
    subject: form.querySelector('[data-testid="test-contact-error-subject"]'),
    message: form.querySelector('[data-testid="test-contact-error-message"]'),
  };

  const resetErrors = () => {
    Object.values(errors).forEach((errorEl) => {
      if (!errorEl) {
        return;
      }
      errorEl.hidden = true;
      errorEl.textContent = '';
    });
    if (successMessage) {
      successMessage.hidden = true;
    }
  };

  const showError = (field, message) => {
    const errorEl = errors[field];
    if (!errorEl) {
      return;
    }
    errorEl.hidden = false;
    errorEl.textContent = message;
  };

  const isEmailValid = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    resetErrors();

    let hasError = false;
    let firstInvalidField = null;

    if (!nameInput.value.trim()) {
      hasError = true;
      showError('name', 'Please enter your full name.');
      if (!firstInvalidField) {
        firstInvalidField = nameInput;
      }
    }

    if (!emailInput.value.trim()) {
      hasError = true;
      showError('email', 'Email address is required.');
      if (!firstInvalidField) {
        firstInvalidField = emailInput;
      }
    } else if (!isEmailValid(emailInput.value.trim())) {
      hasError = true;
      showError('email', 'Please provide a valid email (name@example.com).');
      if (!firstInvalidField) {
        firstInvalidField = emailInput;
      }
    }

    if (!subjectInput.value.trim()) {
      hasError = true;
      showError('subject', 'Subject cannot be empty.');
      if (!firstInvalidField) {
        firstInvalidField = subjectInput;
      }
    }

    if (!messageInput.value.trim()) {
      hasError = true;
      showError('message', 'Please share your message.');
      if (!firstInvalidField) {
        firstInvalidField = messageInput;
      }
    } else if (messageInput.value.trim().length < 10) {
      hasError = true;
      showError('message', 'Message must be at least 10 characters long.');
      if (!firstInvalidField) {
        firstInvalidField = messageInput;
      }
    }

    if (hasError) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    form.reset();
    if (successMessage) {
      successMessage.hidden = false;
    }
  });
};

const initContactValidation = () => {
  const form = document.querySelector('[data-testid="test-contact-form"]');

  if (!form) {
    return;
  }

  validateContactForm(form);
};

const initApp = () => {
  initNavigationToggle();
  initFooterYear();
  initCurrentTime();
  initContactValidation();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
