
export const generateRandomPassword = (length: number = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const sendPasswordEmail = async (userEmail: string, userName: string, password: string, unitName: string): Promise<void> => {
  // 模擬發送郵件 - 在實際應用中，這裡會調用真實的郵件服務
  console.log(`發送密碼通知郵件給: ${userEmail}`);
  console.log(`用戶姓名: ${userName}`);
  console.log(`所屬單位: ${unitName}`);
  console.log(`初始密碼: ${password}`);
  
  // 模擬郵件發送延遲
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 在實際應用中，這裡會使用真實的郵件服務
  // 例如: SendGrid, AWS SES, 或其他郵件服務提供商
};
