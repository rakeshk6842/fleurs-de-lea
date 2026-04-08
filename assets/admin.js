document.addEventListener('DOMContentLoaded', () => {
  const SESSION_KEY = 'fleursAdminSession';
  const DEMO_USERNAME = 'admin';
  const DEMO_PASSWORD = 'fleurs2026';

  const loginView = document.querySelector('#login-view');
  const dashboardView = document.querySelector('#dashboard-view');
  const loginForm = document.querySelector('#login-form');
  const contentForm = document.querySelector('#content-form');
  const statusEl = document.querySelector('#admin-status');
  const logoutButton = document.querySelector('#logout-button');
  const resetButton = document.querySelector('#reset-button');
  const exportButton = document.querySelector('#export-button');
  const importButton = document.querySelector('#import-button');
  const importInput = document.querySelector('#import-json');

  const showStatus = (message, isError = false) => {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.textContent = message;
    statusEl.style.background = isError ? 'rgba(156, 61, 90, 0.12)' : 'rgba(47, 125, 87, 0.12)';
    statusEl.style.color = isError ? '#8a2345' : '#2f7d57';
  };

  const setView = (isLoggedIn) => {
    loginView.classList.toggle('hidden', isLoggedIn);
    dashboardView.classList.toggle('hidden', !isLoggedIn);
    if (isLoggedIn) populateForm();
  };

  const updatePreviews = () => {
    document.querySelectorAll('[data-preview]').forEach((preview) => {
      const field = contentForm.querySelector(`[name="${preview.dataset.preview}"]`);
      if (field && field.value) preview.src = field.value;
    });
  };

  const populateForm = () => {
    const content = window.FleursContent.getStoredContent();

    contentForm.querySelectorAll('[name]').forEach((field) => {
      if (field.type === 'file') return;
      const value = window.FleursContent.getValueByPath(content, field.name);
      field.value = typeof value === 'string' ? value : '';
    });

    updatePreviews();
  };

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginForm.querySelector('[name="username"]').value.trim();
    const password = loginForm.querySelector('[name="password"]').value.trim();

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setView(true);
      showStatus('Login successful. You can now update text, links, and hero images.');
    } else {
      showStatus('Incorrect login. Use the demo credentials shown on the page.', true);
    }
  });

  logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    setView(false);
  });

  document.querySelectorAll('[data-image-target]').forEach((input) => {
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const target = contentForm.querySelector(`[name="${input.dataset.imageTarget}"]`);
        if (target && typeof reader.result === 'string') {
          target.value = reader.result;
          updatePreviews();
          showStatus(`Image ready for ${input.dataset.imageTarget}. Save changes to apply it to the site.`);
        }
      };
      reader.readAsDataURL(file);
    });
  });

  contentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = window.FleursContent.getStoredContent();

    contentForm.querySelectorAll('[name]').forEach((field) => {
      if (field.type === 'file') return;
      window.FleursContent.setValueByPath(content, field.name, field.value.trim());
    });

    window.FleursContent.saveContent(content);
    window.FleursContent.applyContent();
    updatePreviews();
    showStatus('Changes saved. Refresh the public pages if they are already open.');
  });

  resetButton?.addEventListener('click', () => {
    if (!window.confirm('Reset all admin edits back to the current site defaults?')) return;
    window.FleursContent.resetContent();
    populateForm();
    window.FleursContent.applyContent();
    showStatus('The site has been reset to its default content.');
  });

  exportButton?.addEventListener('click', () => {
    const data = JSON.stringify(window.FleursContent.getStoredContent(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fleurs-de-lea-content.json';
    link.click();
    URL.revokeObjectURL(url);
    showStatus('Content backup exported.');
  });

  importButton?.addEventListener('click', () => {
    importInput?.click();
  });

  importInput?.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      window.FleursContent.saveContent(parsed);
      populateForm();
      window.FleursContent.applyContent();
      showStatus('Content backup imported successfully.');
    } catch {
      showStatus('The selected JSON file could not be imported.', true);
    }
  });

  setView(sessionStorage.getItem(SESSION_KEY) === 'true');
});
