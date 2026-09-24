export interface PublicRelationship {
  id: string;
  source: { type: string; id: string };
  sourceTitle: string;
  sourceHref: string;
  target: { type: string; id: string };
  targetTitle: string;
  targetHref: string;
}

export async function getPublicRelationships(_ref: { type: string; id: string }): Promise<PublicRelationship[]> {
  return [];
}
