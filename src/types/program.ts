
export interface FileTag {
  id: number;
  name: string;
}

export interface SystemFile {
  id: number;
  name: string;
  path: string;
  tags: FileTag[];
}

export interface Program {
  id: number;
  name: string;
  agency: string;
  target: string;
  standard: string;
  startDate: Date;
  endDate: Date;
  focus: string;
  totalBudget: number;
  subsidyLimit: number;
  description: string;
  documents: SystemFile[];
  links: string;
}
