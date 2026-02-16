## 2025-05-15 - [XSS in Backend Message Rendering]
**Vulnerability:** The extension used `innerHTML` to display messages received from the backend, which could lead to XSS if the backend is compromised or returns malicious content.
**Learning:** Even simple status messages should be treated as untrusted if they come from an external source or a configurable backend.
**Prevention:** Always use `textContent` instead of `innerHTML` for rendering data that is not explicitly intended to be HTML.

## 2025-05-15 - [Over-privileged Manifest Permissions]
**Vulnerability:** The `manifest.json` included the `debugger` permission, which was completely unused in the codebase.
**Learning:** Boilerplate or legacy permissions can remain in `manifest.json`, violating the Principle of Least Privilege.
**Prevention:** Regularly audit `manifest.json` to ensure only necessary permissions are requested.
