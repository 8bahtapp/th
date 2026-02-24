console.log('✅ theme-manager.js loaded');

class ThemeManager {
    constructor() {
        this.storageKey = '8baht_theme';
        this.themeAttribute = 'data-theme';
        this.init();
    }

    init() {
        console.log('✅ ThemeManager initializing');
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemTheme = this.getSystemTheme();
        const theme = savedTheme || systemTheme;
        
        this.setTheme(theme, false);
        this.createToggleButton();
        this.watchSystemTheme();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme, animate = true) {
        console.log('🎨 Setting theme:', theme);
        document.documentElement.setAttribute(this.themeAttribute, theme);
        localStorage.setItem(this.storageKey, theme);

        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute(this.themeAttribute) || 'light';
        this.setTheme(current === 'dark' ? 'light' : 'dark', true);
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

        const btn = document.createElement('button');
        btn.id = 'theme-toggle-btn';
        btn.className = 'theme-toggle-btn';
        btn.innerHTML = document.documentElement.getAttribute(this.themeAttribute) === 'dark' ? '☀️' : '🌙';
        btn.onclick = () => this.toggleTheme();

        const header = document.querySelector('.header-right');
        if (header) {
            header.insertBefore(btn, header.firstChild);
            console.log('✅ Theme toggle button created');
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeManager());
} else {
    new ThemeManager();
}
