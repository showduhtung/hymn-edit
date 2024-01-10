export type HymnMetadata = { lang: string; num: string; title: string };
type VerseMetadata = { label: string; num: number; html: string };
export type HymnStatus = "completed" | "in-progress" | "not-started";

export type HymnFileType = HymnMetadata & {
  verses: VerseMetadata[];
};

export type EditingHymnType = HymnMetadata & {
  verses: EditingVerseType[];
  status: HymnStatus;
};

export type EditingVerseType = VerseMetadata & { updatedHtml: string };

export type LocalHymnsState = {
  hymns: EditingHymnType[];
  selectedHymnIdx: number;
};
