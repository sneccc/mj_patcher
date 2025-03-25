// ==UserScript==
// @name         MJ Patcher
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A tool for managing and submitting prompts to Midjourney
// @author       Your Name
// @match        https://www.midjourney.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/yourusername/eagle_tools/main/userscript_scripts/mj_patcher/src/utils.js
// @require      https://raw.githubusercontent.com/yourusername/eagle_tools/main/userscript_scripts/mj_patcher/src/api.js
// @require      https://raw.githubusercontent.com/yourusername/eagle_tools/main/userscript_scripts/mj_patcher/src/queue.js
// @require      https://raw.githubusercontent.com/yourusername/eagle_tools/main/userscript_scripts/mj_patcher/src/ui.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize the MJ namespace if it doesn't exist
    window.MJ = window.MJ || {};

    // Load saved settings
    MJ.API.settings.userToken = GM_getValue(`${MJ.Utils.kojima}_token`, '');
    MJ.API.settings.channelId = GM_getValue(`${MJ.Utils.kojima}_channel_id`, '');
    MJ.API.settings.userId = GM_getValue(`${MJ.Utils.kojima}_user_id`, '');
    MJ.API.settings.defaultParams = GM_getValue(`${MJ.Utils.kojima}_default_params`, '');
    MJ.API.settings.minDelay = GM_getValue(`${MJ.Utils.kojima}_min_delay`, 5000);
    MJ.API.settings.maxDelay = GM_getValue(`${MJ.Utils.kojima}_max_delay`, 10000);

    // Load request parameters
    MJ.API.settings.requestMode = GM_getValue(`${MJ.Utils.kojima}_request_mode`, 'fast');
    MJ.API.settings.requestPrivate = GM_getValue(`${MJ.Utils.kojima}_request_private`, false);
    MJ.API.settings.defaultVersion = GM_getValue(`${MJ.Utils.kojima}_default_version`, '6.1');
    MJ.API.settings.defaultStylize = GM_getValue(`${MJ.Utils.kojima}_default_stylize`, 600);
    MJ.API.settings.defaultChaos = GM_getValue(`${MJ.Utils.kojima}_default_chaos`, 0);
    MJ.API.settings.defaultAspectRatio = GM_getValue(`${MJ.Utils.kojima}_default_aspect`, '1:1');
    MJ.API.settings.defaultQuality = GM_getValue(`${MJ.Utils.kojima}_default_quality`, 1);

    // Initialize network monitoring
    MJ.API.setupNetworkMonitoring();

    // Create the UI
    MJ.UI.createUI();

    // Log initialization
    console.log('MJ Patcher initialized');
})(); 