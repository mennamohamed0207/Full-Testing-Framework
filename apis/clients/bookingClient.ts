import { APIRequestContext } from "@playwright/test";
import { ApiTestHelper } from "./apiClient";

export class BookingClient {
    private apiTestHelper: ApiTestHelper;
  constructor(private readonly request: APIRequestContext) {
    this.apiTestHelper= new ApiTestHelper(this.request)
  }

  async createBooking(booking: any) {
    this.apiTestHelper.setEndpoint("booking")
    const response = await this.apiTestHelper.postAndExpectError(booking,200)
    return response.json();
  }


}