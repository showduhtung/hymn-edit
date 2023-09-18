export type HymnType = {
  lang: string;
  num: string;
  title: string;
  verses: VerseType[];
};

export type VerseType = {
  label: string;
  num: number;
  html: string;
  updatedHtml: string;
};

export type LocalHymnsState = {
  hymns: HymnType[];
  selectedHymn: HymnType | undefined;
};
