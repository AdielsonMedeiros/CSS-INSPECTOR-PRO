
// Script for the popup UI
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn') as HTMLButtonElement;
    const statusText = document.getElementById('status-text') as HTMLSpanElement;

    if (!toggleBtn || !statusText) return;

    toggleBtn.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab?.id) {
                // Send message efficiently
                // We don't await the callback to avoid hanging UI on 'lastError'
                chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_INSPECTOR' }, () => {
                    
                    if (chrome.runtime.lastError) {
                       
                        return;
                    }
                });

                // Toggle Visual State locally
                const isNowActive = toggleBtn.classList.toggle('active');
                updateVisuals(isNowActive);
            }
        } catch (e) {
            console.error('Popup error:', e);
        }
    });

    function updateVisuals(isActive: boolean) {
        if (isActive) {
            toggleBtn.textContent = 'ON';
            toggleBtn.style.background = '#10b981'; // Green
            statusText.textContent = 'Inspector Active';
            statusText.style.color = '#10b981';
        } else {
            toggleBtn.textContent = 'OFF';
            toggleBtn.style.background = '#ef4444'; // Red
            statusText.textContent = 'Inspector Paused';
            statusText.style.color = '#ef4444';
        }
    }
});
