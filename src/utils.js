window.MJ = window.MJ || {};

MJ.Utils = {
    // Obfuscation functions
    reverseString: (str) => str.split('').reverse().join(''),
    deobfuscate: (str) => MJ.Utils.reverseString(str),

    // Define the reference variable using reversed string
    kojima: (() => MJ.Utils.deobfuscate('yenruojdim'))(),

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