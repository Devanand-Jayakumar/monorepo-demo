"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs = require("fs");
var path = require("path");
var https = require("https");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load environment variables from .env file
var _a = process.env, TESTRAIL_HOST = _a.TESTRAIL_HOST, TESTRAIL_USERNAME = _a.TESTRAIL_USERNAME, TESTRAIL_API_KEY = _a.TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID = _a.TESTRAIL_PROJECT_ID, TESTRAIL_SUITE_ID = _a.TESTRAIL_SUITE_ID, TESTRAIL_RUN_NAME = _a.TESTRAIL_RUN_NAME;
var httpAgent = new https.Agent({ rejectUnauthorized: false });
var testrail = axios_1.default.create({
    baseURL: "".concat(TESTRAIL_HOST, "/index.php?/api/v2"),
    httpsAgent: httpAgent,
    auth: {
        username: TESTRAIL_USERNAME,
        password: TESTRAIL_API_KEY,
    },
});
function createTestRun(caseIds) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testrail.post("/add_run/".concat(TESTRAIL_PROJECT_ID), {
                        suite_id: TESTRAIL_SUITE_ID,
                        name: TESTRAIL_RUN_NAME,
                        include_all: false,
                        case_ids: caseIds,
                    })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data.id];
            }
        });
    });
}
function addTestResults(runId, results) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, testrail.post("/add_results_for_cases/".concat(runId), { results: results })];
                case 1:
                    res = _a.sent();
                    console.log(res.status);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1); // Use console.error for error logging
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractCaseIdsAndResultsFromJson() {
    var resultDir = './cypress/results';
    var files = fs.readdirSync(resultDir).filter(function (f) { return f.endsWith('mochawesome.json'); });
    console.log("Found result files: ".concat(files.join(', ')));
    var caseResults = [];
    files.forEach(function (file) {
        var content = JSON.parse(fs.readFileSync(path.join(resultDir, file), 'utf-8'));
        content.results.forEach(function (result) {
            result.suites.forEach(function (suite) {
                suite.tests.forEach(function (test) {
                    var title = typeof test.title === 'string' ? test.title : test.title.join(' ');
                    var caseIdMatch = title.match(/C(\d+)/);
                    if (caseIdMatch) {
                        var caseId = parseInt(caseIdMatch[1], 10);
                        caseResults.push({
                            case_id: caseId,
                            status_id: test.state === 'passed' ? 1 : 5,
                            comment: test.err && test.err.message ? test.err.message : 'Test passed successfully',
                        });
                    }
                });
            });
        });
    });
    return caseResults;
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var results, caseIds, runId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                results = extractCaseIdsAndResultsFromJson();
                console.log(results);
                caseIds = results.map(function (r) { return r.case_id; });
                return [4 /*yield*/, createTestRun(caseIds)];
            case 1:
                runId = _a.sent();
                console.log(runId);
                return [4 /*yield*/, addTestResults(runId, results)];
            case 2:
                _a.sent();
                console.log("Test results uploaded to TestRail (Run ID: ".concat(runId, ")"));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error uploading results to TestRail:', error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
