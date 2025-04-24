
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
  links: string;  // Adding the missing 'links' property
}

export const FILE_CATEGORIES = {
  APPLICATION: '申請書',
  REQUIRED: '必備附件',
  OPTIONAL: '可選附件'
} as const;

export type FileCategory = typeof FILE_CATEGORIES[keyof typeof FILE_CATEGORIES];
