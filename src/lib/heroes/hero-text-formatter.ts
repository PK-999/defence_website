/**
 * Intelligent formatter and subsection generator for Gallantry Hero citations and biographies.
 * Transforms monolithic raw text into professionally organized, readable paragraphs and subsections.
 */

export interface FormattedSection {
  id: string;
  title: string;
  iconName?: "crosshair" | "shield" | "flame" | "award" | "book" | "flag" | "quote";
  badge?: string;
  paragraphs: string[];
  callout?: {
    type: "quote" | "decree" | "directive" | "tactical";
    text: string;
    author?: string;
  };
}

export interface FormattedCitation {
  directiveHeader?: string;
  sections: FormattedSection[];
  concludingCommendation?: string;
}

export interface FormattedBiography {
  sections: FormattedSection[];
}

/** Clean up known OCR typos and artifacts */
export function cleanRawText(text: string): string {
  if (!text) return "";
  return text
    // OCR artifact removals
    .replace(/O\s*P\s*E\s*R\s*A\s*T\s*I\s*O\s*N\s*S[\s\S]*?Sketch Showing Plan[^\n]*/gi, "")
    .replace(/Fig\.:\s*\d+/gi, "")
    .replace(/\d+\s+Kargil\s+1999:\s+The\s+Impregnable[^\n]*/gi, "")
    .replace(/\d+\s+From\s+Surprise\s+to\s+Reckoning:[^\n]*/gi, "")
    .replace(/\(Pg\s+no\s+\d+[-–]\d+\)/gi, "")
    // Typo fixes
    .replace(/\bbom\s+on\b/gi, "born on")
    .replace(/\bpf\s+the\s+Award\b/gi, "of the Award")
    .replace(/\bfa\s+il’/g, "fail’")
    .replace(/\bfa\s+il'/g, "fail'")
    .replace(/\bM\s+ore”/g, "More”")
    .replace(/\bM\s+ore"/g, "More\"")
    .replace(/\bI\s+f\s+death/g, "If death")
    .replace(/\s+/g, " ")
    .trim();
}

/** Break long text into natural paragraphs based on sentence transitions */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Match sentence ends (. ! ?) followed by whitespace and capital letter or quote
  const parts = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g);
  if (!parts) return [text];
  return parts.map((s) => s.trim()).filter(Boolean);
}

/**
 * Format a monolithic military citation into structured tactical subsections.
 */
