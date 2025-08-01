"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs = require("fs");
var path = require("path");
function getTimestamp() {
    var now = new Date();
    var yyyy = now.getFullYear();
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var dd = String(now.getDate()).padStart(2, '0');
    var hh = String(now.getHours()).padStart(2, '0');
    var mi = String(now.getMinutes()).padStart(2, '0');
    return "".concat(yyyy, "-").concat(mm, "-").concat(dd, "_").concat(hh, "-").concat(mi);
}
function moveResultsToTimestampedFolder(baseDir, timestamp) {
    var targetDir = path.join(baseDir, timestamp);
    fs.mkdirSync(targetDir, { recursive: true });
    var files = fs.readdirSync(baseDir);
    files.forEach(function (file) {
        var fullPath = path.join(baseDir, file);
        var isDir = fs.lstatSync(fullPath).isDirectory();
        if (!isDir && file !== timestamp) {
            var destPath = path.join(targetDir, file);
            fs.renameSync(fullPath, destPath);
        }
    });
    return targetDir;
}
function copyHistory(prevReportPath, destResultsDir) {
    var historyPath = path.join(prevReportPath, 'history');
    if (fs.existsSync(historyPath)) {
        fs.cpSync(historyPath, path.join(destResultsDir, 'history'), { recursive: true });
    }
}
function getLastReportFolder() {
    var base = 'allure-report';
    if (!fs.existsSync(base))
        return null;
    return fs.readdirSync(base)
        .filter(function (f) { return /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}$/.test(f); })
        .sort()
        .pop() || null;
}
function runAllureGeneration() {
    var timestamp = getTimestamp();
    var baseResults = 'allure-results';
    var baseReports = 'allure-report';
    // Move results to timestamped folder
    var resultDir = moveResultsToTimestampedFolder(baseResults, timestamp);
    var reportDir = path.join(baseReports, timestamp);
    // Copy history
    var lastReport = getLastReportFolder();
    if (lastReport) {
        copyHistory(path.join(baseReports, lastReport), resultDir);
    }
    // Generate report
    (0, child_process_1.execSync)("allure generate ".concat(resultDir, " --clean -o ").concat(reportDir));
    console.log("Allure report generated at ".concat(reportDir));
    // Open report
    (0, child_process_1.execSync)("allure open ".concat(reportDir));
}
runAllureGeneration();
process.exit(0);
