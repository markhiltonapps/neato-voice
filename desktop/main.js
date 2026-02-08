// desktop/main.js
// This is the main Electron process - it controls the app window and system integration
console.log('[Main] main.js execution started...');

const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage, dialog, protocol, net } = require('electron');
const { autoUpdater } = require('electron-updater');

// Fix for background recording/throttling when minimized
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// Register custom protocol scheme
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true } }
]);

const path = require('path');
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');
const { Anthropic } = require('@anthropic-ai/sdk');
// Load .env from strictly defined path to ensure it works in production
// In production (asar), process.cwd() might not be what we expect
const envPath = app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.join(__dirname, '.env');
const dotenvResult = require('dotenv').config({ path: envPath });
if (dotenvResult.error) {
    console.error('[Main] Error loading .env:', dotenvResult.error);
} else {
    console.log('[Main] .env loaded successfully from:', envPath);
}


// Initialize settings storage
const store = new Store({
    defaults: {
        startMinimized: false,
        startWithWindows: false,
        hotkey: 'CommandOrControl+Shift+Space',
        stats: {
            totalDictationTimeMs: 0,
            totalWords: 0,
            wordsThisWeek: 0,
            weekStartDate: new Date().toISOString()
        },
        dictionary: [],
        history: [],
        retentionPeriod: 'forever', // 'never', '24h', '1w', '1m', 'forever'
        translation: { enabled: false, targetLanguage: 'Spanish' },
        microphoneId: 'default'
    }
});

// Keep references to prevent garbage collection
let mainWindow = null;
let overlayWindow = null;
let tray = null;

const fs = require('fs');

// Simple file logger
function logger(message) {
    console.log(message); // Log to terminal
    try {
        const userDataPath = app.getPath('userData');
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        const logPath = path.join(userDataPath, 'neato.log');
        fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
    } catch (e) {
        // Silently fail if file logging fails
    }
}

// Auto-launcher setup
const autoLauncher = new AutoLaunch({
    name: 'Neato Voice',
    path: app.getPath('exe'),
});

