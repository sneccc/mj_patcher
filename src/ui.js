window.MJ = window.MJ || {};

MJ.UI = {
    wildcardKeys: [], // Store wildcard keys

    createUI: () => {
        // --- START WILDCARD LOADING ---
        try {
            const wildcardsData = JSON.parse(GM_getResourceText('wildcards'));
            MJ.UI.wildcardKeys = Object.keys(wildcardsData);
            console.log('Loaded wildcard keys:', MJ.UI.wildcardKeys);
        } catch (error) {
            console.error('Error loading wildcards.json resource:', error);
            MJ.UI.updateStatus('Error loading wildcard data. Autocomplete might not work.');
            // Ensure wildcardKeys is an array even if loading fails
            MJ.UI.wildcardKeys = MJ.UI.wildcardKeys || [];
        }
        // --- END WILDCARD LOADING ---

        // Create main container with cyberpunk theme
        const container = document.createElement('div');
        container.id = `${MJ.Utils.kojima}-prompt-manager`;
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            backgroundColor: '#0a0a0f',
            color: '#e6e6ff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(255,0,60,0.7), 0 0 30px rgba(255,0,60,0.4)',
            border: '1px solid #ff003c',
            width: '350px',
            fontFamily: '"Orbitron", "Rajdhani", sans-serif',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '80vh',
            overflowY: 'auto'
        });

        // Create header with cyberpunk style
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';
        header.style.cursor = 'move';
        header.style.padding = '8px 12px';
        header.style.backgroundColor = '#15151f';
        header.style.borderRadius = '4px';
        header.style.borderBottom = '2px solid #ff003c';
        header.style.textShadow = '0 0 5px #ff003c';

        const title = document.createElement('div');
        title.textContent = '> MJ SNECC_MOD v1.0';
        title.style.fontWeight = 'bold';
        title.style.letterSpacing = '1px';
        title.style.textTransform = 'uppercase';

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.background = 'none';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.color = '#ffdf00';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.fontSize = '20px';
        minimizeBtn.style.fontWeight = 'bold';
        minimizeBtn.style.textShadow = '0 0 5px #ffdf00';

        header.appendChild(title);
        header.appendChild(minimizeBtn);
        container.appendChild(header);

        // Content wrapper for minimize/maximize
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.flexDirection = 'column';
        contentWrapper.style.gap = '10px';
        container.appendChild(contentWrapper);

        // Create tabs with cyberpunk theme
        const tabsContainer = document.createElement('div');
        tabsContainer.style.display = 'flex';
        tabsContainer.style.borderBottom = '1px solid #ff003c';
        contentWrapper.appendChild(tabsContainer);

        const tabs = ['Prompts', 'Settings'];
        const tabContents = {};

        tabs.forEach(tabName => {
            const tab = document.createElement('div');
            tab.textContent = tabName.toUpperCase();
            tab.style.padding = '8px 12px';
            tab.style.cursor = 'pointer';
            tab.style.letterSpacing = '1px';
            tab.style.fontSize = '12px';
            tab.dataset.tab = tabName.toLowerCase();

            // Create content div for this tab
            const content = document.createElement('div');
            content.id = `mj-tab-${tabName.toLowerCase()}`;
            content.style.display = tabName === 'Prompts' ? 'block' : 'none';
            contentWrapper.appendChild(content);
            tabContents[tabName.toLowerCase()] = content;

            tab.addEventListener('click', () => {
                // Deactivate all tabs
                tabsContainer.querySelectorAll('div').forEach(t => {
                    t.style.borderBottom = 'none';
                    t.style.backgroundColor = 'transparent';
                    t.style.color = '#e6e6ff';
                    t.style.textShadow = 'none';
                });

                // Hide all content
                Object.values(tabContents).forEach(c => {
                    c.style.display = 'none';
                });

                // Activate clicked tab
                tab.style.borderBottom = '2px solid #ff003c';
                tab.style.backgroundColor = '#15151f';
                tab.style.color = '#ffdf00';
                tab.style.textShadow = '0 0 5px #ffdf00';

                // Show corresponding content
                tabContents[tab.dataset.tab].style.display = 'block';
            });

            tabsContainer.appendChild(tab);
        });

        // Activate first tab
        tabsContainer.querySelector('div').style.borderBottom = '2px solid #ff003c';
        tabsContainer.querySelector('div').style.backgroundColor = '#15151f';
        tabsContainer.querySelector('div').style.color = '#ffdf00';
        tabsContainer.querySelector('div').style.textShadow = '0 0 5px #ffdf00';

        // Prompts tab content
        const promptsTab = tabContents['prompts'];

        // Prompt input area
        const promptInput = document.createElement('textarea');
        promptInput.placeholder = 'Enter prompts here (one per line)\nUse [option1,option2,option3] for variables';
        promptInput.rows = 6;
        Object.assign(promptInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#15151f',
            color: '#e6e6ff',
            border: '1px solid #ff003c',
            borderRadius: '4px',
            resize: 'vertical',
            fontFamily: 'monospace',
            boxShadow: 'inset 0 0 5px rgba(255,0,60,0.5)'
        });
        promptsTab.appendChild(promptInput);

        // --- START WILDCARD AUTOCOMPLETE UI & LOGIC ---
        const suggestionsBox = document.createElement('div');
        suggestionsBox.id = 'mj-wildcard-suggestions';
        Object.assign(suggestionsBox.style, {
            display: 'none', // Hidden by default
            position: 'absolute', // Position relative to container or body if needed
            backgroundColor: '#15151f',
            border: '1px solid #ff003c',
            borderRadius: '4px',
            marginTop: '2px', // Space below the textarea
            maxHeight: '150px',
            overflowY: 'auto',
            zIndex: '10000', // Above other UI elements
            width: promptInput.offsetWidth + 'px', // Match textarea width initially
            boxShadow: '0 5px 10px rgba(0,0,0,0.5)'
        });
        // Insert suggestionsBox after promptInput in the DOM
        promptInput.parentNode.insertBefore(suggestionsBox, promptInput.nextSibling);

        let currentSuggestionIndex = -1; // Track highlighted suggestion

        const updateSuggestions = (searchTerm) => {
            const filteredKeys = MJ.UI.wildcardKeys.filter(key => key.startsWith(searchTerm));
            suggestionsBox.innerHTML = ''; // Clear previous suggestions
            currentSuggestionIndex = -1; // Reset selection index

            if (filteredKeys.length > 0) {
                filteredKeys.forEach((key, index) => {
                    const item = document.createElement('div');
                    item.textContent = `__${key}__`;
                    Object.assign(item.style, {
                        padding: '5px 8px',
                        cursor: 'pointer',
                        color: '#e6e6ff',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                    });

                    item.addEventListener('mouseover', () => {
                        // Remove highlight from others
                        Array.from(suggestionsBox.children).forEach(child => {
                            child.style.backgroundColor = 'transparent';
                            child.style.color = '#e6e6ff';
                        });
                        // Highlight current
                        item.style.backgroundColor = '#ffdf00';
                        item.style.color = '#0a0a0f';
                        currentSuggestionIndex = index;
                    });

                    item.addEventListener('click', () => {
                        insertWildcard(key);
                        suggestionsBox.style.display = 'none';
                    });

                    suggestionsBox.appendChild(item);
                });
                suggestionsBox.style.display = 'block';
                // Reposition below textarea
                suggestionsBox.style.top = (promptInput.offsetTop + promptInput.offsetHeight + 2) + 'px';
                suggestionsBox.style.left = promptInput.offsetLeft + 'px';
                suggestionsBox.style.width = promptInput.offsetWidth + 'px'; // Ensure width matches
            } else {
                suggestionsBox.style.display = 'none';
            }
        };

        const insertWildcard = (selectedKey) => {
            const cursorPosition = promptInput.selectionStart;
            const textBeforeCursor = promptInput.value.substring(0, cursorPosition);
            const match = textBeforeCursor.match(/__([a-zA-Z0-9_]*)$/); // Find __word starting right before cursor

            if (match) {
                const startIndex = match.index;
                const textAfterCursor = promptInput.value.substring(cursorPosition);
                const wildcardToInsert = `__${selectedKey}__`;

                promptInput.value = promptInput.value.substring(0, startIndex) + wildcardToInsert + textAfterCursor;

                // Set cursor position after the inserted wildcard
                const newCursorPosition = startIndex + wildcardToInsert.length;
                promptInput.focus(); // Refocus is necessary
                promptInput.setSelectionRange(newCursorPosition, newCursorPosition);
            }
             suggestionsBox.style.display = 'none'; // Hide after insertion
        };

        promptInput.addEventListener('input', () => {
            const cursorPosition = promptInput.selectionStart;
            const textBeforeCursor = promptInput.value.substring(0, cursorPosition);
            const match = textBeforeCursor.match(/__([a-zA-Z0-9_]*)$/); // Regex to find __ followed by word characters ending at cursor

            if (match) {
                const searchTerm = match[1]; // The part after __
                updateSuggestions(searchTerm);
            } else {
                suggestionsBox.style.display = 'none'; // Hide if pattern doesn't match
            }
        });

        promptInput.addEventListener('blur', () => {
             // Delay hiding slightly to allow click selection on suggestions
             setTimeout(() => {
                if (!suggestionsBox.matches(':hover')) { // Don't hide if mouse is over suggestions
                   suggestionsBox.style.display = 'none';
                }
             }, 150);
        });

        promptInput.addEventListener('keydown', (e) => {
            if (suggestionsBox.style.display === 'block' && suggestionsBox.children.length > 0) {
                const suggestions = Array.from(suggestionsBox.children);

                if (e.key === 'ArrowDown') {
                    e.preventDefault(); // Prevent cursor move in textarea
                    currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault(); // Prevent cursor move in textarea
                    currentSuggestionIndex = (currentSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                } else if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent newline in textarea
                    if (currentSuggestionIndex >= 0 && currentSuggestionIndex < suggestions.length) {
                        // Extract key from suggestion text: __key__ -> key
                        const selectedText = suggestions[currentSuggestionIndex].textContent;
                        const selectedKey = selectedText.substring(2, selectedText.length - 2);
                        insertWildcard(selectedKey);
                    }
                    return; // Exit after handling Enter
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    suggestionsBox.style.display = 'none';
                    return; // Exit after handling Escape
                } else {
                    // Allow typing other characters
                    return;
                }

                // Highlight the selected suggestion
                suggestions.forEach((item, index) => {
                    if (index === currentSuggestionIndex) {
                        item.style.backgroundColor = '#ffdf00';
                        item.style.color = '#0a0a0f';
                        // Scroll into view if necessary
                        item.scrollIntoView({ block: 'nearest' });
                    } else {
                        item.style.backgroundColor = 'transparent';
                        item.style.color = '#e6e6ff';
                    }
                });
            }
        });
         // Adjust suggestionsBox position/width on window resize
         window.addEventListener('resize', () => {
            if (suggestionsBox.style.display === 'block') {
                suggestionsBox.style.top = (promptInput.offsetTop + promptInput.offsetHeight + 2) + 'px';
                suggestionsBox.style.left = promptInput.offsetLeft + 'px';
                suggestionsBox.style.width = promptInput.offsetWidth + 'px';
            }
         });

        // --- END WILDCARD AUTOCOMPLETE UI & LOGIC ---

        // Example and help text
        const helpText = document.createElement('div');
        helpText.innerHTML = `
            <small>
                <div>Example with variables: "a photo of [cat,dog,bird] in [forest,beach,mountain]"</div>
                <div>Example with wildcards: "a __color__ __material__ object in a __location__ during __time__"</div>
                <div>Available wildcards: color, material, emotion, weather, time, location, style, lighting, camera</div>
            </small>
        `;
        helpText.style.color = '#8a8aaa';
        helpText.style.marginBottom = '10px';
        promptsTab.appendChild(helpText);

        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '8px';
        promptsTab.appendChild(buttonsContainer);

        // Create a styled button with cyberpunk theme
        const createButton = (text, onClick) => {
            const button = document.createElement('button');
            button.textContent = text.toUpperCase();
            Object.assign(button.style, {
                padding: '8px 12px',
                backgroundColor: '#ffdf00',
                color: '#000000',
                border: '1px solid #ff003c',
                borderRadius: '4px',
                cursor: 'pointer',
                flex: '1',
                fontWeight: 'bold',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 5px rgba(255,223,0,0.5)'
            });

            // Add hover effects
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#fff000';
                button.style.boxShadow = '0 0 10px rgba(255,223,0,0.8)';
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#ffdf00';
                button.style.boxShadow = '0 0 5px rgba(255,223,0,0.5)';
            });

            button.addEventListener('click', onClick);
            return button;
        };

        // Add buttons
        const processButton = createButton('Process Prompts', () => {
            const inputText = promptInput.value.trim();
            if (!inputText) {
                MJ.UI.updateStatus('Please enter at least one prompt');
                return;
            }

            // Validate settings before processing
            if (!MJ.API.settings.userToken || MJ.API.settings.userToken.trim() === '') {
                MJ.UI.updateStatus('Error: Authentication token not set. Please go to Settings tab and paste your Midjourney cookie/token.');
                return;
            }

            if (!MJ.API.settings.channelId || MJ.API.settings.channelId.trim() === '') {
                MJ.UI.updateStatus('Error: Channel ID not set. Please go to Settings tab and enter your Midjourney channel ID.');
                return;
            }

            console.log('Processing prompts from input:', inputText);

            // Split input by lines
            const promptTemplates = inputText.split('\n').filter(line => line.trim() !== '');
            console.log('Prompt templates:', promptTemplates);

            // Process each template for variable substitution
            let allPrompts = [];
            promptTemplates.forEach(template => {
                const processed = MJ.Utils.processPromptTemplate(template);
                allPrompts = [...allPrompts, ...processed];
            });

            // Shuffle the prompts before adding to queue
            allPrompts = MJ.Utils.shuffleArray(allPrompts);

            console.log('All processed prompts (randomized):', allPrompts);

            // Add to queue
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...allPrompts];

            MJ.UI.updateStatus(`Added ${allPrompts.length} randomized prompts to queue`);
            console.log(`Added ${allPrompts.length} randomized prompts to queue. Starting processing...`);
            MJ.Queue.startQueueProcessing();
        });

        const clearButton = createButton('Clear Queue', () => {
            MJ.Queue.promptQueue = [];
            MJ.UI.updateStatus('Queue cleared');
        });

        buttonsContainer.appendChild(processButton);
        buttonsContainer.appendChild(clearButton);

        // --- START BATCH PROCESSING ELEMENTS ---
        const batchContainer = document.createElement('div');
        batchContainer.style.display = 'flex';
        batchContainer.style.gap = '8px';
        batchContainer.style.marginTop = '8px'; // Add some space above
        batchContainer.style.alignItems = 'center';

        const batchLabel = document.createElement('label');
        batchLabel.textContent = 'Repeat:';
        batchLabel.style.fontSize = '12px';
        batchLabel.style.color = '#aaa';

        const batchCountInput = document.createElement('input');
        batchCountInput.type = 'number';
        batchCountInput.value = '5'; // Default repeat count
        batchCountInput.min = '1';
        Object.assign(batchCountInput.style, {
            width: '50px', // Smaller width for number input
            padding: '6px 8px',
            backgroundColor: '#15151f',
            color: '#e6e6ff',
            border: '1px solid #ff003c',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            boxShadow: 'inset 0 0 5px rgba(255,0,60,0.5)'
        });

        const batchProcessButton = createButton('Batch Process', () => {
            const inputText = promptInput.value.trim();
            const repeatCount = parseInt(batchCountInput.value, 10);

            if (!inputText) {
                MJ.UI.updateStatus('Please enter at least one prompt');
                return;
            }
            if (isNaN(repeatCount) || repeatCount < 1) {
                 MJ.UI.updateStatus('Please enter a valid number of repetitions (>= 1)');
                 batchCountInput.value = '1'; // Reset to minimum valid
                 return;
            }

            // Validate settings before processing
            if (!MJ.API.settings.userToken || MJ.API.settings.userToken.trim() === '') {
                MJ.UI.updateStatus('Error: Authentication token not set. Go to Settings tab.');
                return;
            }
            if (!MJ.API.settings.channelId || MJ.API.settings.channelId.trim() === '') {
                MJ.UI.updateStatus('Error: Channel ID not set. Go to Settings tab.');
                return;
            }

            console.log(`Batch processing ${repeatCount} times for input:`, inputText);

            // Split input by lines
            const promptTemplates = inputText.split('\n').filter(line => line.trim() !== '');
            console.log('Prompt templates:', promptTemplates);

            // Process each template N times for variable substitution
            let allBatchPrompts = [];
            for (let i = 0; i < repeatCount; i++) {
                promptTemplates.forEach(template => {
                    // Important: Process template anew each time to get different wildcard substitutions if applicable
                    const processed = MJ.Utils.processPromptTemplate(template);
                    allBatchPrompts = [...allBatchPrompts, ...processed];
                });
            }

            // Shuffle the entire batch of prompts before adding to queue
            allBatchPrompts = MJ.Utils.shuffleArray(allBatchPrompts);

            console.log(`All processed batch prompts (randomized, ${allBatchPrompts.length} total):`, allBatchPrompts);

            // Add to queue
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...allBatchPrompts];

            MJ.UI.updateStatus(`Added ${allBatchPrompts.length} randomized prompts (from ${repeatCount} batches) to queue`);
            console.log(`Added ${allBatchPrompts.length} randomized prompts to queue. Starting processing...`);
            MJ.Queue.startQueueProcessing();
        });

        // Style batch button to be less prominent or different? Maybe smaller flex?
        batchProcessButton.style.flex = '1'; // Match other buttons for now

        batchContainer.appendChild(batchLabel);
        batchContainer.appendChild(batchCountInput);
        batchContainer.appendChild(batchProcessButton); // Add button to batch container

        promptsTab.appendChild(batchContainer); // Add batch container to the tab

        // --- END BATCH PROCESSING ELEMENTS ---

        // Status display with cyberpunk style
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'mj-status';
        statusDisplay.textContent = '> SYSTEM READY';
        statusDisplay.style.marginTop = '10px';
        statusDisplay.style.padding = '8px';
        statusDisplay.style.backgroundColor = '#15151f';
        statusDisplay.style.borderRadius = '4px';
        statusDisplay.style.fontSize = '12px';
        statusDisplay.style.fontFamily = 'monospace';
        statusDisplay.style.borderLeft = '3px solid #ff003c';
        statusDisplay.style.color = '#00ff9d';
        promptsTab.appendChild(statusDisplay);

        // Queue display with cyberpunk style
        const queueContainer = document.createElement('div');
        queueContainer.style.marginTop = '10px';

        const queueTitle = document.createElement('div');
        queueTitle.textContent = '> QUEUE STATUS';
        queueTitle.style.fontWeight = 'bold';
        queueTitle.style.marginBottom = '5px';
        queueTitle.style.color = '#00ff9d';
        queueTitle.style.letterSpacing = '1px';
        queueContainer.appendChild(queueTitle);

        const queueDisplay = document.createElement('div');
        queueDisplay.id = 'mj-queue';
        queueDisplay.style.maxHeight = '150px';
        queueDisplay.style.overflowY = 'auto';
        queueDisplay.style.backgroundColor = '#15151f';
        queueDisplay.style.padding = '8px';
        queueDisplay.style.borderRadius = '4px';
        queueDisplay.style.fontSize = '12px';
        queueDisplay.style.fontFamily = 'monospace';
        queueDisplay.style.border = '1px solid #ff003c';
        queueContainer.appendChild(queueDisplay);

        promptsTab.appendChild(queueContainer);

        // Add prompt category buttons
        const loadPromptCategories = async () => {
            try {
                const categories = JSON.parse(GM_getResourceText('prompt_categories'));
                
                // Create a container for category buttons
                const categoryButtonsContainer = document.createElement('div');
                categoryButtonsContainer.style.marginTop = '10px';
                categoryButtonsContainer.style.marginBottom = '10px';
                promptsTab.insertBefore(categoryButtonsContainer, statusDisplay);

                // Create buttons for each category
                Object.entries(categories).forEach(([key, category]) => {
                    const button = createButton(`Queue ${category.name}`, () => {
                        // Get any additional parameters from the prompt input
                        const additionalParams = promptInput.value.trim();

                        // Process each prompt and add it to the queue
                        let processedPrompts = [];
                        category.prompts.forEach(prompt => {
                            // If there are additional parameters, append them to the prompt
                            const fullPrompt = additionalParams ? `${prompt} ${additionalParams}` : prompt;
                            // Process wildcards for each prompt
                            processedPrompts.push(MJ.Utils.processWildcards(fullPrompt));
                        });

                        // Shuffle the prompts before adding to queue
                        processedPrompts = MJ.Utils.shuffleArray(processedPrompts);

                        // Add all processed prompts to the queue
                        MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...processedPrompts];

                        // Update status
                        MJ.UI.updateStatus(`Added ${processedPrompts.length} randomized ${category.name.toLowerCase()} to queue`);
                        console.log(`Added ${processedPrompts.length} randomized ${category.name.toLowerCase()} to queue. Starting processing...`);

                        // Start processing if not already doing so
                        MJ.Queue.startQueueProcessing();
                    });

                    // Apply category-specific styling
                    button.style.backgroundColor = category.color;
                    button.style.boxShadow = `0 0 5px ${category.color}80`;
                    button.style.width = '100%';
                    button.style.marginTop = '5px';
                    button.style.marginBottom = '5px';

                    // Update hover effects for this specific button
                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = category.color;
                        button.style.boxShadow = `0 0 10px ${category.color}cc`;
                    });

                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = category.color;
                        button.style.boxShadow = `0 0 5px ${category.color}80`;
                    });

                    categoryButtonsContainer.appendChild(button);
                });
            } catch (error) {
                console.error('Error loading prompt categories:', error);
                MJ.UI.updateStatus('Error loading prompt categories');
            }
        };

        // Load prompt categories
        loadPromptCategories();

        // Settings tab content with cyberpunk theme
        const settingsTab = tabContents['settings'];

        // Add help text at the top of settings
        const settingsHelp = document.createElement('div');
        settingsHelp.innerHTML = `
            <div style="margin-bottom: 15px; padding: 10px; background-color: #15151f; border-radius: 4px; border-left: 3px solid #ff003c;">
                <strong style="color: #ffdf00; text-transform: uppercase; letter-spacing: 1px;">⚠️ Required Settings</strong>
                <p style="margin-top: 5px; font-size: 12px; line-height: 1.4; color: #e6e6ff;">
                You must configure both the ${MJ.Utils.kojima} Cookie/Token and Channel ID before submitting prompts.
                <br><br>
                    <strong style="color: #00ff9d;">Auto-Detection:</strong> The script will try to automatically detect your User ID and Channel ID from network requests.
                Simply browse ${MJ.Utils.kojima} normally, and the script will capture this information.
                <br><br>
                    <strong style="color: #00ff9d;">Manual Setup:</strong>
                <ol style="margin-top: 5px; padding-left: 20px; font-size: 12px;">
                    <li>Open DevTools (F12) in your browser while on ${MJ.Utils.kojima}</li>
                    <li>Go to the Network tab</li>
                    <li>Look for requests to "/users/queue?userId=" or "/submit-jobs"</li>
                    <li>The userId parameter contains your User ID</li>
                    <li>Your Channel ID is typically "singleplayer_" followed by your User ID</li>
                </ol>
            </p>
        </div>
        `;
        settingsTab.appendChild(settingsHelp);

        // Create a form field with cyberpunk theme
        const createFormField = (labelText, inputElement, description = '') => {
            const fieldContainer = document.createElement('div');
            fieldContainer.style.marginBottom = '12px';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.textTransform = 'uppercase';
            label.style.fontSize = '12px';
            label.style.letterSpacing = '1px';
            label.style.color = '#00ff9d';
            fieldContainer.appendChild(label);

            fieldContainer.appendChild(inputElement);

            if (description) {
                const desc = document.createElement('small');
                desc.textContent = description;
                desc.style.display = 'block';
                desc.style.color = '#8a8aaa';
                desc.style.marginTop = '3px';
                fieldContainer.appendChild(desc);
            }

            return fieldContainer;
        };

        // Token input with cyberpunk theme
        const tokenInput = document.createElement('textarea');
        tokenInput.id = 'mj-token-input';
        tokenInput.value = MJ.API.settings.userToken;
        tokenInput.rows = 4;
        // Fix the initial border color based on the current value
        const hasToken = tokenInput.value && tokenInput.value.trim() !== '';
        Object.assign(tokenInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#15151f',
            color: '#e6e6ff',
            border: hasToken ? '1px solid #00ff9d' : '1px solid #ff003c',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            boxShadow: 'inset 0 0 5px rgba(255,0,60,0.5)'
        });

        // Update both input and change events to catch all changes
        tokenInput.addEventListener('input', () => {
            MJ.API.settings.userToken = tokenInput.value.trim();
            tokenInput.style.border = MJ.API.settings.userToken ? '1px solid #00ff9d' : '1px solid #ff003c';
        });

        tokenInput.addEventListener('change', () => {
            MJ.API.settings.userToken = tokenInput.value.trim();
            tokenInput.style.border = MJ.API.settings.userToken ? '1px solid #00ff9d' : '1px solid #ff003c';
        });

        // Add a blur event to validate when focus leaves the field
        tokenInput.addEventListener('blur', () => {
            MJ.API.settings.userToken = tokenInput.value.trim();
            tokenInput.style.border = MJ.API.settings.userToken ? '1px solid #00ff9d' : '1px solid #ff003c';
        });

        settingsTab.appendChild(createFormField(`${MJ.Utils.kojima} Cookie/Token (Required)`, tokenInput, `Paste your ${MJ.Utils.kojima} authentication cookie here`));

        // User ID display (read-only)
        const userIdInput = document.createElement('input');
        userIdInput.id = 'mj-user-id-input';
        userIdInput.type = 'text';
        userIdInput.value = MJ.API.settings.userId;
        userIdInput.readOnly = true;
        Object.assign(userIdInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#333',
            color: '#aaa',
            border: '1px solid #444',
            borderRadius: '4px'
        });
        settingsTab.appendChild(createFormField('User ID (Auto-detected)', userIdInput, 'Your Midjourney user ID (automatically detected from network requests)'));

        // Channel ID input
        const channelIdInput = document.createElement('input');
        channelIdInput.id = 'mj-channel-id-input';
        channelIdInput.type = 'text';
        channelIdInput.value = MJ.API.settings.channelId || MJ.API.extractChannelId();
        // Fix the initial border color based on the current value
        const hasChannelId = channelIdInput.value && channelIdInput.value.trim() !== '';
        Object.assign(channelIdInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#333',
            color: 'white',
            border: hasChannelId ? '1px solid #4a5' : '1px solid #ff5555',
            borderRadius: '4px'
        });
        // Update both input and change events to catch all changes
        channelIdInput.addEventListener('input', () => {
            MJ.API.settings.channelId = channelIdInput.value.trim();
            channelIdInput.style.border = MJ.API.settings.channelId ? '1px solid #4a5' : '1px solid #ff5555';
        });
        channelIdInput.addEventListener('change', () => {
            MJ.API.settings.channelId = channelIdInput.value.trim();
            channelIdInput.style.border = MJ.API.settings.channelId ? '1px solid #4a5' : '1px solid #ff5555';
        });
        // Add a blur event to validate when focus leaves the field
        channelIdInput.addEventListener('blur', () => {
            MJ.API.settings.channelId = channelIdInput.value.trim();
            // Use green for valid values
            channelIdInput.style.border = MJ.API.settings.channelId ? '1px solid #4a5' : '1px solid #ff5555';
        });
        settingsTab.appendChild(createFormField('Channel ID (Required)', channelIdInput, 'Your Midjourney channel ID (e.g., "singleplayer_96da26f7-3a77-43a4-a725-7b141a4aedba")'));

        // Auto-detect button
        const autoDetectButton = createButton('Auto-Detect Settings', () => {
            MJ.UI.updateStatus('Waiting for Midjourney network activity...');

            // Try to extract from cookies
            const cookies = document.cookie;
            if (cookies.includes('__Host-Midjourney.AuthUserTokenV3') ||
                cookies.includes('cf_clearance')) {
                MJ.API.settings.userToken = cookies;
                tokenInput.value = MJ.API.settings.userToken;
                tokenInput.style.border = '1px solid #4a5';
                MJ.UI.updateStatus('Token extracted from cookies. Waiting for User ID...');
            }

            // Try to extract from JWT
            if (MJ.API.extractUserIdFromJWT()) {
                userIdInput.value = MJ.API.settings.userId;
                channelIdInput.value = MJ.API.settings.channelId;
                channelIdInput.style.border = '1px solid #4a5';
                MJ.UI.updateStatus('User ID and Channel ID extracted from JWT token!');
            } else {
                MJ.UI.updateStatus('Please browse Midjourney normally to auto-detect your User ID and Channel ID.');
            }
        });
        autoDetectButton.style.width = '100%';
        autoDetectButton.style.marginBottom = '15px';
        autoDetectButton.style.backgroundColor = '#5865f2';
        settingsTab.appendChild(autoDetectButton);

        // Default parameters input
        const defaultParamsInput = document.createElement('input');
        defaultParamsInput.type = 'text';
        defaultParamsInput.value = MJ.API.settings.defaultParams;
        Object.assign(defaultParamsInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px'
        });
        defaultParamsInput.addEventListener('change', () => {
            MJ.API.settings.defaultParams = defaultParamsInput.value.trim();
        });
        settingsTab.appendChild(createFormField('Default Parameters', defaultParamsInput, 'Parameters to append to all prompts (e.g., --v 6.1 --stylize 600)'));

        // Delay settings container
        const delayContainer = document.createElement('div');
        delayContainer.style.display = 'flex';
        delayContainer.style.gap = '10px';
        delayContainer.style.marginBottom = '12px';

        // Min delay input
        const minDelayInput = document.createElement('input');
        minDelayInput.type = 'number';
        minDelayInput.min = '0';
        minDelayInput.step = '0.1';
        minDelayInput.value = MJ.API.settings.minDelay / 1000;
        Object.assign(minDelayInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px'
        });
        minDelayInput.addEventListener('change', () => {
            const minSeconds = parseFloat(minDelayInput.value);
            const maxSeconds = parseFloat(maxDelayInput.value);
            
            if (minSeconds >= 0 && minSeconds <= maxSeconds) {
                MJ.API.settings.minDelay = Math.round(minSeconds * 1000);
                GM_setValue(`${MJ.Utils.kojima}_min_delay`, MJ.API.settings.minDelay);
            } else {
                minDelayInput.value = MJ.API.settings.minDelay / 1000;
            }
        });

        const minDelayField = createFormField('Min Delay (s)', minDelayInput, '');
        minDelayField.style.flex = '1';
        delayContainer.appendChild(minDelayField);

        // Max delay input
        const maxDelayInput = document.createElement('input');
        maxDelayInput.type = 'number';
        maxDelayInput.min = '0';
        maxDelayInput.step = '0.1';
        maxDelayInput.value = MJ.API.settings.maxDelay / 1000;
        Object.assign(maxDelayInput.style, {
            width: '100%',
            padding: '8px',
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '4px'
        });
        maxDelayInput.addEventListener('change', () => {
            const minSeconds = parseFloat(minDelayInput.value);
            const maxSeconds = parseFloat(maxDelayInput.value);
            
            if (maxSeconds >= minSeconds) {
                MJ.API.settings.maxDelay = Math.round(maxSeconds * 1000);
                GM_setValue(`${MJ.Utils.kojima}_max_delay`, MJ.API.settings.maxDelay);
            } else {
                maxDelayInput.value = MJ.API.settings.maxDelay / 1000;
            }
        });

        const maxDelayField = createFormField('Max Delay (s)', maxDelayInput, '');
        maxDelayField.style.flex = '1';
        delayContainer.appendChild(maxDelayField);

        settingsTab.appendChild(document.createElement('label')).textContent = 'Random Delay Between Submissions';
        const delayDescription = document.createElement('small');
        delayDescription.textContent = 'Set minimum and maximum delay (in seconds) between prompt submissions';
        delayDescription.style.display = 'block';
        delayDescription.style.color = '#aaa';
        delayDescription.style.marginBottom = '8px';
        settingsTab.appendChild(delayDescription);
        settingsTab.appendChild(delayContainer);

        // Add a "Test Connection" button
        const testConnectionButton = createButton('Test Connection', async () => {
            if (!MJ.API.settings.userToken || MJ.API.settings.userToken.trim() === '') {
                MJ.UI.updateStatus('Error: Authentication token not set. Please paste your Midjourney cookie/token.');
                tokenInput.style.border = '1px solid #ff5555';
                return;
            }

            if (!MJ.API.settings.channelId || MJ.API.settings.channelId.trim() === '') {
                MJ.UI.updateStatus('Error: Channel ID not set. Please enter your Midjourney channel ID.');
                channelIdInput.style.border = '1px solid #ff5555';
                return;
            }

            MJ.UI.updateStatus('Testing connection to Midjourney API...');

            try {
                // Use a simple test prompt
                const testPrompt = "test connection --test --v 0";
                await MJ.API.submitPrompt(testPrompt);
                MJ.UI.updateStatus('Connection successful! Your token and channel ID are working.');
                // Set both inputs to green to indicate success
                tokenInput.style.border = '1px solid #4a5';
                channelIdInput.style.border = '1px solid #4a5';
            } catch (error) {
                console.error('Connection test failed:', error);
                MJ.UI.updateStatus(`Connection test failed: ${error.message}`);
                // Highlight inputs in red
                tokenInput.style.border = '1px solid #ff5555';
                channelIdInput.style.border = '1px solid #ff5555';
            }
        });
        testConnectionButton.style.width = '100%';
        testConnectionButton.style.marginBottom = '15px';
        testConnectionButton.style.backgroundColor = '#4a5';
        settingsTab.appendChild(testConnectionButton);

        // Save settings button
        const saveSettingsButton = createButton('Save Settings', MJ.UI.saveSettings);
        saveSettingsButton.style.width = '100%';
        settingsTab.appendChild(saveSettingsButton);

        // Test Block Detection button
        const testBlockButton = createButton('🚨 Test Block Detection', () => {
            MJ.UI.updateStatus('Testing captcha/blocking detection system...');
            
            // Test with the exact error message you received
            const testMessage = "You have been temporarily blocked from accessing Midjourney. This automatic temporary time out happens on repeated or serious ToS violations.";
            
            console.log('🧪 Testing captcha detection with message:', testMessage);
            
            // Simulate the blocking detection and response
            const isDetected = MJ.API.detectCaptchaOrBlocking(testMessage);
            
            if (isDetected) {
                console.log('✅ Captcha detection working correctly - triggering full response...');
                MJ.UI.updateStatus('✅ Captcha detection test PASSED - Triggering blocking response...');
                
                // Trigger the full blocking response (this will stop queue, play sound, show alerts)
                setTimeout(() => {
                    MJ.API.handleCaptchaOrBlocking(testMessage);
                }, 1000); // Small delay to show the test passed message first
            } else {
                console.log('❌ Captcha detection test FAILED');
                MJ.UI.updateStatus('❌ Captcha detection test FAILED - Detection system not working properly');
                alert('❌ Test Failed: Captcha detection system is not working properly!');
            }
        });
        testBlockButton.style.width = '100%';
        testBlockButton.style.marginTop = '10px';
        testBlockButton.style.backgroundColor = '#ff6b35'; // Orange-red color for warning/test
        testBlockButton.style.border = '1px solid #ff003c';
        testBlockButton.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.5)';
        testBlockButton.title = 'Test the captcha/blocking detection system with a simulated error message';
        settingsTab.appendChild(testBlockButton);

        // Add a debug button in development mode
        const debugButton = createButton('Debug Connection', async () => {
            console.log('=== DEBUG INFORMATION ===');
            console.log('User Token Set:', !!MJ.API.settings.userToken);
            console.log('Channel ID:', MJ.API.settings.channelId);
            console.log('User ID:', MJ.API.settings.userId);
            console.log('Default Params:', MJ.API.settings.defaultParams);
            console.log('Queue Length:', MJ.Queue.promptQueue.length);
            console.log('Is Processing:', MJ.Queue.isProcessing);
            console.log('Processing Interval:', !!MJ.Queue.processingInterval);

            // Test direct fetch to MJ
            try {
                MJ.UI.updateStatus('Testing direct fetch to MJ API...');

                // Use the current default version from settings
                const testPrompt = `debug test --v ${MJ.API.settings.defaultVersion}`;
                const testPayload = {
                    "f": {
                        "mode": MJ.API.settings.requestMode,
                        "private": MJ.API.settings.requestPrivate
                    },
                    "channelId": MJ.API.settings.channelId,
                    "roomId": null,
                    "metadata": {
                        "isMobile": null,
                        "imagePrompts": 0,
                        "imageReferences": 0,
                        "characterReferences": 0,
                        "depthReferences": 0,
                        "lightboxOpen": null
                    },
                    "t": "imagine",
                    "prompt": testPrompt
                };

                console.log('Sending direct fetch with payload:', testPayload);

                const response = await fetch(MJ.API.API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'content-type': 'application/json',
                        'origin': `https://www.${MJ.Utils.kojima}.com`,
                        'referer': `https://www.${MJ.Utils.kojima}.com/explore`,
                        'x-csrf-protection': '1',
                        'cookie': MJ.API.settings.userToken
                    },
                    body: JSON.stringify(testPayload)
                });

                console.log('Direct fetch response status:', response.status);
                const responseData = await response.text();
                console.log('Direct fetch response:', responseData);

                try {
                    const jsonResponse = JSON.parse(responseData);
                    if (jsonResponse.failure && jsonResponse.failure.length > 0) {
                        MJ.UI.updateStatus(`API Error: ${jsonResponse.failure[0].message}`);
                    } else if (jsonResponse.success && jsonResponse.success.length > 0) {
                        MJ.UI.updateStatus('Test prompt submitted successfully!');
                    } else {
                        MJ.UI.updateStatus(`Direct fetch test completed with status: ${response.status}`);
                    }
                } catch (e) {
                    MJ.UI.updateStatus(`Direct fetch test completed with status: ${response.status}`);
                }
            } catch (error) {
                console.error('Direct fetch test failed:', error);
                MJ.UI.updateStatus(`Direct fetch test failed: ${error.message}`);
            }
        });

        debugButton.style.backgroundColor = '#555';
        debugButton.style.marginTop = '10px';
        promptsTab.appendChild(debugButton);

        // Make the UI draggable
        let isDragging = false;
        let dragOffsetX, dragOffsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragOffsetX = e.clientX - container.offsetLeft;
            dragOffsetY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                container.style.left = (e.clientX - dragOffsetX) + 'px';
                container.style.top = (e.clientY - dragOffsetY) + 'px';
                container.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Minimize/maximize functionality with cyberpunk animation
        let isMinimized = false;
        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            if (isMinimized) {
                contentWrapper.style.display = 'none';
                minimizeBtn.textContent = '+';
                container.style.height = 'auto';
                container.style.boxShadow = '0 0 10px rgba(255,0,60,0.5)';
            } else {
                contentWrapper.style.display = 'flex';
                minimizeBtn.textContent = '−';
                container.style.height = '';
                container.style.boxShadow = '0 0 15px rgba(255,0,60,0.7), 0 0 30px rgba(255,0,60,0.4)';
            }
        });

        // Add the container to the page
        document.body.appendChild(container);

        // Update queue display with cyberpunk styling and hover functionality
        setInterval(() => {
            const queueElement = document.getElementById('mj-queue');
            if (queueElement) {
                if (MJ.Queue.promptQueue.length === 0) {
                    queueElement.innerHTML = '<em style="color: #8a8aaa;">Queue is empty</em>';
                } else {
                    queueElement.innerHTML = MJ.Queue.promptQueue.map((prompt, index) =>
                        `<div style="margin-bottom:5px;border-bottom:1px solid #ff003c;padding-bottom:5px;color:#00ff9d;"
                            title="${prompt}">
                            > ${index + 1}. ${prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}
                        </div>`
                    ).join('');
                }
            }
        }, 1000);

        // Add prompt management section
        const promptManagementContainer = document.createElement('div');
        promptManagementContainer.style.marginTop = '20px';
        promptManagementContainer.style.borderTop = '1px solid #ff003c';
        promptManagementContainer.style.paddingTop = '10px';

        // Temporarily disabled collections UI
        /*
        // Add collection management section
        const collectionSection = document.createElement('div');
        collectionSection.style.marginBottom = '15px';

        // Collection name input
        const collectionNameInput = document.createElement('input');
        collectionNameInput.type = 'text';
        collectionNameInput.placeholder = 'Collection name';
        collectionNameInput.style.width = '100%';
        collectionNameInput.style.marginBottom = '5px';
        collectionNameInput.style.backgroundColor = '#1a1a2e';
        collectionNameInput.style.border = '1px solid #ff003c';
        collectionNameInput.style.color = '#00ff9d';
        collectionNameInput.style.padding = '5px';

        // Collection description input
        const collectionDescInput = document.createElement('input');
        collectionDescInput.type = 'text';
        collectionDescInput.placeholder = 'Collection description (optional)';
        collectionDescInput.style.width = '100%';
        collectionDescInput.style.marginBottom = '5px';
        collectionDescInput.style.backgroundColor = '#1a1a2e';
        collectionDescInput.style.border = '1px solid #ff003c';
        collectionDescInput.style.color = '#00ff9d';
        collectionDescInput.style.padding = '5px';

        // Save collection button
        const saveCollectionButton = createButton('Save Current Prompts as Collection', () => {
            const name = collectionNameInput.value.trim();
            if (!name) {
                MJ.UI.updateStatus('Please enter a collection name');
                return;
            }

            const description = collectionDescInput.value.trim();
            const currentPrompts = promptInput.value.split('\n').filter(p => p.trim());
            
            if (currentPrompts.length === 0) {
                MJ.UI.updateStatus('No prompts to save');
                return;
            }

            MJ.Prompts.addCollection(name, currentPrompts, description);
            MJ.UI.updateStatus(`Saved ${currentPrompts.length} prompts to collection "${name}"`);
            
            // Clear inputs
            collectionNameInput.value = '';
            collectionDescInput.value = '';
            
            // Refresh collections list
            refreshCollectionsList();
        });

        // Collections list container
        const collectionsList = document.createElement('div');
        collectionsList.id = 'mj-collections-list';
        collectionsList.style.marginTop = '10px';

        // Function to refresh collections list
        const refreshCollectionsList = () => {
            if (!window.MJ || !window.MJ.Prompts) {
                console.error('MJ.Prompts not initialized');
                collectionsList.innerHTML = '<div style="color: #ff6b6b;">Error: Prompt system not initialized</div>';
                return;
            }

            collectionsList.innerHTML = '';
            const collections = MJ.Prompts.getAllCollections();
            
            if (!collections || Object.keys(collections).length === 0) {
                collectionsList.innerHTML = '<div style="color: #8a8aaa;">No collections saved yet</div>';
                return;
            }
            
            Object.entries(collections).forEach(([name, collection]) => {
                const collectionDiv = document.createElement('div');
                collectionDiv.style.marginBottom = '10px';
                collectionDiv.style.padding = '5px';
                collectionDiv.style.border = '1px solid #ff003c';
                collectionDiv.style.backgroundColor = '#1a1a2e';
                
                const nameDiv = document.createElement('div');
                nameDiv.style.color = '#00ff9d';
                nameDiv.style.fontWeight = 'bold';
                nameDiv.textContent = name;
                
                const descDiv = document.createElement('div');
                descDiv.style.color = '#8a8aaa';
                descDiv.style.fontSize = '0.9em';
                descDiv.textContent = collection.description || 'No description';
                
                const countDiv = document.createElement('div');
                countDiv.style.color = '#ff6b6b';
                countDiv.style.fontSize = '0.9em';
                countDiv.textContent = `${collection.prompts.length} prompts`;
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.marginTop = '5px';
                
                const addToQueueButton = createButton('Add to Queue', () => {
                    MJ.Queue.addCollectionToQueue(name);
                    MJ.Queue.startQueueProcessing();
                });
                
                const deleteButton = createButton('Delete', () => {
                    if (MJ.Prompts.deleteCollection(name)) {
                        MJ.UI.updateStatus(`Deleted collection "${name}"`);
                        refreshCollectionsList();
                    }
                });
                
                buttonContainer.appendChild(addToQueueButton);
                buttonContainer.appendChild(deleteButton);
                
                collectionDiv.appendChild(nameDiv);
                collectionDiv.appendChild(descDiv);
                collectionDiv.appendChild(countDiv);
                collectionDiv.appendChild(buttonContainer);
                
                collectionsList.appendChild(collectionDiv);
            });
        };

        // Assemble the UI
        collectionSection.appendChild(collectionNameInput);
        collectionSection.appendChild(collectionDescInput);
        collectionSection.appendChild(saveCollectionButton);
        collectionSection.appendChild(collectionsList);

        promptManagementContainer.appendChild(collectionSection);
        */

        // Add last used prompts section
        const lastUsedSection = document.createElement('div');
        lastUsedSection.style.marginTop = '15px';

        const lastUsedButton = createButton('Add Last Used Prompts to Queue', () => {
            if (MJ.Queue.addLastUsedToQueue()) {
                MJ.Queue.startQueueProcessing();
            } else {
                MJ.UI.updateStatus('No last used prompts available');
            }
        });

        const clearLastUsedButton = createButton('Clear Last Used Prompts', () => {
            MJ.Prompts.clearLastUsed();
            MJ.UI.updateStatus('Cleared last used prompts');
        });

        // Assemble the UI
        lastUsedSection.appendChild(lastUsedButton);
        lastUsedSection.appendChild(clearLastUsedButton);

        promptManagementContainer.appendChild(lastUsedSection);

        // Add to prompts tab
        promptsTab.appendChild(promptManagementContainer);

        // Initial refresh of collections list
        // refreshCollectionsList(); // Temporarily disabled
    },

    updateStatus: (message) => {
        const statusElement = document.getElementById('mj-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    },

    saveSettings: () => {
        GM_setValue(`${MJ.Utils.kojima}_token`, MJ.API.settings.userToken);
        GM_setValue(`${MJ.Utils.kojima}_channel_id`, MJ.API.settings.channelId);
        GM_setValue(`${MJ.Utils.kojima}_user_id`, MJ.API.settings.userId);
        GM_setValue(`${MJ.Utils.kojima}_default_params`, MJ.API.settings.defaultParams);
        GM_setValue(`${MJ.Utils.kojima}_min_delay`, MJ.API.settings.minDelay);
        GM_setValue(`${MJ.Utils.kojima}_max_delay`, MJ.API.settings.maxDelay);

        // Save request parameters
        GM_setValue(`${MJ.Utils.kojima}_request_mode`, MJ.API.settings.requestMode);
        GM_setValue(`${MJ.Utils.kojima}_request_private`, MJ.API.settings.requestPrivate);
        GM_setValue(`${MJ.Utils.kojima}_default_version`, MJ.API.settings.defaultVersion);
        GM_setValue(`${MJ.Utils.kojima}_default_stylize`, MJ.API.settings.defaultStylize);
        GM_setValue(`${MJ.Utils.kojima}_default_chaos`, MJ.API.settings.defaultChaos);
        GM_setValue(`${MJ.Utils.kojima}_default_aspect`, MJ.API.settings.defaultAspectRatio);
        GM_setValue(`${MJ.Utils.kojima}_default_quality`, MJ.API.settings.defaultQuality);

        MJ.UI.updateStatus('Settings saved');
    }
}; 