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

    processPromptTemplate: (promptTemplate) => {
        const processedPrompts = [];
        const variableRegex = /\[(.*?)\]/g;
        const matches = [...promptTemplate.matchAll(variableRegex)];

        if (matches.length === 0) {
            processedPrompts.push(promptTemplate);
            return processedPrompts;
        }

        let currentPrompts = [promptTemplate];
        matches.forEach(match => {
            const variableOptions = match[1].split(',').map(option => option.trim());
            const newPrompts = [];

            currentPrompts.forEach(prompt => {
                variableOptions.forEach(option => {
                    const newPrompt = prompt.replace(match[0], option);
                    newPrompts.push(newPrompt);
                });
            });

            currentPrompts = newPrompts;
        });

        return currentPrompts;
    }
};