// Create the main application window
function createWindow() {
    logger('Creating window...');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 500,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false, // Ensure audio keeps recording when minimized
        },
        // Start hidden if user prefers
        show: false, // Default to hidden for discrete mode logic
    });

    // Load the web app
    // For development: load from Next.js dev server
    // For production: load from built files
    if (process.env.NODE_ENV === 'development') {
        logger('Loading dev server');
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // Load the live production web app for main window (Stable Auth & Routing)
        // User requested Login Page to be the entry point
        logger('Loading production Login Page (DEV OVERRIDE -> localhost)');
        // mainWindow.loadURL('https://neato-voice.netlify.app/login');
        mainWindow.loadURL('http://localhost:3000/login');
    }

    // Minimize to tray instead of closing
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createOverlayWindow() {
    logger('Creating overlay window...');
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize; // Use workAreaSize to avoid taskbar

    // Dimensions (Increased for High-Vis UI)
    const w = 500;
    const h = 150;
    const x = Math.floor((width - w) / 2); // Center horizontally
    const y = height - h - 50; // Higher up to avoid hidden taskbar issues

    overlayWindow = new BrowserWindow({
        width: w,
        height: h,
        x: x,
        y: y,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        focusable: false, // Do not steal focus
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    if (process.env.NODE_ENV === 'development') {
        overlayWindow.loadURL('http://localhost:3000/overlay');
    } else {
        // Load via app:// protocol
        logger(`Loading Overlay via app:// (DEV OVERRIDE -> localhost)`);
        // overlayWindow.loadURL('app://neato-voice/overlay.html')
        overlayWindow.loadURL('http://localhost:3000/overlay')
            .then(() => logger('[Overlay] Loaded successfully'))
            .catch(e => logger(`[Overlay] Failed to load: ${e}`));
    }

    // Ensure it's ready
    overlayWindow.once('ready-to-show', () => {
        logger('[Overlay] Ready to show');
    });

    overlayWindow.hide();
}

// Create the system tray icon and menu
function createTray() {
    const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
    // Use a fallback if icon doesn't exist yet to avoid crash
    let trayIcon;
    try {
        trayIcon = nativeImage.createFromPath(iconPath);
    } catch (e) {
        console.error("Failed to load tray icon", e);
        return;
    }

    // Log version at startup
    const packageJson = require('./package.json');
    logger(`========================================`);
    logger(`Neato Voice Desktop v${packageJson.version}`);
    logger(`========================================`);

    tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
    tray.setToolTip('Neato Voice - Click to open');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Neato Voice',
            click: () => {
                if (mainWindow) {
                    mainWindow.setSkipTaskbar(false);
                    mainWindow.setOpacity(1.0); // Ensure visible
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        {
            label: 'Start/Stop Recording',
            click: () => {
                // Send message to renderer to toggle recording
                if (mainWindow) {
                    mainWindow.webContents.send('toggle-recording');
                }
            }
        },
        { type: 'separator' },
        {
            label: 'Start with Windows',
            type: 'checkbox',
            checked: store.get('startWithWindows'),
            click: (menuItem) => {
                store.set('startWithWindows', menuItem.checked);
                if (menuItem.checked) {
                    autoLauncher.enable();
                } else {
                    autoLauncher.disable();
                }
            }
        },
        {
            label: 'Start Minimized',
            type: 'checkbox',
            checked: store.get('startMinimized'),
            click: (menuItem) => {
                store.set('startMinimized', menuItem.checked);
            }
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    // Double-click tray icon to open window
    tray.on('double-click', () => {
        if (mainWindow) {
            mainWindow.setSkipTaskbar(false);
            mainWindow.setOpacity(1.0); // Ensure visible
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// Register global hotkey for recording
function registerHotkeys() {
    const hotkey = store.get('hotkey') || 'CommandOrControl+Shift+Space';

    try {
        const registered = globalShortcut.register(hotkey, () => {
            logger('Hotkey pressed!');

            // Check Limit
            let stats = store.get('stats');
            if (!stats) {
                stats = {
                    totalDictationTimeMs: 0,
                    totalWords: 0,
                    wordsThisWeek: 0,
                    weekStartDate: new Date().toISOString()
                };
                store.set('stats', stats);
            }

            // Reset weekly logic here too just in case?
            const weekStart = new Date(stats.weekStartDate);
            const now = new Date();
            const diffDays = Math.ceil(Math.abs(now - weekStart) / (1000 * 60 * 60 * 24));
            if (diffDays > 7) {
                stats.wordsThisWeek = 0;
                stats.weekStartDate = now.toISOString();
                store.set('stats', stats);
            }



            if (mainWindow && !mainWindow.isDestroyed()) {
                // Wake up the renderer invisibly to ensure AudioContext works
                if (!mainWindow.isVisible()) {
                    mainWindow.setOpacity(0.0);
                    mainWindow.showInactive(); // Show without stealing focus
                }

                // Send message to the web app to toggle recording
                mainWindow.webContents.send('trigger-record-toggle');
            }
        });

        if (!registered) {
            logger(`Failed to register hotkey: ${hotkey}`);
        } else {
            logger(`Hotkey registered: ${hotkey}`);
        }
    } catch (e) {
        logger(`Exception registering hotkey: ${e}`);
    }
}

// Setup Updater
function setupAutoUpdater() {
    logger('[Updater] Initializing...');

    autoUpdater.logger = {
        info(msg) { logger(`[Updater] ${msg}`); },
        warn(msg) { logger(`[Updater Warn] ${msg}`); },
        error(msg) { logger(`[Updater Error] ${msg}`); }
    };

    // Trigger check
    try {
        autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
        logger(`[Updater] Error checking: ${e}`);
    }

    autoUpdater.on('update-available', () => {
        logger('[Updater] Update available.');
    });

    autoUpdater.on('update-downloaded', () => {
        logger('[Updater] Update downloaded.');
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'A new version has been downloaded. Restart now to install?',
            buttons: ['Restart', 'Later']
        }).then(({ response }) => {
            if (response === 0) autoUpdater.quitAndInstall();
        });
    });
}

// App lifecycle events - Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        // Register app:// protocol to serve from web-build
        protocol.handle('app', async (req) => {
            try {
                const { pathname } = new URL(req.url);
                logger(`[Protocol] Request: ${req.url} -> pathname: ${pathname}`);

                // Strip leading slash
                const resolvedPath = pathname.replace(/^\//, '');
                let targetPath = path.join(__dirname, 'web-build', resolvedPath);

                // --- ADVANCED ROUTE RESOLUTION ---

                // 1. Handle Next.js RSC/Data requests
                if (resolvedPath.includes('__next')) {
                    const fileName = path.basename(resolvedPath);
                    const dirName = path.dirname(resolvedPath);

                    // 1a. Try exact location (e.g. signup/file.txt)
                    const exactPath = path.join(__dirname, 'web-build', dirName, fileName);

                    // 1b. Try root location (e.g. file.txt)
                    const rootPath = path.join(__dirname, 'web-build', fileName);

                    if (fs.existsSync(exactPath)) {
                        targetPath = exactPath;
                        logger(`[Protocol] Found (exact): ${targetPath}`);
                    } else if (fs.existsSync(rootPath)) {
                        targetPath = rootPath;
                        logger(`[Protocol] Found (root fallback): ${targetPath}`);
                    } else {
                        // 1c. RECURSIVE SEARCH FALLBACK
                        // Next.js static exports put files in unpredictable nested folders.
                        // We will search the entire web-build directory for a file with this name.
                        try {
                            const findFile = (dir, name) => {
                                const files = fs.readdirSync(dir);
                                for (const file of files) {
                                    const fullPath = path.join(dir, file);
                                    let stat;
                                    try {
                                        stat = fs.statSync(fullPath);
                                    } catch (e) { continue; }

                                    if (stat.isDirectory()) {
                                        // Specific Fix: Next.js sometimes creates directories named exactly as the requested file
                                        // e.g. "__next.!KGF1dGgp.signup.txt" is actually a directory containing "__PAGE__.txt"
                                        if (file === name) {
                                            // Check if it's a directory masquerading as the file (RSC payload)
                                            // The actual content is often in __PAGE__.txt inside it
                                            const pagePath = path.join(fullPath, '__PAGE__.txt');
                                            const indexPath = path.join(fullPath, 'index.txt');

                                            if (fs.existsSync(pagePath)) return pagePath;
                                            if (fs.existsSync(indexPath)) return indexPath;

                                            // If regular recursive search, continue down
                                            const found = findFile(fullPath, name);
                                            if (found) return found;
                                        } else {
                                            // Normal directory recursion
                                            const found = findFile(fullPath, name);
                                            if (found) return found;
                                        }
                                    } else if (file === name) {
                                        return fullPath;
                                    }
                                }
                                return null;
                            };

                            const foundPath = findFile(path.join(__dirname, 'web-build'), fileName);
                            if (foundPath) {
                                targetPath = foundPath;
                                logger(`[Protocol] Found (recursive search): ${targetPath}`);
                            }
                        } catch (err) {
                            logger(`[Protocol] Search error: ${err}`);
                        }
                    }
                }

                // 2. Handle Extensionless Routes (e.g., /login -> /login.html)
                if (!path.extname(targetPath)) {
                    if (fs.existsSync(targetPath + '.html')) {
                        targetPath += '.html';
                    } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
                        targetPath = path.join(targetPath, 'index.html');
                    }
                }

                logger(`[Protocol] Final Resolved Path: ${targetPath}`);

                // Check if file exists
                if (!fs.existsSync(targetPath)) {
                    logger(`[Protocol] File not found: ${targetPath}`);
                    // Return 404 response
                    return new Response('Not Found', {
                        status: 404,
                        headers: { 'content-type': 'text/plain' }
                    });
                }

                // Use net.fetch to serve the file
                const fileUrl = require('url').pathToFileURL(targetPath).toString();
                logger(`[Protocol] Serving: ${fileUrl}`);
                return net.fetch(fileUrl);

            } catch (error) {
                logger(`[Protocol] Error: ${error.message}`);
                return new Response(`Error: ${error.message}`, {
                    status: 500,
                    headers: { 'content-type': 'text/plain' }
                });
            }
        });

        logger('App Ready');
        createWindow();
        createOverlayWindow();
        createTray();
        registerHotkeys();
        setupAutoUpdater();

        // macOS: re-create window when dock icon is clicked
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
}

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Don't quit - keep running in tray
        // app.quit();
    }
});

// Clean up before quitting
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// Handle Recording State for Overlay
// Handle Recording State for Overlay
ipcMain.on('recording-state-change', (event, state) => {
    // state can be 'recording', 'processing', 'idle' (or boolean true/false for legacy)
    const isRecording = state === true || state === 'recording';
    const isProcessing = state === 'processing';

    if (overlayWindow && !overlayWindow.isDestroyed()) {
        if (isRecording || isProcessing) {
            overlayWindow.setOpacity(1.0);
            overlayWindow.showInactive(); // Show overlay
        } else {
            // Only hide if completely idle/done
            overlayWindow.hide();
        }
    }

    // Manage Main Window visibility state
    // Only hide main window if we are RECORDING (invisibly). 
    // If processing, we might want to keep it hidden or show it? 
    // For now, let's keep previous logic: if we stop recording (go to idle or processing), restore opacity if needed.
    if (!isRecording && !isProcessing && mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.getOpacity() < 1.0) {
            mainWindow.hide();
            mainWindow.setOpacity(1.0); // Reset for next valid open
        }
    }
});

// Handle messages from the renderer process
ipcMain.handle('get-settings', () => {
    return store.store;
});

ipcMain.handle('save-settings', (event, newSettings) => {
    // Merge updates into store
    if (newSettings.translation) store.set('translation', newSettings.translation);
    if (newSettings.microphoneId) store.set('microphoneId', newSettings.microphoneId);
    return true;
});

// Handle Stats
ipcMain.handle('get-stats', () => {
    let stats = store.get('stats');
    if (!stats) {
        stats = {
            totalDictationTimeMs: 0,
            totalWords: 0,
            wordsThisWeek: 0,
            weekStartDate: new Date().toISOString()
        };
        store.set('stats', stats);
    }

    // Check if week has passed
    const weekStart = new Date(stats.weekStartDate);
    const now = new Date();
    const diffTime = Math.abs(now - weekStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
        // Reset weekly stats
        stats.wordsThisWeek = 0;
        stats.weekStartDate = now.toISOString();
        store.set('stats', stats);
    }

    // Get additional metrics
    const dictionary = store.get('dictionary') || [];
    const dictionarySize = dictionary.length;

    // Ensure correctionsCount exists in returned object (it might be undefined in store)
    const correctionsCount = stats.correctionsCount || 0;

    return {
        ...stats,
        dictionarySize,
        correctionsCount
    };
});

ipcMain.handle('update-stats', (event, { durationMs, wordCount }) => {
    let stats = store.get('stats');
    if (!stats) {
        stats = {
            totalDictationTimeMs: 0,
            totalWords: 0,
            wordsThisWeek: 0,
            weekStartDate: new Date().toISOString()
        };
    }

    stats.totalDictationTimeMs += durationMs;
    stats.totalWords += wordCount;
    stats.wordsThisWeek += wordCount;

    store.set('stats', stats);
    return stats;
});

// Dictionary Handlers
ipcMain.handle('get-dictionary', () => {
    return store.get('dictionary') || [];
});

ipcMain.handle('add-dictionary-word', (event, word) => {
    const current = store.get('dictionary') || [];
    if (!current.includes(word)) {
        current.push(word);
        store.set('dictionary', current);
    }
    return current;
});

ipcMain.handle('remove-dictionary-word', (event, word) => {
    const current = store.get('dictionary') || [];
    const filtered = current.filter(w => w !== word);
    store.set('dictionary', filtered);
    return filtered;
});

// History Handlers
function cleanupHistory() {
    const retention = store.get('retentionPeriod') || 'forever';
    if (retention === 'forever') return;
    if (retention === 'never') {
        store.set('history', []);
        return;
    }

    const history = store.get('history') || [];
    const now = Date.now();
    let cutoff = 0;

    if (retention === '24h') cutoff = now - (24 * 60 * 60 * 1000);
    else if (retention === '1w') cutoff = now - (7 * 24 * 60 * 60 * 1000);
    else if (retention === '1m') cutoff = now - (30 * 24 * 60 * 60 * 1000);

    if (cutoff > 0) {
        const filtered = history.filter(item => item.timestamp > cutoff);
        if (filtered.length !== history.length) {
            store.set('history', filtered);
        }
    }
}

ipcMain.handle('get-history', () => {
    cleanupHistory(); // Ensure clean on fetch
    return store.get('history') || [];
});

ipcMain.handle('add-history-entry', (event, text) => {
    const retention = store.get('retentionPeriod') || 'forever';
    if (retention === 'never') return [];

    const history = store.get('history') || [];
    const entry = {
        id: Date.now().toString(),
        text,
        timestamp: Date.now()
    };

    // Add to front
    history.unshift(entry);

    // Safety limit: Keep max 1000 entries to prevent infinite growth issues
    if (history.length > 1000) {
        history.length = 1000;
    }

    store.set('history', history);
    cleanupHistory();
    return history;
});

ipcMain.handle('clear-history', () => {
    store.set('history', []);
    return [];
});

ipcMain.handle('get-retention-settings', () => {
    return store.get('retentionPeriod') || 'forever';
});

ipcMain.handle('set-retention-settings', (event, period) => {
    store.set('retentionPeriod', period);
    cleanupHistory();
    return period;
});


// Handle Deepgram Key
ipcMain.handle('get-deepgram-key', () => {
    // In a real app we might want to fetch a temporary key from a server here
    // or return the env key if we trust the local environment.
    // For Desktop, we trust the user.
    const key = process.env.DEEPGRAM_API_KEY || process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    if (!key) {
        logger('[Deepgram] Error: No DEEPGRAM_API_KEY found in env');
        return null;
    }
    return key;
});

// Handle AI Refinement
logger('[Main] Registering refine-text IPC handler...');
ipcMain.handle('refine-text', async (event, text, options = {}) => {
    try {
        logger(`[Refinement] Request received (length: ${text.length} chars)`);
        // logger(`[Refinement] Options: ${JSON.stringify(options)}`); // Debug log

        // Check for translation - Fallback to global store setting if not passed
        let translation = options.translation;
        if (!translation || typeof translation.enabled === 'undefined') {
            // Fallback: Check store directly
            translation = store.get('translation');
        }

        // Defaults
        translation = translation || { enabled: false, targetLanguage: 'Spanish' };

        const isTranslation = translation.enabled === true && !!translation.targetLanguage;

        if (isTranslation) {
            logger(`[Refinement] Mode: TRANSLATION to ${translation.targetLanguage}`);
        } else {
            logger(`[Refinement] Mode: STANDARD DICTATION`);
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            logger('[Refinement] Error: No ANTHROPIC_API_KEY found in process.env');
            throw new Error('Anthropic API key not configured');
        }
        logger(`[Refinement] API Key found (starts with: ${apiKey.substring(0, 7)}...)`);

        const anthropic = new Anthropic({ apiKey });

        let systemPrompt = `You are a strict transcription formatter. You have ONE ABSOLUTE RULE that you MUST follow:

IF the input contains a list of 2 or more items (items can be separated by commas, "then", "also", "and", "or", or even just spoken sequentially), you MUST format them as a clean bulleted list.

FORMATTING RULES:
1. Detect any intentional sequence of items, tasks, or objects.
2. If a list is detected → Output a brief introductory line followed by bullet points (starting with "- ").
3. If NO list is detected → Clean up the text (remove filler words like "um", "uh", fix grammar, add punctuation).
4. KEEP IT CONCISE. Do not add introductory conversational filler like "Here is your refined text".

You are the engine for Neato Voice. Users expect high-fidelity, structured output.`;

        let userPrompt = `Replicate this EXACT formatting pattern for all lists:

EXAMPLE 1 (Standard):
Input: "I need to mow the lawn, get gas in the car and call Mom"
Output:
Tasks to complete:
- Mow the lawn
- Get gas in the car
- Call Mom

EXAMPLE 2 (No commas):
Input: "get eggs milk butter and bread"
Output:
Grocery list:
- Eggs
- Milk
- Butter
- Bread

EXAMPLE 3 (Conversational list):
Input: "I think for the meeting we should discuss the budget then the hiring plan and finally the office move"
Output:
Meeting agenda:
- Budget discussion
- Hiring plan
- Office move coordination

Now apply this pattern to the following input:

Input: "${text}"

Output:`;

        if (isTranslation) {
            logger(`[Refinement] Translating to ${translation.targetLanguage}`);
            systemPrompt = `Translate the following transcribed text to ${translation.targetLanguage}.
Rules:
1. Preserve the original meaning and tone.
2. Fix any obvious transcription errors before translating.
3. Output ONLY the translated text, no preamble or explanations.`;
            userPrompt = `Translate this: "${text}"`;
        }

        logger('[Refinement] Calling Claude API...');
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 2048,
            system: systemPrompt,
            messages: [{
                role: "user",
                content: userPrompt
            }]
        });

        const refinedText = response.content[0].text.trim();
        logger(`[Refinement] Success. Result length: ${refinedText.length}`);
        logger(`[Refinement] AI Output (first 200 chars): ${refinedText.substring(0, 200)}`);

        // Log full output for debugging (can be disabled later)
        logger('[Refinement] FULL AI OUTPUT:');
        logger('---START---');
        logger(refinedText);
        logger('---END---');

        // Update Correction Stats
        try {
            const currentStats = store.get('stats') || {};
            currentStats.correctionsCount = (currentStats.correctionsCount || 0) + 1;
            store.set('stats', currentStats);
        } catch (e) {
            logger(`[Stats] Error updating corrections: ${e}`);
        }

        return refinedText;

    } catch (error) {
        logger(`[Refinement] Error: ${error.message}`);
        logger(`[Refinement] Stack: ${error.stack}`);
        // If refinement fails, return original text so the user's workflow isn't blocked
        return text;
    }
});

