# Neato Voice Desktop App - Update System Implementation

## Overview
This document describes the implementation of auto-updates and installer creation for the Neato Voice desktop app.

## Part 2: Auto-Updater System

### Current State
- No update mechanism exists
- Users must manually download and install updates
- No version checking

### Implementation Plan

1. **Install Dependencies**
   - `electron-updater` - For auto-update functionality
   - `electron-builder` -For building installers with update support

2. **Configure electron-builder**
   - Add electron-builder config to package.json
   - Configure for Windows builds
   - Set up GitHub Releases as update server

3. **Implement Auto-Update Logic in main.js**
   - Check for updates on app startup
   - Show notification when update available
 - Download and install in background
   - Restart app after update

4. **Update Workflow**
   - Developer: Push code → Tag release → Build installer → Upload to GitHub Releases
   - User: App checks on startup → Downloads update → Prompts to restart

## Part 3: Real Installer

### Current State
- Download button links to logo SVG
- No actual installer exists
- No build script configured

### Implementation Plan

1. **Configure Electron Builder**
   - Windows targets: NSIS installer (.exe)
   - Include app icon
   - Auto-start on login (optional)
   - Create desktop shortcut

2. **Build Scripts**
   - Add build commands to package.json
   - Configure for production builds

3. **CI/CD (Future)**
   - GitHub Actions to auto-build on release
   - Auto-upload installer to GitHub Releases

## Current Version
- Starting version: 1.0.0

## Files Modified
- `/desktop/package.json` - Add dependencies and build config
- `/desktop/main.js` - Add auto-update logic
- `/web/app/page.tsx` - Update download link to point to real installer

## Testing
- Build installer locally
- Test update mechanism with mock update server
- Verify installer works on clean Windows machine
