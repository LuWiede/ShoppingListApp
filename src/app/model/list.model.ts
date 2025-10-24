export interface List {
  id: string;
  title: string;
  color: string;
  items: string[];
  doneItems?: string[];
  pinned?: boolean;
  createdAt: number;
}