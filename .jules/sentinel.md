## 2026-02-22 - [Insecure Initialization and Session Exfiltration]
**Vulnerability:** The extension relied solely on the page title ("MMP - Maker Management Platform") to trigger initialization and subsequent cookie exfiltration. A malicious site could spoof this title to capture session cookies.
**Learning:** Browser extensions that handle sensitive data like session cookies must strictly verify the origin of the communication partner.
**Prevention:** Use `currentWindow: true` in tab queries to ensure interaction with the active UI, and always present the target origin to the user for manual verification before proceeding with sensitive operations.
