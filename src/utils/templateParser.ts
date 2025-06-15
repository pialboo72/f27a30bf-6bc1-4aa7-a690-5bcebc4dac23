
/**
 * Mock parser: returns some template markers for demonstration.
 * In production, use docx/xlsx libraries to parse actual template markers.
 */
export async function parseTemplateMarkers(file: File): Promise<string[]> {
  // TODO: implement actual docx/xlsx marker parsing
  return ["{{姓名}}", "{{日期}}", "{{申請單位}}"];
}
