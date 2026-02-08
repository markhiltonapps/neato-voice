// desktop/preload.js
// This script runs before the web page loads and provides a secure bridge
// between the Electron main process and the web app

console.log('[Preload] Script is loading...');

const { contextBridge, ipcRenderer } = require('electron');

console.log('[Preload] Electron modules loaded, exposing API...');

// Expose protected methods to the web app
contextBridge.exposeInMainWorld('electronAPI', {
    // Listen for toggle-recording events from main process (hotkey pressed)
    onToggleRecording: (callback) => {
        ipcRenderer.on('trigger-record-toggle', callback);
    },

    // Remove the listener when component unmounts
    removeToggleRecordingListener: () => {
        ipcRenderer.removeAllListeners('toggle-recording');
    },

    // Get app settings
    getSettings: () => ipcRenderer.invoke('get-settings'),

    // Save a setting
    setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),

    // Inject text into active application
    injectText: (text) => {
        console.log('[Preload] Sending inject-text IPC with text length:', text.length);
        ipcRenderer.send('inject-text', text);

        // Listen for response
        ipcRenderer.once('inject-text-response', (event, data) => {
            console.log('[Preload] Received inject-text-response:', data);
        });
    },

    // Refine text using AI in the main process
    refineText: (text, options) => ipcRenderer.invoke('refine-text', text, options),

    // Stats
    getStats: () => ipcRenderer.invoke('get-stats'),
    updateStats: (data) => ipcRenderer.invoke('update-stats', data),

    // Auth/Keys
    getDeepgramApiKey: () => ipcRenderer.invoke('get-deepgram-key'),

    // Dictionary
    getDictionary: () => ipcRenderer.invoke('get-dictionary'),
    addDictionaryWord: (word) => ipcRenderer.invoke('add-dictionary-word', word),
    removeDictionaryWord: (word) => ipcRenderer.invoke('remove-dictionary-word', word),

    // History
    getHistory: () => ipcRenderer.invoke('get-history'),
    addHistoryEntry: (text) => ipcRenderer.invoke('add-history-entry', text),
    clearHistory: () => ipcRenderer.invoke('clear-history'),
    getRetentionSettings: () => ipcRenderer.invoke('get-retention-settings'),
    setRetentionSettings: (period) => ipcRenderer.invoke('set-retention-settings', period),

    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

    // Check if running in Electron
    isElectron: true,

    // Get app version
    getVersion: () => ipcRenderer.invoke('get-version'),

    // Notify backend of recording state (for overlay)
    setRecordingState: (isRecording) => ipcRenderer.send('recording-state-change', isRecording),
});

console.log('[Preload] electronAPI exposed to window successfully');
