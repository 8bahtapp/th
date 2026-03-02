console.log('theme-manager.js loaded');

class ThemeManager {
    constructor() {
        this.storageKey = '8baht_theme';
        this.themeAttribute = 'data-theme';
        this.init();
    }

    init() {
        console.log('ThemeManager initializing');
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemTheme = this.getSystemTheme();
        const theme = savedTheme || systemTheme;

        this.setTheme(theme, false);
        this.bindToggle();
        this.watchSystemTheme();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme) {
        document.documentElement.setAttribute(this.themeAttribute, theme);
        localStorage.setItem(this.storageKey, theme);

        // Sync UI toggle
        const toggle = document.getElementById('theme-toggle-switch');
        if (toggle) {
            toggle.classList.toggle('active', theme === 'dark');
        }
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute(this.themeAttribute) || 'light';
        this.setTheme(current === 'dark' ? 'light' : 'dark');
    }

    bindToggle() {
        const toggle = document.getElementById('theme-toggle-switch');
        if (!toggle) {
            console.warn('❌ theme-toggle-switch not found');
            return;
        }

        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // สำคัญ กัน product click hijack
            this.toggleTheme();
        });
    }

    watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

window.themeManager = new ThemeManager();