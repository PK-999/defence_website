import type { HistoryDossier } from "./history-dossiers";

const PIB = "https://www.pib.gov.in";
const WIKIPEDIA = "https://en.wikipedia.org/wiki";

export const EQUIPMENT_DOSSIERS: Record<string, HistoryDossier> = {
  "arjun-mbt": {
    overview: "Arjun is an Indian third-generation main battle tank designed and developed by the Defence Research and Development Organisation (DRDO), with series production at the Heavy Vehicles Factory (HVF) at Avadi. The Indian Army first inducted the Mk I and later ordered the advanced Mk-1A with 71 indigenous upgrades, hunter-killer sighting, and enhanced Kanchan composite armour.",
    keyPoints: [
      { title: "Mk I induction", body: "A 2015 Ministry of Defence record confirms 124 Mk I tanks ordered and inducted, operationalising 43 and 75 Armoured Regiments.", sourceIndexes: [1] },
      { title: "Mk-1A procurement", body: "The Ministry of Defence contracted Heavy Vehicles Factory for 118 Arjun Mk-1A tanks on 23 September 2021, featuring an indigenous 120 mm rifled gun capable of firing FSAPDS, HESH and SAMHO anti-tank guided missiles.", sourceIndexes: [2] },
      { title: "Advanced Protection", body: "Equipped with indigenous Kanchan composite armour, ERA panels, laser warning receivers and mobile camouflage system.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "Main Battle Tank Arjun", url: `${PIB}/newsite/PrintRelease.aspx?lang=2&reg=48&relid=118644`, note: "Ministry of Defence parliamentary reply" },
      { label: "Ministry of Defence places order for 118 Arjun Mk-1A tanks", url: `${PIB}/Pressreleaseshare.aspx?PRID=1757320&lang=2&reg=3`, note: "Ministry of Defence release, 23 September 2021" },
      { label: "Arjun (tank)", url: `${WIKIPEDIA}/Arjun_(tank)`, note: "Wikipedia overview" },
    ],
  },
  "rafale": {
    overview: "The Dassault Rafale is a French twin-engine, canard delta wing, multirole 4.5th-generation combat aircraft operated by the Indian Air Force (No. 17 Golden Arrows and No. 101 Falcons squadrons). Equipped with the Thales RBE2 AESA radar, SPECTRA electronic warfare suite, Meteor beyond-visual-range air-to-air missiles, SCALP deep-strike cruise missiles, and HAMMER precision-guided munitions, it serves as India's premier air superiority and deep penetration strike fighter.",
    keyPoints: [
      { title: "36 Aircraft Induction", body: "Under an Inter-Governmental Agreement signed in September 2016, 36 Rafale jets (28 single-seat EH and 8 dual-seat DH) were inducted into the Indian Air Force, operating from Ambala and Hasimara Air Force Stations.", sourceIndexes: [1] },
      { title: "13 India-Specific Enhancements (ISE)", body: "Includes helmet-mounted display sights, radar warning receivers, towed decoys, low-band radar jammers, and cold-engine start capability for high-altitude Himalayan air bases like Leh.", sourceIndexes: [1, 2] },
      { title: "Naval Procurement (Rafale Marine)", body: "In 2023–2025, the Indian Navy approved procurement of 26 Rafale-M carrier-borne fighters for deployment aboard INS Vikrant (IAC-1) and INS Vikramaditya.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "Induction Ceremony of Rafale Aircraft", url: `${PIB}/PressReleasePage.aspx?PRID=1652932`, note: "Ministry of Defence release, 10 September 2020" },
      { label: "Dassault Rafale", url: `${WIKIPEDIA}/Dassault_Rafale`, note: "Wikipedia system overview" },
    ],
  },
  "su-30mki": {
    overview: "The Sukhoi Su-30MKI is a twin-engine, two-seat supermaneuverable air superiority fighter developed by Russia's Sukhoi and built under licence by Hindustan Aeronautics Limited (HAL). Serving as the backbone of the Indian Air Force's combat fleet with over 260 aircraft, the Su-30MKI features canard foreplanes, thrust-vectoring AL-31FP engines, Bars PESA radar, and is modified to air-launch the BrahMos supersonic cruise missile.",
    keyPoints: [
      { title: "Fleet Backbone", body: "The IAF operates over 260 Su-30MKI fighters across 14 frontline squadrons, providing long-range combat air patrol, maritime strike, and strategic deterrent capabilities.", sourceIndexes: [1] },
      { title: "BrahMos Air-Launched Cruise Missile", body: "India became the first nation to fire an air-launched Mach 3 supersonic cruise missile from a heavy fighter when Su-30MKI successfully launched BrahMos-A against land and sea targets.", sourceIndexes: [1, 2] },
      { title: "Super Sukhoi Modernisation", body: "A comprehensive indigenous upgrade programme incorporates indigenous Uttam AESA radar, advanced infrared search and track (IRST), new mission computers, and Astra Mk-1/Mk-2 BVR missiles.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "Successful flight test of air launched BrahMos missile from Su-30MKI", url: `${PIB}/PressReleasePage.aspx?PRID=1592631`, note: "Ministry of Defence release" },
      { label: "Sukhoi Su-30MKI", url: `${WIKIPEDIA}/Sukhoi_Su-30MKI`, note: "Wikipedia overview" },
    ],
  },
  "tejas": {
    overview: "The HAL Tejas is an indigenous single-engine, delta wing, light multirole combat aircraft designed by the Aeronautical Development Agency (ADA) in collaboration with the Aircraft Research and Design Centre (ARDC) of Hindustan Aeronautics Limited (HAL). Inducted with No. 45 Flying Daggers and No. 18 Flying Bullets squadrons, the Tejas features quadruplex digital fly-by-wire flight control, carbon-fibre composite structure, and indigenous Astra BVR missile integration.",
    keyPoints: [
      { title: "Indigenous Design", body: "Over 60% indigenous content in the Mk 1A variant, featuring an Uttam AESA radar, advanced electronic warfare suite, mid-air refuelling capability, and smart multifunction displays.", sourceIndexes: [1] },
      { title: "Mk 1A Contract", body: "In February 2021, the Ministry of Defence signed an ₹48,000 crore contract with HAL for 83 Tejas Mk 1A fighters, followed by an additional sanction for 97 aircraft to replace aging fleets.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "Contract for 83 LCA Tejas Mk-1A signed", url: `${PIB}/PressReleasePage.aspx?PRID=1694767`, note: "Ministry of Defence release, 3 February 2021" },
      { label: "HAL Tejas", url: `${WIKIPEDIA}/HAL_Tejas`, note: "Wikipedia overview" },
    ],
  },
  "brahmos": {
    overview: "BrahMos is a medium-range ramjet supersonic cruise missile that can be launched from submarines, ships, aircraft, or land. Developed as a joint venture between the Defence Research and Development Organisation (DRDO) and Russia's NPO Mashinostroyeniya (BrahMos Aerospace), it travels at speeds of Mach 2.8 to 3.0, making it the fastest operational supersonic cruise missile in the world.",
    keyPoints: [
      { title: "Tri-Service Deployment", body: "Deployed with the Indian Army (mobile autonomous launchers), Indian Navy (destroyers, frigates), and Indian Air Force (air-launched BrahMos-A on Su-30MKI).", sourceIndexes: [1] },
      { title: "Extended Range & Precision", body: "Extended range variants exceed 450 km to 800 km under MTCR guidelines, with pinpoint circular error probable (CEP) accuracy.", sourceIndexes: [1, 2] },
      { title: "Next-Gen Variants", body: "Development of BrahMos-NG (miniaturised version for LCA Tejas and MiG-29K) and hypersonic BrahMos-II.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "BrahMos Supersonic Cruise Missile", url: `${PIB}/PressReleasePage.aspx?PRID=1808620`, note: "Ministry of Defence release" },
      { label: "BrahMos", url: `${WIKIPEDIA}/BrahMos`, note: "Wikipedia overview" },
    ],
  },
  "s-400": {
    overview: "The S-400 Triumf (NATO: SA-21 Growler) is a mobile, surface-to-air missile (SAM) system developed by Russia's Almaz Central Design Bureau, operated by the Indian Air Force as the 'Sudarshan Chakra'. Capable of engaging aircraft, cruise missiles, and ballistic missiles at ranges up to 400 kilometres, it forms the strategic air defence umbrella safeguarding northern and western airspaces.",
    keyPoints: [
      { title: "Five Regiment Deal", body: "India contracted five S-400 squadrons in October 2018 under an Inter-Governmental Agreement, with first squadrons deployed in Punjab and eastern sectors.", sourceIndexes: [1] },
      { title: "Multi-Tiered Interception", body: "Integrates four missile classes: 40N6E (400 km), 48N6 (250 km), 9M96E2 (120 km), and 9M96E (40 km), capable of tracking 300 targets simultaneously and engaging up to 36 targets concurrently.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "S-400 Air Defence Missile System", url: `${PIB}/Pressreleaseshare.aspx?PRID=1588145`, note: "Ministry of Defence release" },
      { label: "S-400 missile system", url: `${WIKIPEDIA}/S-400_missile_system`, note: "Wikipedia overview" },
    ],
  },
  "ins-vikrant": {
    overview: "INS Vikrant (IAC-1) is India's first indigenously designed and built aircraft carrier, constructed by Cochin Shipyard Limited (CSL) for the Indian Navy. Commissioned on 2 September 2022, the 45,000-tonne warship employs a Short Take-Off But Arrested Recovery (STOBAR) configuration with a ski-jump ramp, carrying an air wing of up to 30 aircraft including MiG-29K fighter jets, Kamov Ka-31 AEW helicopters, MH-60R Seahawk helicopters, and indigenous ALH Dhruv.",
    keyPoints: [
      { title: "Indigenous Naval Architecture", body: "Designed by the Indian Navy's Warship Design Bureau with 76% indigenous content, utilising specialised DMR 249A warship-grade steel developed by DRDO and SAIL.", sourceIndexes: [1] },
      { title: "Combat Systems & Propulsion", body: "Propelled by four General Electric LM2500 gas turbines generating over 80 MW, reaching top speeds of 28 knots with a range of 7,500 nautical miles.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "Prime Minister commissions first indigenous aircraft carrier INS Vikrant", url: `${PIB}/PressReleasePage.aspx?PRID=1856297`, note: "PIB release, 2 September 2022" },
      { label: "INS Vikrant (2013)", url: `${WIKIPEDIA}/INS_Vikrant_(2013)`, note: "Wikipedia ship overview" },
    ],
  },
  "t-90s-bhishma": {
    overview: "The T-90S Bhishma is the Indian Army's main battle tank fleet, produced in India by Heavy Vehicles Factory (HVF) at Avadi under Russian licence. Featuring a 125 mm 2A46M smoothbore gun, Kontakt-5 explosive reactive armour (ERA), thermal night fighting sights, and the capability to fire 9M119 Refleks anti-tank guided missiles through the gun tube, it forms the spearhead of India's strike corps.",
    keyPoints: [
      { title: "Mass Indigenous Production", body: "Over 1,200 T-90S Bhishma tanks deployed, with progressive upgrades to Bhishma Mk 3 featuring indigenous commander panoramic sights and explosive reactive armour.", sourceIndexes: [1] },
      { title: "Desert and High-Altitude Deployment", body: "Proven operationally in both the Thar Desert armoured corridors and the high-altitude plateaus of Eastern Ladakh at altitudes above 14,000 feet.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "T-90 Bhishma tanks handed over to the Army", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=56489`, note: "Ministry of Defence release" },
      { label: "T-90", url: `${WIKIPEDIA}/T-90`, note: "Wikipedia overview" },
    ],
  },
  "k9-vajra": {
    overview: "The K9 Vajra-T is a 155 mm, 52-calibre self-propelled tracked howitzer built by Larsen & Toubro (L&T) in partnership with Hanwha Defense. Inducted into the Indian Army's Regiment of Artillery, the Vajra provides rapid shoot-and-scoot capability, high-rate burst fire of 3 rounds in 15 seconds, and an effective firing range beyond 38 kilometres.",
    keyPoints: [
      { title: "Make in India Artillery", body: "100 howitzers manufactured at L&T's Armoured Systems Complex in Hazira, Gujarat, with over 50% indigenous component content.", sourceIndexes: [1] },
      { title: "High-Altitude Deployment", body: "Successfully deployed and tested in Eastern Ladakh, equipped with winterisation kits for extreme sub-zero operation.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "K9 Vajra-T howitzers inducted into Indian Army", url: `${PIB}/PressReleasePage.aspx?PRID=1552309`, note: "Ministry of Defence release" },
      { label: "K9 Thunder", url: `${WIKIPEDIA}/K9_Thunder`, note: "Wikipedia overview" },
    ],
  },
  "bofors-fh-77b": {
    overview: "The FH-77B is a 155 mm field howitzer of Swedish origin that entered Indian Army service in the 1980s. In Indian military history it is especially associated with artillery support during the 1999 Kargil conflict, where high-angle and accurate fire was used against fortified positions in mountainous terrain.",
    keyPoints: [
      { title: "Kargil role", body: "A Ministry of Defence account of the Regiment of Artillery states that Bofors fire played a defining role in Kargil and describes accurate artillery fire degrading defended positions.", sourceIndexes: [1] },
      { title: "System identity", body: "The Indian system is the FH-77B 155 mm/39-calibre howitzer. Later 155 mm acquisitions and indigenous systems are separate equipment families and should not be presented as FH-77B variants.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "193rd Gunners Day", url: `${PIB}/PressReleasePage.aspx?PRID=1659566&lang=2&reg=48`, note: "Ministry of Defence / PIB Mumbai, 27 September 2020" },
      { label: "Haubits FH77", url: `${WIKIPEDIA}/Haubits_FH77`, note: "Wikipedia system history and variant overview" },
    ],
  },
  "centurion-tank": {
    overview: "The British-designed Centurion was one of the Indian Army’s principal tanks in the decades after Independence. Indian armoured formations employed it in the 1965 and 1971 wars, including major tank fighting in the Punjab and Jammu sectors; individual battlefield claims vary by source and are not converted here into unsupported totals.",
    keyPoints: [
      { title: "Indian armoured service", body: "Official Armour Day histories place the Centurion in the Army’s post-Independence armoured lineage and identify it with combat in the 1965 and 1971 wars.", sourceIndexes: [1] },
      { title: "Variants and upgrades", body: "Centurion designations cover many marks and national modifications. A specification is meaningful only when its mark, gun and period are stated.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "Armour Day", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=61232`, note: "Ministry of Defence account of Indian armour, 1 May 2010" },
      { label: "Centurion tank", url: `${WIKIPEDIA}/Centurion_(tank)`, note: "Wikipedia design, variants and service overview" },
    ],
  },
  "folland-gnat": {
    overview: "The compact Folland Gnat was acquired and built under licence for the Indian Air Force, becoming closely identified with air combat in the 1965 war and continuing into the 1971 conflict. It was later developed in India into the Ajeet; the Gnat and Ajeet remain related but distinct variants in historical records.",
    keyPoints: [
      { title: "1965 combat", body: "The Government of India’s IAF history describes the Gnat as having proved itself in the 1965 conflict and records the subsequent establishment of additional Gnat squadrons.", sourceIndexes: [1] },
      { title: "Indian manufacture", body: "Hindustan Aeronautics produced the aircraft under licence and later developed the Ajeet. Performance values should be tied to the precise Gnat or Ajeet model cited.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "The Story of the Indian Air Force", url: `${PIB}/PressNoteDetails.aspx?ModuleId=3&NoteId=153257&lang=2&reg=48`, note: "Government of India historical explainer, 7 October 2024" },
      { label: "Folland Gnat", url: `${WIKIPEDIA}/Folland_Gnat`, note: "Wikipedia development, production and service overview" },
    ],
  },
  "ins-vikrant-r11": {
    overview: "INS Vikrant (R11) was India’s first aircraft carrier. Originally laid down in Britain as HMS Hercules, it was acquired by India, commissioned in 1961 and deployed in the 1971 war, when its air group supported operations against ports and maritime targets in the eastern theatre before the ship’s eventual decommissioning in 1997.",
    keyPoints: [
      { title: "Carrier aviation milestone", body: "Vikrant established a sustained carrier-aviation capability for the Indian Navy and operated Sea Hawk fighters and Alizé anti-submarine aircraft during its service life.", sourceIndexes: [1] },
      { title: "1971 eastern theatre", body: "Government accounts place Vikrant and its embarked aircraft in the Bay of Bengal campaign, striking targets and supporting the maritime isolation of East Pakistan.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "INS Vikrant: A saga of courage and strength", url: `${PIB}/FeaturesDeatils.aspx?ModuleId=2&NoteId=151135&lang=2&reg=48`, note: "Government of India historical feature" },
      { label: "INS Vikrant (1961)", url: `${WIKIPEDIA}/INS_Vikrant_(1961)`, note: "Wikipedia ship history and service chronology" },
    ],
  },
  "mirage-2000": {
    overview: "The Dassault Mirage 2000 is a French multirole combat aircraft inducted by the Indian Air Force in the 1980s. Indian Mirage 2000s flew precision-strike missions during Operation Safed Sagar in 1999; subsequent upgrade programmes changed avionics and weapons, so published capabilities need a variant and date.",
    keyPoints: [
      { title: "Operation Safed Sagar", body: "An official IAF account identifies the Mirage 2000 as a central strike platform in the Kargil air campaign, including the use of precision-guided weapons against high-altitude targets.", sourceIndexes: [1] },
      { title: "Evolving configuration", body: "India has operated trainer and combat variants and later upgraded aircraft. Range, radar and weapon statements should therefore remain scoped to the configuration in the cited source.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "Operation Safed Sagar", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=50974`, note: "Indian Air Force / Ministry of Defence historical account" },
      { label: "Dassault Mirage 2000", url: `${WIKIPEDIA}/Dassault_Mirage_2000`, note: "Wikipedia development, variants and operational history" },
    ],
  },
  "t-72-ajeya": {
    overview: "The T-72 is a Soviet-designed main battle tank family produced in India and fielded by the Indian Army under the Ajeya name. It became a major part of India’s armoured fleet after the 1970s; successive production batches, upgrades and specialised derivatives mean that a single undated specification does not describe every Indian T-72.",
    keyPoints: [
      { title: "Place in Indian armour", body: "Official Armour Day accounts identify the T-72 among the principal post-Independence tanks that shaped the modern Indian armoured corps.", sourceIndexes: [1] },
      { title: "Configuration caution", body: "T-72 variants differ in armour, sights, engines and fire-control equipment. Indian upgrade programmes further complicate generic performance claims.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "Armour Day", url: `${PIB}/PressReleasePage.aspx?PRID=1488939&lang=2&reg=48`, note: "Ministry of Defence account of Indian armour, 1 May 2017" },
      { label: "T-72", url: `${WIKIPEDIA}/T-72`, note: "Wikipedia development, variants and operators overview" },
    ],
  },
};

export function getEquipmentDossier(slug: string): HistoryDossier | undefined {
  if (EQUIPMENT_DOSSIERS[slug]) {
    return EQUIPMENT_DOSSIERS[slug];
  }
  
  // Intelligent slug matcher
  const s = slug.toLowerCase();
  if (s.includes("rafale")) return EQUIPMENT_DOSSIERS["rafale"];
  if (s.includes("su-30") || s.includes("sukhoi")) return EQUIPMENT_DOSSIERS["su-30mki"];
  if (s.includes("tejas")) return EQUIPMENT_DOSSIERS["tejas"];
  if (s.includes("brahmos")) return EQUIPMENT_DOSSIERS["brahmos"];
  if (s.includes("s-400")) return EQUIPMENT_DOSSIERS["s-400"];
  if (s.includes("iac-1") || (s.includes("vikrant") && !s.includes("r11"))) return EQUIPMENT_DOSSIERS["ins-vikrant"];
  if (s.includes("t-90")) return EQUIPMENT_DOSSIERS["t-90s-bhishma"];
  if (s.includes("vajra") || s.includes("k9")) return EQUIPMENT_DOSSIERS["k9-vajra"];
  if (s.includes("arjun")) return EQUIPMENT_DOSSIERS["arjun-mbt"];
  if (s.includes("bofors")) return EQUIPMENT_DOSSIERS["bofors-fh-77b"];
  if (s.includes("mirage")) return EQUIPMENT_DOSSIERS["mirage-2000"];
  if (s.includes("t-72")) return EQUIPMENT_DOSSIERS["t-72-ajeya"];
  if (s.includes("gnat")) return EQUIPMENT_DOSSIERS["folland-gnat"];
  if (s.includes("centurion")) return EQUIPMENT_DOSSIERS["centurion-tank"];

  return undefined;
}
