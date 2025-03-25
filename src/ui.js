window.MJ = window.MJ || {};

MJ.UI = {
    createUI: () => {
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

        // Example and help text
        const helpText = document.createElement('div');
        helpText.innerHTML = '<small>Example: "a photo of [cat,dog,bird] in [forest,beach,mountain]"</small>';
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

        // Add landscape prompts button with cyberpunk theme
        const landscapePromptsButton = createButton('Queue Landscape Prompts', () => {
            // Collection of landscape prompts with varied subjects and styles
            const landscapePrompts = [
                "A majestic mountain range at sunset with golden light casting long shadows across snow-capped peaks.",
                "A serene misty valley with a winding river and ancient trees draped in morning fog.",
                "A dramatic coastline with waves crashing against rugged cliffs and a lighthouse in the distance.",
                "A lush tropical rainforest with a hidden waterfall and exotic flowers in vibrant colors.",
                "A vast desert landscape with intricate sand dunes sculpted by the wind at golden hour.",
                "An enchanted forest with bioluminescent plants and mystical light filtering through ancient trees.",
                "A terraced rice field in Asia during harvest season with workers in traditional conical hats.",
                "A dramatic volcanic landscape with flowing lava and steam rising against a twilight sky.",
                "A peaceful lavender field stretching to the horizon with an old stone farmhouse in Provence.",
                "A grand canyon with layered rock formations revealed by millions of years of erosion.",
                "An Arctic landscape with massive blue icebergs floating in pristine waters under the northern lights.",
                "An autumn forest with a carpet of fallen leaves in red, orange, and gold beside a reflective lake.",
                "A Scottish highland vista with rolling hills covered in heather and an ancient castle ruin.",
                "A Japanese garden in fall with maple trees, carefully arranged stones, and a traditional bridge.",
                "A Tuscan countryside with gently rolling hills, cypress trees, and a rustic villa at sunset.",
                "A prairie landscape with tall grasses swaying in the wind under a dramatic stormy sky.",
                "An aerial view of the Amazon rainforest with a winding river cutting through endless green canopy.",
                "A salt flat landscape during rainy season creating a perfect mirror reflection of the sky.",
                "A bamboo forest with tall stalks creating natural corridors of dappled light and shadow.",
                "An underwater landscape with a vibrant coral reef and schools of colorful tropical fish.",
                "A cyberpunk cityscape with holographic advertisements reflecting in puddles after rainfall",
                "A surreal desert landscape where massive stone hands emerge from sand dunes under twin moons",
                "An ancient forest where trees have grown around abandoned temple ruins over centuries",
                "A subterranean crystal cave with bioluminescent fungi and an underground lake",
                "A floating archipelago of small islands connected by rope bridges above misty clouds",
                "A post-apocalyptic cityscape reclaimed by nature with vines climbing skyscrapers",
                "A realm where land and sea merge with islands that transform into sea creatures at dusk",
                "An impossible mountain peak twisted in an Escher-like formation defying gravity",
                "A mirrored salt flat landscape at sunset where sky and earth become indistinguishable",
                "A geothermal valley with vibrant mineral deposits creating a natural rainbow landscape",
                "A massive waterfall cascading into a swirling dimensional portal at the ocean's edge",
                "A night landscape where luminous plants replace stars in a perpetual twilight world",
                "A city built within the hollow trunk of a colossal ancient tree thousands of feet tall",
                "An aurora borealis reflecting on a field of perfectly clear ice sculptures",
                "A landscape where giant crystal formations grow like trees, refracting sunlight in prismatic patterns",
                "A coastline where the ocean meets a desert, creating glass formations along the shore",
                "A valley where gravity works sideways, with waterfalls flowing horizontally across cliffs"
            ];

            // Get any additional parameters from the prompt input
            const additionalParams = promptInput.value.trim();

            // Process each landscape prompt and add it to the queue
            let processedPrompts = [];
            landscapePrompts.forEach(prompt => {
                // If there are additional parameters, append them to the prompt
                const fullPrompt = additionalParams ? `${prompt} ${additionalParams}` : prompt;
                processedPrompts.push(fullPrompt);
            });

            // Shuffle the prompts before adding to queue
            processedPrompts = MJ.Utils.shuffleArray(processedPrompts);

            // Add all processed prompts to the queue
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...processedPrompts];

            // Update status
            MJ.UI.updateStatus(`Added ${processedPrompts.length} randomized landscape prompts to queue`);
            console.log(`Added ${processedPrompts.length} randomized landscape prompts to queue. Starting processing...`);

            // Start processing if not already doing so
            MJ.Queue.startQueueProcessing();
        });

        landscapePromptsButton.style.backgroundColor = '#00ff9d';
        landscapePromptsButton.style.boxShadow = '0 0 5px rgba(0,255,157,0.5)';
        landscapePromptsButton.style.width = '100%';
        landscapePromptsButton.style.marginTop = '10px';
        landscapePromptsButton.style.marginBottom = '5px';

        // Update hover effects for this specific button
        landscapePromptsButton.addEventListener('mouseover', () => {
            landscapePromptsButton.style.backgroundColor = '#00ffb3';
            landscapePromptsButton.style.boxShadow = '0 0 10px rgba(0,255,157,0.8)';
        });

        landscapePromptsButton.addEventListener('mouseout', () => {
            landscapePromptsButton.style.backgroundColor = '#00ff9d';
            landscapePromptsButton.style.boxShadow = '0 0 5px rgba(0,255,157,0.5)';
        });

        promptsTab.insertBefore(landscapePromptsButton, statusDisplay);

        // Add validation prompts button with cyberpunk theme
        const validationPromptsButton = createButton('Queue Validation Prompts', () => {
            // Get the validation prompts from the notes
            const validationPrompts = [
                "A futuristic cityscape with towering skyscrapers and flying cars.",
                "A medieval tavern with a fireplace, wooden tables, and people talking.",
                "A dense forest with tall trees, moss-covered rocks, and a river.",
                "An airship floating in the sky above a vast mountain range.",
                "A ruined city with abandoned buildings and overgrown vegetation.",
                "A warrior in armor holding a sword and standing on a battlefield.",
                "A person wearing a high-tech suit with glowing elements.",
                "A woman sitting in a café, looking out the window at the street.",
                "A wizard casting a spell with sparks of energy around their hands.",
                "A humanoid robot standing in a laboratory surrounded by monitors.",
                "A lone figure standing on a cliff, looking at the horizon.",
                "A study room with bookshelves, a desk, and scattered papers.",
                "A narrow alleyway with a single streetlamp casting shadows.",
                "A lighthouse standing on a rocky shore with waves crashing.",
                "A car driving on a highway with a city skyline in the distance.",
                "A large castle with towers and a drawbridge over a moat.",
                "A dragon flying over a valley with a river below.",
                "A battlefield with soldiers clashing and banners waving.",
                "A small village with cobblestone streets and wooden houses.",
                "A marketplace filled with people, stalls, and goods.",
                "A table with a chessboard in the middle of a game.",
                "A clock tower with gears visible inside the structure.",
                "A plate of assorted food arranged on a wooden table.",
                "An astronaut floating in space near a satellite.",
                "A butterfly resting on a flower in a field.",
                "A library where books float and pages turn themselves with glowing text",
                "A hybrid transport vehicle that functions as both submarine and aircraft",
                "A complex mechanical clockwork device with exposed gears and moving parts",
                "A doorway standing alone in a field that opens to different dimensions",
                "A creature that appears half-mechanical and half-organic in detailed view",
                "A lush garden where plants respond to music playing nearby",
                "An ornate magical staff with intricate carvings and glowing runes",
                "A futuristic operating room with holographic displays and robotic assistants",
                "A living painting where the scene changes based on the observer's emotions",
                "An ancient stone circle at the exact moment of celestial alignment",
                "A supernatural being composed of light particles interacting with physical matter",
                "A fantasy potion shop with bottles of colorful liquids with magical properties",
                "An impossible staircase in Escher style that loops continuously",
                "A surreal dinner party where the food is transformed into unexpected objects",
                "A giant mechanical insect with detailed inner workings visible through transparent parts",
                "A magician pulling impossible objects from an ordinary hat on stage",
                "A character stepping between parallel universes with half their body in each world"
            ];

            // Get any additional parameters from the prompt input
            const additionalParams = promptInput.value.trim();

            // Process each validation prompt and add it to the queue
            let processedPrompts = [];
            validationPrompts.forEach(prompt => {
                // If there are additional parameters, append them to the prompt
                const fullPrompt = additionalParams ? `${prompt} ${additionalParams}` : prompt;
                processedPrompts.push(fullPrompt);
            });

            // Shuffle the prompts before adding to queue
            processedPrompts = MJ.Utils.shuffleArray(processedPrompts);

            // Add all processed prompts to the queue
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...processedPrompts];

            // Update status
            MJ.UI.updateStatus(`Added ${processedPrompts.length} randomized validation prompts to queue`);
            console.log(`Added ${processedPrompts.length} randomized validation prompts to queue. Starting processing...`);

            // Start processing if not already doing so
            MJ.Queue.startQueueProcessing();
        });

        validationPromptsButton.style.backgroundColor = '#1a75ff';
        validationPromptsButton.style.boxShadow = '0 0 5px rgba(26,117,255,0.5)';
        validationPromptsButton.style.width = '100%';
        validationPromptsButton.style.marginTop = '5px';
        validationPromptsButton.style.marginBottom = '10px';

        // Update hover effects for this specific button
        validationPromptsButton.addEventListener('mouseover', () => {
            validationPromptsButton.style.backgroundColor = '#4a8fff';
            validationPromptsButton.style.boxShadow = '0 0 10px rgba(26,117,255,0.8)';
        });

        validationPromptsButton.addEventListener('mouseout', () => {
            validationPromptsButton.style.backgroundColor = '#1a75ff';
            validationPromptsButton.style.boxShadow = '0 0 5px rgba(26,117,255,0.5)';
        });

        promptsTab.insertBefore(validationPromptsButton, statusDisplay);

        // Add everyday things prompts button with cyberpunk theme
        const everydayPromptsButton = createButton('Queue Everyday Things Prompts', () => {
            // Collection of everyday object prompts
            const everydayPrompts = [
                "A vintage alarm clock on a bedside table with morning light streaming through curtains.",
                "A steaming cup of coffee on a wooden table next to an open book.",
                "A well-worn leather wallet with cards and receipts peeking out.",
                "A pair of glasses resting on an open newspaper.",
                "A houseplant in a decorative pot with new leaves unfurling.",
                "A wooden kitchen spoon resting on a ceramic spoon rest.",
                "A smartphone charging on a nightstand with notification lights glowing.",
                "A set of keys on a colorful keychain hanging from a hook.",
                "A refrigerator door covered with family photos and children's artwork.",
                "A stack of clean folded laundry on the edge of a bed.",
                "A toothbrush and toothpaste tube beside a bathroom sink.",
                "A dog's leash hanging from a hook by the front door.",
                "A worn baseball cap on a coat rack in the entryway.",
                "A cast iron pan with herbs and oil being heated on a stove.",
                "A bicycle leaning against a wall in a garage.",
                "A remote control on the arm of a comfortable sofa.",
                "A desk lamp illuminating a workspace with scattered papers.",
                "A mechanical wristwatch with its intricate gears visible.",
                "A pair of well-worn running shoes by the door.",
                "A half-eaten apple resting next to a laptop keyboard.",
                "A clothes iron on an ironing board with a shirt partially pressed.",
                "A collection of spice jars with handwritten labels in a kitchen rack.",
                "A mailbox with envelopes and magazines sticking out.",
                "A bathroom sink with toothbrushes, soap, and everyday items arranged neatly.",
                "A window with raindrops running down the glass on a gray day.",
                "A backpack hanging on a chair with books and notebooks peeking out.",
                "A ceiling fan with dust collecting on the blades spinning slowly.",
                "A kitchen counter with bread crumbs and a butter knife on a cutting board.",
                "A porcelain teapot with steam rising from its spout on a lace doily.",
                "A hand towel hanging slightly crooked on a bathroom towel ring.",
                "A screwdriver set arranged by size in a toolbox compartment.",
                "A hair brush with strands of hair caught in the bristles on a vanity.",
                "A basket of fresh laundry waiting to be folded on a couch.",
                "A water bottle with condensation forming on its surface on a desk.",
                "A medicine cabinet with various pill bottles and health products.",
                "A pencil holder filled with pens, pencils, and markers on a desk.",
                "A light switch with fingerprint smudges around the plate.",
                "A shopping list held by a magnet on a refrigerator door.",
                "A kitchen sponge sitting in a small dish by the sink.",
                "A comb with several teeth missing on a bathroom counter.",
                "A power strip with multiple devices plugged in underneath a desk.",
                "A jar of peanut butter with a knife sticking out of it.",
                "A simple digital watch with the alarm time visible on the display.",
                "A set of measuring cups hanging from hooks in a kitchen.",
                "A computer mouse with a fraying cord on a mousepad.",
                "A fly swatter hanging from a hook in a utility room.",
                "A roll of paper towels on a kitchen counter next to a sink.",
                "A welcome mat with muddy footprints at the front door.",
                "A calendar hanging on a wall with important dates circled.",
                "A dustpan and brush leaning against a wall in a corner.",
                "An antique typewriter with a half-finished page and ink stains on worn metal keys",
                "A child's forgotten teddy bear sitting alone on a playground swing at sunset",
                "Raindrops creating concentric circles in a puddle reflecting neon street signs",
                "A worn guitar with one broken string leaning against an amplifier in a dimly lit garage",
                "A pair of ballet shoes with frayed ribbons hanging on a dressing room mirror",
                "An old film camera surrounded by developed photographs spread across a darkroom counter",
                "A street musician's hat filled with scattered coins and small bills on a busy sidewalk",
                "A cracked smartphone screen still displaying an interrupted text message conversation",
                "A vintage jukebox glowing in the corner of an otherwise empty diner at midnight",
                "A heavily annotated script with coffee stains backstage at a theater production",
                "A collection of seashells arranged by size on a windowsill with salt residue",
                "A homemade birthday cake with slightly melting frosting and uneven candles",
                "A makeshift memorial with weathered photographs and wilting flowers tied to a fence",
                "A street artist's chalk drawing being slowly erased by light rain on pavement",
                "A half-completed crossword puzzle with pencil erasure marks and coffee ring stains",
                "A child's handprint in drying concrete on a newly poured sidewalk",
                "A weathered bench with a dedication plaque in a fog-shrouded park",
                "A lost glove placed carefully on a fence post in case its owner returns",
                "An old rotary telephone with its cord tangled among modern charging cables",
                "A bird's nest constructed with twigs, string, and colorful bits of plastic waste",
                "A handwritten recipe card stained with ingredients passed down through generations"
            ];

            // Get any additional parameters from the prompt input
            const additionalParams = promptInput.value.trim();

            // Process each everyday object prompt and add it to the queue
            let processedPrompts = [];
            everydayPrompts.forEach(prompt => {
                // If there are additional parameters, append them to the prompt
                const fullPrompt = additionalParams ? `${prompt} ${additionalParams}` : prompt;
                processedPrompts.push(fullPrompt);
            });

            // Shuffle the prompts before adding to queue
            processedPrompts = MJ.Utils.shuffleArray(processedPrompts);

            // Add all processed prompts to the queue
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...processedPrompts];

            // Update status
            MJ.UI.updateStatus(`Added ${processedPrompts.length} randomized everyday things prompts to queue`);
            console.log(`Added ${processedPrompts.length} randomized everyday things prompts to queue. Starting processing...`);

            // Start processing if not already doing so
            MJ.Queue.startQueueProcessing();
        });

        everydayPromptsButton.style.backgroundColor = '#ff6b6b';
        everydayPromptsButton.style.boxShadow = '0 0 5px rgba(255,107,107,0.5)';
        everydayPromptsButton.style.width = '100%';
        everydayPromptsButton.style.marginTop = '5px';
        everydayPromptsButton.style.marginBottom = '10px';

        // Update hover effects for this specific button
        everydayPromptsButton.addEventListener('mouseover', () => {
            everydayPromptsButton.style.backgroundColor = '#ff8585';
            everydayPromptsButton.style.boxShadow = '0 0 10px rgba(255,107,107,0.8)';
        });

        everydayPromptsButton.addEventListener('mouseout', () => {
            everydayPromptsButton.style.backgroundColor = '#ff6b6b';
            everydayPromptsButton.style.boxShadow = '0 0 5px rgba(255,107,107,0.5)';
        });

        promptsTab.insertBefore(everydayPromptsButton, statusDisplay);

        // Add character prompts button with cyberpunk theme
        const characterPromptsButton = createButton('Queue Character Prompts', () => {
            // Collection of diverse character prompts
            const characterPrompts = [
                "A South Asian female surgeon performing a complex operation in a modern hospital setting",
                "An African American male teacher engaging with students in a vibrant classroom",
                "A Middle Eastern woman software engineer working at her desk with multiple monitors",
                "A Latino firefighter rescuing people from a burning building",
                "An East Asian male chef preparing dishes in a busy restaurant kitchen",
                "A Native American environmental scientist collecting samples in a forest",
                "A Black female astronaut floating in a space station conducting experiments",
                "A Pacific Islander marine biologist diving among coral reefs",
                "An Indian classical dancer performing in traditional costume on stage",
                "A Hispanic female police officer helping a lost child",
                "A Japanese male architect presenting building plans to clients",
                "An Ethiopian coffee farmer examining fresh coffee cherries",
                "A Korean female esports player competing in a major tournament",
                "A Nigerian businessman giving a presentation in a corporate boardroom",
                "A Vietnamese female mechanic repairing a complex engine",
                "A Moroccan male fashion designer working in his studio",
                "A Chinese female quantum physicist working with laboratory equipment",
                "A Brazilian martial arts instructor teaching a class",
                "A Kenyan marathon runner crossing the finish line",
                "A Filipino nurse caring for patients in a hospital ward",
                "A Turkish female judge presiding over a courtroom",
                "A Jamaican music producer working at a mixing board",
                "A Persian male florist arranging an elaborate bouquet",
                "A Mexican female archaeologist excavating ancient ruins",
                "A Tibetan mountain guide leading an expedition",
                "A cybernetic person with visible augmentations playing a holographic musical instrument",
                "A tribal elder with traditional face paint sharing stories around a campfire",
                "A drag performer with elaborate costume mid-performance under colorful stage lights",
                "A Paralympic athlete with a prosthetic limb breaking a world record",
                "A female cosmonaut in a retro-futuristic spacesuit on the surface of Mars",
                "An elderly tattoo artist with full-body ink working on a client's intricate design",
                "A holographic AI teacher interacting with students in a mixed-reality classroom",
                "A non-binary fashion model wearing avant-garde clothing on a futuristic runway",
                "A deep sea explorer in a pressure suit examining bioluminescent creatures",
                "A circus performer executing a dangerous trapeze act high above a captivated audience",
                "A time-traveling Victorian scientist examining modern technology with steampunk tools",
                "A blind musician feeling soundwaves visually represented through specialized technology",
                "A genetic engineer with unusual hybrid features working in a luminous biotech laboratory",
                "A cyborg monk in meditation as digital and organic energies flow around them",
                "A nomadic desert dweller with weather-beaten skin collecting water from a fog harvester"
            ];

            // Get any additional parameters from the prompt input
            const additionalParams = promptInput.value.trim();

            // Process each character prompt and add it to the queue
            let processedPrompts = [];
            characterPrompts.forEach(prompt => {
                // If there are additional parameters, append them to the prompt
                const fullPrompt = additionalParams ? `${prompt} ${additionalParams}` : prompt;
                processedPrompts.push(fullPrompt);
            });

            // Shuffle the prompts before adding to queue
            processedPrompts = MJ.Utils.shuffleArray(processedPrompts);

            // Add all processed prompts to the queue
            MJ.Queue.promptQueue = [...MJ.Queue.promptQueue, ...processedPrompts];

            // Update status
            MJ.UI.updateStatus(`Added ${processedPrompts.length} randomized character prompts to queue`);
            console.log(`Added ${processedPrompts.length} randomized character prompts to queue. Starting processing...`);

            // Start processing if not already doing so
            MJ.Queue.startQueueProcessing();
        });

        characterPromptsButton.style.backgroundColor = '#9b59b6';
        characterPromptsButton.style.boxShadow = '0 0 5px rgba(155,89,182,0.5)';
        characterPromptsButton.style.width = '100%';
        characterPromptsButton.style.marginTop = '5px';
        characterPromptsButton.style.marginBottom = '10px';

        // Update hover effects for this specific button
        characterPromptsButton.addEventListener('mouseover', () => {
            characterPromptsButton.style.backgroundColor = '#a66bbe';
            characterPromptsButton.style.boxShadow = '0 0 10px rgba(155,89,182,0.8)';
        });

        characterPromptsButton.addEventListener('mouseout', () => {
            characterPromptsButton.style.backgroundColor = '#9b59b6';
            characterPromptsButton.style.boxShadow = '0 0 5px rgba(155,89,182,0.5)';
        });

        promptsTab.insertBefore(characterPromptsButton, statusDisplay);

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
        collectionSection.appendChild(collectionNameInput);
        collectionSection.appendChild(collectionDescInput);
        collectionSection.appendChild(saveCollectionButton);
        collectionSection.appendChild(collectionsList);

        lastUsedSection.appendChild(lastUsedButton);
        lastUsedSection.appendChild(clearLastUsedButton);

        promptManagementContainer.appendChild(collectionSection);
        promptManagementContainer.appendChild(lastUsedSection);

        // Add to prompts tab
        promptsTab.appendChild(promptManagementContainer);

        // Initial refresh of collections list
        refreshCollectionsList();

        // Add prompt category buttons
        const loadPromptCategories = async () => {
            try {
                const categories = JSON.parse(GM_getResourceText('prompt_categories'));
                
                Object.entries(categories).forEach(([key, category]) => {
                    const button = createButton(`Queue ${category.name}`, () => {
                        // Get any additional parameters from the prompt input
                        const additionalParams = promptInput.value.trim();

                        // Process each prompt and add it to the queue
                        let processedPrompts = [];
                        category.prompts.forEach(prompt => {
                            // If there are additional parameters, append them to the prompt
                            const fullPrompt = additionalParams ? `${prompt} ${additionalParams}` : prompt;
                            processedPrompts.push(fullPrompt);
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
                    button.style.marginBottom = '10px';

                    // Update hover effects for this specific button
                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = category.color;
                        button.style.boxShadow = `0 0 10px ${category.color}cc`;
                    });

                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = category.color;
                        button.style.boxShadow = `0 0 5px ${category.color}80`;
                    });

                    promptsTab.insertBefore(button, statusDisplay);
                });
            } catch (error) {
                console.error('Error loading prompt categories:', error);
                MJ.UI.updateStatus('Error loading prompt categories');
            }
        };

        // Load prompt categories
        loadPromptCategories();
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