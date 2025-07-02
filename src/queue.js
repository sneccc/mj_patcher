window.MJ = window.MJ || {};

MJ.Queue = {
    promptQueue: [],
    isProcessing: false,
    processingInterval: null,

    startQueueProcessing: () => {
        // Validate settings before starting
        if (!MJ.API.settings.userToken || MJ.API.settings.userToken.trim() === '') {
            MJ.UI.updateStatus('Error: Authentication token not set. Please go to Settings tab and paste your Midjourney cookie/token.');
            return;
        }

        if (!MJ.API.settings.channelId || MJ.API.settings.channelId.trim() === '') {
            MJ.UI.updateStatus('Error: Channel ID not set. Please go to Settings tab and enter your Midjourney channel ID.');
            return;
        }

        if (!MJ.Queue.processingInterval) {
            MJ.Queue.processQueue();
            MJ.Queue.processingInterval = setInterval(MJ.Queue.processQueue, 5000);
            MJ.UI.updateStatus('Queue processing started');
        }
    },

    stopQueueProcessing: () => {
        if (MJ.Queue.processingInterval) {
            clearInterval(MJ.Queue.processingInterval);
            MJ.Queue.processingInterval = null;
            MJ.UI.updateStatus('Queue processing stopped');
        }
    },

    processQueue: async () => {
        if (MJ.Queue.isProcessing || MJ.Queue.promptQueue.length === 0) {
            return;
        }

        // Check if system is blocked due to captcha/blocking detection
        if (MJ.API && MJ.API.canProcessQueue && !MJ.API.canProcessQueue()) {
            MJ.UI.updateStatus('🚨 Queue processing blocked due to captcha/blocking detection. Use MJ.API.setBlockedState(false) to resume when resolved.');
            MJ.Queue.stopQueueProcessing();
            return;
        }

        // Validate settings before starting to process
        if (!MJ.API.settings.userToken || MJ.API.settings.userToken.trim() === '') {
            MJ.UI.updateStatus('Error: Authentication token not set. Please go to Settings tab and paste your Midjourney cookie/token.');
            MJ.Queue.stopQueueProcessing();
            return;
        }

        if (!MJ.API.settings.channelId || MJ.API.settings.channelId.trim() === '') {
            MJ.UI.updateStatus('Error: Channel ID not set. Please go to Settings tab and enter your Midjourney channel ID.');
            MJ.Queue.stopQueueProcessing();
            return;
        }

        MJ.Queue.isProcessing = true;
        MJ.UI.updateStatus(`Processing queue: ${MJ.Queue.promptQueue.length} prompts remaining`);
        console.log('Processing prompt queue, remaining prompts:', MJ.Queue.promptQueue.length);

        try {
            const prompt = MJ.Queue.promptQueue.shift();
            MJ.UI.updateStatus(`Submitting prompt: ${prompt}`);

            // Add default parameters if not already included
            const fullPrompt = prompt.includes('--') ? prompt : `${prompt} ${MJ.API.settings.defaultParams}`;

            console.log('Attempting to submit prompt:', fullPrompt);
            const result = await MJ.API.submitPrompt(fullPrompt);

            // Add to last used prompts
            MJ.Prompts.addToLastUsed(prompt);

            MJ.UI.updateStatus(`Prompt submitted successfully: ${prompt}`);
            console.log('Midjourney API response:', result);

            // Use random delay between submissions
            const delay = MJ.Queue.getRandomDelay();
            MJ.UI.updateStatus(`Waiting ${(delay/1000).toFixed(1)} seconds before next submission...`);

            setTimeout(() => {
                MJ.Queue.isProcessing = false;
                MJ.Queue.processQueue();
            }, delay);
        } catch (error) {
            console.error('Error submitting prompt:', error);
            
            // Check if error message contains captcha/blocking indicators
            if (MJ.API && MJ.API.detectCaptchaOrBlocking && MJ.API.detectCaptchaOrBlocking(error.message)) {
                console.error('🚨 Captcha/blocking detected in queue processing error');
                MJ.API.handleCaptchaOrBlocking(error.message);
            } else {
                MJ.UI.updateStatus(`Error: ${error.message}`);
            }
            
            MJ.Queue.isProcessing = false;
        }
    },

    getRandomDelay: () => {
        return Math.floor(Math.random() * (MJ.API.settings.maxDelay - MJ.API.settings.minDelay + 1)) + MJ.API.settings.minDelay;
    },

    // Temporarily disabled collections functionality
    /*
    // Add prompts from a collection to the queue
    addCollectionToQueue: (collectionName) => {
        const collection = MJ.Prompts.getCollection(collectionName);
        if (collection) {
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...collection.prompts];
            MJ.UI.updateStatus(`Added ${collection.prompts.length} prompts from collection "${collectionName}" to queue`);
            return true;
        }
        return false;
    },
    */

    // Add last used prompts to the queue
    addLastUsedToQueue: () => {
        const lastUsed = MJ.Prompts.getLastUsed();
        if (lastUsed.length > 0) {
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...lastUsed];
            MJ.UI.updateStatus(`Added ${lastUsed.length} last used prompts to queue`);
            return true;
        }
        return false;
    }
}; 