"""Build auditable research observations from cached sources; never publish or write the app DB."""
import gzip,json,re,hashlib
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from extract_research import clean
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'data';OUT.mkdir(exist_ok=True)
def save(name,rows):
    (OUT/(name+'.json')).write_text(json.dumps(rows,ensure_ascii=False,indent=2))
    return rows
def ident(prefix,*parts):return prefix+'-'+hashlib.sha256('|'.join(map(str,parts)).encode()).hexdigest()[:16]
sources={}
for f in sorted(ROOT.glob('sources-*-retrieval.json')):
    for x in json.loads(f.read_text()):sources[x['id']]=x
sources['portal-directory']={'id':'portal-directory','url':'https://gallantryawards.gov.in/awards','title':'Gallantry Awards directory (incomplete cached index)','publisher':'Ministry of Defence','tier':'primary_directory','status':'partial_index_only','coverage':'4310 observations; 2778 IDs; unstable pagination; date semantics unresolved','accessedAt':'2026-09-09','reuseNote':'Systematic profile retrieval not performed following Website Policy review.'}
def soup(src):return BeautifulSoup(gzip.decompress((ROOT/src['rawPath']).read_bytes()),'html.parser')
for src in sources.values():
    if 'pib.gov.in' in src.get('url','') and src.get('rawPath') and 'pdf' not in src['url'].lower():
        headings=soup(src).select('h2')
        title=next((clean(h.get_text(' ',strip=True)) for h in headings if len(clean(h.get_text(' ',strip=True)))>20),None)
        if title:src['title']=title
        src.setdefault('publisher','Press Information Bureau')
medals=['Param Vir Chakra','Maha Vir Chakra','Vir Chakra','Ashoka Chakra','Kirti Chakra','Shaurya Chakra']
aliases={m.upper():m for m in medals};aliases['MAHAVIR CHAKRA']='Maha Vir Chakra';aliases['ASHOK CHAKRA']='Ashoka Chakra'
events=[];annual=[]
for sid,src in sources.items():
    if not (re.match(r'pib-(rd|id)\d{4}$',sid) or sid=='pib-2026-aug') or not src.get('rawPath'):continue
    s=soup(src);year=int(re.search(r'20\d{2}',sid)[0]);announced=f'{year}-'+('08-14' if '-id' in sid or sid=='pib-2026-aug' else '01-25')
    heading='';seen=set();start=len(events)
    for n,tr in enumerate(s.select('table tr'),1):
        cols=[clean(c.get_text(' ',strip=True)) for c in tr.find_all(['td','th'],recursive=False)]
        if not cols:continue
        unique=list(dict.fromkeys(c for c in cols if c))
        if len(unique)==1:
            heading=unique[0].upper();continue
        explicit=cols[-1].upper()
        label=explicit if explicit in aliases or explicit.startswith('BAR TO ') else heading
        base=label.removeprefix('BAR TO ')
        if base not in aliases:continue
        serviceidx=next((i for i,c in enumerate(cols) if c.upper() in ['ARMY','NAVY','AIR FORCE','MHA','CRPF','BSF','CIVILIAN','ARMY (CIVILIAN)','J&K POLICE','BRDB']),None)
        if serviceidx is None or serviceidx==0:continue
        raw=cols[serviceidx-1]
        if not raw or 'NAME' in raw:continue
        key=(label,raw,cols[serviceidx])
        if key in seen:continue
        seen.add(key)
        num=re.match(r'^([A-Z]{0,3}[-/]?\d{4,}[A-Z]?\b(?:-[A-Z])?)\s*,?\s*',raw)
        person=raw[num.end():] if num else raw
        events.append({'id':ident('announcement',sid,label,raw),'medal':aliases[base],'isBar':label.startswith('BAR TO '),'rankNameUnitRaw':person,'serviceNumber':num[1] if num else None,'serviceRaw':cols[serviceidx],'announcementDate':announced,'awardYear':year,'actionDate':None,'gazetteDate':None,'ceremonyDate':None,'posthumous':True if 'POSTHUMOUS' in raw.upper() else None,'sourceId':sid,'sourceUrl':src['url'],'locator':f'HTML table row {n}','verification':'official_announcement_transcribed','publicationStatus':'review_required','biography':None,'citationStory':None})
    annual.append({'sourceId':sid,'announcementDate':announced,'extractedEvents':len(events)-start,'counts':{m:sum(x['medal']==m for x in events[start:]) for m in medals},'coverage':'HTML rows only; reconcile against headline and attachments'})
