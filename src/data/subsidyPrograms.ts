
export const subsidyPrograms = [
  {
    id: 1,
    title: "文化部藝術發展補助",
    organization: "文化部",
    description: "支持國內藝術工作者及團體發展創作，提升文化藝術水準，促進藝文產業良性發展。",
    deadline: "2025/05/20",
    category: "文化藝術",
    tags: ["展演活動", "藝術創作", "人才培育"],
    maxAmount: 500000,
    applyUrl: "#",
    applicationTemplate: {
      id: 101,
      name: "文化部藝術發展補助申請書.docx",
      path: "/templates/culture-art-application.docx",
      size: 45678,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tags: [
        { id: 1, name: "申請單位" },
        { id: 2, name: "活動名稱" },
        { id: 3, name: "申請日期" },
        { id: 4, name: "活動目的" },
        { id: 5, name: "預計參與人數" }
      ]
    },
    requiredDocuments: ["活動企劃書", "預算表", "團體證明文件"]
  },
  {
    id: 2,
    title: "體育署全民運動補助",
    organization: "體育署",
    description: "促進全民運動參與，提升國民體適能，推廣各類運動項目，建構健康活力社會。",
    deadline: "2025/06/15",
    category: "體育",
    tags: ["運動賽事", "場地設備", "教練培訓"],
    maxAmount: 300000,
    applyUrl: "#",
    applicationTemplate: {
      id: 102,
      name: "體育署運動補助申請表.docx",
      path: "/templates/sports-application.docx",
      size: 38456,
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tags: [
        { id: 6, name: "申請單位" },
        { id: 7, name: "運動項目" },
        { id: 8, name: "活動地點" },
        { id: 9, name: "預計效益" }
      ]
    },
    requiredDocuments: ["活動計劃書", "場地使用證明", "安全保險證明"]
  },
  {
    id: 3,
    title: "教育部學生社團活動補助",
    organization: "教育部",
    description: "鼓勵大專院校學生參與社團活動，發展多元能力，提升自主學習與公民參與素養。",
    deadline: "2025/07/01",
    category: "教育",
    tags: ["學生社團", "校園活動", "服務學習"],
    maxAmount: 150000,
    applyUrl: "#"
  },
  {
    id: 4,
    title: "衛生福利部社區健康促進補助",
    organization: "衛生福利部",
    description: "推動社區健康促進計劃，強化民眾健康意識，建立社區自主健康管理能力。",
    deadline: "2025/05/30",
    category: "健康照護",
    tags: ["健康促進", "社區營造", "健康講座"],
    maxAmount: 250000,
    applyUrl: "#"
  },
  {
    id: 5,
    title: "環保署環境教育活動補助",
    organization: "環保署",
    description: "提升環境教育質量，促進民眾環境保護意識，推廣永續發展理念與實踐。",
    deadline: "2025/06/30",
    category: "環境教育",
    tags: ["環保活動", "永續發展", "生態保育"],
    maxAmount: 200000,
    applyUrl: "#"
  },
];

export const categories = ["全部", "文化藝術", "體育", "教育", "健康照護", "環境教育"];
