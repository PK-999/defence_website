export type HistoryDossier = {
  overview: string;
  overviewSources?: number[];
  overviewParagraphs?: string[];
  researchParagraphs?: string[];
  keyPoints: Array<{ title: string; body: string; sourceIndexes?: number[] }>;
  sources: Array<{ label: string; url: string; note: string; publisher?: string; date?: string }>;
};

const GALLANTRY = "https://gallantryawards.gov.in";
const PIB = "https://www.pib.gov.in";

const WAR_1947 = `${GALLANTRY}/assets/uploads/wars/pdf/pak.pdf`;
const WAR_1965 = `${GALLANTRY}/assets/uploads/wars/pdf/shab.pdf`;
const WAR_1971 = `${GALLANTRY}/assets/wars/1525467759_2023-01-23_1971_INDO-PAK%20WAR%20_AM_JS_221118.pdf`;
const KARGIL = `${GALLANTRY}/assets/wars/1255459323_2022-06-15_10631539_2022-06-15_Tales.pdf`;
const KARGIL_HISTORY = `${GALLANTRY}/assets/wars/596980200_2022-06-15_war.pdf`;
const TIGER_HILL = `${GALLANTRY}/assets/wars/877697776_2023-07-07_The%20Battle%20of%20Tiger%20Hill.pdf`;
const HAJI_PIR = `${GALLANTRY}/assets/wars/1084364235_2024-01-11_Battle%20of%20Hajipir.pdf`;
const TANGAIL = `${GALLANTRY}/assets/wars/1893686490_2024-01-11_Tangail%20v4.pdf`;
const MEGHDOOT = `${PIB}/Pressreleaseshare.aspx?PRID=2017834&lang=2&reg=48`;
const SAFED_SAGAR = `${PIB}/PressReleasePage.aspx?PRID=2033075&lang=2&reg=48`;
const TRIDENT = `${PIB}/PressReleasePage.aspx?PRID=1880958&lang=2&reg=48`;
const GOA = "https://dip.goa.gov.in/history-of-goa/";
export const CONFLICT_DOSSIERS: Record<string, HistoryDossier> = {
  "indo-pak-1947": {
    overview: "The 1947–48 war developed from the crisis over Jammu and Kashmir’s accession into a campaign fought across widely separated mountain and valley sectors. Airlift into Srinagar, the defence of the valley approaches, relief operations around Poonch and fighting on the Ladakh axis all formed part of the same extended contest before the ceasefire of 1 January 1949.",
    overviewParagraphs: [
      "The conflict emerged in the unsettled months after Partition, when the future of Jammu and Kashmir became inseparable from the security of the new Indian state. The accession crisis opened a campaign that was fought across valleys, roads and high passes rather than along one continuous front.",
      "Srinagar’s airfield became the critical entry point for Indian reinforcements. The defence at Badgam slowed the advance towards the valley while the air bridge brought in troops, turning time on the approaches into a strategic resource.",
      "The campaign then widened into a series of mountain and communications battles. Naushera, Rajouri, Poonch and the Zoji La axis show how road access, relief of isolated positions and control of passes shaped the course of the fighting.",
      "The ceasefire of 1 January 1949 stopped the major campaign without resolving the underlying dispute. It left a divided territory and a military line whose later history became part of the continuing India–Pakistan security relationship.",
    ],
    researchParagraphs: [
      "The source record is strongest when the war is read as several connected theatres: the Srinagar valley, the Jammu approaches, the Poonch–Rajouri communications area and the Ladakh route. This framing explains why a single battlefield narrative cannot account for the campaign’s duration.",
      "The airfield and its approaches illustrate the relationship between tactical delay and operational depth. A local action such as Badgam mattered because it protected the time needed for reinforcement and consolidation, not because it decided the whole war on its own.",
      "Mountain communications were a recurring constraint. The record’s references to passes, roads and relief operations point to the practical problem of sustaining forces across terrain where movement could be slower and more decisive than firepower.",
      "The ceasefire should therefore be treated as a change in the military situation rather than a final settlement. The cited campaign history supports the broad sequence and named actions, while later political interpretations require separate sources and should not be folded into the battlefield account.",
    ],
    keyPoints: [
      { title: "Srinagar and the valley", body: "The air bridge into Srinagar made the airfield and its approaches strategically decisive. The defence at Badgam delayed raiders moving toward the airfield while reinforcements arrived." },
      { title: "Mountain communications", body: "Operations around Naushera, Rajouri, Poonch and Zoji La repeatedly depended on opening roads, holding passes and moving forces across difficult terrain." },
      { title: "Ceasefire and legacy", body: "The fighting ended under a UN-backed ceasefire, leaving a divided territory and a military line that became the foundation of the later Line of Control." },
    ],
    sources: [{ label: "Official 1947–48 war history", url: WAR_1947, note: "Gallantry Awards portal, Ministry of Defence" }],
  },
  "sino-indian-1962": {
    overview: "The 1962 war was fought in two principal theatres: Ladakh in the west and the North-East Frontier Agency in the east. Thin communications, extreme altitude and dispersed posts shaped the campaign. The official gallantry record is especially detailed at Sirijap, Tongpeng La and Rezang La through the citations of the Param Vir Chakra recipients who fought there.",
    overviewParagraphs: [
      "The 1962 war unfolded across two distant Himalayan theatres: Ladakh in the west and the North-East Frontier Agency in the east. The separation between these fronts made the conflict a set of linked but locally distinct campaigns.",
      "High altitude, poor communications and isolated forward posts shaped what units could see, reinforce and sustain. Positions that looked small on a map could carry outsized importance because roads and supporting formations were limited.",
      "The major offensive began on 20 October, including the Namka Chu sector in the east and fighting around forward posts in Ladakh. November brought further actions, including the defence of Rezang La on 18 November.",
      "China announced a unilateral ceasefire on 21 November. The war’s military outcome and the continuing border dispute are best kept distinct: the first can be described through the campaign record, while the second extends beyond the immediate fighting.",
    ],
    researchParagraphs: [
      "The two-theatre structure is the key to reading the evidence. Sirijap, Tongpeng La and Rezang La were not interchangeable engagements; each reflects a different local problem within a campaign spread across extreme distances.",
      "The official gallantry citations provide unusually vivid detail about individual positions and commanders. They are valuable for reconstructing acts of leadership and resistance, but they are not by themselves a complete order of battle or a substitute for the wider campaign history.",
      "The terrain explains much of the operational difficulty. Dispersed posts below dominating ground faced limits on mutual support, while thin roads and high passes constrained reinforcement and made the timing of movement central to the outcome.",
      "A careful dossier therefore distinguishes the documented sequence of attacks, the conditions recorded in individual citations and the larger political dispute over the frontier. Keeping those layers separate avoids turning a few well-documented actions into an overconfident account of every sector.",
    ],
    keyPoints: [
      { title: "Two distant theatres", body: "Operations unfolded across Ladakh and the eastern frontier rather than along a single continuous front, complicating reinforcement, supply and command." },
      { title: "20 October offensive", body: "Large-scale attacks began on 20 October, including the Namka Chu sector in the east and isolated posts in Ladakh." },
      { title: "November fighting", body: "A renewed phase in November included the defence of Rezang La on 18 November. China announced a unilateral ceasefire on 21 November." },
    ],
    sources: [
      { label: "Major Shaitan Singh official record", url: `${GALLANTRY}/awardee/1057`, note: "Rezang La citation and profile" },
      { label: "Lt Col Dhan Singh Thapa official record", url: `${GALLANTRY}/awardee/1055`, note: "Sirijap citation and profile" },
      { label: "Subedar Joginder Singh official record", url: `${GALLANTRY}/awardee/1056`, note: "Tongpeng La citation and profile" },
    ],
  },
  "goa-1961": {
    overview: "Operation Vijay in December 1961 was a tri-service campaign that ended Portuguese rule in Goa, Daman and Diu. Land columns advanced into Goa, naval forces operated off the coast and the Air Force struck selected military targets and supported the rapid campaign.",
    overviewParagraphs: [
      "Operation Vijay followed the failure of negotiations to secure the handover of Portugal’s remaining Indian enclaves. The campaign was directed at Goa, Daman and Diu and combined military action with a long-running political question about colonial rule after Indian independence.",
      "The Army’s advance formed the main land effort, with columns moving through the approaches to Goa. The short duration of the campaign meant that movement, pressure on key routes and the collapse of Portuguese resistance developed together.",
      "The Navy operated off the coast while the Air Force supported the operation and struck selected military targets. The engagement off Mormugao and the action at Dabolim show how the maritime and air dimensions fitted into the wider land campaign.",
      "Portuguese authority ended after the December operation, and Goa, Daman and Diu were integrated into the Indian Union. The military result and the longer political history of the territories are related but should be described as separate parts of the record.",
    ],
    researchParagraphs: [
      "The strongest feature of the source set is the campaign’s joint character. Land, sea and air actions are best understood as coordinated pressure rather than as isolated service stories presented side by side.",
      "Mormugao and Dabolim provide useful examples of that distinction. The naval challenge to Afonso de Albuquerque and the Air Force strike were significant documented actions, but neither one represents the whole of Operation Vijay.",
      "The campaign also illustrates the importance of tempo. A rapid operation can produce a compact narrative, yet its outcome depends on the interaction of movement on land, control of nearby waters and the disruption of military facilities from the air.",
      "The dossier uses the Government of Goa and Ministry of Defence material to anchor the sequence. Claims about the operation’s constitutional and social aftermath belong to a broader political history and are not added to the military account without separate evidence.",
    ],
    keyPoints: [
      { title: "A tri-service action", body: "Army, Navy and Air Force elements acted in concert across the land approaches, coastal waters and airspace." },
      { title: "Mormugao and Dabolim", body: "Naval action occurred off Mormugao while Canberra aircraft struck Dabolim airfield. These were parts of a broader operation, not isolated engagements." },
      { title: "Political result", body: "Portuguese authority ended after the brief campaign, and the territories were incorporated into the Indian Union." },
    ],
    sources: [
      { label: "History of Goa", url: GOA, note: "Department of Information and Publicity, Government of Goa" },
      { label: "IAF Canberra service history", url: `${PIB}/PressReleasePage.aspx?PRID=1501361&lang=1&reg=3`, note: "Includes the Dabolim strike" },
    ],
  },
  "indo-pak-1965": {
    overview: "The 1965 war expanded from infiltration in Jammu and Kashmir into conventional fighting across the international border. The campaign included mountain operations around Haji Pir, armour battles in Punjab and the Sialkot sector, and sustained air operations before the ceasefire of 23 September.",
    overviewParagraphs: [
      "The 1965 war began with a sequence of confrontations in and around Jammu and Kashmir before widening into conventional fighting across the international border. Infiltration and the response to it made the local dispute impossible to separate from the larger campaign.",
      "Operations around Haji Pir focused on the mountain routes connected with infiltration. The pass became one of the clearest examples of how control of difficult ground could influence movement and the security of the Uri–Poonch area.",
      "The war then included major armoured actions in Punjab and the Sialkot sector. Asal Uttar, Phillora and Chawinda brought armour, infantry, artillery and air power into a broader contest in which terrain and communications continued to shape decisions.",
      "A UN-mandated ceasefire took effect on 23 September 1965, followed by the Tashkent Declaration in January 1966. The military campaign therefore ended without a simple battlefield resolution, and later diplomatic developments need their own documentary treatment.",
    ],
    researchParagraphs: [
      "The escalation sequence is more useful than a single battle label. The source record moves from infiltration and the response in Jammu and Kashmir to a general war, allowing the dossier to connect Haji Pir with the later armoured and air campaigns without treating them as one engagement.",
      "The mountain and plains theatres demanded different methods. Haji Pir turned on movement through steep ground and poor weather, while Asal Uttar, Phillora and Chawinda depended on the interaction of prepared positions, armour and supporting arms.",
      "The air campaign formed another layer of the war. Interception, close support, interdiction and counter-air missions affected the wider contest, but the available sources do not justify reducing the ground battles to air-power narratives.",
      "The ceasefire and Tashkent settlement mark the boundary of this military dossier. They establish the end of the fighting and the beginning of a diplomatic phase, while leaving disputed claims and later political conclusions outside the section unless separately sourced.",
    ],
    keyPoints: [
      { title: "Escalation", body: "Infiltration under Operation Gibraltar and the subsequent Operation Grand Slam widened into a general war in early September." },
      { title: "Armour and air power", body: "Asal Uttar, Phillora and Chawinda became major armoured actions, while the Air Force flew interception, close-support, interdiction and counter-air missions." },
      { title: "Ceasefire", body: "A UN-mandated ceasefire took effect on 23 September 1965; the Tashkent Declaration followed in January 1966." },
    ],
    sources: [
      { label: "Official 1965 war history", url: WAR_1965, note: "Gallantry Awards portal, Ministry of Defence" },
      { label: "1965 ceasefire commemoration", url: `${PIB}/PressReleasePage.aspx?PRID=2171328&lang=2&reg=48`, note: "Ministry of Defence account of the air campaign" },
    ],
  },
  "indo-pak-1971": {
    overview: "The December 1971 war was fought on eastern and western fronts and ended with the surrender of Pakistani forces in Dhaka and the emergence of Bangladesh. Rapid ground manoeuvre in the east was supported by airborne, helicopter, naval and air operations; the western front included major battles intended to hold or shape the wider contest.",
    overviewParagraphs: [
      "The December 1971 war was fought on two connected fronts. In the east, Indian and Mukti Bahini forces moved towards Dhaka through a campaign designed to maintain momentum; in the west, major battles held or shaped the wider contest.",
      "The eastern advance depended on more than the speed of ground columns. The Tangail airdrop and Meghna helicopter crossings show how airborne and helicopter operations helped formations bypass obstacles and keep pressure on the approaches to the capital.",
      "Naval and air operations added pressure across the theatre, while the western front drew on actions such as Longewala, Basantar and the strikes around Karachi. These actions belonged to the same war but had different local purposes.",
      "The campaign ended with the surrender of Pakistani forces in Dhaka on 16 December and the emergence of Bangladesh. The surrender is the documented endpoint of the military narrative; the conflict’s humanitarian and political consequences require a wider history.",
    ],
    researchParagraphs: [
      "The eastern campaign is best understood through tempo and access. Bypassing some strongpoints, opening crossings and placing airborne forces ahead of the main advance all served the same operational aim: keeping the route to Dhaka moving.",
      "Tangail and the Meghna crossings demonstrate different forms of joint action. One placed forces near a route ahead of withdrawing units, while the other used helicopters to overcome a major water obstacle; together they show why the campaign cannot be reduced to a list of infantry advances.",
      "The western front had a shaping role rather than a single shared objective. Longewala, Basantar and the naval strikes around Karachi imposed pressure and fixed attention while the decisive political and military result developed in the east.",
      "The source-backed conclusion is the surrender signed in Dhaka on 16 December. Treating that event separately from later national narratives keeps the dossier precise about what the cited war history establishes and what would need additional evidence.",
    ],
    keyPoints: [
      { title: "Eastern campaign", body: "Indian and Mukti Bahini forces advanced on multiple axes, bypassing some strongpoints to maintain momentum toward Dhaka." },
      { title: "Joint and airborne operations", body: "The Tangail airdrop, Meghna helicopter crossings, air support and the naval blockade show how the services combined to accelerate the eastern campaign." },
      { title: "Western front and surrender", body: "Longewala, Basantar and naval strikes on Karachi were among the major western actions. The Eastern Command surrender was signed in Dhaka on 16 December." },
    ],
    sources: [{ label: "Official 1971 war history", url: WAR_1971, note: "Gallantry Awards portal, Ministry of Defence" }],
  },
  "siachen-1984": {
    overview: "Operation Meghdoot began on 13 April 1984 to secure key passes and heights in the Siachen region. The campaign created a permanent high-altitude logistics problem: men, equipment and supplies had to be moved and sustained in terrain where weather and altitude were as consequential as opposing fire.",
    overviewParagraphs: [
      "Operation Meghdoot began on 13 April 1984 with the occupation of key passes and heights in the Siachen region. The initial objective was to secure ground whose value came from its position on the Saltoro Ridge and the approaches around the glacier.",
      "The campaign was shaped by a problem that continued after the first deployment: sustaining people and equipment at extreme altitude. Weather, thin air and the absence of ordinary surface routes made logistics a central part of the military story.",
      "Air transport and helicopters supported induction, resupply and casualty evacuation. This air-maintenance system was not a supporting detail; it was the practical condition that allowed isolated positions to remain occupied.",
      "Operation Rajiv in 1987, including the capture of Quaid Post and its later renaming as Bana Post, became a prominent action within the continuing Siachen contest. It belongs to the same high-altitude setting but is distinct from the initial 1984 deployment.",
    ],
    researchParagraphs: [
      "The dossier treats Siachen as a sustained high-altitude contest rather than a single battle. The source material supports the opening deployment, the continuing logistics burden and the later action at Quaid Post as different phases of the same strategic problem.",
      "Control of the heights mattered because positions along the Saltoro Ridge shaped observation, access and the ability to establish a presence before an opposing deployment was completed. The geography is therefore part of the evidence, not just background scenery.",
      "Air maintenance explains the campaign’s endurance. Transport aircraft and helicopters connected remote posts to the wider force, while resupply and evacuation had to be planned around weather and altitude as carefully as around hostile fire.",
      "The record of Operation Rajiv adds a later tactical example without standing in for the whole conflict. Keeping the 1984 occupation, the logistics system and the 1987 capture distinct gives the research section a clearer structure and avoids repeating the short overview.",
    ],
    keyPoints: [
      { title: "Securing the heights", body: "Indian forces occupied strategically important positions along the Saltoro Ridge before an opposing deployment could be completed." },
      { title: "Air maintenance", body: "The Air Force’s transport aircraft and helicopters became essential to induction, resupply, casualty evacuation and the survival of isolated posts." },
      { title: "Operation Rajiv", body: "The 1987 capture of Quaid Post—later renamed Bana Post—became one of the best-known actions within the continuing Siachen contest." },
    ],
    sources: [
      { label: "Operation Meghdoot at 40", url: MEGHDOOT, note: "Ministry of Defence / Indian Air Force" },
      { label: "Bana Singh official record", url: `${GALLANTRY}/awardee/1064`, note: "Operation Meghdoot / Rajiv citation and profile" },
    ],
  },
  "kargil-1999": {
    overview: "The Kargil conflict followed the discovery of intrusions across high ridgelines overlooking communications in the Kargil sector. Indian forces fought to identify, isolate and recapture a chain of fortified heights under severe altitude and terrain constraints, while the Air Force conducted Operation Safed Sagar in support of the ground campaign.",
    overviewParagraphs: [
      "The Kargil conflict began when reports from local shepherds and patrol contacts exposed intrusions on high ridgelines overlooking important communications in the Kargil sector. What first appeared local soon required reconnaissance, mobilisation and a wider response.",
      "Indian forces then worked to identify, isolate and recapture a chain of fortified heights. The terrain forced many attacks up steep approaches, often at night, while elevation and exposure limited movement, observation and support.",
      "Tololing, Point 5140, Tiger Hill and Point 4875 became prominent objectives within that sequence. Each was a local fight inside a campaign whose progress depended on reducing the defended heights one position at a time.",
      "Operation Safed Sagar began on 26 May in support of the ground campaign. The withdrawal and recapture process culminated in the declaration of Operation Vijay’s success on 26 July 1999, providing the documented endpoint for this overview.",
    ],
    researchParagraphs: [
      "The first research problem was scale. Local warnings and patrol contacts had to be turned into an understanding of how many positions were involved, where they sat and which communications they overlooked; the source record supports that progression without requiring an invented day-by-day account.",
      "Terrain was operationally decisive. High ridgelines, steep approaches and exposed movement affected reconnaissance, artillery support, infantry assaults and the ability to hold a newly recaptured position, making geography inseparable from the campaign narrative.",
      "The named objectives form a useful sequence of examples rather than a complete list. The official Kargil history and linked gallantry accounts provide specific detail for Tololing, Point 5140 and Tiger Hill, while the dossier avoids claiming that those actions represent every sector.",
      "Operation Safed Sagar shows the joint dimension of the campaign. Air reconnaissance, strike and support missions operated alongside the ground effort, and the final withdrawal and recapture process is kept separate from later commemorative language so the conclusion remains source-bounded.",
    ],
    keyPoints: [
      { title: "Discovery and mobilisation", body: "Reports from local shepherds and patrol contacts exposed the scale of the intrusions in May 1999, prompting reconnaissance and a widening ground response." },
      { title: "Recapturing the heights", body: "Tololing, Point 5140, Tiger Hill and Point 4875 were among the prominent objectives in a campaign fought largely by steep night approaches and close infantry assaults." },
      { title: "Air support and conclusion", body: "Operation Safed Sagar began on 26 May. The withdrawal and recapture process culminated in the declaration of Operation Vijay’s success on 26 July." },
    ],
    sources: [
      { label: "Official Kargil history", url: KARGIL_HISTORY, note: "Gallantry Awards portal, Ministry of Defence" },
      { label: "Tales of valour from Kargil", url: KARGIL, note: "Source-linked battle and awardee accounts" },
      { label: "Operation Safed Sagar", url: SAFED_SAGAR, note: "Ministry of Defence / Indian Air Force" },
    ],
  },
};