export function formatHeroCitation(raw: string | null | undefined): FormattedCitation {
  if (!raw || !raw.trim()) {
    return {
      sections: [
        {
          id: "citation-summary",
          title: "Citation of Gallantry",
          paragraphs: ["Conferred for conspicuous bravery and gallantry in the face of the enemy."],
        },
      ],
    };
  }

  const cleaned = cleanRawText(raw);

  // Extract Directive Header (e.g. "Captain Vikram Batra (IC-57556)... (Effective date...)")
  let directiveHeader = "";
  let body = cleaned;

  const directiveMatch = cleaned.match(
    /^([^(]*\([A-Z0-9-]+\)[^)]*?\((?:Posthumous|Effective date[^)]*)\)[^)]*?\))/i
  );
  if (directiveMatch) {
    directiveHeader = directiveMatch[1].trim();
    body = cleaned.slice(directiveMatch[0].length).trim();
  }

  // Extract formal concluding commendation (e.g. "Captain Vikram Batra, thus, displayed...")
  let concludingCommendation = "";
  const commendationMatch = body.match(
    /(?:(?:Lieutenant|Captain|Major|Rifleman|Grenadier|Havildar|Subedar|Naik|Sepoy|Lance|Flying Officer|Squadron Leader|Wing Commander)[^,]+,\s*(?:thus|displayed|was awarded)[\s\S]*?highest traditions of the (?:Army|Air Force|Navy|Armed Forces)\.?)$/i
  );

  if (commendationMatch) {
    concludingCommendation = commendationMatch[0].trim();
    body = body.slice(0, commendationMatch.index).trim();
  }

  const sentences = splitIntoSentences(body);
  const sections: FormattedSection[] = [];

  // Group sentences by tactical theme
  const settingSentences: string[] = [];
  const assaultSentences: string[] = [];
  const climaxSentences: string[] = [];

  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (
      lower.includes("injured") ||
      lower.includes("succumbed") ||
      lower.includes("fatal") ||
      lower.includes("serious wounds") ||
      lower.includes("grievous") ||
      lower.includes("fell upon the enemy") ||
      lower.includes("supreme sacrifice") ||
      lower.includes("undaunted")
    ) {
      climaxSentences.push(s);
    } else if (
      lower.includes("attack") ||
      lower.includes("assault") ||
      lower.includes("engaged") ||
      lower.includes("grenade") ||
      lower.includes("hand-to-hand") ||
      lower.includes("killed") ||
      lower.includes("captured") ||
      lower.includes("clearing") ||
      lower.includes("platoon") ||
      lower.includes("bunker") ||
      lower.includes("rallied")
    ) {
      assaultSentences.push(s);
    } else {
      settingSentences.push(s);
    }
  }

  // 1. Operational Setting & Mission Objective
  if (settingSentences.length > 0) {
    sections.push({
      id: "tactical-objective",
      title: "Operational Setting & Objective",
      iconName: "crosshair",
      badge: "SECTOR DIRECTIVE",
      paragraphs: chunkSentences(settingSentences, 3),
    });
  }

  // 2. Tactical Engagement & Assault
  if (assaultSentences.length > 0) {
    sections.push({
      id: "battlefield-assault",
      title: "Tactical Maneuver & Close Combat",
      iconName: "flame",
      badge: "COMBAT ACTION",
      paragraphs: chunkSentences(assaultSentences, 3),
    });
  }

  // 3. Climax & Decisive Stand
  if (climaxSentences.length > 0) {
    sections.push({
      id: "decisive-climax",
      title: "Conspicuous Valour & Supreme Sacrifice",
      iconName: "award",
      badge: "DECISIVE CLIMAX",
      paragraphs: chunkSentences(climaxSentences, 2),
    });
  }

  // Fallback if clustering was uneven
  if (sections.length === 0) {
    sections.push({
      id: "citation-narrative",
      title: "Battlefield Action Narrative",
      iconName: "award",
      paragraphs: chunkSentences(sentences, 3),
    });
  }

  return {
    directiveHeader,
    sections,
    concludingCommendation,
  };
}

/**
 * Format a monolithic biography into structured, readable subsections.
 */
