# Sentinel's Journal - Critical Security Learnings

## 2025-02-23 - Insecure Extension Initialization via Tab Title
**Vulnerability:** The extension identified the configuration source (MMP instance) solely by the tab title "MMP - Maker Management Platform".
**Learning:** This allowed any malicious website to spoof the MMP management page by setting its `<title>`, potentially tricking users into initializing the extension with a malicious backend that could steal sensitive cookies (e.g., from MakerWorld).
**Prevention:** Always verify the origin of the configuration source and present it to the user for manual confirmation. Anchoring the initialization to a verified origin prevents title-spoofing attacks.

## 2025-02-23 - DOM-based XSS in Extension UI
**Vulnerability:** The extension used `.innerHTML` to display messages from external APIs and status updates.
**Learning:** If the backend or a spoofed backend provides malicious HTML/script in its response, it could execute in the context of the extension, which has broad permissions (cookies, storage, etc.).
**Prevention:** Use `.textContent` instead of `.innerHTML` when rendering data that does not explicitly require HTML formatting, especially when the data source is external or configurable.

## 2025-02-24 - Cross-Window Tab Hijacking in Extension Popup
**Vulnerability:** The extension used `chrome.tabs.query({ active: true })` without `currentWindow: true`, which could return active tabs from all open windows.
**Learning:** This allowed the extension to potentially show the wrong UI (e.g., the initialization screen for a spoofed MMP tab in another window) even if the user was currently looking at a legitimate supported site in the current window. It also risked sending data from a tab in one window to a backend configured by a tab in another.
**Prevention:** Always use `currentWindow: true` when querying for the active tab in extension popups to ensure interaction is limited to the user's current window.