export const OPERATION_DOSSIERS: Record<string, HistoryDossier> = {
  "kargil-infiltration-discovered": {
    overview: "The first reports and patrol contacts in May 1999 transformed what initially appeared to be a local intrusion into evidence of a broader occupation of the heights. Establishing the extent, routes and strength of the positions became the first task of the campaign.",
    keyPoints: [
      { title: "Local warning", body: "Reports by local shepherds helped draw attention to movement on the heights." },
      { title: "From patrols to campaign", body: "Reconnaissance and early contacts showed that multiple defended positions overlooked important approaches and the national highway." },
    ],
    sources: [{ label: "Official Kargil history", url: KARGIL_HISTORY, note: "Gallantry Awards portal, Ministry of Defence" }],
  },
  "battle-of-badgam-1947": {
    overview: "The action at Badgam on 3 November 1947 was a delaying defence south-west of Srinagar. D Company, 4 Kumaon, held a much larger attacking force long enough to protect the immediate approach to the airfield and allow the wider defence to consolidate.",
    keyPoints: [
      { title: "Airfield as lifeline", body: "Srinagar airfield was the entry point for reinforcements, making time and distance on its approaches strategically important." },
      { title: "Somnath Sharma", body: "The company commander remained in the field despite a fractured arm and was killed while directing the defence." },
    ],
    sources: [
      { label: "Official 1947–48 war history", url: WAR_1947, note: "Campaign context" },
      { label: "Major Somnath Sharma official record", url: `${GALLANTRY}/awardee/1049`, note: "Citation and biography" },
    ],
  },
  "operation-cactus": {
    overview: "Operation Cactus was India’s rapid November 1988 intervention after an attempted coup in the Maldives. Troops were airlifted over long distance to Malé, secured the capital and key facilities, while naval and maritime-reconnaissance elements helped track the fleeing mercenaries.",
    keyPoints: [
      { title: "Rapid airlift", body: "The response depended on moving a combat force directly to Hulhulé airport and then across to Malé before the coup could consolidate." },
      { title: "Maritime pursuit", body: "Naval aviation tracked the vessel used by fleeing mercenaries until Indian warships intercepted it." },
    ],
    sources: [
      { label: "INAS 312 and Operation Cactus", url: `${PIB}/newsite/printRelease.aspx?lang=2&reg=48&relid=160149`, note: "Ministry of Defence naval aviation history" },
      { label: "IAF Canberra service history", url: `${PIB}/PressReleasePage.aspx?PRID=1501361&lang=1&reg=3`, note: "Official operational service summary" },
    ],
  },
  "battle-of-basantar-1971": {
    overview: "Basantar was fought in the Shakargarh sector as Indian formations worked through minefields to establish and protect a bridgehead. Engineers, infantry and armour were tightly interdependent: lanes and crossings had to remain open while counter-attacks were defeated.",
    keyPoints: [
      { title: "Minefield and bridgehead", body: "The battle centred on opening routes through defended ground and holding the lodgement needed for the advance." },
      { title: "Armoured counter-attacks", body: "The Poona Horse fought to protect the bridgehead; Arun Khetarpal’s final tank action became the battle’s best-known individual account." },
    ],
    sources: [
      { label: "Official 1971 war history", url: WAR_1971, note: "Shakargarh campaign context" },
      { label: "Arun Khetarpal official record", url: `${GALLANTRY}/awardee/1060`, note: "Citation and profile" },
      { label: "Hoshiar Singh official record", url: `${GALLANTRY}/awardee/1061`, note: "Jarpal citation" },
    ],
  },
  "battle-of-longewala": {
    overview: "At Longewala, a small Indian defensive position blocked a larger armoured thrust in the Rajasthan sector during the opening days of the 1971 war. The defenders held through the night; daylight air attacks then struck vehicles concentrated in exposed desert terrain.",
    keyPoints: [
      { title: "Night defence", body: "The post’s garrison used prepared positions and limited anti-tank weapons to delay the advance." },
      { title: "Air action at daylight", body: "Hunters operating from Jaisalmer attacked the halted column after dawn, illustrating the close relationship between the ground defence and air response." },
    ],
    sources: [{ label: "Official 1971 war history", url: WAR_1971, note: "Western front campaign account" }],
  },
  "operation-trident": {
    overview: "On the night of 4–5 December 1971, an Indian Navy missile-boat group struck targets off Karachi in Operation Trident. The raid demonstrated the range and effect of a compact missile force supported by larger ships and careful planning.",
    keyPoints: [
      { title: "Missile strike group", body: "Vidyut-class missile boats, supported for the transit and attack, engaged ships and shore installations off Karachi." },
      { title: "Naval commemoration", body: "The action of 4 December is commemorated annually as Navy Day in India." },
    ],
    sources: [{ label: "Operation Trident anniversary", url: TRIDENT, note: "Ministry of Defence / Indian Navy" }],
  },
  "battle-of-asal-uttar": {
    overview: "Asal Uttar was a defensive battle in the Khem Karan sector in September 1965. Prepared ground, local terrain and close-range anti-tank fire disrupted a major armoured advance and produced heavy tank losses.",
    keyPoints: [
      { title: "Shaping the ground", body: "Defensive deployment and waterlogged fields restricted armour movement and created engagement areas." },
      { title: "Abdul Hamid", body: "The 4 Grenadiers recoilless-rifle detachment led by Abdul Hamid repeatedly engaged tanks before he was killed." },
    ],
    sources: [
      { label: "Official 1965 war history", url: WAR_1965, note: "Campaign context" },
      { label: "Abdul Hamid official record", url: `${GALLANTRY}/awardee/1058`, note: "Citation and profile" },
    ],
  },
  "tangail-airdrop-1971": {
    overview: "The Tangail airdrop on 11 December 1971 placed an airborne battalion north of Dhaka to seize the Poongli bridge area, disrupt withdrawing forces and speed the advance on the capital.",
    keyPoints: [
      { title: "Operational purpose", body: "The drop was designed to get ahead of withdrawing troops and secure a crossing on a route toward Dhaka." },
      { title: "Airborne concentration", body: "Transport aircraft, pathfinders, paratroopers and follow-on ground forces had to converge on a time-sensitive objective." },
    ],
    sources: [{ label: "The Tangail airdrop", url: TANGAIL, note: "Gallantry Awards portal history" }],
  },
  "operation-polo": {
    overview: "Operation Polo was the September 1948 police action that integrated Hyderabad State into the Indian Union. Indian columns advanced from several directions; the Nizam announced a ceasefire on 17 September after a campaign lasting roughly four days.",
    keyPoints: [
      { title: "Political setting", body: "Hyderabad had remained outside the Union after independence amid failed negotiations, internal violence and mobilisation by the Nizam’s forces and the Razakars." },
      { title: "Rapid conclusion", body: "The military action began on 13 September and ended with the ceasefire and accession of Hyderabad." },
    ],
    sources: [
      { label: "Hyderabad Liberation Day background", url: `${PIB}/PressReleasePage.aspx?PRID=1860131&lang=2&reg=48`, note: "Government of India historical account" },
      { label: "Operation Polo and integration", url: `${PIB}/PressReleasePage.aspx?PRID=1507643&lang=2&reg=48`, note: "Government account of the four-day action" },
    ],
  },
  "battle-of-chawinda-1965": {
    overview: "Chawinda formed part of the large armoured contest in the Sialkot sector during September 1965. It followed Indian advances through the Phillora area and developed into a concentrated battle involving armour, infantry, artillery and air support.",
    keyPoints: [
      { title: "Sialkot axis", body: "The fighting was connected to the wider effort to draw pressure from the Chhamb sector and threaten communications around Sialkot." },
      { title: "From Phillora to Chawinda", body: "Armoured engagements unfolded across several localities rather than as a single isolated clash; the Poona Horse’s record spans this sequence." },
    ],
    sources: [
      { label: "Official 1965 war history", url: WAR_1965, note: "Sialkot campaign context" },
      { label: "Ardeshir Tarapore official record", url: `${GALLANTRY}/awardee/1059`, note: "Phillora–Chawinda citation and profile" },
    ],
  },
  "battle-of-rezang-la-1962": {
    overview: "Rezang La was defended on 18 November 1962 by C Company, 13 Kumaon, in the Chushul sector. Isolated platoon positions fought at extreme altitude after communications and reinforcement became exceptionally difficult.",
    keyPoints: [
      { title: "Distributed defence", body: "The company’s platoons occupied separate positions covering approaches to the pass, limiting mutual support once the battle began." },
      { title: "Shaitan Singh", body: "The company commander moved between positions under fire and continued directing the defence after being severely wounded." },
    ],
    sources: [{ label: "Major Shaitan Singh official record", url: `${GALLANTRY}/awardee/1057`, note: "Citation, profile and bibliography" }],
  },
  "naval-action-mormugao-1961": {
    overview: "During Operation Vijay, Indian naval ships challenged the Portuguese sloop Afonso de Albuquerque off Mormugao. The engagement disabled the ship, while land and air operations elsewhere in Goa were bringing the wider campaign to a close.",
    keyPoints: [
      { title: "Coastal control", body: "The naval presence restricted movement by sea and confronted the principal Portuguese warship in Goan waters." },
      { title: "Part of a joint campaign", body: "The Mormugao engagement should be read alongside the land advance and air action at Dabolim." },
    ],
    sources: [
      { label: "History of Goa", url: GOA, note: "Government of Goa background" },
      { label: "IAF Canberra service history", url: `${PIB}/PressReleasePage.aspx?PRID=1501361&lang=1&reg=3`, note: "Official account of the parallel Dabolim strike" },
    ],
  },
  "operation-bison-1948": {
    overview: "Operation Bison reopened the Zoji La axis in late 1948 using infantry and armour at an altitude where tanks were not expected. The action helped restore the road link toward Dras and Leh after earlier attempts to force the pass had failed.",
    keyPoints: [
      { title: "Armour in the mountains", body: "Light tanks were moved and prepared for a surprise assault in terrain normally treated as unsuitable for armoured operations." },
      { title: "Opening the Ladakh route", body: "Forcing Zoji La changed the logistical position on the Ladakh axis and enabled follow-on advances toward Dras and Kargil." },
    ],
    sources: [
      { label: "President of India: General K. S. Thimayya centenary address", url: "https://presidentofindia.nic.in/dr-apj-abdul-kalam/speeches/address-birth-centenary-celebrations-general-ks-thimayya-madikeri", note: "Official reference to the Zoji La operation" },
      { label: "Official 1947–48 war history", url: WAR_1947, note: "Campaign context" },
    ],
  },
  "operation-meghdoot-1984": {
    overview: "Operation Meghdoot began on 13 April 1984 with the occupation of key passes and heights in the Siachen region. Its enduring feature is the air-maintenance system needed to sustain troops at extreme altitude.",
    keyPoints: [
      { title: "Pre-emption on the Saltoro Ridge", body: "The initial deployment secured strategically important positions before an opposing force could establish itself there." },
      { title: "Aviation lifeline", body: "Transport aircraft and helicopters enabled induction, resupply and casualty evacuation where surface routes were absent or highly constrained." },
    ],
    sources: [{ label: "Operation Meghdoot at 40", url: MEGHDOOT, note: "Ministry of Defence / Indian Air Force" }],
  },
  "operation-safed-sagar": {
    overview: "Operation Safed Sagar was the Indian Air Force’s air campaign during the Kargil conflict. Beginning on 26 May 1999, it supported ground forces by reconnaissance, strike, escort and air-defence missions in demanding high-altitude conditions.",
    keyPoints: [
      { title: "High-altitude employment", body: "Terrain, target elevation and rules governing the Line of Control shaped aircraft routing, weapon delivery and mission planning." },
      { title: "Joint support", body: "Air operations were integrated with the Army’s campaign against fortified positions and their supply lines." },
    ],
    sources: [{ label: "Operation Safed Sagar retrospective", url: SAFED_SAGAR, note: "Ministry of Defence / Indian Air Force" }],
  },
  "kargil-battle-of-tololing": {
    overview: "Tololing dominated part of the Dras sector and the highway below. Its recapture in June 1999 was an important early success after repeated assaults in steep, exposed terrain.",
    keyPoints: [
      { title: "Terrain and observation", body: "Positions on the ridge overlooked movement through the valley, giving the height importance beyond its footprint." },
      { title: "A campaign turning point", body: "The recapture demonstrated that the fortified heights could be taken, but only with careful preparation and costly uphill attacks." },
    ],
    sources: [
      { label: "Official Kargil history", url: KARGIL_HISTORY, note: "Campaign history" },
      { label: "Tales of valour from Kargil", url: KARGIL, note: "Source-linked battle accounts" },
    ],
  },
  "kargil-tiger-hill": {
    overview: "Tiger Hill was one of the most prominent objectives in the Dras sector. Assault groups climbed difficult approaches in darkness and fought across the summit complex before the feature was declared recaptured in early July 1999.",
    keyPoints: [
      { title: "Multiple approaches", body: "The plan used converging assault routes to reach and isolate the summit positions in terrain that strongly favoured the defence." },
      { title: "Yogendra Singh Yadav", body: "His official citation records the exposed climb and attack on positions blocking the assault group’s progress." },
    ],
    sources: [
      { label: "The Battle of Tiger Hill", url: TIGER_HILL, note: "Gallantry Awards portal battle history" },
      { label: "Yogendra Singh Yadav official record", url: `${GALLANTRY}/awardee/1068`, note: "Citation and profile" },
    ],
  },
  "kargil-point-5140": {
    overview: "Point 5140 was a commanding feature in the Tololing complex. Its recapture in June 1999 opened further tactical possibilities in the Dras sector and became closely associated with Captain Vikram Batra and 13 Jammu and Kashmir Rifles.",
    keyPoints: [
      { title: "Night assault", body: "The attack used darkness and steep approaches to close with defended positions on the height." },
      { title: "Vikram Batra", body: "The official gallantry profile links his leadership at Point 5140 with his later fatal action at Point 4875." },
    ],
    sources: [
      { label: "Official Kargil history", url: KARGIL_HISTORY, note: "Campaign context" },
      { label: "Vikram Batra official record", url: `${GALLANTRY}/awardee/1065`, note: "Citation and biography" },
    ],
  },
  "battle-of-namka-chu-1962": {
    overview: "The battle on the Namka Chu on 20 October 1962 opened the major eastern-front offensive. Indian positions were spread along the river below dominating heights, and the attacks rapidly disrupted the brigade’s communications and ability to reinforce its forward battalions.",
    keyPoints: [
      { title: "Ground disadvantage", body: "Forward positions lay beneath higher ground across the river, making observation, movement and mutual support difficult." },
      { title: "Opening phase", body: "The collapse of the Namka Chu positions formed part of the first major phase of the 1962 war in the eastern theatre." },
    ],
    sources: [{ label: "Gallantry Awards 1962 records", url: `${GALLANTRY}/awardees`, note: "Official recipient profiles and citations from the campaign" }],
  },
  "operation-rajiv-1987": {
    overview: "Operation Rajiv was mounted in June 1987 to capture the high-altitude position known as Quaid Post above the Siachen Glacier. After difficult approaches and earlier attempts, a small group led by Bana Singh reached and cleared the post, which was later renamed Bana Post.",
    keyPoints: [
      { title: "Weather and vertical terrain", body: "The approach demanded technical climbing and movement through severe weather at extreme altitude." },
      { title: "Final assault", body: "Bana Singh’s party used an unexpected route and fought at close quarters on reaching the position." },
    ],
    sources: [
      { label: "Bana Singh official record", url: `${GALLANTRY}/awardee/1064`, note: "Operation Meghdoot / Rajiv citation and profile" },
      { label: "Operation Meghdoot at 40", url: MEGHDOOT, note: "Wider Siachen context" },
    ],
  },
  "battle-of-haji-pir-1965": {
    overview: "The capture of Haji Pir Pass in August 1965 was intended to disrupt infiltration routes across the Uri–Poonch bulge. Forces approached through difficult weather and mountain terrain, and the pass was taken before the war widened across the international border.",
    keyPoints: [
      { title: "Infiltration routes", body: "The pass and surrounding routes were connected to the movement of infiltrators under Operation Gibraltar." },
      { title: "Mountain assault", body: "The approach required movement across steep ground in rain and poor visibility before the defenders could fully react." },
    ],
    sources: [
      { label: "Battle of Haji Pir", url: HAJI_PIR, note: "Gallantry Awards portal battle history" },
      { label: "1965 golden-jubilee account", url: `${PIB}/newsite/PrintRelease.aspx?lang=2&reg=48&relid=126830`, note: "Ministry of Defence commemoration" },
    ],
  },
};

export function getConflictDossier(slug: string): HistoryDossier | null {
  return CONFLICT_DOSSIERS[slug] ?? null;
}

export function getHistoryOperationDossier(slug: string): HistoryDossier | null {
  return OPERATION_DOSSIERS[slug] ?? null;
}
