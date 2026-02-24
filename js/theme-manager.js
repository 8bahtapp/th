/* ===== THEME MANAGER ===== */

class ThemeManager {
    constructor() {
        this.storageKey = '8baht_theme';
        this.themeAttribute = 'data-theme';
        this.transitionClass = 'theme-transition';
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemTheme = this.getSystemTheme();
        const theme = savedTheme || systemTheme;

        this.setTheme(theme, false);
        this.createToggleButton();
        this.watchSystemTheme();
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme, animate = true) {
        if (animate) {
            document.body.classList.add(this.transitionClass);
        }

        document.documentElement.setAttribute(this.themeAttribute, theme);
        localStorage.setItem(this.storageKey, theme);

        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }

        if (animate) {
            setTimeout(() => {
                document.body.classList.remove(this.transitionClass);
            }, 300);
        }
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute(this.themeAttribute) || 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme, true);
    }

    watchSystemTheme() {
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.storageKey)) {
                    this.setTheme(e.matches ? 'dark' : 'light', true);
                }
            });
        }
    }

    createToggleButton() {
        if (document.getElementById('theme-toggle-btn')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.innerHTML = document.documentElement.getAttribute(this.themeAttribute) === 'dark' ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-label', 'Toggle theme');
        toggleBtn.addEventListener('click', () => this.toggleTheme());

        const header = document.querySelector('.header-right');
        if (header) {
            header.insertBefore(toggleBtn, header.firstChild);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeManager();
    });
} else {
    new ThemeManager();
}
