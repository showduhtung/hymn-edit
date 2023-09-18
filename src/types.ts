export type HymnType = {
  lang: string;
  num: string;
  title: string;
  verses: VerseType[];
  status: "completed" | "in-progress" | "not-started";
};

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