save('official-award-announcements',events);save('announcement-coverage',annual)
observations=json.loads((ROOT/'award-observations.json').read_text())
for x in observations:
    x['id']=ident('award-observation',x['sourceId'],x['locator'])
    x['publicationStatus']='research_only'
    if x['sourceId'].startswith('historical-'):
        x['sourceFileMedal']=x['sourceId'][11:].replace('-',' ').title()
        x['medalConflict']=x['medal']!=x['sourceFileMedal']
save('award-observations',observations)
save('historical-award-roster',[x for x in observations if x['sourceId'].startswith('historical-')])
bios=[];relationships=[]
for sid,src in sources.items():
    if not sid.startswith('bio-') or not src.get('rawPath'):continue
    s=soup(src);box=s.select_one('table.infobox');facts={}
    if box:
        for tr in box.select('tr'):
            h=tr.find('th',recursive=False);d=tr.find('td',recursive=False)
            if h and d:
                for ref in d.select('sup.reference'):ref.decompose()
                facts[clean(h.get_text(' ',strip=True))]=clean(d.get_text(' ',strip=True))
    chosen={k:v for k,v in facts.items() if k in ['Born','Died','Birth name','Service years','Service number','Branch','Service/ branch','Service / branch','Rank','Unit','Commands','Commands held','Battles / wars','Battles/wars','Conflicts','Awards','Allegiance']}
    refs=[]
    for a in s.select('.references a.external[href]'):
        url=a['href'];refs.append({'title':clean(a.get_text(' ',strip=True)),'url':urljoin(src['url'],url),'retrieved':False})
    bio={'id':ident('biography',src['url']),'name':src.get('title'),'sourceId':sid,'sourceUrl':src['url'],'factsRaw':chosen,'biography':None,'biographyStatus':'structured_facts_only; narrative_not_written' if chosen else 'no_structured_facts; check_target_identity','verification':'secondary_unverified','referenceCandidates':refs,'publicationStatus':'research_only'}
    bios.append(bio)
    if box:
        for tr in box.select('tr'):
            h=tr.find('th',recursive=False)
            if h and clean(h.get_text(' ',strip=True)) in ['Conflicts','Battles / wars','Battles/wars','Battles/wars:']:
                for a in tr.select('td a[href]'):
                    name=clean(a.get_text(' ',strip=True))
                    if name and any(c.isalnum() for c in name) and not a['href'].startswith('#'):relationships.append({'id':ident('participation',bio['id'],name),'personId':bio['id'],'person':bio['name'],'eventName':name,'eventUrl':urljoin(src['url'],a['href']),'relationship':'reported_participation_not_command','sourceId':sid,'sourceUrl':src['url'],'verification':'secondary_unverified'})
