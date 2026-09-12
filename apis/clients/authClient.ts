import { APIRequestContext } from "@playwright/test";
import { ApiTestHelper } from "./apiClient";
import { User } from "../../data/builders/userBuilder";

export class AuthClient {
    private apiTestHelper: ApiTestHelper;
    private userBuilder: User;

    constructor(request: APIRequestContext) {
        this.apiTestHelper = new ApiTestHelper(request)
        this.userBuilder = new User()
    }
    public async getAuthToekn() {
        this.apiTestHelper.setEndpoint("auth")
        const loginData = this.userBuilder.getCorrectAuthData()
        const response = this.apiTestHelper.postAndExpectError(loginData, 200)
        const body: any = (await response).json()
        return body.token;
    }
}