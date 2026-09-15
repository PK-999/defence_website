"""Offline evidence-integrity checks. Does not certify historical truth or national completeness."""
import json,gzip,hashlib,collections
from pathlib import Path
R=Path(__file__).resolve().parent;D=R/'data'
def load(n):return json.loads((D/(n+'.json')).read_text())
checks=[]
def check(name,condition):
 checks.append({'check':name,'passed':bool(condition)})
 if not condition:raise AssertionError(name)
sources={x['id']:x for x in load('sources')}
for name in ['award-observations','historical-award-roster','official-award-announcements','biographical-facts','person-conflict-links','equipment-discovery','conflict-operation-discovery','equipment-primary-facts','equipment-operation-links','operation-primary-facts','citation-briefs','pvc-recipient-profiles']:
 rows=load(name)
 check(name+': unique observation IDs',len({x['id'] for x in rows})==len(rows))
 check(name+': source IDs resolve',all(x.get('sourceId') in sources for x in rows))
 check(name+': source URL present',all(x.get('sourceUrl','').startswith('http') for x in rows))
 check(name+': no automatic publication',all(x.get('publicationStatus') not in ['published','public'] for x in rows))
hist=load('historical-award-roster')
expected={'param-vir-chakra':21,'maha-vir-chakra':218,'vir-chakra':1319,'ashoka-chakra':87,'kirti-chakra':478,'shaurya-chakra':2068}
check('Historical source-file counts',collections.Counter(x['sourceId'][11:] for x in hist)==expected)
conflicts=[x for x in hist if x['medalConflict']]
check('Teja Singh medal conflict retained',len(conflicts)==1 and conflicts[0]['serviceNumber']=='45047')
ann=load('official-award-announcements')
expected_ann={'pib-rd2018':16,'pib-id2018':21,'pib-rd2019':16,'pib-id2019':17,'pib-rd2020':9,'pib-id2020':10,'pib-rd2021':18,'pib-id2021':17,'pib-rd2022':12,'pib-id2022':16,'pib-rd2023':21,'pib-id2023':15,'pib-rd2024':22,'pib-id2024':22,'pib-rd2025':16,'pib-id2025':35,'pib-rd2026':17,'pib-2026-aug':29}
check('18 announcement tables: expected extracted event totals',collections.Counter(x['sourceId'] for x in ann)==expected_ann)
check('Civilian and other services retained',{'ARMY (CIVILIAN)','J&K POLICE','BRDB','MHA'}.issubset({x['serviceRaw'] for x in ann}))
check('Repeat award preserved',any(x['isBar'] and x['serviceNumber']=='IC-87240L' for x in ann))
check('Action and ceremony dates not fabricated',all(x['actionDate'] is None and x['ceremonyDate'] is None for x in ann))
cit=load('citation-briefs');check('15 citations match award events',len(cit)==15 and all(x['awardEventId'] in {a['id'] for a in ann} for x in cit))
pvc=load('pvc-recipient-profiles')
check('21 PVC profiles, 14 posthumous',len(pvc)==21 and sum(x['posthumous'] for x in pvc)==14)
check('21 PVC primary story briefs and separately sourced life facts',all(x['story'] and x['biographySourceUrl'] and x['biographicalFactsRaw'] for x in pvc))
check('Abdul Hamid conflicting dates retained',any(x['name']=='Abdul Hamid' and '1967' in x['displayedDateRaw'] and x['actionDateFromNarrative']=='1965-09-10' for x in pvc))
equip=load('equipment-discovery')
check('Three-service equipment scope',set(x['service'] for x in equip)=={'Indian Army','Indian Navy','Indian Air Force'})
check('Discovery quantities remain unreconciled',all(x['quantityAsOf'] is None and x['quantityMeaning']=='unreconciled_do_not_sum' for x in equip))
check('Missing technical details not invented',all(x['dimensions'] is None and x['capabilities'] is None for x in equip))
fact=load('equipment-primary-facts')
check('Arjun order classified as order',any(x['entity']=='Arjun Mk-1A' and x['field']=='ordered_quantity' and x['value']==118 for x in fact))
check('Chinook Block II excluded from Indian specification transfer',any(x['entity']=='CH-47F Block II' and x['field']=='excluded_specification_scope' for x in fact))
check('Full biographies not misrepresented',all(x['biography'] is None for x in load('biographical-facts')))
hashes=0
for src in sources.values():
 if src.get('rawPath') and src.get('sha256'):
  digest=hashlib.sha256(gzip.decompress((R/src['rawPath']).read_bytes())).hexdigest()
  check('Cached source digest '+src['id'],digest==src['sha256']);hashes+=1
result={'checksPassed':len(checks),'sourceHashesChecked':hashes,'completeCorpus':False,'scope':'Offline extraction and evidence integrity only; not independent verification of every fact.','checks':checks}
(R/'verification-results.json').write_text(json.dumps(result,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='checks'},indent=2))
