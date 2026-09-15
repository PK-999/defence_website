"""Extract factual citation fields and attach original brief descriptions with page provenance."""
import json,re,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def clean(t):return re.sub(r'\s+',' ',t).strip()
stories=[
'Led a Manipur operation, confronting armed insurgents while his team was under fire.',
'Protected fellow soldiers and a military dog during a Kishtwar confrontation.',
'Rescued two wounded comrades in Kishtwar and died from injuries sustained during the action.',
'Protected a scout and continued fighting despite injuries during a border patrol attack.',
'Led a counter-infiltration action and pursued armed infiltrators under dangerous conditions.',
'Led troops during a counter-infiltration engagement and maintained contact under fire.',
'Led a forest search and confronted armed suspects sheltering in caves.',
'Moved under fire to protect troops during a Line of Control engagement.',
'Led a cordon during a difficult counter-terrorist operation in Kishtwar.',
'Continued defending his post despite injury and warned troops about a hostile drone.',
'Led soldiers under fire during an operation against armed insurgents in Manipur.',
'Held his position under gunfire and grenade attack during a forest operation.',
'Avoided endangering fellow soldiers, fought despite wounds, and later died of his injuries.',
'Protected his column while confronting an armed militant during a forest search.',
'Checked civilian absence before leading a dangerous search of a house in Kathua.'
]
url='https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/aug/doc2026814957801.pdf'
events=json.loads((ROOT/'data/official-award-announcements.json').read_text());out=[]
for p,story in zip(json.loads((ROOT/'army-2026-citations-pages.json').read_text()),stories,strict=True):
 t=clean(p['text'])
 def field(a,b):
  m=re.search(re.escape(a)+r'\s*(.*?)\s*'+re.escape(b),t);return m[1] if m else None
 num=field('Personnel No','Rank & Decorations, if any')
 match=[x for x in events if x['sourceId']=='pib-2026-aug' and re.sub(r'\W','',x.get('serviceNumber') or '')==re.sub(r'\W','',num or '')]
 assert len(match)==1,(num,len(match))
 event=match[0]
 record={'id':'citation-'+str(p['page']),'awardEventId':event['id'],'rankNameRaw':field('Name:','Award Recommended'),'medal':event['medal'],'isBar':event['isBar'],'rankRaw':field('Rank & Decorations, if any','Unit'),'unitRaw':field('Unit','Whether Posthumous'),'serviceNumber':num,'effectiveDateRaw':field('Effective Date of Award','Personnel No'),'dateMeaning':'source_effective_date; distinct from announcement; do not assume legal award date','announcementDate':'2026-08-14','posthumous':field('Whether Posthumous','Father’s Name')=='YES','storyBrief':story,'storyScope':'Brief paraphrase of official account, not an independent battle assessment or full biography','sourceId':'army-2026-citations','sourceUrl':url+'#page='+str(p['page']),'locator':'PDF page '+str(p['page']),'verification':'primary_citation_read','publicationStatus':'editorial_review_required'}
 out.append(record)
(ROOT/'data/citation-briefs.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print('Linked citation briefs',len(out))
