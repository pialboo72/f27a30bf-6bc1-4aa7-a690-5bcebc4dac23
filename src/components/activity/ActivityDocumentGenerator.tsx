
import React from 'react';

export const generateDocumentContent = (activity: any) => {
  return `活動申請書

活動名稱：${activity.name || activity.title || ''}
活動類別：${activity.category || ''}
活動日期：${activity.date || ''}
活動地點：${activity.location || ''}
主辦單位：${activity.unit || ''}

活動目的：
${activity.purpose || ''}

活動內容：
${activity.content || ''}

參與對象：${activity.target || ''}
預計參與人數：${activity.participants || ''}人

申請日期：${new Date().toLocaleDateString()}
申請狀態：${activity.status || ''}`;
};

export const handleDownloadDocument = (activity: any, format: string = 'txt') => {
  const content = generateDocumentContent(activity);
  const fileName = `${activity.name || activity.title}_申請文件`;
  
  try {
    let blob;
    let mimeType;
    let fileExtension;
    
    switch (format) {
      case 'docx':
        const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 ${content.replace(/\n/g, '\\par ')}}`;
        blob = new Blob([rtfContent], { type: 'application/rtf' });
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileExtension = 'rtf';
        break;
      case 'odt':
        blob = new Blob([content], { type: 'application/vnd.oasis.opendocument.text' });
        mimeType = 'application/vnd.oasis.opendocument.text';
        fileExtension = 'txt';
        break;
      case 'pdf':
        blob = new Blob([content], { type: 'text/plain' });
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
      default:
        blob = new Blob([content], { type: 'text/plain' });
        mimeType = 'text/plain';
        fileExtension = 'txt';
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('下載文件時發生錯誤:', error);
    return false;
  }
};

export const handlePrintDocument = (activity: any) => {
  const content = generateDocumentContent(activity);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${activity.name} - 申請文件</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            h1 { text-align: center; margin-bottom: 30px; }
            .content { white-space: pre-line; }
          </style>
        </head>
        <body>
          <div class="content">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
    
    return true;
  }
  return false;
};
