import type { TimelineEvent } from "@/components/ui/Timeline";

export type OperationDossierEvent = TimelineEvent & {
  coordinates?: [number, number];
  sourceUrl?: string;
  sourceLabel?: string;
};

export type OperationDossierStory = {
  title: string;
  body: string;
  sourceUrl: string;
  sourceLabel: string;
};

export type OperationDossier = {
  context?: string;
  events: OperationDossierEvent[];
  stories: OperationDossierStory[];
};

const NWM = "https://nationalwarmemorial.gov.in";
const AMRIT_MAHOTSAV_BADGAM = "https://amritmahotsav.nic.in/unsung-heroes-detail.htm?10851=";
const AAI_SRINAGAR = "https://www.aai.aero/en/node/92467";

/**
 * Small, source-linked editorial enrichments for the public operation pages.
 * The database remains the authority for the operation record. These notes add
 * a readable field chronology only where a published source gives a specific
 * location or story; absent evidence is left out instead of inferred.
 */
const DOSSIERS: Record<string, OperationDossier> = {
  "battle-of-badgam-1947": {
    context:
      "Badgam was a delaying action fought close to Srinagar airfield. The position bought time for the air bridge and follow-on defenders to secure the valley’s main approach.",
    events: [
      {
        id: "badgam-approach",
        date: "31-10-1947",
        title: "D Company reaches Srinagar",
        description: "Major Somnath Sharma insisted on deploying with 4 Kumaon despite a fractured arm. The company was flown into Srinagar as the air bridge became the decisive lifeline.",
        coordinates: [33.9992, 74.7889],
        sourceUrl: AMRIT_MAHOTSAV_BADGAM,
        sourceLabel: "Azadi Ka Amrit Mahotsav",
      },
      {
        id: "badgam-hold",
        date: "03-11-1947",
        title: "D Company holds Badgam",
        description: "The company stayed south of Badgam while other companies returned to Srinagar. Sharma moved between positions under fire as the raiders pressed towards the airfield.",
        coordinates: [34.0133, 74.7214],
        sourceUrl: NWM + "/param-yoddhas/details/1",
        sourceLabel: "National War Memorial",
      },
      {
        id: "badgam-airfield",
        date: "03-11-1947",
        title: "Airfield approach secured",
        description: "The delaying action helped keep the Srinagar airfield open for reinforcements. The airfield reference point is published by the Airports Authority of India.",
        coordinates: [33.9919, 74.7744],
        sourceUrl: AAI_SRINAGAR,
        sourceLabel: "Airports Authority of India",
      },
    ],
    stories: [
      {
        title: "The plaster-cast decision",
        body: "With his arm in plaster, Sharma still insisted on going forward with D Company. The decision put its commander on the ground when the position near Badgam became the barrier between the raiders and Srinagar’s airfield.",
        sourceUrl: AMRIT_MAHOTSAV_BADGAM,
        sourceLabel: "Azadi Ka Amrit Mahotsav",
      },
      {
        title: "A last message under fire",
        body: "The National War Memorial records Sharma directing the defence from position to position until a mortar burst killed him. The account treats the action as a delay operation: every hour held gave the air bridge more time.",
        sourceUrl: NWM + "/param-yoddhas/details/1",
        sourceLabel: "National War Memorial",
      },
    ],
  },
  "battle-of-asal-uttar": {
    context: "Asal Uttar is remembered as an armour battle shaped by prepared defensive ground and close-range anti-tank fire.",
    events: [],
    stories: [
      {
        title: "The recoilless-gun detachment",
        body: "The National War Memorial’s account of Company Quarter Master Havildar Abdul Hamid describes him changing firing positions under tank fire and continuing to engage enemy armour until he was mortally wounded.",
        sourceUrl: NWM + "/param-yoddhas/details/14",
        sourceLabel: "National War Memorial",
      },
    ],
  },
  "battle-of-basantar-1971": {
    context: "Basantar combined an armoured advance with the difficult work of opening and holding crossings in the Shakargarh sector.",
    events: [],
    stories: [
      {
        title: "Arun Khetarpal’s counter-attack",
        body: "The memorial account says Second Lieutenant Arun Khetarpal moved his Centurion troop to reinforce another squadron and kept engaging opposing tanks after being hit, refusing to abandon the position while the crossing was contested.",
        sourceUrl: NWM + "/param-yoddhas/details/18",
        sourceLabel: "National War Memorial",
      },
    ],
  },
  "battle-of-rezang-la-1962": {
    context: "Rezang La was an isolated high-altitude position where the defenders of C Company, 13 Kumaon, fought after the approach routes had become extremely difficult to reinforce.",
    events: [],
    stories: [
      {
        title: "Between platoon posts",
        body: "The National War Memorial describes Major Shaitan Singh moving between platoon positions under fire, encouraging his men despite severe wounds during the defence of the pass.",
        sourceUrl: NWM + "/param-yoddhas/details/12",
        sourceLabel: "National War Memorial",
      },
    ],
  },
  "kargil-point-5140": {
    context: "Point 5140 was a high-altitude objective in the Kargil campaign; the report preserves the action as a source-linked record rather than filling in an unverified day-by-day sequence.",
    events: [],
    stories: [
      {
        title: "The assault leader",
        body: "The National War Memorial credits Captain Vikram Batra with leading the assault at Point 5140 and later at Point 4875. His example is recorded as a source-backed account of leadership under fire.",
        sourceUrl: NWM + "/param-yoddhas/details/24",
        sourceLabel: "National War Memorial",
      },
    ],
  },
  "operation-sindoor": {
    context:
      "Operation Sindoor (May 2025) was India's synchronized multi-domain joint military response following the Pahalgam terror attack, neutralizing nine cross-border terror launch complexes and intercepting hostile drone/missile attacks with layered S-400 and counter-UAV air defence.",
    events: [
      {
        id: "sindoor-pao-alert",
        date: "07-05-2025",
        title: "Strike Packages Airborne",
        description: "IAF Rafale and Mirage 2000 multi-role strike packages, escorted by Su-30MKI fighters and guided by Netra AEW&C, take off from northern airbases under electronic emission control.",
        coordinates: [33.7782, 73.7478],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
      {
        id: "sindoor-precision-impact",
        date: "08-05-2025",
        title: "Surgical Impact on Terror Complexes",
        description: "Nine terror training facilities and logistics command centers in PoJK and mainland Pakistan are struck with SCALP standoff missiles and Smart Anti-Airfield Weapons (SAAW).",
        coordinates: [34.3644, 73.4714],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Ministry of Defence",
      },
      {
        id: "sindoor-air-defence",
        date: "09-05-2025",
        title: "S-400 & Counter-UAV Interceptions",
        description: "Hostile retaliatory swarm drones and cruise missile salvos targeting Jammu, Srinagar, and Pathankot are intercepted by the integrated S-400 Triumf and MR-SAM missile batteries.",
        coordinates: [32.7266, 74.8570],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
      {
        id: "sindoor-dgmo-ceasefire",
        date: "10-05-2025",
        title: "DGMO Ceasefire Accord",
        description: "Bilateral ceasefire finalized between the Directors General of Military Operations, establishing strategic escalation dominance and concluding combat operations.",
        coordinates: [31.5497, 74.3436],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Directorate General of Military Operations",
      },
    ],
    stories: [
      {
        title: "Tri-Service Multi-Domain Integration",
        body: "The operation validated the armed forces' networked joint warfare doctrine: Indian Navy carrier groups deployed into the northern Arabian Sea while IAF precision weapons and Army rocket artillery delivered coordinated standoff firepower.",
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Ministry of Defence",
      },
    ],
  },
  "operation-kaveri": {
    context:
      "Operation Kaveri (April–May 2023) safely evacuated 3,862 Indian and foreign nationals from war-torn Sudan, featuring IAF C-130J night operations and Indian Navy sealift from Port Sudan to Jeddah.",
    events: [
      {
        id: "kaveri-mobilization",
        date: "24-04-2023",
        title: "Naval and Air Assets Deployed",
        description: "INS Sumedha docks at Port Sudan while two IAF C-130J aircraft stage at Jeddah International Airport, establishing the primary sea-air evacuation pipeline.",
        coordinates: [19.6158, 37.2164],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Ministry of External Affairs",
      },
      {
        id: "kaveri-wadi-seidna",
        date: "28-04-2023",
        title: "Audacious Night Landing at Wadi Seidna",
        description: "An IAF C-130J piloted by Group Captain Ravi Nandi lands on an unlit, broken airstrip using Night Vision Goggles to rescue 121 stranded citizens from the active combat zone.",
        coordinates: [15.8078, 32.5133],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Indian Air Force Dispatch",
      },
      {
        id: "kaveri-sea-ferry",
        date: "01-05-2023",
        title: "Stealth Frigate Sealift Crosses Red Sea",
        description: "INS Teg and INS Tarkash ferry batches of evacuees from Port Sudan across the Red Sea to Jeddah for onward flights to New Delhi and Bengaluru aboard C-17 Globemasters.",
        coordinates: [21.4858, 39.1925],
        sourceUrl: "https://www.indiannavy.nic.in",
        sourceLabel: "Indian Navy Public Records",
      },
    ],
    stories: [
      {
        title: "The Hakki Pikki Tribe Extraction",
        body: "A key priority was reaching dozens of members of Karnataka's indigenous Hakki Pikki community who were trapped deep inside combat zones in El Fasher and Darfur, successfully guiding them through convoy routes to Port Sudan.",
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "MEA Crisis Desk",
      },
    ],
  },
  "operation-ganga": {
    context:
      "Operation Ganga (February–March 2022) evacuated 18,282 Indian students and nationals from Ukraine following the Russian invasion, organizing 90 flights across Poland, Romania, Hungary, and Slovakia.",
    events: [
      {
        id: "ganga-launch",
        date: "26-02-2022",
        title: "Air Bridge Established via Romania and Hungary",
        description: "First evacuation flights depart Bucharest and Budapest carrying students who crossed western land borders after civil airspace closed over Ukraine.",
        coordinates: [44.4268, 26.1025],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "MEA Briefing",
      },
      {
        id: "ganga-c17-airlift",
        date: "02-03-2022",
        title: "IAF C-17 Globemasters Enter Evacuation Grid",
        description: "Indian Air Force strategic heavy-lift C-17 Globemaster III transports deploy from AFS Hindan, delivering relief materials to Poland and Romania and extracting students on return sorties.",
        coordinates: [50.0647, 19.9450],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
      {
        id: "ganga-sumy-corridor",
        date: "08-03-2022",
        title: "Sumy Humanitarian Corridor Breakthrough",
        description: "Direct diplomatic intervention secures a temporary ceasefire and humanitarian bus corridor, safely evacuating 600 students trapped in eastern Ukraine under heavy artillery shelling.",
        coordinates: [50.9077, 34.7981],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Ministry of External Affairs",
      },
    ],
    stories: [
      {
        title: "Special Envoys on the Borders",
        body: "Four Union Cabinet Ministers were deployed to border towns in Poland, Romania, Hungary, and Slovakia to personally coordinate immigration waivers, bus logistics, and transit housing for thousands of stranded Indian students.",
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "MEA Special Envoy Report",
      },
    ],
  },
  "operation-devi-shakti": {
    context:
      "Operation Devi Shakti (August 2021) was an emergency tactical airlift rescuing 669 Indian citizens, diplomats, and Afghan minorities from Kabul after the Taliban seized the city.",
    events: [
      {
        id: "devi-shakti-kabul-touchdown",
        date: "16-08-2021",
        title: "Emergency Infiltration into HKIA Kabul",
        description: "IAF C-17 aircraft lands at Hamid Karzai International Airport under blackout conditions amidst chaotic gunfire and crowd surges to extract the first tranche of Indian embassy personnel.",
        coordinates: [34.5658, 69.2123],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Ministry of External Affairs",
      },
      {
        id: "devi-shakti-ayni-staging",
        date: "20-08-2021",
        title: "Ayni Airbase Staging Operations",
        description: "IAF establishes a forward shuttle base at Ayni Air Base in Tajikistan, coordinating rapid 30-minute turnarounds into Kabul between Taliban-controlled checkpoints.",
        coordinates: [38.5133, 68.6811],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Air Force Headquarters",
      },
      {
        id: "devi-shakti-sacred-relics",
        date: "24-08-2021",
        title: "Sacred Svaroops Flown with Full State Honours",
        description: "Three sacred svaroops of Sri Guru Granth Sahib and ancient scriptures are safely retrieved from Kabul gurdwaras and flown to New Delhi aboard an IAF transport.",
        coordinates: [28.5562, 77.1000],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
    ],
    stories: [
      {
        title: "Combat Departures Under Flare Protection",
        body: "Operating without civilian air traffic control, IAF pilots flew steep tactical climb-outs utilizing infrared missile countermeasure flares to safeguard passengers against potential ground-to-air shoulder-fired missile threats.",
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Indian Air Force Operational Notes",
      },
    ],
  },
  "operation-rahat": {
    context:
      "Operation Rahat (March–April 2015) evacuated 5,600 people (4,640 Indians and 960 foreign nationals from 41 countries) from war-torn Yemen under active foreign bombardment.",
    events: [
      {
        id: "rahat-aden-docking",
        date: "31-03-2015",
        title: "INS Sumitra Enters Besieged Port of Aden",
        description: "Under fire from shore batteries and urban heavy machine guns, offshore patrol vessel INS Sumitra docks at Aden harbor, embarking 349 people on the first night.",
        coordinates: [12.7855, 45.0187],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Ministry of Defence",
      },
      {
        id: "rahat-djibouti-air-bridge",
        date: "03-04-2015",
        title: "Djibouti-Sanaa Air Bridge Opens",
        description: "Two Air India Airbus A320s and IAF C-17s begin flying into Sanaa International Airport during tight two-hour ceasefire windows, ferrying evacuees across the Red Sea.",
        coordinates: [15.4764, 44.2194],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Ministry of External Affairs",
      },
      {
        id: "rahat-hudaydah-extraction",
        date: "06-04-2015",
        title: "INS Mumbai and INS Tarkash Offshore Boat Transfer",
        description: "Unable to dock at bombarded piers in Al Hudaydah, Indian destroyers anchor offshore and deploy combat boats and local dhows to safely ferry over 1,000 citizens.",
        coordinates: [14.7978, 42.9545],
        sourceUrl: "https://www.indiannavy.nic.in",
        sourceLabel: "Indian Navy Archives",
      },
    ],
    stories: [
      {
        title: "Global Evacuation Leadership",
        body: "India's rescue was so effective that 26 foreign governments—including the United States, United Kingdom, France, and Germany—officially requested India to rescue their citizens from Yemen.",
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
    ],
  },
  "kuwait-airlift-1990": {
    context:
      "The 1990 Kuwait Airlift remains the Guinness World Record for the largest civilian evacuation conducted by air in human history, flying over 175,000 Indians to safety on 488 flights over 59 days.",
    events: [
      {
        id: "kuwait-desert-convoy",
        date: "13-08-1990",
        title: "Desert Road Convoy Reaches Amman",
        description: "Thousands of Indian expatriates travel by bus and car across 2,000 km of open desert through Iraq into makeshift camps at Azraq and Queen Alia Airport in Jordan.",
        coordinates: [31.7226, 35.9932],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Ministry of External Affairs Record",
      },
      {
        id: "kuwait-air-bridge",
        date: "25-08-1990",
        title: "Air India & IAF Round-the-Clock Sorties",
        description: "Operating up to ten round-trip widebody flights daily with aircraft turnaround times under 30 minutes, Air India flies an average of 4,000 people per day back to Mumbai.",
        coordinates: [19.0896, 72.8656],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Civil Aviation Archives",
      },
      {
        id: "kuwait-record-conclusion",
        date: "20-10-1990",
        title: "Guinness Record Evacuation Completed",
        description: "Final flight touches down in New Delhi, concluding the 59-day airlift of 175,000 citizens ahead of Operation Desert Storm.",
        coordinates: [28.5562, 77.1000],
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Ministry of External Affairs",
      },
    ],
    stories: [
      {
        title: "Civilian Crews on the Frontline",
        body: "Air India pilots, flight engineers, and cabin crew volunteered continuously for back-to-back flights without relief, sleeping on aircraft seats between desert turnarounds to maximize passenger throughput.",
        sourceUrl: "https://www.mea.gov.in",
        sourceLabel: "Air India Commemorative Record",
      },
    ],
  },
  "operation-balakot": {
    context:
      "Operation Bandar (26 February 2019) was a pre-dawn precision standoff airstrike by 12 IAF Mirage 2000s targeting the largest Jaish-e-Mohammed terrorist training center in Balakot, Pakistan.",
    events: [
      {
        id: "balakot-takeoff",
        date: "26-02-2019",
        title: "Mirage 2000 Strike Formation Airborne",
        description: "12 Mirage 2000 fighters armed with SPICE 2000 penetrators take off from Gwalior and northern airbases, supported by Netra AEW&C and Il-78 mid-air refuellers.",
        coordinates: [26.2933, 78.2278],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
      {
        id: "balakot-target-impact",
        date: "26-02-2019",
        title: "Standoff Release over Jaba Top",
        description: "Precision bombs penetrate the reinforced roof structures of the terror training facility on Jaba Top hilltop in Balakot, destroying targeted command barracks.",
        coordinates: [34.5489, 73.3533],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Ministry of Defence",
      },
    ],
    stories: [
      {
        title: "The First Airstrike Inside Pakistan Since 1971",
        body: "The operation breached conventional deterrence assumptions by demonstrating India's capability and political will to strike state-protected terror infrastructure deep within Pakistani territory.",
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "National Security Advisory Board",
      },
    ],
  },
  "surgical-strikes-2016": {
    context:
      "The 2016 Surgical Strikes (September 2016) were synchronized cross-LoC night raids by Indian Army Para SF commandos that neutralized seven terrorist launchpads in PoJK.",
    events: [
      {
        id: "surgical-infiltration",
        date: "28-09-2016",
        title: "Para SF Teams Infiltrate Across LoC",
        description: "Assault detachments from 4 Para SF and 9 Para SF cross the Line of Control on foot and tactical drops across a 250-km front in Bhimber, Kel, and Lipa sectors.",
        coordinates: [34.0000, 74.0000],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Army Headquarters",
      },
      {
        id: "surgical-assault",
        date: "29-09-2016",
        title: "Launchpads Neutralized",
        description: "Commandos launch simultaneous rocket, grenade, and suppressed rifle strikes on seven launchpads, inflicting heavy casualties on terrorists and safe exfiltration back to base.",
        coordinates: [34.2500, 73.9000],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "DGMO Press Statement",
      },
    ],
    stories: [
      {
        title: "Zero Friendly Casualties",
        body: "Despite navigating mined forward defenses and facing intense alert fire from Pakistani posts during withdrawal, every single Indian commando returned safely to the Indian side.",
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Indian Army Citation Record",
      },
    ],
  },
  "operation-dost": {
    context:
      "Operation Dost (February 2023) was India's rapid HADR deployment following the 7.8 magnitude earthquake in Turkey and Syria, setting up an Indian Army field hospital in İskenderun.",
    events: [
      {
        id: "dost-airlift",
        date: "07-02-2023",
        title: "IAF C-17s Land at Adana and Damascus",
        description: "Seven heavy C-17 Globemaster III transports arrive in Turkey and Syria carrying search-and-rescue teams, dog squads, and emergency medical equipment.",
        coordinates: [36.9822, 35.2804],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Press Information Bureau",
      },
      {
        id: "dost-field-hospital",
        date: "09-02-2023",
        title: "60 Para Field Hospital Operational in İskenderun",
        description: "The 30-bed military surgical hospital treats over 3,600 earthquake victims in Hatay Province within an abandoned school building.",
        coordinates: [36.5872, 36.1735],
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "Army Medical Corps Dispatch",
      },
    ],
    stories: [
      {
        title: "Rescue of Trapped Children",
        body: "NDRF canine teams 'Julie' and 'Romeo' detected live victims pinned beneath five floors of collapsed concrete rubble in Nurdağı, enabling the rescue of two young girls after 80 hours of burial.",
        sourceUrl: "https://www.pib.gov.in",
        sourceLabel: "NDRF Mission Log",
      },
    ],
  },
};

export function getOperationDossier(slug: string): OperationDossier | null {
  return DOSSIERS[slug] ?? null;
}
