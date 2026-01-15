/**
 * CSS Inspector Pro - Background Script
 */

console.log('[CSS Inspector Pro] Background Service Worker Loaded');

// We don't need much logic here since the Popup handles the UI interactions
// and the Content Script handles the logic.

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extensions installed successfully');
  }
});
