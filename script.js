const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

// Mobile nav toggle
if (navToggle && siteNav) navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Simple fly‑in animation on scroll for section content
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.3 });

// animate every element inside each <section>
document.querySelectorAll('section *').forEach(el => {
  // ignore elements that are not visible or are structural with no size
  if (el.clientHeight === 0 && el.clientWidth === 0) return;
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Contact form submit — send to Formspree and show status
const CONTACT_FORMS = document.querySelectorAll('.contact-form');
CONTACT_FORMS.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusEl = form.querySelector('.form-status');
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    if (statusEl) statusEl.textContent = 'Sending...';

    try {
      const data = new FormData(form);
      const resp = await fetch(form.action, {
        method: form.method || 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });
      if (resp.ok) {
        if (statusEl) statusEl.textContent = 'Thanks! Your message has been sent.';
        form.reset();
      } else {
        const json = await resp.json();
        if (json && json.errors) {
          statusEl.textContent = json.errors.map(e=>e.message).join(', ');
        } else {
          statusEl.textContent = 'Oops! There was a problem submitting the form.';
        }
      }
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Network error. Please try again later.';
    }

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
});


function scrollPortfolio(direction, buttonElement) {
  // Find the portfolio-track closest to the clicked button
  const track = buttonElement.closest('.portfolio-stack-div').querySelector('.portfolio-track');
  if (track) {
    track.scrollBy({
      left: track.clientWidth * direction,
      behavior: 'smooth'
    });
  }
}