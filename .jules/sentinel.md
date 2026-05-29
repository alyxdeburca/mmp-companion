# Sentinel's Journal - Critical Security Learnings

## 2025-02-23 - Insecure Extension Initialization via Tab Title
**Vulnerability:** The extension identified the configuration source (MMP instance) solely by the tab title "MMP - Maker Management Platform".
**Learning:** This allowed any malicious website to spoof the MMP management page by setting its `<title>`, potentially tricking users into initializing the extension with a malicious backend that could steal sensitive cookies (e.g., from MakerWorld).
**Prevention:** Always verify the origin of the configuration source and present it to the user for manual confirmation. Anchoring the initialization to a verified origin prevents title-spoofing attacks.

## 2025-02-23 - DOM-based XSS in Extension UI
**Vulnerability:** The extension used `.innerHTML` to display messages from external APIs and status updates.
**Learning:** If the backend or a spoofed backend provides malicious HTML/script in its response, it could execute in the context of the extension, which has broad permissions (cookies, storage, etc.).
**Prevention:** Use `.textContent` instead of `.innerHTML` when rendering data that does not explicitly require HTML formatting, especially when the data source is external or configurable.

## 2025-02-24 - Verified Origin Bypass in Extension Configuration
**Vulnerability:** The extension fetched `settings.json` from a verified origin but trusted its `local_backend` value blindly, allowing the configuration to redirect all subsequent API calls (including those carrying sensitive session cookies) to an attacker-controlled domain.
**Learning:** Even when the source of configuration is verified (e.g., via origin check or manual confirmation), individual fields within that configuration must be validated against the security boundary established for that source.
**Prevention:** Strictly validate that the origin of any configurable backend matches the origin of the configuration source itself. Use `new URL()` for robust resolution and origin comparison.
