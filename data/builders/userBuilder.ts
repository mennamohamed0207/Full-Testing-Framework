import { faker } from "@faker-js/faker";
import { process } from "zod/v4/core";

export class User {
    private username: string;
    private password: string;

    constructor() {
        this.username = ""
        this.password = ""
    }
    getCorrectAuthData(): any {
        this.username = process.env.USERNAME;
        this.password = process.env.PASSWORd;

        return {
            username: this.username,
            password: this.password
        }
    }
    getWrongUsername() {
        this.password = process.env.PASSWORd;
        this.username = `${faker.person.firstName()}${faker.person.lastName()}`
        return {
            username:this.username,
            password:this.password
        }
    }
}