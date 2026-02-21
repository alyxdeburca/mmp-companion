## 2025-05-14 - Insecure Instance Initialization via Tab Title
**Vulnerability:** The extension identified and trusted the MMP management page solely by its HTML title ("MMP - Maker Management Platform"), potentially allowing a malicious site to spoof it and steal session cookies.
**Learning:** A malicious website can spoof a page title to trick the user into "initializing" the extension against a rogue backend.
**Prevention:**
1. Display the target origin to the user in the UI before initialization so they can verify it.
2. Restrict initialization to the current active tab to avoid accidental initialization from background tabs.
3. Use the verified origin explicitly for all subsequent network requests during the initialization process.
