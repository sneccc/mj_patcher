window.MJ = window.MJ || {};

MJ.Prompts = {
    // Storage key for prompts
    STORAGE_KEY: 'mj_saved_prompts',

    collections: {},
    lastUsed: [],

    // Initialize prompts from storage
    init: () => {
        try {
            const saved = GM_getValue(MJ.Prompts.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                MJ.Prompts.collections = parsed.collections || {};
                MJ.Prompts.lastUsed = parsed.lastUsed || [];
            }
        } catch (error) {
            console.error('Error initializing prompts:', error);
            MJ.Prompts.collections = {};
            MJ.Prompts.lastUsed = [];
        }
    },

    // Save prompts to storage
    save: () => {
        const data = {
            collections: MJ.Prompts.collections,
            lastUsed: MJ.Prompts.lastUsed
        };
        GM_setValue(MJ.Prompts.STORAGE_KEY, JSON.stringify(data));
    },

    // Add a new prompt collection
    addCollection: (name, prompts, description = '') => {
        MJ.Prompts.collections[name] = {
            prompts: prompts,
            description: description,
            created: Date.now(),
            lastUsed: Date.now()
        };
        MJ.Prompts.save();
        return true;
    },

    // Update an existing collection
    updateCollection: (name, prompts, description = null) => {
        if (MJ.Prompts.collections[name]) {
            MJ.Prompts.collections[name].prompts = prompts;
            if (description !== null) {
                MJ.Prompts.collections[name].description = description;
            }
            MJ.Prompts.collections[name].lastUsed = Date.now();
            MJ.Prompts.save();
            return true;
        }
        return false;
    },

    // Delete a collection
    deleteCollection: (name) => {
        if (MJ.Prompts.collections[name]) {
            delete MJ.Prompts.collections[name];
            MJ.Prompts.save();
            return true;
        }
        return false;
    },

    // Get all collections
    getAllCollections: () => {
        return MJ.Prompts.collections;
    },

    // Get a specific collection
    getCollection: (name) => {
        return MJ.Prompts.collections[name];
    },

    // Add a prompt to the last used list
    addToLastUsed: (prompt) => {
        MJ.Prompts.lastUsed.unshift(prompt);
        MJ.Prompts.lastUsed = MJ.Prompts.lastUsed.slice(0, 50); // Keep only last 50
        MJ.Prompts.save();
    },

    // Get last used prompts
    getLastUsed: () => {
        return MJ.Prompts.lastUsed;
    },

    // Clear last used prompts
    clearLastUsed: () => {
        MJ.Prompts.lastUsed = [];
        MJ.Prompts.save();
    }
};

// Initialize prompts when the module loads
MJ.Prompts.init(); 