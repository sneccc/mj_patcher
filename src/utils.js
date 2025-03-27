window.MJ = window.MJ || {};

// Define the core functions first, completely independent
const reverseString = (str) => str.split('').reverse().join('');
const deobfuscate = (str) => reverseString(str);
const kojima = deobfuscate('yenruojdim');

// Then create the Utils object using the pre-defined functions
MJ.Utils = {
    // Core functions
    reverseString,
    deobfuscate,
    kojima,
    
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    getRandomValue: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },

    processWildcards: (prompt) => {
        const wildcards = JSON.parse(GM_getResourceText('wildcards'));
        const wildcardRegex = /__(\w+)__/g;
        let processedPrompt = prompt;
        let match;

        while ((match = wildcardRegex.exec(prompt)) !== null) {
            const wildcardName = match[1];
            if (wildcards[wildcardName] && wildcards[wildcardName].values) {
                const randomValue = MJ.Utils.getRandomValue(wildcards[wildcardName].values);
                processedPrompt = processedPrompt.replace(match[0], randomValue);
            }
        }

        return processedPrompt;
    },

    processPromptTemplate: (promptTemplate) => {
        const processedPrompts = [];
        const variableRegex = /\[(.*?)\]/g;
        const matches = [...promptTemplate.matchAll(variableRegex)];

        if (matches.length === 0) {
            // If no variables, just process wildcards
            processedPrompts.push(MJ.Utils.processWildcards(promptTemplate));
            return processedPrompts;
        }

        let currentPrompts = [promptTemplate];
        matches.forEach(match => {
            const variableOptions = match[1].split(',').map(option => option.trim());
            const newPrompts = [];

            currentPrompts.forEach(prompt => {
                variableOptions.forEach(option => {
                    const newPrompt = prompt.replace(match[0], option);
                    // Process wildcards after variable substitution
                    newPrompts.push(MJ.Utils.processWildcards(newPrompt));
                });
            });

            currentPrompts = newPrompts;
        });

        return currentPrompts;
    }
};