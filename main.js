console.log('Hi there traveler!');
const supportedSites = ['https://makerworld.com', 'https://www.thingiverse.com'];
const actions = { show: {} };

let settings = null; // Declare global settings variable

// Define the init function early
const init = async () => {
    console.log("Current settings:", settings);
    // Only look at the active tab in the current window for security and clarity
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    // Check for the "MMP - Maker Management Platform" tab
    if (tab && tab.title === "MMP - Maker Management Platform") {
        await showInit(tab);
        return;
    }

    // Handle supported sites
    if (tab) {
        try {
            const url = new URL(tab.url);
            if (supportedSites.includes(url.origin)) {
                await actions.show[url.origin]();
            }
        } catch (e) {
            console.error("Invalid URL:", tab.url);
        }
    }
};

// Send a POST request with a payload
const send = async (payload) => {
    return await fetch(settings.local_backend + "/downloader/fetch", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
    });
};

// Toggle the display of different screens
const toggleScreen = (id) => {
    const newScreen = document.getElementById(id);
    if (newScreen) {
        newScreen.style.display = 'block';
        document.getElementById("default-screen").style.display = 'none';
    }
};

// Initialize the settings by fetching from settings.json
const showInit = async (tab) => {
    const initBtn = document.getElementById("init-btn");
    const initOrigin = document.getElementById("init-origin");

    const url = new URL(tab.url);
    const origin = url.origin;

    if (initOrigin) {
        initOrigin.textContent = `Target: ${origin}`;
    }

    initBtn.onclick = async () => {
        try {
            const response = await fetch(origin + '/settings.json');
            if (!response.ok) {
                console.error("Failed to fetch settings.json:", response.status);
                return;
            }

            const fetchedSettings = await response.json();
            console.log("Fetched settings:", fetchedSettings);

            // Handle both local_backend and localBackend
            settings = fetchedSettings.local_backend
            ? fetchedSettings
            : { ...fetchedSettings, local_backend: fetchedSettings.localBackend };

            if (settings.local_backend && typeof settings.local_backend === "string") {
                if (settings.local_backend.startsWith("/")) {
                    settings.local_backend = origin + settings.local_backend;
                }
                // Save the settings and update the "initialized" status
                await chrome.storage.sync.set({ settings, initialized: true });
                console.log("Settings saved to chrome storage:", settings);
                toggleInitializedStatus();
                init();
            } else {
                console.error("Invalid or missing local_backend in settings.json.");
            }
        } catch (error) {
            console.error("Error processing settings.json:", error);
        }
    };
    toggleScreen("init-screen");
};

// Toggle "initialized" status in the UI
const toggleInitializedStatus = () => {
    const initBtn = document.getElementById("init-btn");
    if (initBtn) {
        initBtn.innerText = "Initialized";
        initBtn.disabled = true; // Disable the button after initialization
    }
};

// Handle MakerWorld actions
actions.show['https://makerworld.com'] = async () => {
    const msgCmp = document.getElementById("mkw-msg");
    const importCMP = document.getElementById("mkw-import");

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (tab) {
        const url = new URL(tab.url);
        if (url.origin === 'https://makerworld.com' && !url.pathname.includes("/models/")) {
            msgCmp.textContent = "This is not an importable project page.";
            importCMP.style.display = 'none';
        }
    }

    importCMP.onclick = async () => {
        const cookies = await chrome.cookies.getAll({ domain: "makerworld.com" });
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (tab && new URL(tab.url).origin === 'https://makerworld.com') {
            const payload = { cookies, url: tab.url };
            const response = await send(payload);
            if (response.status !== 200) {
                const data = await response.json();
                msgCmp.textContent = data.message;
            } else {
                msgCmp.textContent = "Great Success!";
            }
        }
    };
    toggleScreen("mkw-screen");
};

// Handle Thingiverse actions
actions.show['https://www.thingiverse.com'] = async () => {
    const msgCmp = document.getElementById("tv-msg");
    const importCMP = document.getElementById("tv-import");

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (tab) {
        const url = new URL(tab.url);
        if (url.origin === 'https://www.thingiverse.com' && !url.pathname.includes("/thing:")) {
            msgCmp.textContent = "This is not an importable project page.";
            importCMP.style.display = 'none';
        }
    }

    importCMP.onclick = async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (tab && new URL(tab.url).origin === 'https://www.thingiverse.com') {
            const payload = { url: tab.url };
            const response = await send(payload);
            if (response.status !== 200) {
                const data = await response.json();
                msgCmp.textContent = data.message;
            } else {
                msgCmp.textContent = "Great Success!";
            }
        }
    };
    toggleScreen("tv-screen");
};

// Fetch the settings from chrome storage
const mmpBackendStorage = await chrome.storage.sync.get("settings");
console.log("Backend storage settings:", mmpBackendStorage);

if (mmpBackendStorage.settings) {
    settings = mmpBackendStorage.settings;
}

// Check if already initialized
const checkInitializedStatus = async () => {
    const storedData = await chrome.storage.sync.get(["initialized", "settings"]);
    if (storedData.initialized) {
        toggleInitializedStatus();
    } else {
        console.log("Not initialized yet.");
    }
};

// Call this after loading the script to check if initialization is done
await checkInitializedStatus();

// Call init to start the process
await init();
