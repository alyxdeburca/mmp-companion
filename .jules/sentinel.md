# Sentinel's Journal - Critical Security Learnings

## 2025-02-23 - Insecure Extension Initialization via Tab Title
**Vulnerability:** The extension identified the configuration source (MMP instance) solely by the tab title "MMP - Maker Management Platform".
**Learning:** This allowed any malicious website to spoof the MMP management page by setting its `<title>`, potentially tricking users into initializing the extension with a malicious backend that could steal sensitive cookies (e.g., from MakerWorld).
**Prevention:** Always verify the origin of the configuration source and present it to the user for manual confirmation. Anchoring the initialization to a verified origin prevents title-spoofing attacks.

## 2025-02-23 - DOM-based XSS in Extension UI
**Vulnerability:** The extension used `.innerHTML` to display messages from external APIs and status updates.
**Learning:** If the backend or a spoofed backend provides malicious HTML/script in its response, it could execute in the context of the extension, which has broad permissions (cookies, storage, etc.).
**Prevention:** Use `.textContent` instead of `.innerHTML` when rendering data that does not explicitly require HTML formatting, especially when the data source is external or configurable.

## 2026-02-25 - Sensitive Data Exposure in Developer Console
**Vulnerability:** The extension was logging full authentication cookies and configuration objects (including potential API keys) to the browser's developer console.
**Learning:** Browser extensions that handle sensitive session data must avoid all forms of logging that could expose this data. Even if intended for debugging, such logs can be captured by other tools or seen by anyone with access to the browser, leading to session hijacking or credential theft.
**Prevention:** Implement a strict "no-log" policy for sensitive objects. Use targeted logging for debugging only, and ensure all production-ready code has sensitive logs removed. Sanitizing logs or using a dedicated secure logging framework is preferred if logging is necessary.
