(() => {
  let activeSelectId = null;

  document.querySelectorAll('[data-media-target]').forEach((button) => {
    button.addEventListener('click', () => {
      activeSelectId = button.getAttribute('data-media-target');
    });
  });

  document.querySelectorAll('.media-picker-option').forEach((button) => {
    button.addEventListener('click', () => {
      if (!activeSelectId) {
        return;
      }

      const select = document.getElementById(activeSelectId);
      if (!select) {
        return;
      }

      select.value = button.getAttribute('data-media-id');
      const modalElement = document.getElementById('mediaPickerModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    });
  });

  document.querySelectorAll('.admin-search-input').forEach((input) => {
    input.addEventListener('input', () => {
      const term = input.value.trim().toLowerCase();
      const targetSelector = input.getAttribute('data-filter-target');
      const keySelector = input.getAttribute('data-filter-key');

      document.querySelectorAll(targetSelector).forEach((card) => {
        const keyNode = card.querySelector(keySelector);
        const haystack = (keyNode?.textContent || card.textContent || '').toLowerCase();
        card.style.display = !term || haystack.includes(term) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton && form.checkValidity()) {
        submitButton.disabled = true;
        const label = submitButton.querySelector('.submit-label');
        if (label) {
          label.textContent = 'Saving...';
        }
      }

      form.classList.add('was-validated');
    });
  });
})();
