import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

interface LogEntry {
  timestamp: string;
  testTitle: string;
  method: string;
  url: string;
  requestBody?: unknown;
  status: number;
  responseBody: unknown;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly requestContext: APIRequestContext;
  private testTitle: string;
  private readonly logFilePath: string;

  constructor(baseUrl: string, requestContext: APIRequestContext) {
    this.baseUrl = baseUrl;
    this.requestContext = requestContext;
    this.testTitle = "";

    // One log file per run, timestamped
    const logsDir = path.join(process.cwd(), "artifacts", "logs");
    fs.mkdirSync(logsDir, { recursive: true });
    const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
    this.logFilePath = path.join(logsDir, `api-run-${runStamp}.log`);
  }

  public setTestTitle(testTitle: string) {
    this.testTitle = testTitle;
  }

  private log(entry: LogEntry) {
    const line = JSON.stringify(entry, null, 2) + "\n---\n";
    fs.appendFileSync(this.logFilePath, line, "utf-8");
  }

  private async logAndParse(
    method: string,
    url: string,
    response: APIResponse,
    requestBody?: unknown
  ): Promise<any> {
    const status = response.status();
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text(); 
    }

    this.log({
      timestamp: new Date().toISOString(),
      testTitle: this.testTitle,
      method,
      url: `${this.baseUrl}${url}`,
      requestBody,
      status,
      responseBody: body,
    });

    return body;
  }

  public async getAndAssert(
    url: string,
    expectedStatus: number,
    expectedMessageCode: string
  ): Promise<any> {
    const response = await this.requestContext.get(`${this.baseUrl}${url}`);
    const body = await this.logAndParse("GET", url, response);

    expect(response.status(), `Unexpected status for GET ${url}`).toBe(expectedStatus);
    if (expectedMessageCode) {
      expect(
        JSON.stringify(body),
        `Expected response to contain "${expectedMessageCode}"`
      ).toContain(expectedMessageCode);
    }
    return body;
  }

  public async postAndAssert(
    url: string,
    requestBody: any,
    expectedStatus: number,
    expectedMessageCode: string
  ): Promise<any> {
    const response = await this.requestContext.post(`${this.baseUrl}${url}`, {
      data: requestBody,
    });
    const body = await this.logAndParse("POST", url, response, requestBody);

    expect(response.status(), `Unexpected status for POST ${url}`).toBe(expectedStatus);
    if (expectedMessageCode) {
      expect(
        JSON.stringify(body),
        `Expected response to contain "${expectedMessageCode}"`
      ).toContain(expectedMessageCode);
    }
    return body;
  }
}