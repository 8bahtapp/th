console.log('✅ config-loader.js loaded');

class ConfigLoader {
    constructor(configPath = '/th/config.json') {
        this.configPath = configPath;
        this.config = null;
        this.load();
    }

    async load() {
        try {
            console.log('📥 Loading config from:', this.configPath);
            const response = await fetch(this.configPath);
            this.config = await response.json();
            console.log('✅ Config loaded');
        } catch (error) {
            console.error('❌ Config load error:', error);
        }
    }

    getUrl(key) {
        return this.config?.urls[key] || '';
    }
}

const configLoader = new ConfigLoader('/th/config.json');
window.configLoader = configLoader;
