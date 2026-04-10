# Sentinel's Journal - Critical Security Learnings

## 2025-02-23 - Insecure Extension Initialization via Tab Title
**Vulnerability:** The extension identified the configuration source (MMP instance) solely by the tab title "MMP - Maker Management Platform".
**Learning:** This allowed any malicious website to spoof the MMP management page by setting its `<title>`, potentially tricking users into initializing the extension with a malicious backend that could steal sensitive cookies (e.g., from MakerWorld).
**Prevention:** Always verify the origin of the configuration source and present it to the user for manual confirmation. Anchoring the initialization to a verified origin prevents title-spoofing attacks.

## 2025-02-23 - DOM-based XSS in Extension UI
**Vulnerability:** The extension used `.innerHTML` to display messages from external APIs and status updates.
**Learning:** If the backend or a spoofed backend provides malicious HTML/script in its response, it could execute in the context of the extension, which has broad permissions (cookies, storage, etc.).
**Prevention:** Use `.textContent` instead of `.innerHTML` when rendering data that does not explicitly require HTML formatting, especially when the data source is external or configurable.

## 2026-04-10 - Verified Origin Bypass in Configuration
**Vulnerability:** The extension fetched a `settings.json` file from a verified origin but didn't validate that the `local_backend` URL inside that file matched the same origin.
**Learning:** For configurable backends, resolve paths using `new URL(path, base)` and strictly validate that `backendUrl.origin` matches the base origin to prevent an attacker-controlled JSON from redirecting traffic to a malicious server.
**Prevention:** Always validate that dynamically loaded configuration URLs align with the trusted source's origin before using them for sensitive operations like project imports.
