"""Fetch an explicit public source manifest, caching bytes and recording provenance."""
import concurrent.futures, gzip, hashlib, json, sys, time
from pathlib import Path
from datetime import datetime, timezone
import requests
ROOT=Path(__file__).resolve().parent

def fetch(item):
    dest=ROOT/'raw'/(item['id']+'.bin.gz')
    if dest.exists():return {**item,'cached':True,'rawPath':str(dest.relative_to(ROOT))}
    for attempt in range(2):
        try:
            r=requests.get(item['url'],headers={'User-Agent':'SentinelResearch/1.0 (educational reference research; Python requests)'},timeout=35)
            r.raise_for_status();dest.write_bytes(gzip.compress(r.content));time.sleep(.25)
            return {**item,'status':'retrieved','finalUrl':r.url,'accessedAt':datetime.now(timezone.utc).isoformat(),'sha256':hashlib.sha256(r.content).hexdigest(),'rawPath':str(dest.relative_to(ROOT)),'contentType':r.headers.get('content-type')}
        except Exception as e:
            if attempt:return {**item,'status':'access_failed','error':str(e)}
            time.sleep(1)

if __name__=='__main__':
    manifest=Path(sys.argv[1]);items=json.loads(manifest.read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as e:results=list(e.map(fetch,items))
    (ROOT/(manifest.stem+'-retrieval.json')).write_text(json.dumps(results,ensure_ascii=False,indent=2))
    for r in results:print(r['id'],r.get('status','cached'),flush=True)
