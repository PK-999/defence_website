# Gallantry award research corpus

`gallantry-awardees.json` is a reproducible, structured capture of the public Param Vir Chakra and Ashoka Chakra directories on the Ministry of Defence Gallantry Awards portal.

## Scope

- 21 Param Vir Chakra recipients
- 98 Ashoka Chakra recipients
- Canonical name, award, official “Award / Date of Action” value, service, rank, unit or organisation, service number, posthumous status, published family/residence fields, conflict or operation label where supplied, and links to official profiles, citations and bibliographies

The government field “Award / Date of Action” is preserved as-is because its meaning is not uniform across all historical records. The site must not relabel it as a battlefield action date without separate evidence.

## Refresh

Run `npm run research:gallantry`. The collector verifies the official total for both award categories and stops if the returned count differs from 21 PVC or 98 AC records. It also checks every profile and citation asset and omits stale files while retaining the canonical awardee page. It stores links and structured fields, not copies of long profile or citation prose.

## Publication notes

- The Ministry of Defence awardee page is the canonical source for each record.
- Government-hosted profile and citation files remain linked to their publisher.
- Some counter-insurgency citations are unpublished or abbreviated for security reasons.
- The legacy application database is not overwritten by this corpus. Canonical research pages are generated from this file, while existing editorial records can link to a matching official dossier.