save('biographical-facts',bios);save('person-conflict-links',relationships)
equipment=[];conflicts=[]
for t in json.loads((ROOT/'extracted-tables.json').read_text()):
    sid=t['sourceId'];header=None;category=t['section']
    if sid in ['wiki-7','wiki-8']:
        for n,row in enumerate(t['rows'][1:],2):
            vals=[x['text'] for x in row]
            if sid=='wiki-7':
                name=vals[0];date=None;location=None;kind='conflict_discovery';scope='pre_1947_context' if t['table']==1 else 'independent_India_candidate'
            else:
                if len(vals)<5:continue
                name,date,location=vals[1:4];kind='operation_discovery';scope='independent_India_candidate'
            conflicts.append({'id':ident('conflict',sid,t['table'],n),'name':name,'type':kind,'scope':scope,'dateRaw':date,'locationRaw':location,'sourceId':sid,'sourceUrl':t['sourceUrl'],'locator':f'table {t["table"]}, row {n}','linkedEntities':row[0 if sid=='wiki-7' else 1]['links'],'verification':'secondary_unverified','classificationNote':'Confirm direct Indian military involvement; diplomatic support is not a war.','commanders':None,'outcome':None,'casualties':None,'publicationStatus':'research_only'})
        continue
    if sid not in ['wiki-9','wiki-11','wiki-12','followup-wiki-2','followup-wiki-3','followup-wiki-4']:continue
    if sid=='wiki-11' and t['section']=='Coast Guard':continue
    service='Indian Navy' if sid in ['wiki-12','followup-wiki-4'] else 'Indian Air Force' if sid=='followup-wiki-3' else 'Indian Army'
    if sid=='wiki-11':service={'Air Force':'Indian Air Force','Army Aviation Corps':'Indian Army','Naval Air Arm':'Indian Navy'}[t['section']]
    for n,row in enumerate(t['rows'],1):
        vals=[x['text'] for x in row]
        if len(set(vals))==1:category=vals[0];continue
        if vals[0] in ['Name','Aircraft','Class','Ship','Boat'] and ('Origin' in vals or 'Notes' in vals or 'Note' in vals):header=vals;continue
        if not header or len(vals)!=len(header):continue
        d=dict(zip(header,vals));name=d.get('Ship') or d.get('Boat') or d.get('Name') or d.get('Aircraft')
        if not name:continue
        field=next(k for k in ['Ship','Boat','Name','Aircraft'] if d.get(k));namecell=row[header.index(field)]
        equipment.append({'id':ident('equipment-observation',sid,t['table'],n),'name':name,'service':service,'category':category,'entityType':'hull_or_craft' if sid in ['wiki-12','followup-wiki-4'] else 'platform_or_variant','variantRaw':d.get('Variant'),'classRaw':d.get('Class'),'roleRaw':d.get('Type') or d.get('Primary role(s)'),'originRaw':d.get('Origin') or d.get('Origin Country'),'quantityRaw':d.get('Quantity') or d.get('In service') or d.get('Count'),'quantityMeaning':'unreconciled_do_not_sum','quantityAsOf':None,'introducedRaw':d.get('Introduced') or d.get('Commissioned') or d.get('Comm.'),'retiredRaw':d.get('Retired') or d.get('Decommissioned'),'pennantRaw':d.get('Pennant') or d.get('Pennant No.') or d.get('No.'),'dimensions':None,'capabilities':None,'combatUse':None,'status':'requires_dated_primary_source','sourceId':sid,'sourceUrl':t['sourceUrl'],'locator':f'table {t["table"]}, row {n}','entityLinks':namecell['links'],'referenceAnchors':sum((x['referenceAnchors'] for x in row),[]),'verification':'secondary_discovery_only','publicationStatus':'research_only'})
save('equipment-discovery',equipment);save('conflict-operation-discovery',conflicts)
save('sources',list(sources.values()))
summary={'scope':'1947–2026-09-09; earlier context separately marked','complete':False,'counts':{'awardObservations':len(observations),'historicalRosterRows':sum(x['sourceId'].startswith('historical-') for x in observations),'officialAnnouncementEvents':len(events),'biographicalFactProfiles':len(bios),'personConflictLinks':len(relationships),'equipmentDiscoveryRows':len(equipment),'conflictOperationCandidates':len(conflicts),'retrievedSources':sum(bool(x.get('rawPath')) for x in sources.values())},'warning':'Counts are evidence records, not unique people, current inventory or completeness denominators.'}
save('coverage',summary);print(json.dumps(summary,indent=2));print(json.dumps(annual,indent=2))
