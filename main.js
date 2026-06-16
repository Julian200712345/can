/* =====================================================================
   Hippe Vlaggenlijntjes — Algemene logica: uitschuifmenu & winkelwagen-teller
   ===================================================================== */

const CART_KEY = 'hippevlaggenlijntjes_cart';

/** Haal de winkelwagen op uit localStorage. */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

/** Sla de winkelwagen op in localStorage. */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

/** Werk het aantal-bolletje in de header bij. */
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/** Uitschuifmenu open/dicht (met overlay). */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  const closeBtn = document.querySelector('.nav-close');
  if (!toggle || !links) return;

  const open = () => {
    links.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    links.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  updateCartCount();
});
