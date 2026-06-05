# Sentinel's Journal - Critical Security Learnings

## 2025-02-23 - Insecure Extension Initialization via Tab Title
**Vulnerability:** The extension identified the configuration source (MMP instance) solely by the tab title "MMP - Maker Management Platform".
**Learning:** This allowed any malicious website to spoof the MMP management page by setting its `<title>`, potentially tricking users into initializing the extension with a malicious backend that could steal sensitive cookies (e.g., from MakerWorld).
**Prevention:** Always verify the origin of the configuration source and present it to the user for manual confirmation. Anchoring the initialization to a verified origin prevents title-spoofing attacks.

## 2025-02-23 - DOM-based XSS in Extension UI
**Vulnerability:** The extension used `.innerHTML` to display messages from external APIs and status updates.
**Learning:** If the backend or a spoofed backend provides malicious HTML/script in its response, it could execute in the context of the extension, which has broad permissions (cookies, storage, etc.).
**Prevention:** Use `.textContent` instead of `.innerHTML` when rendering data that does not explicitly require HTML formatting, especially when the data source is external or configurable.

## 2025-06-05 - Verified Origin Bypass in Extension Initialization
**Vulnerability:** A malicious `settings.json` on a verified origin could specify a `local_backend` on a different, attacker-controlled origin, bypassing the user's manual confirmation of the initialization source.
**Learning:** Initializing the extension with a verified origin is not enough if the fetched configuration can redirect traffic to an unverified third party. This could lead to the theft of sensitive cookies from supported platforms.
**Prevention:** For configurable backends, resolve paths using `new URL(path, base)` and strictly validate that `backendUrl.origin` matches the verified `origin` to prevent redirection to malicious origins.