// Handle text injection
const { clipboard } = require('electron');
const { spawn } = require('child_process');

ipcMain.on('inject-text', async (event, text) => {
    if (!text) return;

    console.log('[Main] Received inject-text request, text length:', text.length);
    // console.log('[Main] Text to inject:', text.substring(0, 100) + '...'); // Disabled for privacy

    // Send confirmation back to renderer
    event.reply('inject-text-response', { success: true, textLength: text.length });

    // 1. Write text to clipboard
    clipboard.writeText(text);
    console.log('[Main] Text written to clipboard');

    // 2. Hide the main window to ensure the target app has focus
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isVisible()) {
            mainWindow.minimize(); // Only minimize if actually visible
            console.log('[Main] Window minimized from visible state');
        } else {
            console.log('[Main] Window already hidden/minimized, preserving focus');
        }
    }

    // 3. Wait a bit for window to minimize, then simulate Ctrl+V
    setTimeout(() => {
        const ps = spawn('powershell', [
            '-NoProfile',
            '-WindowStyle', 'Hidden',
            '-Command',
            // Longer delay to ensure the target window has focus
            'Start-Sleep -Milliseconds 500; Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("^v")'
        ], {
            detached: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });

        ps.stdout.on('data', (data) => {
            console.log('[Main] PowerShell stdout:', data.toString());
        });

        ps.stderr.on('data', (data) => {
            console.error('[Main] PowerShell stderr:', data.toString());
        });

        ps.on('close', (code) => {
            console.log('[Main] PowerShell process exited with code:', code);
        });

        ps.on('error', (err) => {
            console.error('[Main] PowerShell spawn error:', err);
        });
    }, 200); // Wait 200ms for window to minimize
});
