"""Read the public portal's own paginated directory. Resumable; no application DB writes."""
import argparse, concurrent.futures, gzip, hashlib, json, re, threading, time
from pathlib import Path
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
RAW = ROOT / 'raw'
RAW.mkdir(exist_ok=True)
BASE = 'https://gallantryawards.gov.in'
LOCAL = threading.local()
LOCK = threading.Lock()

def client():
    if not hasattr(LOCAL, 'session'):
        LOCAL.session = requests.Session()
        r = LOCAL.session.get(BASE + '/awards', timeout=35)
        r.raise_for_status()
        LOCAL.token = {re.search("var csrfName = '([^']+)'",r.text)[1]: re.search("var csrfHash = '([^']+)'",r.text)[1]}
    return LOCAL.session

def record_access(url, data, filename, status='retrieved'):
    record={'url':url,'accessedAt':datetime.now(timezone.utc).isoformat(),'status':status,'sha256':hashlib.sha256(data).hexdigest(),'rawPath':str(filename.relative_to(ROOT))}
    with LOCK:
        with (ROOT/'retrieval-ledger.jsonl').open('a') as f:f.write(json.dumps(record)+'\n')

def page(n):
    dest=RAW/f'awards-page-{n}.json'
    if dest.exists():return json.loads(dest.read_text())
    u=BASE+f'/awards/search_view/{n}'
    for attempt in range(2):
        try:
            s=client();r=s.post(u,data={'chakra':'','year':'','forces':'',**LOCAL.token},timeout=35);r.raise_for_status()
            d=r.json();assert d.get('status')=='success' and isinstance(d.get('data'),list)
            dest.write_text(json.dumps(d,ensure_ascii=False));record_access(u,r.content,dest)
            time.sleep(.4);return d
        except Exception:
            if attempt:raise
            time.sleep(2)

def profile(identifier):
    dest=RAW/f'profile-{identifier}.html.gz';out=ROOT/'profiles'/f'{identifier}.json';out.parent.mkdir(exist_ok=True)
    if out.exists():return json.loads(out.read_text())
    u=BASE+f'/awardee/{identifier}'
    for attempt in range(2):
        try:
            if dest.exists():data=gzip.decompress(dest.read_bytes())
            else:
                r=client().get(u,timeout=35);r.raise_for_status();data=r.content
                dest.write_bytes(gzip.compress(data));record_access(u,data,dest)
            s=BeautifulSoup(data,'html.parser')
            details=[]
            for tab in s.select('[id^=tabAllChakra]'):
                fields={}
                for tr in tab.select('tr'):
                    td=tr.find_all('td',recursive=False)
                    if len(td)==2:fields[td[0].get_text(' ',strip=True)]=re.sub(r'\s+',' ',td[1].get_text(' ',strip=True))
                if fields:details.append(fields)
            assert details, 'No profile details table'
            tabs={}
            for key in ['ci','tabParam1','tabMahavir2','tabProfile']:
                tab=s.find(id=key)
                if tab:
                    text=re.sub(r'\s+',' ',tab.get_text(' ',strip=True))
                    tabs[key]={'text':text if text not in ['No Data Found!','Records Not Found',''] else None,
                    'documents':[x.get('src') or x.get('data') for x in tab.find_all(['iframe','embed','object'])],
                    'images':[x.get('src') for x in tab.find_all('img')],
                    'links':[x['href'] for x in tab.find_all('a',href=True)]}
            d={'portalId':str(identifier),'sourceUrl':u,'details':details,'tabs':tabs,'extractionStatus':'source_transcription_not_independent_verification'}
            out.write_text(json.dumps(d,ensure_ascii=False,indent=2));time.sleep(.4);return d
        except Exception:
            if attempt:raise
            time.sleep(2)

def main():
    raise SystemExit('Network harvesting disabled after review of the portal Website Policy. Use cached evidence; obtain and document appropriate permission before restoring systematic retrieval.')
    a=argparse.ArgumentParser();a.add_argument('mode',choices=['index','profiles']);a.add_argument('--workers',type=int,default=3);args=a.parse_args()
    errors=[]
    if args.mode=='index':
        first=page(1);last=max(map(int,re.findall(r'data-ci-pagination-page="(\d+)"',first['pagination'])))
        jobs=list(range(1,last+1));fn=page
    else:
        rows=json.loads((ROOT/'award-directory.json').read_text());jobs=sorted({x['a_id'] for x in rows},key=int);fn=profile
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures={ex.submit(fn,j):j for j in jobs}
        for i,f in enumerate(concurrent.futures.as_completed(futures),1):
            try:results.append((futures[f],f.result()))
            except Exception as e:errors.append({'item':futures[f],'error':str(e)})
            if i%25==0:print(args.mode,i,'/',len(jobs),'errors',len(errors),flush=True)
    if args.mode=='index':
        rows=[r for _,d in sorted(results) for r in d['data']]
        (ROOT/'award-directory.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
        print('rows',len(rows),'unique IDs',len({x['a_id'] for x in rows}),flush=True)
    (ROOT/f'{args.mode}-errors.json').write_text(json.dumps(errors,indent=2))
    print('FINISHED',args.mode,'success',len(results),'errors',len(errors),flush=True)

if __name__=='__main__':main()
