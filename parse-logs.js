const fs = require('fs');

const logPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\77503773-90d0-4450-964e-e937b79d83a8\\.system_generated\\logs\\overview.txt';
const logContent = fs.readFileSync(logPath, 'utf8');

// We want to find the LAST occurrence of the file contents before the theme switcher.
// Actually, let's just find "LoginPage.jsx" and extract the blocks.
function extractFileHistory(fileName, outName) {
  const lines = logContent.split('\n');
  let output = [];
  let capture = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(fileName)) {
       output.push(`--- MATCH at line ${i} ---`);
       // capture 50 lines before and 200 lines after
       const start = Math.max(0, i - 10);
       const end = Math.min(lines.length, i + 300);
       output.push(lines.slice(start, end).join('\n'));
    }
  }
  
  fs.writeFileSync(`c:/Users/user/Desktop/Xente-Frontend/${outName}`, output.join('\n\n=========================\n\n'));
}

extractFileHistory('LoginPage.jsx', 'login-history.txt');
extractFileHistory('AmbassadorDashboard.jsx', 'ambassador-history.txt');
extractFileHistory('AdminDashboard.jsx', 'admin-history.txt');
console.log('Done');
