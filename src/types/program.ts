
export interface FileTag {
  id: number;
  name: string;
}

export interface SystemFile {
  id: number;
  name: string;
  path: string;
  size: number;
  type: string;
  uploadDate?: string;
  tags: FileTag[];
  folders?: string[];
  category?: string; // 新增 category 屬性
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
  // 新增模板相關欄位
  applicationTemplate?: SystemFile;
  budgetTemplate?: SystemFile;
  requiredDocuments?: string[];
}

// 新增補助計劃資料結構，與現有的補助計劃列表整合
export interface SubsidyProgram {
  id: number;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  category: string;
  tags: string[];
  maxAmount: number;
  applyUrl: string;
  // 新增缺少的屬性
  status?: string;
  amount?: number;
  // 模板相關
  applicationTemplate?: SystemFile;
  budgetTemplate?: SystemFile;
  requiredDocuments?: string[];
}

export const FILE_CATEGORIES = {
  APPLICATION: '申請書',
  REQUIRED: '必備附件',
  OPTIONAL: '可選附件'
} as const;

export type FileCategory = typeof FILE_CATEGORIES[keyof typeof FILE_CATEGORIES];
