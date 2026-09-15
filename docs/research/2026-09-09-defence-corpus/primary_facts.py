"""Curated facts checked against cached primary sources. Historical snapshots, not live inventory."""
import json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parent;D=R/'data'
sources={x['id']:x for x in json.loads((D/'sources.json').read_text())}
facts=[];links=[]
def fact(entity,service,field,value,unit,sid,date=None,scope='Indian service',note='',locator='main article'):
 facts.append({'id':'fact-'+str(len(facts)+1),'entity':entity,'service':service,'field':field,'value':value,'unit':unit,'effectiveDate':date,'scope':scope,'note':note,'sourceId':sid,'sourceUrl':sources[sid]['url'],'locator':locator,'verification':'primary_source_read','publicationStatus':'editorial_review_required'})
def link(entity,event,role,sid,date,note=''):
 links.append({'id':'use-'+str(len(links)+1),'equipment':entity,'event':event,'role':role,'periodRaw':date,'sourceId':sid,'sourceUrl':sources[sid]['url'],'note':note,'verification':'official_report; role_limited_to_source'})
for field,value,unit in [('length',15.30,'m'),('wingspan',10.90,'m'),('height',5.30,'m'),('maximum_takeoff_mass',24.5,'tonne'),('maximum_external_load',9.5,'tonne'),('maximum_speed',1.8,'Mach'),('service_ceiling',50000,'ft')]:
 fact('Rafale','Indian Air Force',field,value,unit,'rafale-specs',scope='Manufacturer family specification; Indian configuration not separately established',note='Do not infer Indian weapon fit or operational performance from a maximum envelope.',locator='Specifications and performance data')
for field,value,unit in [('length',262,'m'),('width',62,'m'),('full_load_displacement',43000,'tonne'),('maximum_speed',28,'kn'),('endurance_range',7500,'nautical mile')]:
 fact('INS Vikrant (IAC-1)','Indian Navy',field,value,unit,'vikrant-2022','2022-08-25',note='Pre-commissioning specification announcement; not evidence that commissioning had already occurred.')
fact('Arjun Mk-1A','Indian Army','ordered_quantity',118,'tank','arjun-order','2021-09-23',note='Order with HVF; not current holdings or delivered quantity.')
fact('K9 Vajra-T','Indian Army','gun_calibre',155,'mm','k9-contract','2024-12-20')
fact('K9 Vajra-T','Indian Army','barrel_length_calibres',52,'calibre','k9-contract','2024-12-20')
fact('K9 Vajra-T','Indian Army','procurement_contract_value',7628.70,'INR crore','k9-contract','2024-12-20',note='Contract value is not unit price; source does not state quantity.')
fact('ATAGS','Indian Army','gun_calibre',155,'mm','atags-contract','2025-03-26')
fact('ATAGS','Indian Army','barrel_length_calibres',52,'calibre','atags-contract','2025-03-26')
fact('ATAGS','Indian Army','status_event','procurement contract signed',None,'atags-contract','2025-03-26',note='Contract announcement does not establish delivery or induction.')
fact('High Mobility Vehicle 6x6 gun towing vehicle','Indian Army','status_event','procurement contract signed',None,'atags-contract','2025-03-26')
for service,n in [('Indian Army',90),('Indian Air Force',66)]:
 fact('LCH Prachand',service,'ordered_quantity',n,'helicopter','lch-contract','2025-03-28',note='2025 order tranche; not current fleet strength.')
fact('LCH Prachand','Indian Army / Indian Air Force','operating_altitude_capability','over 5000','m','lch-contract','2025-03-28',note='As stated by MoD; do not turn into service ceiling or payload-at-altitude guarantee.')
fact('KC-135 (Metrea wet lease)','Indian Air Force / Indian Navy training','contracted_lease_quantity',1,'aircraft','lch-contract','2025-03-28',scope='Wet-leased training service',note='Not an Indian-owned aircraft; expected provision within six months is not proof of delivery.')
for entity,service,n in [('C-17','Indian Air Force',11),('AH-64 Apache','Indian Air Force',22),('CH-47 Chinook','Indian Air Force',15),('P-8I','Indian Navy',12)]:
 fact(entity,service,'manufacturer_reported_operated_quantity',n,'aircraft','boeing-india',scope='Undated manufacturer country overview',note='Retrieved 2026-09-09; no effective inventory date. Not certified current; service assignment requires separate corroboration.')
