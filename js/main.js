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
