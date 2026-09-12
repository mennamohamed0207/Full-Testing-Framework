import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import fs, { stat } from "fs";

const RUN_TIMESTAMP = new Date()
  .toISOString()
  .slice(0, 16)
  .replace(/[:.]/g, "-");

const LOG_DIR = './logs';
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

export class ApiTestHelper {
  private request: APIRequestContext;
  private endpoint: string | any;
  private logFileName: string | any;
  private currentTestTitle: string = "Unknown Test";
  constructor(request: APIRequestContext) {
    this.request = request;
  }
  setEndpoint(endpoint: string) {
    this.endpoint = endpoint
    const safeEndpoint = this.endpoint.replace(/[<>:"/\\|?*]/g, "_");
    this.logFileName = `${LOG_DIR}/${safeEndpoint}-${RUN_TIMESTAMP}-log.txt`;
  }
  getEndpoint(): string {
    return this.endpoint
  }

  setCurrentTestTitle(title: string) {
    this.currentTestTitle = title;
  }

  private writeLog(log: string) {
    console.log(log);
    fs.appendFileSync(this.logFileName, log);
  }

  async postAndExpectError(
    payload: object,
    statusCode: number,
    expectError?: string,
    testTitle?: string
  ): Promise<APIResponse> {
    const title = testTitle ?? this.currentTestTitle;


    let testcaseStatus = "Passed";

    console.log(this.endpoint);
    
    const response = await this.request.post(this.endpoint, { data: payload });
    const responseText = await response.text();
    const body = await response.json();
    console.log("Response Body: ", body);
    console.log("\n Status Code: ", statusCode);
    if (statusCode != response.status() || (expectError != undefined && !responseText.includes(expectError))) {
      testcaseStatus = "Failed"
    }
    const log = `
====================================================
Time: ${new Date().toISOString()}
Test: ${title} - ${testcaseStatus}
Endpoint: ${this.endpoint}
Payload: ${JSON.stringify(payload, null, 2)}
Expected Status: ${statusCode}
Actual Status: ${response.status()}
Response:
${JSON.stringify(body, null, 2)}
====================================================
`;

    this.writeLog(log);

    expect(response.status(), "Status Code").toBe(statusCode);
    if (expectError !== undefined)
      expect(responseText).toContain(expectError);

    return response;
  }

  async getAndExpectError(
    params: Record<string, string | undefined>,
    statusCode: number,
    expectError?: string,
    testTitle?: string
  ): Promise<APIResponse> {
    const title = testTitle ?? this.currentTestTitle;

    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
      .join('&');
    const fullUrl = query ? `${this.endpoint}?${query}` : this.endpoint;

    let testcaseStatus = "Passed";

    const response = await this.request.get(fullUrl);
    const responseText = await response.text();
    const body = await response.json().catch(() => null);

    if (statusCode != response.status() || (expectError != undefined && !responseText.includes(expectError))) {
      testcaseStatus = "Failed"
    }
    console.log("Response Body: ", body);
    console.log("\n Status Code: ", statusCode);
    const log = `
====================================================
Time: ${new Date().toISOString()}
Test: ${title} - ${testcaseStatus}
Endpoint: ${fullUrl}
Expected Status: ${statusCode}
Actual Status: ${response.status()}
Response:
${JSON.stringify(body, null, 2)}
====================================================
`;

    this.writeLog(log);

    expect(response.status(), "Status Code").toBe(statusCode);
    if (expectError !== undefined)
      expect(responseText).toContain(expectError);

    return response;
  }
}