fact('CH-47F Block II','Not established for India','excluded_specification_scope','Manufacturer page specifies Block II',None,'chinook-specs',scope='Foreign/family variant reference only',note='Do not transfer Block II gross weight, payload or dimensions to Indian CH-47F(I) without configuration evidence.',locator='CH-47F Chinook Block II Specifications')
for field,value in [('length',39.50),('wingspan',37.64),('height',12.83)]:
 fact('P-8 family','Indian Navy candidate',field,value,'m','p8-specs','2025-10',scope='Generic P-8 product card; P-8I applicability unverified',note='Indian-specific sensor, weapon and communication fit not established.',locator='PDF page 1, Technical Specifications')
commissioned=[('INS Surat','2025-01-15'),('INS Nilgiri (P17A)','2025-01-15'),('INS Vaghsheer','2025-01-15'),('INS Arnala','2025-06-18'),('INS Tamal','2025-07-01'),('INS Nistar','2025-07-18'),('INS Udaygiri (P17A)','2025-08-26'),('INS Himgiri (P17A)','2025-08-26'),('INS Androth','2025-10-06'),('INS Ikshak','2025-11-06'),('INS Mahe','2025-11-24'),('Diving Support Craft A20','2025-12-16')]
for entity,date in commissioned:fact(entity,'Indian Navy','commissioned_on',date,None,'mod-review2025',date,locator='Indian Navy: Indigenisation and modernisation; ship commissioning list')
fact('MiG-21','Indian Air Force','retired_on','2025-09-26',None,'mod-review2025','2025-09-26',locator='Farewell to MiG-21')
fact('Rafale naval procurement','Indian Navy','ordered_quantity',26,'aircraft','mod-review2025','2025-04',note='22 single-seat and four twin-seat aircraft; do not describe all 26 as carrier-capable Rafale M.',locator='Rafale-M agreement')
for e in ['MiG-21','MiG-23','MiG-27','Jaguar','Mirage 2000','MiG-29','Canberra','Avro','Mi-17']:
 link(e,'Operation Safed Sagar','Used in air campaign; specific combat/support task not established for each type','safed-sagar2009','1999')
for e in ['An-12','An-32','Il-76','Mi-8','Mi-17','Chetak','Cheetah']:
 link(e,'Operation Meghdoot','Air transport/helicopter support','meghdoot-2024','1984 onward; platform-specific dates require follow-up')
for e in ['INS Satpura','INS Savitri','INS Karmuk','LCU 52','INS Gharial']:
 link(e,'Operation Brahma','Humanitarian assistance and disaster relief','mod-review2025','2025',note='Deployment is not combat use.')
operations=[
 {'name':'Operation Bison','type':'operation','parentConflict':'India–Pakistan war 1947–1948','date':'1948-11-01','keyFigure':'K. S. Thimayya','figureRole':'Commander leading armour-supported assault; rank at action requires separate source','summary':'Armour and infantry attacked Zoji La after earlier attempts failed.','sourceId':'bison-president'},
 {'name':'Operation Meghdoot','type':'operation','parentConflict':'Siachen conflict','date':'1984-04-13','keyFigure':None,'figureRole':None,'summary':'Operation to secure strategically important positions in the Siachen region, supported by IAF airlift.','sourceId':'meghdoot-2024'},
 {'name':'Operation Safed Sagar','type':'air operation','parentConflict':'Kargil conflict','date':'1999-05-26','keyFigure':None,'figureRole':None,'summary':'IAF campaign supporting the Army’s Operation Vijay.','sourceId':'kargil2026'},
 {'name':'Tololing','type':'battle','parentConflict':'Kargil conflict','date':'1999-06-13','keyFigure':None,'figureRole':None,'summary':'Recapture reported by the official retrospective. Date describes recapture, not the entire battle.','sourceId':'kargil2026'},
 {'name':'Tiger Hill','type':'battle','parentConflict':'Kargil conflict','date':'1999-07-04','keyFigure':None,'figureRole':None,'summary':'Peak recapture reported by the official retrospective; follow-on fighting requires separate chronology.','sourceId':'kargil2026'}
]
for i,x in enumerate(operations):x.update(id='operation-fact-'+str(i+1),sourceUrl=sources[x['sourceId']]['url'],verification='official_retrospective; scope_limited',publicationStatus='editorial_review_required')
for name,data in [('equipment-primary-facts',facts),('equipment-operation-links',links),('operation-primary-facts',operations)]: (D/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2))
print('Primary equipment facts',len(facts),'equipment operation links',len(links),'operation facts',len(operations))
