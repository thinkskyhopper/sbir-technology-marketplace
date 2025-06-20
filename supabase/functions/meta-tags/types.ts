
export interface MetaData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  phase: string;
  agency: string;
  value: number;
  status: string;
}
