
// Script for the popup UI
document.addEventListener('DOMContentLoaded', async () => {
    const toggleBtn = document.getElementById('toggle-btn') as HTMLButtonElement;
    const statusText = document.getElementById('status-text') as HTMLSpanElement;

    if (!toggleBtn || !statusText) return;

    // Estado local do popup
    let isActive = false;

    // Ao abrir o popup, tenta obter o estado atual do content script
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { action: 'GET_STATE' }, (response) => {
                if (chrome.runtime.lastError) {
                    // Content script não está carregado nesta página
                    updateVisuals(false);
                    return;
                }
                if (response && typeof response.isActive === 'boolean') {
                    isActive = response.isActive;
                    updateVisuals(isActive);
                }
            });
        }
    } catch (e) {
        console.error('Popup init error:', e);
    }

    toggleBtn.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab?.id) {
                chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_INSPECTOR' }, (response) => {
                    if (chrome.runtime.lastError) {
                        // Content script não está carregado
                        statusText.textContent = 'Reload page first';
                        statusText.style.color = '#f59e0b';
                        return;
                    }
                    
                    if (response && typeof response.isActive === 'boolean') {
                        isActive = response.isActive;
                        updateVisuals(isActive);
                    }
                });
            }
        } catch (e) {
            console.error('Popup error:', e);
        }
    });

    function updateVisuals(active: boolean) {
        if (active) {
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
