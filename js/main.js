'use strict';
/* ===== MOBILE NAVIGATION ===== */
function initNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  function closeMenu() {
    navigation.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }
  toggle.addEventListener('click', function () {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(); toggle.focus();
    }
  });
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  navigation.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', closeMenu);
}
initNavigation();

/* ===== COLOUR THEME: storage can be disabled by browser privacy settings ===== */
function initTheme() {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('ember-theme') || 'dark'; } catch (error) { /* Keep the default. */ }
  function applyTheme(theme) {
    root.dataset.theme = theme === 'light' ? 'light' : 'dark';
    const light = root.dataset.theme === 'light';
    button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    button.setAttribute('aria-pressed', String(light));
    button.querySelector('.theme-symbol').textContent = light ? '☾' : '☼';
    document.querySelector('meta[name="theme-color"]').content = light ? '#f6f1e7' : '#171916';
  }
  applyTheme(savedTheme);
  button.addEventListener('click', function () {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('ember-theme', nextTheme); } catch (error) { /* Theme still works for this page. */ }
  });
}

/* ===== OPENING STATUS: always calculated in Jos time ===== */
function updateOpeningStatus() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos', weekday: 'short', hour: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());
  const weekday = parts.find(function (part) { return part.type === 'weekday'; }).value;
  const hour = Number(parts.find(function (part) { return part.type === 'hour'; }).value);
  const open = weekday !== 'Mon' && hour >= 12 && hour < 22;
  document.querySelectorAll('.opening-status').forEach(function (badge) {
    badge.textContent = open ? 'Open now · until 10 pm WAT' : 'Closed · Tue–Sun, noon–10 pm WAT';
  });
}

/* ===== MENU CATEGORY FILTERS: no library is used ===== */
function initMenuFilters() {
  const buttons = document.querySelectorAll('.filter-button');
  const cards = document.querySelectorAll('.menu-card');
  if (!buttons.length) return;
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      const category = button.dataset.filter;
      let visibleCount = 0;
      buttons.forEach(function (tab) {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(function (card) {
        const visible = category === 'all' || card.dataset.category === category;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      document.getElementById('filter-result').textContent = visibleCount + (visibleCount === 1 ? ' dish to discover' : ' dishes to discover');
    });
  });
}

/* ===== BACK TO TOP ===== */
function initBackToTop() {
  const button = document.querySelector('.back-top');
  function updateButton() { button.hidden = window.scrollY < 500; }
  window.addEventListener('scroll', updateButton, { passive: true });
  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  updateButton();
}
initTheme();
initMenuFilters();
initBackToTop();
updateOpeningStatus();
setInterval(updateOpeningStatus, 60000);
document.querySelectorAll('.current-year').forEach(function (element) { element.textContent = new Date().getFullYear(); });

/* ===== CONTACT FORM: validation only; no network request or stored message ===== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const fields = Array.from(form.querySelectorAll('input, textarea'));
  const success = document.getElementById('form-success');
  const message = document.getElementById('message');
  const counter = document.getElementById('message-count');
  const subject = new URLSearchParams(window.location.search).get('subject');
  if (subject) document.getElementById('subject').value = subject.slice(0, 120);

  function validateField(field) {
    const value = field.value.trim();
    let error = '';
    if (!value) error = 'Please enter your ' + ({ name: 'full name', email: 'email address', subject: 'subject', message: 'message' }[field.name]) + '.';
    else if (field.name === 'name' && value.length < 2) error = 'Your name needs at least 2 characters.';
    else if (field.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address, such as you@example.com.';
    else if (field.name === 'subject' && value.length < 3) error = 'Please use at least 3 characters for the subject.';
    else if (field.name === 'message' && value.length < 10) error = 'Please write at least 10 characters in your message.';
    else if (value.length > field.maxLength) error = 'Please shorten this field to ' + field.maxLength + ' characters.';
    document.getElementById(field.id + '-error').textContent = error;
    field.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  }

  function updateCharacterCount() {
    counter.textContent = message.value.length.toLocaleString('en-GB') + ' / 1,000 characters';
  }
  fields.forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      success.hidden = true;
      if (field.hasAttribute('aria-invalid')) validateField(field);
    });
  });
  message.addEventListener('input', updateCharacterCount);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    success.hidden = true;
    // Validate every field, even if an earlier one is invalid.
    const results = fields.map(validateField);
    if (results.some(function (valid) { return !valid; })) {
      fields.find(function (field) { return field.getAttribute('aria-invalid') === 'true'; }).focus();
      return;
    }
    const fullName = document.getElementById('name').value.trim();
    // textContent ensures names are treated as text, never executable HTML.
    success.textContent = 'Thanks, ' + fullName + '! Your message passed validation. (Demo site: no message was actually sent.) No table has been reserved.';
    form.reset();
    fields.forEach(function (field) {
      field.removeAttribute('aria-invalid');
      document.getElementById(field.id + '-error').textContent = '';
    });
    updateCharacterCount();
    success.hidden = false;
    success.focus();
  });
  updateCharacterCount();
}
initContactForm();
