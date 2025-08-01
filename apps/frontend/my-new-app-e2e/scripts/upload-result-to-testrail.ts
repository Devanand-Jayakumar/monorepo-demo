import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
const FormData = require('form-data');
import { config } from 'dotenv';

config(); // Load environment variables from .env file

interface TestResult {
    case_id: number;
    status_id: number;
    comment: string;
    screenshot_path?: string;
}

const {
    TESTRAIL_HOST,
    TESTRAIL_USERNAME,
    TESTRAIL_API_KEY,
    TESTRAIL_PROJECT_ID,
    TESTRAIL_SUITE_ID,
    TESTRAIL_RUN_NAME,
} = process.env;

const httpAgent = new https.Agent({ rejectUnauthorized: false });
const testrail = axios.create({
    baseURL: `${TESTRAIL_HOST}/index.php?/api/v2`,
    httpsAgent: httpAgent,
    auth: {
        username: TESTRAIL_USERNAME as string,
        password: TESTRAIL_API_KEY as string,
    },
});

async function createTestRun(caseIds: number[]): Promise<number> {
    const response = await testrail.post(`/add_run/${TESTRAIL_PROJECT_ID}`, {
        suite_id: TESTRAIL_SUITE_ID,
        name: TESTRAIL_RUN_NAME,
        include_all: false,
        case_ids: caseIds,
    });
    return response.data.id;
}

async function addTestResults(runId: number, results: TestResult[]): Promise<void> {
    for (const result of results) {
        try {
            const response = await testrail.post(`/add_result_for_case/${runId}/${result.case_id}`, {
                status_id: result.status_id,
                comment: result.comment,
            });
            const resultId = response.data.id;
            if (result.screenshot_path) {
                const formData = new FormData();
                formData.append('attachment', fs.createReadStream(result.screenshot_path));
                await testrail.post(`/add_attachment_to_result/${resultId}`, formData, {
                    headers: formData.getHeaders(),
                });
            }
        } catch (err) {
            console.error(`Failed to upload screenshot for case ${result.case_id}`, err);
        }
    }

}


function findScreenshotForCase(caseId: number, screenshotRoot: string): string | undefined {
    const casePattern = new RegExp(`C${caseId}\\D`);
    const walk = (dir: string): string[] =>
        fs.readdirSync(dir).flatMap(file => {
            const fullPath = path.join(dir, file);
            return fs.statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
        });

    const allFiles = walk(screenshotRoot);
    return allFiles.find(file => casePattern.test(path.basename(file)));
}


function extractCaseIdsAndResultsFromJson(): TestResult[] {
    const resultDir = './cypress/results';
    const screenshotDir = './cypress/screenshots';
    const files = fs.readdirSync(resultDir).filter(f => f.endsWith('.json'));
    const caseResults: TestResult[] = [];
    files.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(resultDir, file), 'utf-8'));
        content.results.forEach((result: any) => { // Type the result as any, or create a proper type if the structure is known
            result.suites.forEach((suite: any) => {  // Type the suite as any
                suite.tests.forEach((test: any) => { // Type the test as any
                    const title: string = typeof test.title === 'string' ? test.title : test.title.join(' ');
                    const caseIdMatch = title.match(/C(\d+)/);
                    if (caseIdMatch) {
                        const caseId: number = parseInt(caseIdMatch[1], 10);
                        const screenshotFile = findScreenshotForCase(caseId, screenshotDir);
                        caseResults.push({
                            case_id: caseId,
                            status_id: test.state === 'passed' ? 1 : 5,
                            comment: test.err && test.err.message ? test.err.message : 'Test passed successfully',
                            screenshot_path: screenshotFile,
                        });
                    }
                });
            });
        });
    });
    return caseResults;
}
(async () => {
    try {
        const results = extractCaseIdsAndResultsFromJson();
        const caseIds = results.map(r => r.case_id);
        const runId = await createTestRun(caseIds);
        await addTestResults(runId, results);
        console.log(`Test results uploaded to TestRail (Run ID: ${runId})`);
    } catch (error) {
        console.error('Error uploading results to TestRail:', error);
    }
})();