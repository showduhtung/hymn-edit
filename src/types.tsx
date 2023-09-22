type HymnMetadata = {
  lang: string;
  num: string;
  title: string;
};

export type HymnFileType = HymnMetadata & { verses: string[] };

export type HymnType = HymnMetadata & {
  verses: VerseType[];
  status: HymnStatus;
};

export type HymnStatus = "completed" | "in-progress" | "not-started";

export type VerseType = {
  label: string;
  num: number;
  html: string;
  updatedHtml: string;
};

export type LocalHymnsState = {
  hymns: HymnType[];
  selectedHymnIdx: number;
};
