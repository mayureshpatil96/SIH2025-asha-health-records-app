(function() {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
    });
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Basic i18n scaffold
  const translations = {
    hi: {
      'Empowering ASHA Workers with Digital Tools': 'डिजिटल साधनों से आशा कार्यकर्ताओं को सशक्त बनाना',
      'Get Started': 'शुरू करें',
      'Explore Features': 'विशेषताएँ देखें',
      'About the Platform': 'प्लेटफ़ॉर्म के बारे में',
      'Features': 'विशेषताएँ',
      'Login': 'लॉगिन',
      'Sign up': 'साइन अप'
    }
  };
  function applyI18n(lang) {
    const map = translations[lang];
    if (!map) return;
    document.querySelectorAll('h1, h2, h3, a.btn, .lead, .brand, nav a').forEach(el => {
      const text = el.textContent && el.textContent.trim();
      if (text && map[text]) {
        el.textContent = map[text];
      }
    });
  }
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    const savedLang = localStorage.getItem('lang') || 'en';
    langSelect.value = savedLang;
    if (savedLang !== 'en') applyI18n(savedLang);
    langSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      localStorage.setItem('lang', lang);
      location.reload();
    });
  }

  // Page-specific demo data
  if (window.page === 'dashboard') {
    const attendanceEl = document.getElementById('attendanceRate');
    const taskList = document.getElementById('taskList');
    if (attendanceEl) attendanceEl.textContent = '92%';
    if (taskList) {
      const tasks = [
        { title: 'Home visit - Ward 3', due: 'Today' },
        { title: 'Immunization camp prep', due: 'Tomorrow' },
        { title: 'ANC follow-up - Meera', due: 'Fri' }
      ];
      taskList.innerHTML = tasks.map(t => `<li><span>${t.title}</span><span class="muted">${t.due}</span></li>`).join('');
    }
  }

  if (window.page === 'admin') {
    // Render simple bar chart using CSS only
    const bars = [68, 75, 80, 60, 90];
    const chart = document.getElementById('perfBars');
    if (chart) {
      chart.innerHTML = bars.map(v => `<div class="bar" style="height:${v}%" title="${v}%"></div>`).join('');
    }
  }
})();


