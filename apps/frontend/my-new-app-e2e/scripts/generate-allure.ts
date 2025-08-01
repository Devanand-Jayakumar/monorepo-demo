import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
 
function getTimestamp(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}`;
}
 
function moveResultsToTimestampedFolder(baseDir: string, timestamp: string): string {
  const targetDir = path.join(baseDir, timestamp);
  fs.mkdirSync(targetDir, { recursive: true });
 
  const files = fs.readdirSync(baseDir);
  files.forEach(file => {
    const fullPath = path.join(baseDir, file);
    const isDir = fs.lstatSync(fullPath).isDirectory();
    if (!isDir && file !== timestamp) {
      const destPath = path.join(targetDir, file);
      fs.renameSync(fullPath, destPath);
    }
  });
 
  return targetDir;
}
 
function copyHistory(prevReportPath: string, destResultsDir: string) {
  const historyPath = path.join(prevReportPath, 'history');
  if (fs.existsSync(historyPath)) {
    fs.cpSync(historyPath, path.join(destResultsDir, 'history'), { recursive: true });
  }
}
 
function getLastReportFolder(): string | null {
  const base = 'allure-report';
  if (!fs.existsSync(base)) return null;
 
  return fs.readdirSync(base)
    .filter(f => /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}$/.test(f))
    .sort()
    .pop() || null;
}
 
function runAllureGeneration() {
  const timestamp = getTimestamp();
  const baseResults = 'allure-results';
  const baseReports = 'allure-report';
 
  // Move results to timestamped folder
  const resultDir = moveResultsToTimestampedFolder(baseResults, timestamp);
  const reportDir = path.join(baseReports, timestamp);
 
  // Copy history
  const lastReport = getLastReportFolder();
  if (lastReport) {
    copyHistory(path.join(baseReports, lastReport), resultDir);
  }
 
  // Generate report
  execSync(`allure generate ${resultDir} --clean -o ${reportDir}`);
  console.log(`Allure report generated at ${reportDir}`);
 
  // Open report
 // execSync(`allure open ${reportDir}`);
}
 
runAllureGeneration();
process.exit(0)
