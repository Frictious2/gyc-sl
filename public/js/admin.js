(() => {
  let activeSelectId = null;
  const editors = [];
  const plainTextNames = new Set([
    'meta_json',
    'footer_quick_links',
    'footer_program_links',
    'footer_get_involved_links',
    'footer_socials',
    'contact_socials',
    'contact_map_embed'
  ]);

  const syncEditorsForForm = (form) => {
    editors.forEach(({ textarea, editor }) => {
      if (form.contains(textarea)) {
        textarea.value = editor.getData();
      }
    });
  };

  const initWysiwygEditors = async () => {
    if (typeof window.ClassicEditor === 'undefined') {
      return;
    }

    const textareas = [...document.querySelectorAll('textarea')].filter((textarea) => {
      if (textarea.dataset.plainText === 'true') {
        return false;
      }

      if (plainTextNames.has(textarea.name)) {
        return false;
      }

      return true;
    });

    for (const textarea of textareas) {
      try {
        const editor = await window.ClassicEditor.create(textarea, {
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            '|',
            'insertTable',
            'undo',
            'redo'
          ]
        });

        editors.push({ textarea, editor });
      } catch (error) {
        console.error('Failed to initialize CKEditor:', textarea.name || textarea.id, error);
      }
    }
  };

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
      syncEditorsForForm(form);

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

  document.querySelectorAll('form').forEach((form) => {
    if (form.classList.contains('needs-validation')) {
      return;
    }

    form.addEventListener('submit', () => {
      syncEditorsForForm(form);
    });
  });

  document.querySelectorAll('[data-auto-submit]').forEach((element) => {
    element.addEventListener('change', () => {
      const form = element.closest('form');
      if (form) {
        form.requestSubmit();
      }
    });
  });

  initWysiwygEditors();
})();
