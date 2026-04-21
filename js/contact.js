/* ============================================================
   ICO — CONTACT FORM — Formspree Integration
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], textarea[required]');

  /* Live validation on blur/input */
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => validateField(input));
  });

  function validateField(field) {
    const val = field.value.trim();
    let valid = val.length > 0;
    if (field.type === 'email' && val) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    field.style.borderColor = valid ? 'var(--gold)' : '#e74c3c';
    field.classList.toggle('error', !valid);
    return valid;
  }

  function showStatus(message, isError = false) {
    let status = document.getElementById('formStatus');
    if (!status) {
      status = document.createElement('div');
      status.id = 'formStatus';
      status.style.cssText = `
        margin-top: 1rem;
        padding: 1rem 1.4rem;
        border-radius: 10px;
        font-size: 0.92rem;
        font-weight: 600;
        text-align: center;
      `;
      form.appendChild(status);
    }
    status.style.display  = 'block';
    status.style.background = isError ? 'rgba(231,76,60,0.12)' : 'rgba(46,204,113,0.12)';
    status.style.border     = isError ? '1px solid rgba(231,76,60,0.4)' : '1px solid rgba(46,204,113,0.4)';
    status.style.color      = isError ? '#e74c3c' : '#27ae60';
    status.innerHTML        = isError
      ? `<i class="fas fa-exclamation-circle"></i> ${message}`
      : `<i class="fas fa-check-circle"></i> ${message}`;
    if (!isError) setTimeout(() => { status.style.display = 'none'; }, 6000);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* Validate ALL fields first — stop here if any fail */
    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      showStatus('Please fill in all required fields correctly.', true);
      return; /* ← hard stop, never reaches fetch */
    }

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        showStatus('Your message has been sent! We will get back to you soon.');
        form.reset();
        inputs.forEach(i => { i.style.borderColor = ''; i.classList.remove('error'); });
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.innerHTML = original;
      btn.disabled = false;
      showStatus('Failed to send. Please email us directly at info@un-ico.org', true);
    }
  });
});
