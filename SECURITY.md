# Security Policy

CodeInOven takes security seriously. This document describes how to report
vulnerabilities and what you can expect from the maintainers.

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

To report a vulnerability privately, use GitHub's
[private vulnerability reporting](https://github.com/pillardash-oss/codeinoven-site/security/advisories/new)
for this repository, or email the maintainers at
`hey@pillardash.com`. Include:

- A description of the vulnerability and its impact.
- The affected version(s) and the commit/tag if known.
- Steps to reproduce, or a minimal proof of concept.
- Any proposed fix, if you have one.

If you are able, encrypt sensitive details — but plaintext reports are
preferred over not reporting at all.

## Scope

This policy covers:

- The CodeInOven marketing website (this repository).
- The AI Agent Icons Directory application and its public JSON API.
- The container images built from this repository.
- The servers on which these services are deployed.

Out of scope: dependencies that are patched upstream without site changes, and
issues that require the attacker to already have physical access to the server.

## Response expectations

| Severity | Initial response | Fix target |
| -------- | ---------------- | ---------- |
| Critical | 24 hours | 7 days |
| High | 48 hours | 14 days |
| Medium | 7 days | 30 days |
| Low | 14 days | Next minor release |

The maintainers will acknowledge your report within the initial-response
window and keep you updated on progress. We will coordinate a disclosure date
with you before any public announcement.

## Reporting handling

1. Triage the report privately, reproduce, and assess severity.
2. Prepare a fix on a private branch.
3. Ship the fix and redeploy.
4. Publish a security advisory with affected versions and mitigations.

For the desktop application's policy, see the main
[CodeInOven repository](https://github.com/pillardash-oss/codeinoven/blob/main/SECURITY.md).
