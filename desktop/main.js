// desktop/main.js
// This is the main Electron process - it controls the app window and system integration

const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

// Fix for background recording/throttling when minimized
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const path = require('path');
const Store = require('electron-store');
const AutoLaunch = require('auto-launch');
const { Anthropic } = require('@anthropic-ai/sdk');
// Load .env from strictly defined path to ensure it works in production
// In production (asar), process.cwd() might not be what we expect
const envPath = app.isPackaged
    ? path.join(process.resourcesPath, '.env')
    : path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });

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
function log(message) {
    try {
        const userDataPath = app.getPath('userData');
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        const logPath = path.join(userDataPath, 'neato.log');
        fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
    } catch (e) {
        console.log(message);
    }
}

// Auto-launcher setup
const autoLauncher = new AutoLaunch({
    name: 'Neato Voice',
    path: app.getPath('exe'),
});

// Create the main application window
function createWindow() {
    log('Creating window...');
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
        log('Loading dev server');
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // Load the live production web app
        log('Loading production URL');
        mainWindow.loadURL('https://neato-voice.netlify.app');
        // mainWindow.webContents.openDevTools();
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
    log('Creating overlay window...');
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
        // Fix: Next.js export creates overlay/index.html, not overlay.html
        const overlayPath = path.join(__dirname, 'web-build', 'overlay', 'index.html');
        log(`Loading Overlay from: ${overlayPath}`);

        overlayWindow.loadFile(overlayPath)
            .then(() => log('[Overlay] Loaded successfully'))
            .catch(e => {
                log(`[Overlay] Failed to load overlay file: ${e}`);
                // Fallback try overlay.html just in case config changes
                const fallback = path.join(__dirname, 'web-build', 'overlay.html');
                overlayWindow.loadFile(fallback).catch(e2 => log(`[Overlay] Failed fallback: ${e2}`));
            });
    }

    // Ensure it's ready
    overlayWindow.once('ready-to-show', () => {
        log('[Overlay] Ready to show');
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
            log('Hotkey pressed!');

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
            log(`Failed to register hotkey: ${hotkey}`);
        } else {
            log(`Hotkey registered: ${hotkey}`);
        }
    } catch (e) {
        log(`Exception registering hotkey: ${e}`);
    }
}

// Setup Updater
function setupAutoUpdater() {
    log('[Updater] Initializing...');

    autoUpdater.logger = {
        info(msg) { log(`[Updater] ${msg}`); },
        warn(msg) { log(`[Updater Warn] ${msg}`); },
        error(msg) { log(`[Updater Error] ${msg}`); }
    };

    // Trigger check
    try {
        autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
        log(`[Updater] Error checking: ${e}`);
    }

    autoUpdater.on('update-available', () => {
        log('[Updater] Update available.');
    });

    autoUpdater.on('update-downloaded', () => {
        log('[Updater] Update downloaded.');
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
        log('App Ready');
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


// Handle AI Refinement
ipcMain.handle('refine-text', async (event, text, options = {}) => {
    try {
        log(`[Refinement] Request received (length: ${text.length} chars)`);
        // log(`[Refinement] Options: ${JSON.stringify(options)}`); // Debug log

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
            log(`[Refinement] Mode: TRANSLATION to ${translation.targetLanguage}`);
        } else {
            log(`[Refinement] Mode: STANDARD DICTATION`);
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            log('[Refinement] Error: No ANTHROPIC_API_KEY found');
            throw new Error('Anthropic API key not configured');
        }

        const anthropic = new Anthropic({ apiKey });

        let prompt = `Refine the following transcribed text.
Rules:
1. Remove filler words (um, uh, ah, like, you know).
2. Fix grammar and punctuation.
3. If the user corrects themselves, use the corrected version.
4. **CRITICAL:** If there are 3+ items or actions, YOU MUST format them as a bulleted list.
   - Example: "I need to X, Y, and Z" -> 
     * X
     * Y
     * Z
5. Output ONLY the refined text, no preamble.`;

        if (isTranslation) {
            log(`[Refinement] Translating to ${translation.targetLanguage}`);
            prompt = `Translate the following transcribed text to ${translation.targetLanguage}.
Rules:
1. Preserve the original meaning and tone.
2. Fix any obvious transcription errors before translating.
3. Output ONLY the translated text, no preamble or explanations.`;
        }

        prompt += `\n\nText to refine: "${text}"`;

        log('[Refinement] Calling Claude API...');
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }]
        });

        const refinedText = response.content[0].text.trim();
        log(`[Refinement] Success. Result length: ${refinedText.length}`);

        // Update Correction Stats
        try {
            const currentStats = store.get('stats') || {};
            currentStats.correctionsCount = (currentStats.correctionsCount || 0) + 1;
            store.set('stats', currentStats);
        } catch (e) {
            log(`[Stats] Error updating corrections: ${e}`);
        }

        return refinedText;

    } catch (error) {
        log(`[Refinement] Error: ${error.message}`);
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
