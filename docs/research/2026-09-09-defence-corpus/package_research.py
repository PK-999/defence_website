"""Create the reader report and structured-data archive from the canonical research files."""
import html,json,re,zipfile,hashlib
from pathlib import Path
R=Path(__file__).resolve().parent;D=R/'data';OUT=R.parents[2]/'outputs/defence-research-20260909'
OUT.mkdir(parents=True,exist_ok=True)
def esc(x):return html.escape(str(x))
def inline(t):
 t=esc(t)
 return re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',r'<a href="\2">\1</a>',t)
def render_text(text):
 blocks=[]
 for block in text.strip().split('\n\n'):
  if block.startswith('# '):blocks.append('<h1>'+inline(block[2:])+'</h1>')
  elif block.startswith('## '):blocks.append('<h2>'+inline(block[3:])+'</h2>')
  elif block.startswith('|'):
   lines=block.splitlines();rows=[[c.strip() for c in l.strip('|').split('|')] for l in lines if not re.fullmatch(r'[| :\-]+',l)]
   blocks.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th>'+inline(c)+'</th>' for c in rows[0])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in row)+'</tr>' for row in rows[1:])+'</tbody></table></div>')
  else:blocks.append('<p>'+inline(block.replace('\n',' '))+'</p>')
 return '\n'.join(blocks)
body=render_text((R/'report-source.md').read_text())
profiles=json.loads((D/'pvc-recipient-profiles.json').read_text())
body+='<h2>Param Vir Chakra recipient briefs</h2><p>These are original summaries of the National War Memorial accounts. Action dates and displayed dates remain separate in the dataset. The linked secondary life facts require independent verification before they form full biographies.</p>'
for x in profiles:
 body+='<section><h3>'+esc(x['name'])+'</h3><p class="context">'+esc(x['rankAtAction']+' · '+x['unitAtAction']+' · '+x['service']+(' · Posthumous' if x['posthumous'] else ''))+'</p><p>'+esc(x['story'])+' <a href="'+esc(x['sourceUrl'])+'">National War Memorial profile</a>.</p></section>'
body+='<h2>Selected equipment observations</h2><p>Applicability and dates are part of each fact. Family specifications and foreign variants are explicitly qualified. Blank quantities must not be read as zero.</p><div class="table-wrap"><table><thead><tr><th>Equipment</th><th>Fact</th><th>Value</th><th>Scope and source</th></tr></thead><tbody>'
for x in json.loads((D/'equipment-primary-facts.json').read_text()):
 body+='<tr><td>'+esc(x['entity'])+'</td><td>'+esc(x['field'].replace('_',' '))+'</td><td>'+esc(str(x['value'])+(' '+x['unit'] if x['unit'] else ''))+'</td><td>'+esc((x['effectiveDate'] or 'Effective date not established')+'. '+x['scope']+'. '+x['note'])+' <a href="'+esc(x['sourceUrl'])+'">Source</a></td></tr>'
body+='</tbody></table></div>'
body+='<h2>Completion and verification sequence</h2>'+render_text((R/'implementation-and-tests.md').read_text().split('\n\n',1)[1].split('## Checks already implemented')[0])
body+='<h2>Source inventory</h2><p>The workbook Sources tab and structured-data sources.json contain the complete retrieval inventory, including failed requests and cached-file hashes. The historical roster, discovery tables and biographical observations retain row-level source references. The full request remains incomplete.</p>'
style='''body{font:17px/1.65 Arial,Helvetica,sans-serif;color:#202124;background:#fff;margin:0}main{max-width:1040px;margin:52px auto;padding:0 28px 70px}h1{font-size:34px;line-height:1.2;font-weight:650;margin:0 0 28px}h2{font-size:25px;line-height:1.3;margin:42px 0 16px;border-bottom:1px solid #ccc;padding-bottom:9px}h3{font-size:20px;margin:26px 0 6px}p{max-width:88ch;margin:0 0 18px}a{color:#174e87;text-decoration:underline;text-underline-offset:3px}.context{color:#555;font-size:15px;margin-bottom:8px}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.5;margin:16px 0 28px}th,td{padding:12px 14px;vertical-align:top;text-align:left;border-bottom:1px solid #ddd;min-width:95px}th{background:#eceeef;color:#202124}tr:nth-child(even){background:#f7f7f7}section{break-inside:avoid}@media(max-width:650px){main{margin-top:25px;padding:0 18px 40px}h1{font-size:28px}body{font-size:16px}}@media print{main{margin:0;max-width:none;padding:0}body{font-size:10pt}h1{font-size:22pt}h2{font-size:16pt;break-after:avoid}h3{break-after:avoid}a{color:inherit}table{font-size:8pt}.table-wrap{overflow:visible}tr{break-inside:avoid}}'''
document='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Indian defence reference collection</title><style>'+style+'</style></head><body><main>'+body+'</main></body></html>'
(OUT/'research-report.html').write_text(document)
readme='''# Indian defence research data

Partial research collection, scope 1947–9 September 2026 with earlier context marked.
Not an exhaustive roster, current equipment inventory or publication-ready biography database.

Files ending in observations/discovery contain unverified source records. Do not sum their quantities or merge people by name alone. Primary facts carry their own scope, effective date and source. Null means not established, not zero. Announcement dates, action dates and ceremony dates are distinct. Full biographies remain incomplete.

historical-award-roster.json: 4,191 rows from six historical CSVs. Source-file medal and medal field can conflict.
official-award-announcements.json: 329 records extracted from 18 releases, 2018–2026. These can overlap other collections.
pvc-recipient-profiles.json: all 21 PVC recipients with primary story briefs and separately sourced secondary life facts.
biographical-facts.json: 257 linked source profiles; 242 yielded selected facts. No full biography claim.
equipment-discovery.json: 892 candidate rows, not unique systems or current stock.
equipment-primary-facts.json: 46 scoped observations, including explicit variant exclusions.
conflict-operation-discovery.json: 102 candidates, including pre-1947 context.
Other files: participation links, equipment roles, citation briefs, coverage, source inventory and unresolved issues.

Retain source URLs, identifiers, locators and qualifications when reusing factual records. Check applicable source terms before publishing. Raw downloaded pages, images and full citation texts are deliberately excluded from this package.
'''
(OUT/'DATA-README.md').write_text(readme)
with zipfile.ZipFile(OUT/'research-data.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('README.md',readme)
 for f in sorted(D.glob('*.json')):z.write(f,'data/'+f.name)
 z.write(R/'implementation-and-tests.md','completion-plan.md')
checksums={f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in OUT.iterdir() if f.suffix in ['.html','.xlsx','.zip']}
(OUT/'checksums.json').write_text(json.dumps(checksums,indent=2));print('Report and data archive written',OUT)
