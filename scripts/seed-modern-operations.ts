import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MODERN_OPERATIONS = [
  {
    slug: "operation-sindoor",
    title: "Operation Sindoor",
    category: "combat",
    summary:
      "A coordinated multi-domain joint operation conducted by the Indian Armed Forces in May 2025 in response to the Pahalgam terror attack, executing precision strikes against nine terror launch complexes in Pakistan and PoJK while intercepting retaliatory drone and missile incursions using S-400 air defence and integrated counter-UAV grids.",
    content: `## Mission Overview

Operation Sindoor represents a historic inflection point in Indian military doctrine—marking the nation's first fully integrated multi-domain joint operation executed simultaneously across air, land, maritime, space, and cyber domains.

Launched following the April 22, 2025 terror attack in Pahalgam, Jammu and Kashmir, which claimed 26 civilian lives, the Indian Armed Forces orchestrated a retaliatory campaign between May 7 and May 10, 2025.

### Strategic Objectives
1. **Dismantle Cross-Border Terror Nodes**: Execute high-precision standoff strikes against nine verified terrorist command, training, and logistical facilities across Pakistan-occupied Jammu & Kashmir (PoJK) and mainland Pakistan.
2. **Layered Anti-Access / Area Denial (A2/AD)**: Neutralize retaliatory ballistic, cruise missile, and swarm UAV incursions targeted at western military airfields and command stations.
3. **Escalation Dominance**: Establish air and electronic superiority while maintaining strict proportionality to compel a DGMO-level ceasefire.

### Tactical Execution & Tri-Service Synergy

#### Phase I: Precision Standoff Strikes (Night of 07–08 May 2025)
At 01:45 IST, Indian Air Force strike packages comprising Dassault Rafale and upgraded Mirage 2000 fighters, supported by Netra and Phalcon AEW&C systems and Su-30MKI air-dominance escorts, launched SCALP standoff cruise missiles and Smart Anti-Airfield Weapons (SAAW). Nine critical training centers associated with The Resistance Front (TRF) and Lashkar-e-Taiba were obliterated in surgical strikes across Muzaffarabad, Kotli, and Muridke. Concurrently, Indian Army artillery and rocket brigades deployed BrahMos supersonic cruise missiles and Pinaka-ER long-range guided rockets to suppress hostile artillery observation posts along the Line of Control.

#### Phase II: Air Defence & Counter-Drone Grid
On May 8, the adversary launched a synchronized counter-strike deploying high-speed drones, cruise missiles, and unmanned loitering munitions towards airfields in Jammu, Srinagar, Pathankot, and Bhuj. India's layered air defence umbrella—anchored by the S-400 Triumf long-range surface-to-air missile system, MR-SAM (Barak-8), Akash-1S batteries, and indigenous high-power electronic countermeasure jammers—intercepted 94% of hostile incoming vectors before airspace penetration.

#### Phase III: Naval Forward Posture & Electronic Suppression
The Indian Navy's Western Fleet deployed a carrier battle group centered around INS Vikrant and guided-missile stealth destroyers into forward patrol zones in the North Arabian Sea, imposing maritime chokehold readiness and electronic denial over commercial and naval communications corridors.

### Operational Legacy
The operation concluded on May 10, 2025, following a bilateral ceasefire agreed upon by the Directors General of Military Operations (DGMOs). Operation Sindoor demonstrated India's seamless theater jointness, real-time networked intelligence, and the operational maturity of its indigenous air defence and electronic warfare architecture.`,
    dateStart: "2025-05-07",
    dateEnd: "2025-05-10",
    coordinates: JSON.stringify([33.7782, 73.7478]),
    referenceUrl: "https://www.pib.gov.in",
  },
  {
    slug: "operation-kaveri",
    title: "Operation Kaveri",
    category: "evacuation",
    summary:
      "A complex non-combatant evacuation operation conducted by the Indian Armed Forces in April–May 2023 to rescue Indian citizens stranded amidst heavy urban warfare between rival military factions in Sudan, notable for the daring blackout landing of an IAF C-130J at the austere Wadi Seidna airstrip.",
    content: `## Mission Overview

In April 2023, ferocious civil conflict erupted across Sudan as the Sudanese Armed Forces (SAF) and the paramilitary Rapid Support Forces (RSF) clashed in Khartoum and urban centers. Trapped in the crossfire were approximately 4,000 Indian nationals, including a significant contingent of the Hakki Pikki tribe in remote hinterlands.

India launched **Operation Kaveri** on 24 April 2023, named after the sacred river Kaveri that sustains southern India, symbolizing life, protection, and safe return.

### Operational Components

#### The Air Bridge: C-130J Tactical Mastery & C-17 Heavy Lift
The Indian Air Force established a forward operating staging base at Prince Sultan Air Base and Jeddah International Airport in Saudi Arabia. IAF deployed two C-130J Special Operations transport aircraft and heavy-lift C-17 Globemaster IIIs. 

#### The Wadi Seidna Midnight Rescue
On the night of 27–28 April 2023, in one of the most audacious tactical airlifts in modern aviation history, an IAF C-130J piloted by Group Captain Ravi Nandi carried out a blackout landing at the degraded Wadi Seidna airstrip, 40 km north of battle-torn Khartoum. The airstrip had no runway lights, radar, or navigation aids. Flying on Night Vision Goggles (NVGs), the crew touched down on an unlit runway, embarked 121 stranded passengers—including pregnant women and infants—and took off within minutes under threat of ground fire without refuelling.

#### The Naval Sealift
The Indian Navy deployed frontline stealth frigate INS Teg, guided-missile frigate INS Tarkash, and offshore patrol vessel INS Sumedha to Port Sudan on the Red Sea coast. Naval commandos (MARCOS) secured the port perimeter while warships ferried evacuees across the Red Sea to Jeddah for onward airlift to New Delhi and Bengaluru.

### Key Metrics & Outcome
- **Total Evacuees**: 3,862 individuals safely rescued (including foreign nationals from friendly nations).
- **Sorties Conducted**: 22 IAF flights and 5 naval sea sorties over an 11-day span.
- **Zero Casualties**: Not a single Indian life was lost during the extraction from active combat zones.`,
    dateStart: "2023-04-24",
    dateEnd: "2023-05-05",
    coordinates: JSON.stringify([15.5007, 32.5599]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/36495",
  },
  {
    slug: "operation-ajay",
    title: "Operation Ajay",
    category: "evacuation",
    summary:
      "Evacuation airlift launched by the Government of India in October 2023 to repatriate Indian citizens who wished to leave Israel following the outbreak of the 2023 Israel–Hamas war.",
    content: `## Mission Overview

Following the October 7, 2023 terror attacks and subsequent escalation of hostilities between Israel and Hamas in the Gaza Strip, commercial flight operations out of Ben Gurion Airport in Tel Aviv were severely disrupted. Approximately 18,000 Indian citizens—primarily caregivers, IT professionals, researchers, and university students—were residing in Israel.

External Affairs Minister Dr. S. Jaishankar announced **Operation Ajay** on 11 October 2023 to ensure the safe repatriation of any Indian citizen requesting extraction.

### Execution
The Ministry of External Affairs set up a 24-hour round-the-clock emergency control room in New Delhi alongside dedicated field desks in Tel Aviv and Ramallah. The Indian Air Force positioned heavy-lift C-17 Globemaster III transports on standby, while government-chartered widebody aircraft operated flights from Tel Aviv to New Delhi.

### Outcome
- Over **1,340 Indian nationals**, including infants and academic scholars, were safely evacuated across six dedicated flights.
- Ground transit corridors through Jordan and Egypt were secured as contingency extraction vectors.`,
    dateStart: "2023-10-11",
    dateEnd: "2023-10-24",
    coordinates: JSON.stringify([32.0853, 34.7818]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/37180",
  },
  {
    slug: "operation-dost",
    title: "Operation Dost",
    category: "humanitarian",
    summary:
      "A massive international humanitarian assistance and disaster relief (HADR) mission launched by India to Turkey and Syria following the catastrophic 7.8 magnitude earthquake in February 2023, deploying the Indian Army's 60 Para Field Hospital and specialized NDRF urban search & rescue units.",
    content: `## Mission Overview

On 6 February 2023, a devastating 7.8-magnitude earthquake struck southern Turkey and northern Syria, followed by powerful aftershocks, killing more than 50,000 people and flattening urban centers. India launched **Operation Dost** (*Operation Friend*) within twelve hours of the tragedy, dispatching search and rescue battalions and field medical centers.

### Field Deployment & Assets

#### Indian Army 60 Para Field Hospital
The Indian Army mobilized the elite 60 Para Field Hospital under Lieutenant Colonel Yaduvir Singh. Within hours of touchdown at Adana Airport, the unit convoyed to İskenderun in Hatay Province—one of the hardest-hit regions where the local civil hospital had collapsed.
- Converted an abandoned school building into a fully functional 30-bed surgical field hospital within six hours.
- Equipped with trauma ICU, emergency operation theater, digital X-ray, triage ward, laboratory, and pharmacy.
- Treated **3,607 patients**, performing 10 major surgeries and over 60 life-saving procedures under sub-zero winter temperatures.

#### NDRF Urban Search & Rescue (USAR)
Three self-contained NDRF search-and-rescue teams comprising 152 personnel, canine squads (trained for live-victim detection in collapsed concrete rubble), life-detector radars, and heavy-cutting equipment deployed to Gaziantep and Nurdağı.
- Rescued multiple live victims trapped beneath multi-story pancake collapses, including an eight-year-old girl and a six-year-old child who had been buried for over 80 hours.

#### IAF Air Bridge
The Indian Air Force flew seven heavy C-17 Globemaster III aircraft carrying over 250 tonnes of relief material, survival shelters, medicines, and specialized diagnostic generators directly into Turkey and Damascus, Syria.`,
    dateStart: "2023-02-07",
    dateEnd: "2023-02-20",
    coordinates: JSON.stringify([37.0662, 37.3833]),
    referenceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1900890",
  },
  {
    slug: "operation-ganga",
    title: "Operation Ganga",
    category: "evacuation",
    summary:
      "The massive non-combatant evacuation operation conducted by the Government of India in February–March 2022 to evacuate over 18,200 Indian students and citizens from Ukraine amid the Russian invasion, organizing a round-the-clock air bridge from neighbouring Poland, Romania, Hungary, and Slovakia.",
    content: `## Mission Overview

On 24 February 2022, military operations by the Russian Federation began across Ukraine, resulting in the immediate closure of Ukrainian civil airspace. Trapped inside besieged university towns—including Kharkiv, Sumy, Kyiv, and Vinnytsia—were more than 20,000 Indian citizens, predominantly young medical students.

India initiated **Operation Ganga** on 26 February 2022, orchestrating a coordinated extraction of extraordinary diplomatic and logistical scale.

### Execution Strategy

#### Cross-Border Land Corridors
With airspace shuttered, Indian diplomats and voluntary transport convoys coordinated the movement of thousands of students across frozen terrain toward border checkpoints in five neighbouring nations:
- **Romania** (Bucharest & Suceava)
- **Poland** (Rzeszów & Warsaw)
- **Hungary** (Budapest)
- **Slovakia** (Košice)
- **Moldova** (Chișinău)

#### Ministerial Envoys on the Frontlines
In an unprecedented diplomatic move, four senior Cabinet Ministers were dispatched as Special Envoys to personally oversee logistics, housing, and flights in each transit capital:
- Hardeep Singh Puri (Hungary)
- Jyotiraditya Scindia (Romania and Moldova)
- Kiren Rijiju (Slovakia)
- Gen (Retd) V.K. Singh (Poland)

#### The Air Bridge
The IAF mobilized its No. 81 Squadron C-17 Globemaster III transports from Air Force Station Hindan alongside commercial flights operated by Air India, IndiGo, SpiceJet, and Air India Express.
- 90 total flights were operated, including 14 dedicated IAF C-17 missions carrying humanitarian aid into Europe and returning packed with students.

#### The Sumy Humanitarian Corridor
In March 2022, approximately 600 Indian students remained pinned down under intense shelling in the eastern city of Sumy. Prime Minister Narendra Modi spoke directly with both Russian President Vladimir Putin and Ukrainian President Volodymyr Zelenskyy, securing a temporary ceasefire and humanitarian corridor to evacuate the students by bus convoy to Poltava and onward to Poland.

### Outcome
**18,282 Indian nationals** were safely repatriated to India, alongside 147 foreign nationals from 18 partner countries.`,
    dateStart: "2022-02-26",
    dateEnd: "2022-03-11",
    coordinates: JSON.stringify([48.3794, 31.1656]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/34947",
  },
  {
    slug: "operation-devi-shakti",
    title: "Operation Devi Shakti",
    category: "evacuation",
    summary:
      "A high-risk tactical evacuation conducted by the Indian Air Force and Ministry of External Affairs in August 2021 to extract Indian diplomats, citizens, and Afghan minority refugees from Kabul under chaotic conditions following the collapse of the Afghan government to the Taliban.",
    content: `## Mission Overview

In August 2021, the lightning offensive of the Taliban culminated in the fall of Kabul on 15 August 2021. Amid the sudden collapse of civil authority and the flight of President Ashraf Ghani, tens of thousands of panicked civilians converged on Hamid Karzai International Airport (HKIA). Commercial flights were cancelled, and the airport perimeter was breached amid gunfire, suicide bomb threats, and unmonitored airspace.

India launched **Operation Devi Shakti** (*Divine Strength*) to extract Indian embassy personnel, security guards, Indian workers, and Afghan Hindu and Sikh families facing persecution.

### Tactical Execution

#### The Ayni Airbase Staging Hub
Because of limited parking slots and unpredictable ground security at Kabul, the Indian Air Force established an operational staging node at Ayni Air Base in Gissar, Tajikistan, where C-17 and C-130J aircraft waited for air traffic clearances before executing rapid tactical turnaround sorties into Kabul.

#### High-Threat Air Operations
IAF transport pilots operated under perilous conditions:
- **No Air Traffic Control**: Civil ATC was non-existent; military tactical controllers managed single-runway landings.
- **Surface Threat**: Aircraft performed steep tactical descents and rapid combat departures utilizing missile countermeasures and flares to evade potential MANPADS shoulder-fired missiles.
- **Perimeter Extraction**: Indo-Tibetan Border Police (ITBP) commandos and Indian diplomats escorted convoys of evacuees through heavily guarded Taliban checkpoints outside the airport gates.

#### Safeguarding Sacred Heritage
On 24 August 2021, three sacred svaroops of Sri Guru Granth Sahib and ancient Hindu holy texts were carefully retrieved from historical gurdwaras in Kabul and flown with full state honours aboard an IAF aircraft to New Delhi, received at the tarmac by Union Ministers.

### Outcome
- **669 people evacuated**, comprising 448 Indian nationals, 206 Afghan Sikhs and Hindus, and citizens of other nations.
- The entire diplomatic contingent, embassy archives, and ITBP security detachment were recovered without loss of life.`,
    dateStart: "2021-08-16",
    dateEnd: "2021-08-31",
    coordinates: JSON.stringify([34.5553, 69.2075]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/34212",
  },
  {
    slug: "operation-samudra-setu",
    title: "Operation Samudra Setu",
    category: "rescue",
    summary:
      "A nationwide naval sealift operation launched by the Indian Navy in May 2020 during the peak of the global COVID-19 lockdown, deploying amphibious warships to repatriate stranded Indian citizens across the Indian Ocean.",
    content: `## Mission Overview

During the outbreak of the COVID-19 pandemic in early 2020, international borders closed and commercial air travel ceased worldwide, leaving tens of thousands of Indian expatriates and tourists stranded abroad.

The Indian Navy launched **Operation Samudra Setu** (*Sea Bridge*) on 5 May 2020 as part of the broader national Vande Bharat Mission to evacuate stranded citizens by sea.

### Naval Fleet & Medical Protocols
The Navy deployed four specialized amphibious warfare ships:
- **INS Jalashwa** (Landing Platform Dock - LPD)
- **INS Magar** (Landing Ship Tank - LST)
- **INS Shardul** (Landing Ship Tank - LST)
- **INS Airavat** (Landing Ship Tank - LST)

To prevent viral transmission at sea, each warship was retrofitted with dedicated COVID isolation wards, thermal screening bays, air ventilation filters, and rapid antigen testing stations.

### Destinations & Voyage Routes
- **Maldives (Malé to Kochi)**: INS Jalashwa and INS Magar executed multiple voyages carrying 2,673 citizens.
- **Sri Lanka (Colombo to Tuticorin)**: INS Jalashwa and INS Shardul repatriated 700 Indian workers and tourists.
- **Iran (Bandar Abbas to Kochi)**: INS Shardul brought back 233 Indian fishermen stranded along the Persian Gulf coast during monsoon conditions.

### Operation Samudra Setu II (2021)
During the severe second COVID-19 surge in April–May 2021, the operation was reactivated as **Samudra Setu II**. Nine Indian Navy warships—including INS Kolkata, INS Kochi, INS Talwar, and INS Airavat—shipped over 1,150 tonnes of liquid medical oxygen (LMO) and thousands of oxygen concentrators from Qatar, Kuwait, Singapore, Bahrain, and the UAE directly to Indian ports.

### Total Impact
Over **3,992 citizens** were evacuated safely across 55 days, covering more than 23,000 nautical miles under zero-infection safety standards.`,
    dateStart: "2020-05-05",
    dateEnd: "2020-07-08",
    coordinates: JSON.stringify([4.1755, 73.5093]),
    referenceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=1637213",
  },
  {
    slug: "operation-sankalp",
    title: "Operation Sankalp",
    category: "maritime-security",
    summary:
      "A long-running frontline maritime security operation launched by the Indian Navy in June 2019 to safeguard Indian-flagged merchant shipping and secure critical international sea lanes in the Persian Gulf, Gulf of Oman, and northern Arabian Sea against asymmetric drone, missile, and piracy threats.",
    content: `## Mission Overview

On 19 June 2019, following violent attacks on oil tankers in the Gulf of Oman and rising geopolitical instability around the Strait of Hormuz, the Indian Navy initiated **Operation Sankalp** (*Resolution*).

The directive tasked the Indian Navy with establishing an unyielding defensive umbrella over Indian merchant vessels and asserting India's role as the primary Net Security Provider in the Indian Ocean Region (IOR).

### Deployments & Operational Capabilities
The Indian Navy has continuously maintained forward-deployed stealth destroyers and guided-missile frigates in the region, including:
- **INS Chennai**, **INS Kolkata**, **INS Kochi**, **INS Visakhapatnam** (Guided-Missile Destroyers)
- **INS Talwar**, **INS Teg**, **INS Tarkash**, **INS Trikand** (Stealth Frigates)
- **P-8I Neptune** Long-Range Maritime Patrol aircraft and SeaGuardian MQ-9B UAVs conducting persistent intelligence, surveillance, and reconnaissance (ISR).

### Major Interventions & Anti-Piracy Operations

#### Rescue of MV Ruen (March 2024)
In a stunning 40-hour high-seas operation 1,400 nautical miles west of India, INS Kolkata intercepted the hijacked bulk carrier *MV Ruen*, which had been taken over by 35 heavily armed Somali pirates. Supported by INS Subhadra, P-8I aircraft, and MARCOS commandos airdropped from a C-17 aircraft into the open sea, the Navy forced the surrender of all 35 pirates and safely rescued all 17 crew members without a single casualty.

#### Counter-Drone & Firefighting Missions (2024)
Amid Houthi anti-ship missile and drone attacks in the Gulf of Aden, Indian Navy warships repeatedly answered distress calls:
- **MV Marlin Luanda**: INS Visakhapatnam deployed its specialized firefighting teams to battle a catastrophic blaze on an oil tanker struck by an anti-ship missile for over six hours, saving the vessel and crew.
- **MV True Confidence & MV Genco Picardy**: Provided immediate medical care and explosive ordnance disposal (EOD) assistance following drone impacts.

### Outcome
Operation Sankalp has protected over **500 Indian-flagged vessels** transporting crude oil and vital cargo, inspecting hundreds of suspect dhows and escorting more than 40 million tonnes of cargo safely through contested waters.`,
    dateStart: "2019-06-19",
    dateEnd: null,
    coordinates: JSON.stringify([25.0000, 57.0000]),
    referenceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2015830",
  },
  {
    slug: "operation-balakot",
    title: "Operation Bandar (Balakot Airstrike)",
    category: "combat",
    summary:
      "Pre-dawn precision standoff airstrikes executed by the Indian Air Force on 26 February 2019 targeting the largest Jaish-e-Mohammed terror training camp in Balakot, Pakistan, in retaliation for the Pulwama terror attack.",
    content: `## Mission Overview

On 14 February 2019, a suicide bomber of the Pakistan-based terrorist group Jaish-e-Mohammed (JeM) rammed a vehicle packed with explosives into a Central Reserve Police Force (CRPF) convoy at Lethpora, Pulwama, killing 40 Indian security personnel.

India responded on the night of 26 February 2019 with **Operation Bandar** (*Code name Monkey*), launching pre-dawn precision airstrikes deep inside Pakistani sovereign airspace.

### Tactical Air Package & Flight Path
Around 03:00 IST on 26 February 2019, a specialized strike package took off from multiple air bases in northern and central India:
- **12 Mirage 2000 fighters** from No. 1 and No. 7 Squadrons at Gwalior, armed with Israeli SPICE 2000 precision-guided penetrator bombs and Crystal Maze AGM-142 missiles.
- **Su-30MKI air superiority fighters** providing combat air patrol (CAP) and diversionary sweeps along the Rajasthan and Punjab borders.
- **Netra Airborne Early Warning and Control (AEW&C)** providing radar coverage and battle management.
- **Ilyushin Il-78 MKI** aerial tankers providing mid-air refuelling over the Himalayas.

### The Strike at Jaba Top
Crossing the Line of Control into Khyber Pakhtunkhwa province, the Mirage 2000s executed standoff releases from high altitude. The SPICE 2000 bombs pierced the roofs of multiple barracks and training modules on Jaba Top hilltop in Balakot, destroying the camp infrastructure where hundreds of suicide cadres and commanders were housed.

### Strategic Impact
Operation Bandar marked the first time since the 1971 war that the Indian Air Force crossed the international border to conduct airstrikes inside Pakistan proper. It fundamentally altered the deterrence matrix by proving that cross-border terrorism would be met with direct, conventional air strikes regardless of the nuclear threshold.`,
    dateStart: "2019-02-26",
    dateEnd: "2019-02-26",
    coordinates: JSON.stringify([34.5489, 73.3533]),
    referenceUrl: "https://www.pib.gov.in",
  },
  {
    slug: "surgical-strikes-2016",
    title: "2016 Special Forces Surgical Strikes",
    category: "combat",
    summary:
      "Synchronized cross-LoC special operations raids conducted by the Indian Army's Special Forces on the night of 28–29 September 2016, destroying seven terrorist launchpads across Pakistan-occupied Kashmir following the Uri attack.",
    content: `## Mission Overview

On 18 September 2016, four heavily armed terrorists attacked an Indian Army administrative base in Uri, Jammu and Kashmir, killing 19 soldiers. Eleven days later, on the night of 28–29 September 2016, India executed cross-border surgical strikes against terrorist launchpads awaiting infiltration along the Line of Control (LoC).

### Special Operations Tactics

#### The Infiltration
Elite commandos from the **4 Para (Special Forces)** and **9 Para (Special Forces)** regiments led the assault. Supported by live satellite imagery and thermal surveillance from Israeli-supplied Searcher and Heron UAVs, multiple strike teams crossed the LoC on foot and through specialized low-altitude helicopter drops across a 250-km front in Bhimber, Hotspring, Kel, and Lipa sectors.

#### Tactical Assault on Launchpads
Moving silently behind enemy forward defense lines, the Para SF teams approached seven designated terrorist launchpads located 500 meters to 3 kilometers inside Pakistan-occupied Kashmir.
- At approximately 00:30 IST, teams launched coordinated assaults using shoulder-fired Carl Gustaf rocket launchers, grenade launchers, and suppressed TAR-21 assault rifles.
- All seven targeted camps were neutralized within four hours, causing heavy casualties among assembled militants and their handlers.

#### Exfiltration Under Fire
Despite intense incoming fire from Pakistani border posts alerted by the explosions, all Indian special forces teams safely exfiltrated back across the Line of Control without suffering a single fatality.

### Aftermath & Strategic Shift
At a live press conference in New Delhi on 29 September 2016, the Director General of Military Operations (DGMO), Lt Gen Ranbir Singh, publicly announced the operation. The strikes signaled India's new doctrine of pre-emptive, punitive retaliation against cross-border terror networks.`,
    dateStart: "2016-09-28",
    dateEnd: "2016-09-29",
    coordinates: JSON.stringify([34.0000, 74.0000]),
    referenceUrl: "https://www.pib.gov.in",
  },
  {
    slug: "operation-sankat-mochan",
    title: "Operation Sankat Mochan",
    category: "evacuation",
    summary:
      "Emergency tactical airlift conducted by the Indian Air Force in July 2016 to evacuate Indian nationals caught in the middle of fierce urban civil war in Juba, South Sudan.",
    content: `## Mission Overview

In July 2016, intense fighting erupted in Juba between forces loyal to South Sudanese President Salva Kiir and Vice President Riek Machar. Heavy artillery, tank shells, and automatic gunfire swept through the capital, trapping foreign nationals and aid workers in their compounds with food and water rapidly diminishing.

India launched **Operation Sankat Mochan** (*Reliever of Troubles*) on 14 July 2016, spearheaded by Minister of State for External Affairs General (Retd) V.K. Singh, who personally flew to Juba to oversee the extraction.

### Operational Deployment
Two Indian Air Force C-17 Globemaster III aircraft from Air Force Station Hindan flew into Juba International Airport via Uganda.
- Indian diplomats coordinated with UN peacekeepers and local authorities to secure safe road corridors from residential compounds to the airport tarmac.
- Amid gunfire audible across the runway, 153 Indian citizens—including women and three infants—along with two Nepalese nationals were embarked and evacuated.

### Flight Route & Return
The aircraft departed Juba for Entebbe Airport in Uganda for refuelling before flying non-stop across the Indian Ocean to land safely at New Delhi on 15 July 2016.`,
    dateStart: "2016-07-14",
    dateEnd: "2016-07-15",
    coordinates: JSON.stringify([4.8594, 31.5713]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/27129",
  },
  {
    slug: "operation-rahat",
    title: "Operation Rahat",
    category: "evacuation",
    summary:
      "One of the largest and most widely acclaimed non-combatant evacuation operations in modern military history, conducted by the Indian Navy, Air Force, and Air India in March–April 2015 to rescue over 5,600 people from war-torn Yemen under heavy foreign airstrikes.",
    content: `## Mission Overview

In March 2015, following the Houthi takeover of the Yemeni capital Sanaa and the advance on the southern port of Aden, a coalition of Arab states led by Saudi Arabia launched Operation Decisive Storm, initiating devastating airstrikes across Yemen. Civilian airports were shuttered and naval ports blockaded, trapping thousands of Indian nurses, medical workers, and expatriates in severe mortal danger.

India launched **Operation Rahat** (*Relief*) on 1 April 2015 under the direct on-ground leadership of Union Minister Gen (Retd) V.K. Singh, based at the staging hub in Djibouti.

### Naval Heroism Under Bombardment
The Indian Navy deployed a three-ship task force into hostile Yemeni waters:
- **INS Sumitra** (Offshore Patrol Vessel): Under fire from shore batteries and urban shelling, INS Sumitra sailed directly into the besieged port of Aden on 31 March, safely embarking 349 people. Over the following week, the vessel made repeated sorties into Al Hudaydah and Aden.
- **INS Mumbai** (Guided Missile Destroyer) and **INS Tarkash** (Stealth Frigate): Prevented from docking at Aden due to active harbor battles, the warships anchored offshore and used 12-man combat boats and local dhows to ferry over 1,500 people through burning wreckage under naval commando guard.
- **MV Kavaratti & MV Coral**: Passenger ferries chartered by the Lakshadweep administration deployed to extract larger groups to Djibouti across the Gulf of Aden.

### The Aerial Lifeline
The Indian Air Force deployed two C-17 Globemaster III transports alongside two Air India Airbus A320 airliners operating daily shuttle flights into Sanaa International Airport during brief 2-hour daily ceasefire windows granted by the coalition, flying evacuees across the Red Sea to Djibouti for onward transit.

### Global Humanitarian Impact
- **Total Evacuees**: **5,600 people** evacuated (4,640 Indians and 960 foreign nationals from 41 countries, including the United States, United Kingdom, France, Germany, Canada, and Pakistan).
- The operation received global accolades; 26 foreign governments officially requested India to evacuate their citizens.`,
    dateStart: "2015-04-01",
    dateEnd: "2015-04-11",
    coordinates: JSON.stringify([12.7855, 45.0187]),
    referenceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=120894",
  },
  {
    slug: "operation-maitri",
    title: "Operation Maitri",
    category: "humanitarian",
    summary:
      "A massive joint military disaster relief mission launched by the Indian Armed Forces within six hours of the catastrophic 7.8 magnitude Nepal earthquake in April 2015, deploying heavy airlifters, field hospitals, and mountain rescue helicopters.",
    content: `## Mission Overview

On 25 April 2015, a violent 7.8-magnitude earthquake struck Gorkha District, Nepal, killing nearly 9,000 people and triggering massive avalanches across Mount Everest and the Langtang valley. Entire villages were wiped out and infrastructure collapsed.

Within six hours of the catastrophe, India launched **Operation Maitri** (*Friendship*), the largest and fastest international relief deployment ever undertaken by the Indian military on foreign soil.

### The Air Bridge
The Indian Air Force mobilized its strategic transport fleet from Hindan and Palam airbases:
- **Aircraft Fleet**: 8 C-17 Globemaster IIIs, 4 Il-76s, 8 C-130Js, and 10 An-32s operated continuous sorties into Kathmandu's Tribhuvan International Airport.
- Over **1,700 tonnes of relief supplies**, including 50 tonnes of drinking water, mobile reverse-osmosis plants, food packets, generators, and tents were delivered.

### Mountain Helicopters & Aerial Evacuation
IAF and Indian Army Aviation deployed 13 helicopters (Mi-17V5, ALH Dhruv, and Cheetahs):
- Flew hundreds of sorties into inaccessible Himalayan mountain valleys (Barpak, Pokhara, Langtang, Gorkha).
- Evacuated injured villagers and stranded international climbers from high-altitude slopes.

### Indian Army Medical & Engineering Task Forces
- **18 Army Medical Teams** established full-scale military field hospitals in Kathmandu, Senamangal, and Lahan, treating 4,960 casualties and performing over 220 emergency surgeries.
- **16 Engineering Task Forces** cleared 16 km of road debris, restored power grids, and repaired critical bridges connecting Kathmandu to rural districts.

### Outcome
Operation Maitri evacuated **11,200 people** (including 785 foreign tourists), treated thousands of wounded citizens, and formed the backbone of Nepal's immediate survival and reconstruction response.`,
    dateStart: "2015-04-25",
    dateEnd: "2015-05-11",
    coordinates: JSON.stringify([27.7172, 85.3240]),
    referenceUrl: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=122482",
  },
  {
    slug: "operation-safe-homecoming",
    title: "Operation Safe Homecoming",
    category: "evacuation",
    summary:
      "A large-scale multi-modal evacuation launched by India in February–March 2011 to rescue more than 15,400 Indian citizens caught in the Libyan Civil War, coordinating amphibious assault ships, merchant ferries, and commercial airliners.",
    content: `## Mission Overview

In February 2011, widespread uprisings erupted across Libya against the regime of Muammar Gaddafi, quickly degenerating into armed civil war with intense street fighting and aerial bombardment in Benghazi, Tripoli, and Misrata. Over 18,000 Indian citizens—predominantly doctors, petroleum engineers, nurses, and construction workers—were trapped across the country.

On 26 February 2011, the Government of India launched **Operation Safe Homecoming**.

### The Multi-Modal Extraction Model

#### The Naval Sealift
The Indian Navy dispatched three frontline warships from Mumbai:
- **INS Jalashwa** (Landing Platform Dock)
- **INS Mysore** (Guided Missile Destroyer)
- **INS Aditya** (Fleet Replenishment Tanker)
The Navy also chartered commercial passenger ferries *MV Scotia Prince* and *MV Red Star One* to enter the bombarded harbors of Benghazi and Tripoli, embarking thousands of citizens and sailing across the Mediterranean Sea to the port of Alexandria, Egypt, and Valletta, Malta.

#### Air Bridge
Air India and chartered commercial carriers operated daily evacuation flights from Tripoli and Sabha airports, as well as ferry flights from Alexandria and Malta directly back to New Delhi and Mumbai.

#### Border Crossings
Land extraction routes were organized across the Libyan border into Egypt (via the Sallum border crossing) and Tunisia (via Ras Ajdir), where Indian diplomatic field teams provided food, transit visas, and bus transport.

### Outcome
By 10 March 2011, **15,400 Indian nationals** had been safely evacuated back to India without a single casualty, making it one of the largest naval-air evacuations in Mediterranean history.`,
    dateStart: "2011-02-26",
    dateEnd: "2011-03-10",
    coordinates: JSON.stringify([32.8872, 13.1913]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/509",
  },
  {
    slug: "operation-sukoon",
    title: "Operation Sukoon (Beirut Sealift)",
    category: "evacuation",
    summary:
      "A naval sealift operation conducted by the Indian Navy in July 2006 to evacuate Indian, Sri Lankan, and Nepalese nationals from Lebanon during the 2006 Lebanon War between Israel and Hezbollah.",
    content: `## Mission Overview

On 12 July 2006, the 2006 Lebanon War erupted between Israel and the paramilitary wing of Hezbollah. Within hours, Israeli naval forces enforced an air and sea blockade around Lebanon, and Beirut's Rafic Hariri International Airport was bombed, severing all civilian exits. Approximately 10,000 Indian citizens, alongside thousands of other South Asian expatriates, were stranded under intense bombardment.

The Indian Navy launched **Operation Sukoon** (*Peace*) on 19 July 2006.

### The Western Fleet Task Force
By coincidence, a frontline task force of the Indian Navy's Western Fleet was returning through the Mediterranean Sea after joint exercises:
- **INS Mumbai** (Guided Missile Destroyer, Flagship)
- **INS Betwa** (Guided Missile Frigate)
- **INS Brahmaputra** (Guided Missile Frigate)
- **INS Shakti** (Fleet Tanker)

Commanded by Rear Admiral Anup Singh, the task force was diverted directly into the war zone.

### Execution of the Sealift
Negotiating safe passage through diplomatic channels with the Israel Defense Forces and Lebanese authorities, the Indian warships entered the bombed port of Beirut.
- Indian naval commandos secured the loading berths.
- Over three separate shuttle voyages, the warships embarked evacuees under naval air guard, transporting them across the eastern Mediterranean to the port of Larnaca in Cyprus.
- From Cyprus, Air India Boeing 747 aircraft flew the evacuees home to Mumbai and Chennai.

### Outcome
The Indian Navy evacuated **2,280 people**, including 1,764 Indian citizens, 436 Sri Lankans, 69 Nepalese, and 11 Lebanese nationals, earning the mission the title *The Beirut Sealift*.`,
    dateStart: "2006-07-19",
    dateEnd: "2006-08-01",
    coordinates: JSON.stringify([33.8938, 35.5018]),
    referenceUrl: "https://www.mea.gov.in/press-releases.htm?dtl/2347",
  },
  {
    slug: "kuwait-airlift-1990",
    title: "1990 Kuwait Airlift (Operation Airlift)",
    category: "evacuation",
    summary:
      "The Guinness World Record for the largest civilian evacuation conducted by air in human history, evacuating over 175,000 Indian citizens stranded in Kuwait and Iraq over 59 days on 488 flights following Saddam Hussein's invasion of Kuwait.",
    content: `## Mission Overview

On 2 August 1990, Iraqi forces under Saddam Hussein invaded Kuwait, annexing the emirate within days. The sudden war trapped more than 170,000 Indian citizens—mostly working in businesses, financial institutions, and hospitals across Kuwait. Their savings were frozen, civil order collapsed, and armed Iraqi patrols instituted curfews.

Recognizing that a massive conflict (the Gulf War) was imminent, India executed **Operation Airlift**, entering history as the largest civilian airlift ever achieved by any nation.

### Logistics of an Epic Evacuation
Because Iraqi and Kuwaiti airspace were closed to international air traffic and the UN imposed sanctions, India negotiated safe passage through Baghdad to allow Indian citizens to travel by road convoy across the Iraqi desert into Amman, Jordan.
- Over 170,000 civilians travelled 2,000 km across desert highways in crowded buses, trucks, and private cars to temporary refugee camps at Azraq and Amman.
- The Jordanian government, overwhelmed by the refugee influx, permitted an emergency air bridge from Queen Alia International Airport in Amman.

### The Air India & IAF Air Bridge
Beginning on 13 August 1990 and lasting until 20 October 1990:
- **Air India** operated **488 flights** over **59 continuous days**, utilizing Boeing 747, Airbus A300, and A310 aircraft.
- Flight crews and cabin personnel volunteered for multiple back-to-back sorties with turnaround times measured in minutes.
- Indian Air Force Il-76 heavy transport aircraft flew critical reconnaissance, relief supplies, and specialized passenger runs.

### Guinness World Record & Historical Legacy
- **Total Evacuees**: **175,000 Indian nationals** were flown safely back to Mumbai and Delhi before the United States and coalition forces launched Operation Desert Storm.
- The feat remains the **Guinness World Record** for the largest air evacuation in human history and inspired the 2016 historical drama film *Airlift*.`,
    dateStart: "1990-08-13",
    dateEnd: "1990-10-20",
    coordinates: JSON.stringify([29.3759, 47.9774]),
    referenceUrl: "https://www.mea.gov.in",
  },
  {
    slug: "operation-castor-rainbow",
    title: "Operation Castor & Rainbow (2004 Tsunami Relief)",
    category: "humanitarian",
    summary:
      "A trans-oceanic humanitarian assistance and disaster relief (HADR) mission launched by the Indian Armed Forces within hours of the devastating 2004 Indian Ocean earthquake and tsunami, deploying over 40 warships and dozens of aircraft across Sri Lanka, Maldives, and Indonesia.",
    content: `## Mission Overview

On 26 December 2004, a massive 9.1–9.3 magnitude undersea megathrust earthquake off the coast of northern Sumatra, Indonesia, triggered catastrophic tsunami waves up to 30 meters high across the Indian Ocean basin, killing over 227,000 people across 14 nations. India’s own Andaman and Nicobar Islands and Tamil Nadu coast were heavily damaged.

Despite suffering severe damage to its own southern bases (such as Air Force Station Car Nicobar), India did not request foreign aid. Instead, within four hours of the disaster, the Indian Armed Forces launched simultaneous trans-national HADR missions across the Indian Ocean:
- **Operation Castor**: Relief mission deployed to the Maldives.
- **Operation Rainbow**: Massive naval and medical intervention in Sri Lanka.
- **Operation Gambhir**: Hospital ship and engineering deployment to Banda Aceh, Indonesia.

### Deployment of Military Muscle for Peace
The Indian Navy deployed more than **40 warships**, 30 naval aircraft, and thousands of personnel:
- **Hospital Ships**: Survey vessels INS Nirupak and INS Sarvekshak were converted into floating 50-bed emergency surgical hospitals within 48 hours, treating thousands of survivors along the devastated coasts of Galle, Trincomalee, and Aceh.
- **Hovercraft & Landing Craft**: Ferried heavy earth-moving equipment, mobile water-purification plants, and bridging units directly onto destroyed beaches where ports had been washed away.
- **Indian Air Force Air Bridge**: IAF Il-76, An-32, and Mi-8/Mi-17 helicopters flew hundreds of supply drops into remote island atolls.

### Strategic Legacy
Operation Castor and Rainbow demonstrated India's emergence as the primary security and humanitarian provider in the Indian Ocean, establishing the operational model for contemporary HADR diplomacy.`,
    dateStart: "2004-12-26",
    dateEnd: "2005-01-20",
    coordinates: JSON.stringify([6.9271, 79.8612]),
    referenceUrl: "https://www.indiannavy.nic.in",
  },
];

async function main() {
  console.log("🌱 Starting Modern Operations & Humanitarian Airlifts Seed...");

  let seededCount = 0;
  for (const op of MODERN_OPERATIONS) {
    await prisma.operation.upsert({
      where: { slug: op.slug },
      update: {
        title: op.title,
        category: op.category,
        summary: op.summary,
        content: op.content,
        dateStart: op.dateStart,
        dateEnd: op.dateEnd,
        coordinates: op.coordinates,
        referenceUrl: op.referenceUrl,
      },
      create: {
        slug: op.slug,
        title: op.title,
        category: op.category,
        summary: op.summary,
        content: op.content,
        dateStart: op.dateStart,
        dateEnd: op.dateEnd,
        coordinates: op.coordinates,
        referenceUrl: op.referenceUrl,
      },
    });
    seededCount++;
    console.log(`✅ Upserted operation: ${op.title} (${op.dateStart})`);
  }

  const totalOps = await prisma.operation.count();
  console.log(`\n🎉 Successfully upserted ${seededCount} modern operations.`);
  console.log(`📊 Total Operations in database: ${totalOps}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
