# Owner work and inputs needed for the remaining SENTINEL build

This file separates work that requires the site owner's identity or accounts from work an implementation agent can complete independently. Playwright Chromium is already installed. Source discovery and routine fact checks are authorized to use reputable publishers, official records, and Wikipedia without per-fact manual review.

## Required before real editor sign-in can be accepted

1. Choose an OIDC provider supported by the production organization, such as Auth0, Microsoft Entra ID, Google Workspace, or another standards-compliant provider.
2. In that provider, create a confidential web application named `SENTINEL Editor`.
3. Register these callback URLs, replacing domains with the actual preview and production domains:
   - `http://localhost:3000/api/auth/callback/oidc`
   - `https://<preview-domain>/api/auth/callback/oidc`
   - `https://<production-domain>/api/auth/callback/oidc`
4. Register matching logout/return URLs for the same three origins if the provider requires them.
5. Provide the implementation agent through the deployment platform's secret manager, rather than chat or committed files:
   - issuer URL;
   - client ID;
   - client secret;
   - the provider claim that identifies an approved editor, normally immutable `sub` plus issuer;
   - the exact editor identities or group/role claim allowed to publish.
6. Confirm whether editor access should require MFA at the identity provider. Recommended: require MFA for every publisher account.

The database already contains one pending principal for **Puneeth Kakarla** (`puneethkakarla@gmail.com`) with both `REVIEWER` and `PUBLISHER` roles. It is deliberately inactive and has no subject, so the email address alone cannot grant access. After the provider is configured, complete the activation in this order:

1. Sign in once with the owner account in the local or staging app.
2. Copy the immutable `sub` claim and the exact issuer URL from the authenticated session/provider console. Do not use a display name or email as the subject.
3. Set `EDITOR_SUBJECTS` to a JSON array containing that exact issuer and subject, and set `OWNER_EDITOR_ISSUER` and `OWNER_EDITOR_SUBJECT` in the deployment secret manager. The allow-list and principal row must match; the email alone is never sufficient.
4. Run `npm run link:editorial-principal` against the intended `DATABASE_URL`.
5. Confirm the command reports the owner email, issuer, subject, both roles, and `active=true`; then remove the one-time shell variables from the local shell history/secrets if the platform supports one-time values.
6. Test review and publish separately. A principal with only `REVIEWER` must be denied by publication actions, and a principal with only `PUBLISHER` must be denied by review actions.

Never commit `OWNER_EDITOR_SUBJECT`, client secrets, session cookies, or a production database file. If the identity provider rotates or replaces the account, set the old principal inactive before linking the replacement subject.

These inputs unblock real login, logout, token-expiry, revoked-user, and unauthorized-user tests. Until then, the admin surface remains fail-closed.

## Required before production deployment

1. Create or select the hosting project and give the agent project access or run the documented deployment command yourself.
2. Choose the production domain and create the DNS records shown by the host.
3. Create the production database and a separate preview/staging database. Supply each `DATABASE_URL` through the host's secret manager.
4. Add OIDC secrets and `AUTH_SECRET` to local, preview, and production environments. Generate `AUTH_SECRET` with a cryptographically secure generator; do not reuse it between unrelated applications.
5. Identify who receives operational alerts and provide a non-public contact address for the privacy and editorial pages.
6. Confirm the backup owner, retention period, and restore target. Recommended minimum: daily encrypted backups, 30-day retention, and a quarterly restore rehearsal.

## One-time content and product decisions

The agent can continue with the defaults below. Send corrections only where you want a different policy.

| Decision | Current default | What to provide if changing it |
| --- | --- | --- |
| Public brand | `SENTINEL Indian Defence Archive` | Final product name, short name, and organization name. |
| Editorial scope | Public, historical, educational Indian defence information | Explicit exclusions, date boundaries, or topics to prioritize. |
| Routine fact review | Automated: one directly relevant official source or two independent reputable sources, with no unresolved conflict | A different evidence threshold or publisher allow/block list. |
| Sensitive/current material | Exclude non-public, tactical real-time, leaked, doxxing, and operationally sensitive material | A narrower public-information policy if desired. |
| Disputed claims | Show only after sources and the nature of disagreement can be displayed; otherwise hold as draft | Preferred wording or a stricter exclusion policy. |
| Wikipedia | Discovery and cross-checking source; not the sole basis for consequential claims | Permission to use it more narrowly. |
| Media | Use only assets with documented reuse rights and attribution; otherwise use designed placeholders/maps | Owned brand assets, licensed photographs, or a preferred public-domain/Creative Commons collection. |
| Languages | English first; preserve source language metadata | Priority order for Hindi and other Indian languages, and who approves translations. |
| Analytics | No behavioral analytics until the owner chooses a provider and privacy terms | Provider, retention setting, consent requirement, and measurement goals. |

## Helpful assets that do not block engineering

- A vector logo (`SVG`) and square app icon, with confirmation that you own or may reuse them.
- A short public mission statement and the legal/publishing entity name.
- Licensed photographs with creator, source URL, license, attribution text, and any required modification notice.
- A prioritized list of the next five collections after Kargil. A practical order is 1971 war, 1965 war, 1962 war, major humanitarian/evacuation operations, then equipment families.
- A preferred feedback channel for factual corrections.

## What the implementation agent can proceed with now

No additional owner input is needed to build and test public browsing, search, source pages, timelines, maps, graph views, comparison, metadata, accessibility, the extraction pipeline, and draft data imports. The agent can also prepare deployment configuration and a staging rehearsal. Owner-held credentials are required only for real identity-provider acceptance and the final production environment.

The current Kargil source package is under `docs/verification/2026-09-07/` and `data/import/kargil-initial-candidates.json`. It intentionally remains draft data. The publication action must be attributable to an authenticated editor or to an explicitly documented batch-publisher identity once that workflow exists.