export function formatHeroBiography(raw: string | null | undefined): FormattedBiography {
  if (!raw || !raw.trim()) {
    return { sections: [] };
  }

  const cleaned = cleanRawText(raw);
  const sentences = splitIntoSentences(cleaned);

  const earlyLife: string[] = [];
  const regimentalHeritage: string[] = [];
  const operationalDeploy: string[] = [];
  const combatAction: string[] = [];
  const legacyAndMemorials: string[] = [];
  let famousQuote: { text: string; author?: string } | undefined;

  for (const s of sentences) {
    const lower = s.toLowerCase();

    // Check for quotes / diary entries
    if (
      lower.includes("personal diary") ||
      lower.includes("if death strikes") ||
      lower.includes("yeh dil mange") ||
      lower.includes("yeh dil maange") ||
      lower.includes("some goals are so worthy")
    ) {
      if (lower.includes("if death strikes")) {
        famousQuote = {
          text: "If death strikes before I prove my blood, I promise (swear), I will kill death.",
          author: "Personal Diary",
        };
      } else if (lower.includes("yeh dil")) {
        famousQuote = {
          text: "Yeh Dil Maange More!",
          author: "Success Signal, Point 5140",
        };
      } else if (lower.includes("some goals")) {
        famousQuote = {
          text: "Some goals are so worthy, it’s glorious even to fail.",
          author: "Personal Diary",
        };
      }
      legacyAndMemorials.push(s);
    } else if (
      lower.includes("sainik school") ||
      lower.includes("inaugurated") ||
      lower.includes("remembrance") ||
      lower.includes("posthumously") ||
      lower.includes("memorial") ||
      lower.includes("dwar") ||
      lower.includes("statue") ||
      lower.includes("continue to be an inspiration")
    ) {
      legacyAndMemorials.push(s);
    } else if (
      lower.includes("born on") ||
      lower.includes("eldest") ||
      lower.includes("schooling") ||
      lower.includes("nda") ||
      lower.includes("ima") ||
      lower.includes("national cadet corps") ||
      lower.includes("ncc") ||
      lower.includes("commissioned into") ||
      lower.includes("dream of becoming")
    ) {
      earlyLife.push(s);
    } else if (
      lower.includes("regiment was raised") ||
      lower.includes("battalion was raised") ||
      lower.includes("motto is") ||
      lower.includes("gurkhas") ||
      lower.includes("regimental history") ||
      lower.includes("absorbed into") ||
      lower.includes("imperial service troops")
    ) {
      regimentalHeritage.push(s);
    } else if (
      lower.includes("attacked") ||
      lower.includes("charged") ||
      lower.includes("grenade") ||
      lower.includes("machine gun") ||
      lower.includes("succumbed") ||
      lower.includes("hit in the") ||
      lower.includes("hand-to-hand") ||
      lower.includes("pounced")
    ) {
      combatAction.push(s);
    } else {
      operationalDeploy.push(s);
    }
  }

  const sections: FormattedSection[] = [];

  // 1. Early Life & Commissioning
  if (earlyLife.length > 0) {
    sections.push({
      id: "early-life",
      title: "Early Life, Commissioning & Calling",
      iconName: "shield",
      badge: "ORIGINS",
      paragraphs: chunkSentences(earlyLife, 3),
    });
  }

  // 2. Regimental Traditions
  if (regimentalHeritage.length > 0) {
    sections.push({
      id: "regimental-traditions",
      title: "Regimental Heritage & Battle Honours",
      iconName: "flag",
      badge: "FORMATION TRADITIONS",
      paragraphs: chunkSentences(regimentalHeritage, 3),
    });
  }

  // 3. Operational Deployment
  if (operationalDeploy.length > 0) {
    sections.push({
      id: "operational-deployment",
      title: "Operational Deployment & Strategic Setting",
      iconName: "crosshair",
      badge: "THEATRE DEPLOYMENT",
      paragraphs: chunkSentences(operationalDeploy, 3),
    });
  }

  // 4. Heroic Action & Supreme Sacrifice
  if (combatAction.length > 0) {
    sections.push({
      id: "conspicuous-valour",
      title: "Conspicuous Valour in the Face of the Enemy",
      iconName: "flame",
      badge: "SUPREME SACRIFICE",
      paragraphs: chunkSentences(combatAction, 3),
    });
  }

  // 5. Legacy & Memorials
  if (legacyAndMemorials.length > 0 || famousQuote) {
    sections.push({
      id: "legacy-memorials",
      title: "Enduring Legacy & National Remembrance",
      iconName: "book",
      badge: "NATIONAL HONOUR",
      paragraphs: chunkSentences(legacyAndMemorials, 3),
      callout: famousQuote
        ? {
            type: "quote",
            text: famousQuote.text,
            author: famousQuote.author,
          }
        : undefined,
    });
  }

  return { sections };
}

/** Helper: chunk sentences into readable paragraph blocks */
function chunkSentences(sentences: string[], perParagraph: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i += perParagraph) {
    result.push(sentences.slice(i, i + perParagraph).join(" "));
  }
  return result;
}
