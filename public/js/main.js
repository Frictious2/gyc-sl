document.querySelectorAll('.stat-value').forEach((element) => {
  const text = element.textContent.trim();
  const number = Number(text.replace(/[^\d]/g, ''));

  if (!number) {
    return;
  }

  let current = 0;
  const suffix = text.replace(/[\d]/g, '');
  const step = Math.ceil(number / 40);

  const tick = () => {
    current += step;

    if (current >= number) {
      element.textContent = `${number}${suffix}`;
      return;
    }

    element.textContent = `${current}${suffix}`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});

document.querySelectorAll('.needs-validation').forEach((form) => {
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }

    const isValid = form.checkValidity();
    if (isValid) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        const label = submitButton.querySelector('.submit-label');
        const submittingLabel = submitButton.getAttribute('data-submitting-label');
        if (label && submittingLabel) {
          label.textContent = submittingLabel;
        }
      }
    }

    form.classList.add('was-validated');
  });
});
