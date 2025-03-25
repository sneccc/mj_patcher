window.MJ = window.MJ || {};

MJ.Prompts = {
    // Storage key for prompts
    STORAGE_KEY: 'mj_saved_prompts',

    // Initialize prompts from storage
    init: () => {
        const savedPrompts = GM_getValue(MJ.Prompts.STORAGE_KEY, {
            collections: {},
            lastUsed: []
        });
        return savedPrompts;
    },

    // Save prompts to storage
    save: (prompts) => {
        GM_setValue(MJ.Prompts.STORAGE_KEY, prompts);
    },

    // Add a new prompt collection
    addCollection: (name, prompts, description = '') => {
        const savedPrompts = MJ.Prompts.init();
        savedPrompts.collections[name] = {
            prompts,
            description,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
        MJ.Prompts.save(savedPrompts);
    },

    // Update an existing collection
    updateCollection: (name, prompts, description = null) => {
        const savedPrompts = MJ.Prompts.init();
        if (savedPrompts.collections[name]) {
            savedPrompts.collections[name].prompts = prompts;
            if (description !== null) {
                savedPrompts.collections[name].description = description;
            }
            savedPrompts.collections[name].lastUsed = new Date().toISOString();
            MJ.Prompts.save(savedPrompts);
            return true;
        }
        return false;
    },

    // Delete a collection
    deleteCollection: (name) => {
        const savedPrompts = MJ.Prompts.init();
        if (savedPrompts.collections[name]) {
            delete savedPrompts.collections[name];
            MJ.Prompts.save(savedPrompts);
            return true;
        }
        return false;
    },

    // Get all collections
    getAllCollections: () => {
        const savedPrompts = MJ.Prompts.init();
        return savedPrompts.collections;
    },

    // Get a specific collection
    getCollection: (name) => {
        const savedPrompts = MJ.Prompts.init();
        return savedPrompts.collections[name];
    },

    // Add a prompt to the last used list
    addToLastUsed: (prompt) => {
        const savedPrompts = MJ.Prompts.init();
        // Remove if already exists
        savedPrompts.lastUsed = savedPrompts.lastUsed.filter(p => p !== prompt);
        // Add to beginning
        savedPrompts.lastUsed.unshift(prompt);
        // Keep only last 50 prompts
        savedPrompts.lastUsed = savedPrompts.lastUsed.slice(0, 50);
        MJ.Prompts.save(savedPrompts);
    },

    // Get last used prompts
    getLastUsed: () => {
        const savedPrompts = MJ.Prompts.init();
        return savedPrompts.lastUsed;
    },

    // Clear last used prompts
    clearLastUsed: () => {
        const savedPrompts = MJ.Prompts.init();
        savedPrompts.lastUsed = [];
        MJ.Prompts.save(savedPrompts);
    }
}; 