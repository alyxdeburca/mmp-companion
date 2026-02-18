# Sentinel Security Journal

This journal tracks critical security learnings for the MMP Companion project.

## 2025-05-14 - Untrusted Settings Source via Tab Title Spoofing
**Vulnerability:** The extension initializes its `local_backend` setting by searching for an active tab titled "MMP - Maker Management Platform" and fetching `/settings.json` from its origin.
**Learning:** An attacker can easily spoof a page title to trick the extension into "initializing" against a malicious server. Since the extension sends sensitive session cookies (for MakerWorld) to this backend, this leads to a critical cookie theft vulnerability.
**Prevention:** Implement a secure configuration mechanism, such as a dedicated options page for backend URL entry, or require user confirmation/verification of the origin before saving settings.
