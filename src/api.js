window.MJ = window.MJ || {};

MJ.API = {
    // Configuration
    API_ENDPOINT: `https://www.${MJ.Utils.kojima}.com/api/app/submit-jobs`,
    
    // Store settings
    settings: {
        userToken: GM_getValue(`${MJ.Utils.kojima}_token`, ''),
        channelId: GM_getValue(`${MJ.Utils.kojima}_channel_id`, ''),
        userId: GM_getValue(`${MJ.Utils.kojima}_user_id`, ''),
        defaultParams: GM_getValue(`${MJ.Utils.kojima}_default_params`, '--v 6.1'),
        minDelay: GM_getValue(`${MJ.Utils.kojima}_min_delay`, 2000),
        maxDelay: GM_getValue(`${MJ.Utils.kojima}_max_delay`, 5000),
        requestMode: GM_getValue(`${MJ.Utils.kojima}_request_mode`, 'relaxed'),
        requestPrivate: GM_getValue(`${MJ.Utils.kojima}_request_private`, false),
        defaultVersion: GM_getValue(`${MJ.Utils.kojima}_default_version`, '6.1'),
        defaultStylize: GM_getValue(`${MJ.Utils.kojima}_default_stylize`, '100'),
        defaultChaos: GM_getValue(`${MJ.Utils.kojima}_default_chaos`, '0'),
        defaultAspectRatio: GM_getValue(`${MJ.Utils.kojima}_default_aspect`, '1:1'),
        defaultQuality: GM_getValue(`${MJ.Utils.kojima}_default_quality`, '1')
    },

    setupNetworkMonitoring: () => {
        // Create a proxy for the original XMLHttpRequest
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;

        // Override the open method to capture URLs
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._mjUrl = url;
            return originalXhrOpen.apply(this, arguments);
        };

        // Override the send method to capture request data
        XMLHttpRequest.prototype.send = function(data) {
            const xhr = this;

            // Add a response handler
            this.addEventListener('load', function() {
                try {
                    // Check if this is a relevant Midjourney API call
                    if (xhr._mjUrl && xhr._mjUrl.includes(`${MJ.Utils.kojima}.com/api/`)) {
                        // Extract user ID from queue API
                        if (xhr._mjUrl.includes('/users/queue') || xhr._mjUrl.includes('/users/info')) {
                            const userIdMatch = xhr._mjUrl.match(/userId=([^&]+)/);
                            if (userIdMatch && userIdMatch[1]) {
                                const extractedUserId = userIdMatch[1];
                                if (extractedUserId !== MJ.API.settings.userId) {
                                    MJ.API.settings.userId = extractedUserId;
                                    GM_setValue(`${MJ.Utils.kojima}_user_id`, MJ.API.settings.userId);
                                    console.log('Extracted User ID:', MJ.API.settings.userId);

                                    // Update channel ID based on user ID
                                    const newChannelId = `singleplayer_${MJ.API.settings.userId}`;
                                    if (newChannelId !== MJ.API.settings.channelId) {
                                        MJ.API.settings.channelId = newChannelId;
                                        GM_setValue(`${MJ.Utils.kojima}_channel_id`, MJ.API.settings.channelId);
                                        console.log('Updated Channel ID:', MJ.API.settings.channelId);

                                        // Update UI if it exists
                                        const channelIdInput = document.getElementById('mj-channel-id-input');
                                        if (channelIdInput) {
                                            channelIdInput.value = MJ.API.settings.channelId;
                                            channelIdInput.style.border = '1px solid #4a5';
                                            MJ.UI.updateStatus('User ID and Channel ID automatically detected!');
                                        }
                                    }
                                }
                            }
                        }

                        // Extract token from cookies if not set
                        if (!MJ.API.settings.userToken) {
                            const cookies = document.cookie;
                            if (cookies.includes('__Host-Midjourney.AuthUserTokenV3') ||
                                cookies.includes('cf_clearance')) {
                                MJ.API.settings.userToken = cookies;
                                GM_setValue(`${MJ.Utils.kojima}_token`, MJ.API.settings.userToken);
                                console.log('Extracted token from cookies');

                                // Update UI if it exists
                                const tokenInput = document.getElementById('mj-token-input');
                                if (tokenInput) {
                                    tokenInput.value = MJ.API.settings.userToken;
                                    tokenInput.style.border = '1px solid #4a5';
                                }
                            }
                        }

                        // Extract channel ID from submit-jobs API
                        if (xhr._mjUrl.includes('/submit-jobs') && data) {
                            try {
                                const requestData = JSON.parse(data);
                                if (requestData.channelId && requestData.channelId !== MJ.API.settings.channelId) {
                                    MJ.API.settings.channelId = requestData.channelId;
                                    GM_setValue(`${MJ.Utils.kojima}_channel_id`, MJ.API.settings.channelId);
                                    console.log('Extracted Channel ID from request:', MJ.API.settings.channelId);

                                    // Update UI if it exists
                                    const channelIdInput = document.getElementById('mj-channel-id-input');
                                    if (channelIdInput) {
                                        channelIdInput.value = MJ.API.settings.channelId;
                                        channelIdInput.style.border = '1px solid #4a5';
                                    }
                                }
                            } catch (e) {
                                console.error('Error parsing request data:', e);
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error in XHR monitoring:', e);
                }
            });

            return originalXhrSend.apply(this, arguments);
        };

        // Also monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;

            // Create a promise chain to intercept the response
            const fetchPromise = originalFetch.apply(this, arguments);

            if (url && url.includes(`${MJ.Utils.kojima}.com/api/`)) {
                // Extract user ID from queue API
                if (url.includes('/users/queue') || url.includes('/users/info')) {
                    const userIdMatch = url.match(/userId=([^&]+)/);
                    if (userIdMatch && userIdMatch[1]) {
                        const extractedUserId = userIdMatch[1];
                        if (extractedUserId !== MJ.API.settings.userId) {
                            MJ.API.settings.userId = extractedUserId;
                            GM_setValue(`${MJ.Utils.kojima}_user_id`, MJ.API.settings.userId);
                            console.log('Extracted User ID from fetch:', MJ.API.settings.userId);

                            // Update channel ID based on user ID
                            const newChannelId = `singleplayer_${MJ.API.settings.userId}`;
                            if (newChannelId !== MJ.API.settings.channelId) {
                                MJ.API.settings.channelId = newChannelId;
                                GM_setValue(`${MJ.Utils.kojima}_channel_id`, MJ.API.settings.channelId);
                                console.log('Updated Channel ID from fetch:', MJ.API.settings.channelId);

                                // Update UI if it exists
                                const channelIdInput = document.getElementById('mj-channel-id-input');
                                if (channelIdInput) {
                                    channelIdInput.value = MJ.API.settings.channelId;
                                    channelIdInput.style.border = '1px solid #4a5';
                                    MJ.UI.updateStatus('User ID and Channel ID automatically detected!');
                                }
                            }
                        }
                    }
                }

                // Try to extract data from submit-jobs API
                if (url.includes('/submit-jobs') && init && init.body) {
                    try {
                        const requestData = JSON.parse(init.body);
                        if (requestData.channelId && requestData.channelId !== MJ.API.settings.channelId) {
                            MJ.API.settings.channelId = requestData.channelId;
                            GM_setValue(`${MJ.Utils.kojima}_channel_id`, MJ.API.settings.channelId);
                            console.log('Extracted Channel ID from fetch request:', MJ.API.settings.channelId);

                            // Update UI if it exists
                            const channelIdInput = document.getElementById('mj-channel-id-input');
                            if (channelIdInput) {
                                channelIdInput.value = MJ.API.settings.channelId;
                                channelIdInput.style.border = '1px solid #4a5';
                            }
                        }
                    } catch (e) {
                        console.error('Error parsing fetch request data:', e);
                    }
                }
            }

            return fetchPromise;
        };

        // Try to extract from JWT token if present
        MJ.API.extractUserIdFromJWT();
    },

    extractUserIdFromJWT: () => {
        try {
            const jwtCookie = document.cookie.split('; ')
                .find(row => row.startsWith(`__Host-${MJ.Utils.kojima}.AuthUserTokenV3_i=`));

            if (jwtCookie) {
                const token = jwtCookie.split('=')[1];
                // JWT tokens have 3 parts separated by dots
                const parts = token.split('.');
                if (parts.length === 3) {
                    // The middle part contains the payload
                    const payload = JSON.parse(atob(parts[1]));
                    if (payload[`${MJ.Utils.kojima}_id`]) {
                        MJ.API.settings.userId = payload[`${MJ.Utils.kojima}_id`];
                        GM_setValue(`${MJ.Utils.kojima}_user_id`, MJ.API.settings.userId);
                        console.log('Extracted User ID from JWT:', MJ.API.settings.userId);

                        // Update channel ID based on user ID
                        const newChannelId = `singleplayer_${MJ.API.settings.userId}`;
                        MJ.API.settings.channelId = newChannelId;
                        GM_setValue(`${MJ.Utils.kojima}_channel_id`, MJ.API.settings.channelId);
                        console.log('Updated Channel ID from JWT:', MJ.API.settings.channelId);

                        return true;
                    }
                }
            }
        } catch (e) {
            console.error('Error extracting user ID from JWT:', e);
        }
        return false;
    },

    extractChannelId: () => {
        // If we already have a user ID, use it to form the channel ID
        if (MJ.API.settings.userId) {
            return `singleplayer_${MJ.API.settings.userId}`;
        }

        // Try to extract from cookies or page content
        const cookieMatch = document.cookie.match(/channelId=([^;]+)/);
        if (cookieMatch) {
            return cookieMatch[1];
        }

        // Try to extract from JWT token
        if (MJ.API.extractUserIdFromJWT()) {
            return MJ.API.settings.channelId;
        }

        // Default to empty string
        return '';
    },

    submitPrompt: async (prompt) => {
        // Improved validation with specific error messages
        if (!MJ.API.settings.userToken || MJ.API.settings.userToken.trim() === '') {
            throw new Error('Authentication token not set. Please go to Settings tab and paste your Midjourney cookie/token.');
        }

        if (!MJ.API.settings.channelId || MJ.API.settings.channelId.trim() === '') {
            throw new Error('Channel ID not set. Please go to Settings tab and enter your Midjourney channel ID.');
        }

        // Check if token looks valid (contains some expected parts)
        if (!MJ.API.settings.userToken.includes(`__Host-${MJ.Utils.kojima}`) && !MJ.API.settings.userToken.includes('cf_clearance')) {
            console.warn(`Warning: Your token may not be valid. It should contain authentication cookies from ${MJ.Utils.kojima}.`);
        }

        // Validate and fix parameters
        const validatedPrompt = MJ.API.validateParameters(prompt);
        if (validatedPrompt !== prompt) {
            console.log('Prompt parameters were fixed:', prompt, '->', validatedPrompt);
        }

        // Extract cookies from the token
        const cookies = MJ.API.settings.userToken;

        // Prepare the payload
        const payload = {
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
            "prompt": validatedPrompt
        };

        console.log('Submitting prompt to Midjourney API:', validatedPrompt);
        console.log('API Endpoint:', MJ.API.API_ENDPOINT);
        console.log('Channel ID:', MJ.API.settings.channelId);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        // Make the API request
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: MJ.API.API_ENDPOINT,
                    headers: {
                        'accept': '*/*',
                        'content-type': 'application/json',
                        'origin': `https://www.${MJ.Utils.kojima}.com`,
                        'referer': `https://www.${MJ.Utils.kojima}.com/explore`,
                        'x-csrf-protection': '1'
                    },
                    data: JSON.stringify(payload),
                    cookie: cookies,
                    onload: function(response) {
                        console.log('API Response Status:', response.status);
                        console.log('API Response Headers:', response.responseHeaders);
                        try {
                            if (response.status >= 400) {
                                console.error('API Error Response:', response.responseText);
                                reject(new Error(`API returned error ${response.status}: ${response.statusText}. Check console for details.`));
                                return;
                            }

                            const result = JSON.parse(response.responseText);
                            console.log('API Response Data:', result);

                            // Check for API-level errors
                            if (result.failure && result.failure.length > 0) {
                                const failures = result.failure;
                                const errorMessages = failures.map(f => f.message).join('; ');
                                console.error('API reported failures:', failures);
                                reject(new Error(`API reported errors: ${errorMessages}`));
                                return;
                            }

                            resolve(result);
                        } catch (error) {
                            console.error('Error parsing API response:', error, response);
                            reject(new Error(`Failed to parse API response: ${error.message}. Check console for details.`));
                        }
                    },
                    onerror: function(error) {
                        console.error('Network error:', error);
                        reject(new Error(`Network error: ${error.statusText || 'Unknown error'}. Check console for details.`));
                    }
                });
            } catch (error) {
                console.error('Error in GM_xmlhttpRequest:', error);
                reject(new Error(`Error in GM_xmlhttpRequest: ${error.message}`));
            }
        });
    },

    validateParameters: (prompt) => {
        // Common parameter fixes
        let fixedPrompt = prompt;

        // Fix version parameter (--v 0 is invalid, should be --v 6.0 or similar)
        if (fixedPrompt.includes('--v 0')) {
            fixedPrompt = fixedPrompt.replace('--v 0', `--v ${MJ.API.settings.defaultVersion}`);
        }

        // Ensure --v parameter is valid (should be 5.0, 5.1, 5.2, 6.0, 6.1, etc.)
        const versionMatch = fixedPrompt.match(/--v\s+(\S+)/);
        if (versionMatch) {
            const version = versionMatch[1];
            // If version is just a number without decimal, add .0
            if (/^\d+$/.test(version)) {
                fixedPrompt = fixedPrompt.replace(`--v ${version}`, `--v ${version}.0`);
            }
        } else if (!fixedPrompt.includes('--v ')) {
            // If no version parameter, add the default
            fixedPrompt = `${fixedPrompt} --v ${MJ.API.settings.defaultVersion}`;
        }

        // Fix stylize parameter (should be between 0-1000)
        const stylizeMatch = fixedPrompt.match(/--stylize\s+(\S+)/);
        if (stylizeMatch) {
            const stylize = parseInt(stylizeMatch[1]);
            if (isNaN(stylize) || stylize < 0 || stylize > 1000) {
                // Replace with a valid value
                fixedPrompt = fixedPrompt.replace(`--stylize ${stylizeMatch[1]}`, `--stylize ${MJ.API.settings.defaultStylize}`);
            }
        }

        // Fix chaos parameter (should be between 0-100)
        const chaosMatch = fixedPrompt.match(/--chaos\s+(\S+)/);
        if (chaosMatch) {
            const chaos = parseInt(chaosMatch[1]);
            if (isNaN(chaos) || chaos < 0 || chaos > 100) {
                // Replace with a valid value
                fixedPrompt = fixedPrompt.replace(`--chaos ${chaosMatch[1]}`, `--chaos ${MJ.API.settings.defaultChaos}`);
            }
        }

        return fixedPrompt;
    }
}; 