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
};

export function getOperationDossier(slug: string): OperationDossier | null {
  return DOSSIERS[slug] ?? null;
}
