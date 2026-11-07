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
