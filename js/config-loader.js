/* ===== CONFIG LOADER ===== */

class ConfigLoader {
    constructor(configPath = 'config.json') {
        this.configPath = configPath;
        this.config = null;
    }

    async load() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) throw new Error(`Failed to load config: ${response.status}`);
            this.config = await response.json();
            return this.config;
        } catch (error) {
            console.error('ConfigLoader Error:', error);
            return null;
        }
    }

    getUrl(key) {
        return this.config?.urls[key] || '';
    }

    getText(key) {
        return this.config?.texts[key] || '';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        const configLoader = new ConfigLoader('config.json');
        const config = await configLoader.load();
        if (config) {
            console.log('Config loaded successfully:', config);
            window.configLoader = configLoader;
        }
    });
} else {
    const configLoader = new ConfigLoader('config.json');
    configLoader.load().then(config => {
        if (config) {
            console.log('Config loaded successfully:', config);
            window.configLoader = configLoader;
        }
    });
}
