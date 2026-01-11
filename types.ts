
export interface Person {
  id: string;
  name: string;
  urduName?: string;
  role?: string;
  bio?: string;
  image?: string;
  spouse?: string;
  spouseImage?: string;
  spouseRole?: string;
  children?: Person[];
}

export enum TreeType {
  FAMILY = 'FAMILY'
}

export interface ShajraLine {
  arabic: string;
  roman: string;
  urdu: string;
}

export interface ShajraItem {
  type: string;
  title?: string;
  arabic?: string;
  roman?: string;
  meaning?: string;
  lines?: ShajraLine[];
}
