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
            console.log('MJ.Prompts initialized successfully');
        } catch (error) {
            console.error('Error initializing prompts:', error);
            MJ.Prompts.collections = {};
            MJ.Prompts.lastUsed = [];
        }
    },

    // Save prompts to storage
    save: () => {
        try {
            const data = {
                collections: MJ.Prompts.collections,
                lastUsed: MJ.Prompts.lastUsed
            };
            GM_setValue(MJ.Prompts.STORAGE_KEY, JSON.stringify(data));
            console.log('MJ.Prompts saved successfully');
        } catch (error) {
            console.error('Error saving prompts:', error);
        }
    },

    // Get all collections
    getAllCollections: () => {
        if (!MJ.Prompts.collections) {
            console.error('Collections not initialized');
            return {};
        }
        return MJ.Prompts.collections;
    },

    // Get a specific collection
    getCollection: (name) => {
        if (!MJ.Prompts.collections || !MJ.Prompts.collections[name]) {
            console.error(`Collection "${name}" not found`);
            return null;
        }
        return MJ.Prompts.collections[name];
    },

    // Add a new prompt collection
    addCollection: (name, prompts, description = '') => {
        try {
            if (!name || !prompts || !Array.isArray(prompts)) {
                console.error('Invalid collection data');
                return false;
            }

            MJ.Prompts.collections[name] = {
                prompts: prompts,
                description: description,
                created: Date.now(),
                lastUsed: Date.now()
            };
            MJ.Prompts.save();
            console.log(`Collection "${name}" added successfully`);
            return true;
        } catch (error) {
            console.error('Error adding collection:', error);
            return false;
        }
    },

    // Update an existing collection
    updateCollection: (name, prompts, description = null) => {
        try {
            if (!MJ.Prompts.collections[name]) {
                console.error(`Collection "${name}" not found`);
                return false;
            }

            MJ.Prompts.collections[name].prompts = prompts;
            if (description !== null) {
                MJ.Prompts.collections[name].description = description;
            }
            MJ.Prompts.collections[name].lastUsed = Date.now();
            MJ.Prompts.save();
            console.log(`Collection "${name}" updated successfully`);
            return true;
        } catch (error) {
            console.error('Error updating collection:', error);
            return false;
        }
    },

    // Delete a collection
    deleteCollection: (name) => {
        try {
            if (!MJ.Prompts.collections[name]) {
                console.error(`Collection "${name}" not found`);
                return false;
            }

            delete MJ.Prompts.collections[name];
            MJ.Prompts.save();
            console.log(`Collection "${name}" deleted successfully`);
            return true;
        } catch (error) {
            console.error('Error deleting collection:', error);
            return false;
        }
    },

    // Add a prompt to the last used list
    addToLastUsed: (prompt) => {
        try {
            if (!prompt) {
                console.error('Invalid prompt');
                return false;
            }

            MJ.Prompts.lastUsed.unshift(prompt);
            MJ.Prompts.lastUsed = MJ.Prompts.lastUsed.slice(0, 50); // Keep only last 50
            MJ.Prompts.save();
            console.log('Prompt added to last used list');
            return true;
        } catch (error) {
            console.error('Error adding to last used:', error);
            return false;
        }
    },

    // Get last used prompts
    getLastUsed: () => {
        if (!MJ.Prompts.lastUsed) {
            console.error('Last used list not initialized');
            return [];
        }
        return MJ.Prompts.lastUsed;
    },

    // Clear last used prompts
    clearLastUsed: () => {
        try {
            MJ.Prompts.lastUsed = [];
            MJ.Prompts.save();
            console.log('Last used list cleared');
            return true;
        } catch (error) {
            console.error('Error clearing last used:', error);
            return false;
        }
    }
};

// Initialize prompts when the module loads
MJ.Prompts.init(); 