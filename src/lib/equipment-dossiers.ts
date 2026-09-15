import type { HistoryDossier } from "./history-dossiers";

const PIB = "https://www.pib.gov.in";
const WIKIPEDIA = "https://en.wikipedia.org/wiki";

export const EQUIPMENT_DOSSIERS: Record<string, HistoryDossier> = {
  "arjun-mbt": {
    overview: "Arjun is an Indian main battle tank designed and developed by the Defence Research and Development Organisation, with production at the Heavy Vehicles Factory at Avadi. The Army first inducted the Mk I and later ordered the improved Mk-1A; variant, date and source therefore matter whenever a specification or fleet figure is quoted.",
    keyPoints: [
      { title: "Mk I induction", body: "A 2015 Ministry of Defence reply recorded 124 Mk I tanks ordered, 122 produced and inducted, and two Arjun regiments—43 and 75 Armoured Regiments—raised and operationalised.", sourceIndexes: [1] },
      { title: "Mk-1A order", body: "The Ministry of Defence contracted Heavy Vehicles Factory for 118 Arjun Mk-1A tanks on 23 September 2021. The Mk-1A was described as incorporating numerous improvements over Mk I, so the two variants should not be treated as a single specification set.", sourceIndexes: [2] },
      { title: "Reading the record", body: "Published fleet numbers are dated snapshots, not a live readiness count. Technical values on this site retain the variant and effective date supplied by their source.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "Main Battle Tank Arjun", url: `${PIB}/newsite/PrintRelease.aspx?lang=2&reg=48&relid=118644`, note: "Ministry of Defence parliamentary reply, 24 April 2015" },
      { label: "Ministry of Defence places order for 118 Arjun Mk-1A tanks", url: `${PIB}/Pressreleaseshare.aspx?PRID=1757320&lang=2&reg=3`, note: "Ministry of Defence release, 23 September 2021" },
      { label: "Arjun (tank)", url: `${WIKIPEDIA}/Arjun_(tank)`, note: "Wikipedia overview used for discovery and cross-checking; consequential figures are anchored to official releases" },
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
  "hawker-hunter": {
    overview: "The Hawker Hunter was a British jet fighter and ground-attack aircraft operated by several Indian Air Force squadrons. In Indian service it flew in the 1965 and 1971 wars and is particularly associated with daylight strikes against the armoured column around Longewala in December 1971.",
    keyPoints: [
      { title: "Longewala", body: "A Ministry of Defence historical account credits Hunters operating from Jaisalmer with attacking the exposed column after the night defence of the Longewala post.", sourceIndexes: [1] },
      { title: "Multiple variants", body: "The Hunter family included fighter, fighter-bomber, reconnaissance and training variants. Site specifications should identify the variant rather than imply that every Hunter shared one configuration.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "The Battle of Longewala", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=33912`, note: "Ministry of Defence historical account" },
      { label: "Hawker Hunter", url: `${WIKIPEDIA}/Hawker_Hunter`, note: "Wikipedia development, variants and operators overview" },
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
  "mil-mi-17": {
    overview: "Mi-17 denotes a large family of Soviet- and Russian-designed medium transport helicopters operated by the Indian Air Force in several variants. Indian aircraft have supported transport, high-altitude logistics, disaster relief and armed missions; variant-specific equipment and dates must be stated because Mi-17, Mi-17-1V and Mi-17V-5 are not interchangeable labels.",
    keyPoints: [
      { title: "Kargil employment", body: "Official IAF histories record Mi-17 helicopters in the early phase of Operation Safed Sagar, including rocket attacks in the high-altitude theatre before tactics were revised after the loss of an aircraft.", sourceIndexes: [1] },
      { title: "Mi-17V-5 induction", body: "The IAF formally inducted the Mi-17V-5 in February 2012. The release describes the newer variant’s avionics, transport and operational features separately from earlier Mi-17 fleets.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "Operation Safed Sagar", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=51724`, note: "Indian Air Force / Ministry of Defence historical account" },
      { label: "Mi-17 V5 inducted into the Indian Air Force", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=80355`, note: "Ministry of Defence release, 17 February 2012" },
      { label: "Mil Mi-17", url: `${WIKIPEDIA}/Mil_Mi-17`, note: "Wikipedia family, variants and operators overview" },
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
  "t-90s-bhishma": {
    overview: "The T-90S Bhishma is the Indian Army’s version of the Russian T-90 main battle tank, acquired through direct supply and licensed production. It entered Indian service in the 2000s and has since appeared in several production and upgrade configurations; service totals are dated procurement snapshots rather than live availability figures.",
    keyPoints: [
      { title: "Indian production", body: "Ministry of Defence releases record licensed manufacture at Heavy Vehicles Factory, Avadi, and distinguish imported, assembled and indigenously produced stages.", sourceIndexes: [1] },
      { title: "Variant discipline", body: "T-90, T-90S and later national configurations differ. Specifications are presented only when the cited source identifies the relevant configuration.", sourceIndexes: [2] },
    ],
    sources: [
      { label: "T-90 Bhishma tanks handed over to the Army", url: `${PIB}/newsite/erelcontent.aspx?lang=2&reg=48&relid=56489`, note: "Ministry of Defence release, 24 August 2009" },
      { label: "T-90", url: `${WIKIPEDIA}/T-90`, note: "Wikipedia development, variants and operators overview" },
    ],
  },
  "vidyut-class-missile-boat": {
    overview: "The Vidyut-class missile boats were small, fast vessels armed with Soviet anti-ship missiles and operated by the Indian Navy’s missile-boat force. Their best-known combat employment came in December 1971, when boats of the class participated in the planned strikes against shipping and shore targets off Karachi.",
    keyPoints: [
      { title: "Operation Trident", body: "On the night of 4–5 December 1971, a missile-boat group struck targets off Karachi. Official commemorations identify the action as a landmark in Indian naval history and the origin of the Navy Day observance on 4 December.", sourceIndexes: [1] },
      { title: "Operating limits and support", body: "The boats combined heavy missile armament with limited endurance, so the Karachi operation depended on supporting ships, towing and careful transit planning.", sourceIndexes: [1, 2] },
    ],
    sources: [
      { label: "Operation Trident anniversary", url: `${PIB}/PressReleasePage.aspx?PRID=1880958&lang=2&reg=48`, note: "Ministry of Defence / Indian Navy, 4 December 2022" },
      { label: "Vidyut-class missile boat", url: `${WIKIPEDIA}/Vidyut-class_missile_boat`, note: "Wikipedia class history and service overview" },
    ],
  },
};

export function getEquipmentDossier(slug: string): HistoryDossier | undefined {
  return EQUIPMENT_DOSSIERS[slug];
}
