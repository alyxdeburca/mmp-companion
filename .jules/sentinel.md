# Sentinel's Journal - Critical Security Learnings

## 2025-02-23 - Insecure Extension Initialization via Tab Title
**Vulnerability:** The extension identified the configuration source (MMP instance) solely by the tab title "MMP - Maker Management Platform".
**Learning:** This allowed any malicious website to spoof the MMP management page by setting its `<title>`, potentially tricking users into initializing the extension with a malicious backend that could steal sensitive cookies (e.g., from MakerWorld).
**Prevention:** Always verify the origin of the configuration source and present it to the user for manual confirmation. Anchoring the initialization to a verified origin prevents title-spoofing attacks.

## 2025-02-23 - DOM-based XSS in Extension UI
**Vulnerability:** The extension used `.innerHTML` to display messages from external APIs and status updates.
**Learning:** If the backend or a spoofed backend provides malicious HTML/script in its response, it could execute in the context of the extension, which has broad permissions (cookies, storage, etc.).
**Prevention:** Use `.textContent` instead of `.innerHTML` when rendering data that does not explicitly require HTML formatting, especially when the data source is external or configurable.

## 2025-02-24 - Verified Origin Bypass in Configuration
**Vulnerability:** The extension fetched a `settings.json` file from a verified origin but accepted any `local_backend` URL inside it, including those pointing to different origins.
**Learning:** An attacker-controlled or compromised JSON could redirect subsequent API calls containing sensitive data (like authentication cookies) to a malicious server, even if the user correctly identified the initial setup page.
**Prevention:** Strictly validate that any backend URL provided in a configuration file matches the origin from which the configuration was fetched, using the `URL` constructor for robust resolution and comparison.
