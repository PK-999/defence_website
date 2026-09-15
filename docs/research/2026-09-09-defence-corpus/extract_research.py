"""Extract source observations. No automatic promotion to verified facts or publication."""
import csv, gzip, hashlib, io, json, re
from pathlib import Path
from urllib.parse import urljoin
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parent

def clean(s):return re.sub(r'\s+',' ',s).strip()
def cell(tag,url):
    clone=BeautifulSoup(str(tag),'html.parser')
    refs=[]
    for sup in clone.select('sup.reference'):
        refs.extend(a.get('href') for a in sup.select('a[href]'));sup.decompose()
    links=[{'text':clean(a.get_text(' ',strip=True)),'url':urljoin(url,a['href'])} for a in clone.select('a[href]') if a.get_text(strip=True) and not a['href'].startswith('#')]
    return {'text':clean(clone.get_text(' ',strip=True)),'links':links,'referenceAnchors':refs}

def tables(source):
    s=BeautifulSoup(gzip.decompress((ROOT/source['rawPath']).read_bytes()),'html.parser')
    result=[]
    for number,t in enumerate(s.select('table.wikitable'),1):
        heading=t.find_previous(['h2','h3','h4']);section=clean(heading.get_text(' ',strip=True)) if heading else ''
        span={};rows=[]
        for tr in t.find_all('tr'):
            row={};newspan={};col=0
            for c,(remaining,value) in span.items():
                row[c]=value
                if remaining>1:newspan[c]=(remaining-1,value)
            for td in tr.find_all(['th','td'],recursive=False):
                while col in row:col+=1
                v=cell(td,source['url'])
                cs=int(re.match(r'\d+',str(td.get('colspan',1)))[0]);rs=int(re.match(r'\d+',str(td.get('rowspan',1)))[0])
                for c in range(col,col+cs):
                    row[c]=v
                    if rs>1:newspan[c]=(rs-1,v)
                col+=cs
            span=newspan
            if row:rows.append([row.get(c,{'text':'','links':[],'referenceAnchors':[]}) for c in range(max(row)+1)])
        if rows:result.append({'sourceId':source['id'],'sourceUrl':source['url'],'table':number,'section':section,'rows':rows})
    return result

def main():
    sources=[]
    for f in ROOT.glob('sources-*-retrieval.json'):
        sources.extend(x for x in json.loads(f.read_text()) if x.get('status')=='retrieved' or x.get('cached'))
    unique={x['id']:x for x in sources};sources=list(unique.values())
    extracted=[];awards=[];bio_targets={}
    for src in sources:
        if src['id'].startswith(('wiki-','followup-wiki-')):
            ts=tables(src);extracted.extend(ts)
            if src['id'] in ['wiki-1','wiki-2','wiki-3','wiki-5','wiki-6','followup-wiki-5','wiki-ac']:
                medal={'wiki-1':'Param Vir Chakra','wiki-2':'Maha Vir Chakra','wiki-3':'Vir Chakra','wiki-5':'Kirti Chakra','wiki-6':'Shaurya Chakra','followup-wiki-5':'Vir Chakra','wiki-ac':'Ashoka Chakra'}[src['id']]
                for t in ts:
                    header=None
                    for rownum,row in enumerate(t['rows'],1):
                        txt=[x['text'] for x in row]
                        if any(x in ['Name','Recipient'] for x in txt) and 'Rank' in ' '.join(txt):header=txt;continue
                        if not header or len(header)!=len(row):continue
                        values=dict(zip(header,txt));name=values.get('Name',values.get('Recipient',''))
                        if not name or name in ['Name','Recipient']:continue
                        namecell=row[header.index('Name' if 'Name' in header else 'Recipient')]
                        links=[x for x in namecell['links'] if '/wiki/' in x['url'] and 'redlink=1' not in x['url']]
                        if links:
                            target=links[0];bio_targets[target['url']]={'name':name,'url':target['url'],'medal':medal}
                        awards.append({'sourceId':src['id'],'sourceUrl':src['url'],'locator':f'table {t["table"]}, row {rownum}','medal':medal,'name':name,'rankRaw':values.get('Rank') or next((v for k,v in values.items() if k.startswith('Rank')),None),'serviceRaw':values.get('Branch') or values.get('Service') or values.get('Service/Regiment'),'unitRaw':values.get('Unit') or values.get('Regiment'),'dateRaw':values.get('Date of Award') or values.get('Date') or values.get('Year') or values.get('Date of action'),'dateMeaning':'action' if 'Date of action' in values else 'source_label_unreconciled','notes':values.get('Notes'),'profileUrl':links[0]['url'] if links else None,'verification':'secondary_list_observation'})
        elif src['id'].startswith('historical-'):
            text=gzip.decompress((ROOT/src['rawPath']).read_bytes()).decode('utf-8-sig')
            for n,x in enumerate(csv.DictReader(io.StringIO(text)),2):
                awards.append({'sourceId':src['id'],'sourceUrl':src['url'],'locator':f'CSV row {n}','medal':x.get('Award','').title(),'name':x.get('Name'),'rankRaw':x.get('Rank at time of Award'),'serviceNumber':x.get('Service No.'),'serviceRaw':None,'unitRaw':x.get('Unit'),'dateRaw':x.get('Year of Award'),'dateMeaning':'historical_source_award_label','notes':None,'profileUrl':None,'verification':'2018_transcription_not_verified'})
    # Current portal observations are kept distinct: page order and date semantics were inconsistent.
    for x in {r['a_id']:r for r in json.loads((ROOT/'award-directory.json').read_text())}.values():
        awards.append({'sourceId':'portal-directory','sourceUrl':'https://gallantryawards.gov.in/awardee/'+x['a_id'],'locator':'directory API record '+x['a_id'],'medal':x['chakra'],'name':x['a_title'],'rankRaw':x['a_rank'],'serviceNumber':x['a_service_no'],'serviceRaw':x['award_title'],'unitRaw':None,'dateRaw':x['a_award_year'],'dateMeaning':'API_award_year_field_ambiguous','notes':('Additional medal field: '+x['chakra_2']) if x.get('chakra_2') else None,'profileUrl':'https://gallantryawards.gov.in/awardee/'+x['a_id'],'verification':'primary_directory_observation_date_unreconciled'})
    (ROOT/'extracted-tables.json').write_text(json.dumps(extracted,ensure_ascii=False,indent=2))
    (ROOT/'award-observations.json').write_text(json.dumps(awards,ensure_ascii=False,indent=2))
    (ROOT/'biography-targets.json').write_text(json.dumps(list(bio_targets.values()),ensure_ascii=False,indent=2))
    print('tables',len(extracted),'award observations',len(awards),'biography targets',len(bio_targets))

if __name__=='__main__':main()
