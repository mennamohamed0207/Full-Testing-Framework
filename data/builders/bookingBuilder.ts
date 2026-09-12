import { faker } from "@faker-js/faker";

export class BookingBuilder{
    getBooking()
    {
        return {
            "firstname" :faker.person.firstName(),
            "lastname" : faker.person.lastName(),
            "totalprice" : faker.number.float()* 100,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : faker.date.recent(),
                "checkout" : faker.date.recent()
            },
            "additionalneeds" : faker.string.alphanumeric()
        }
    }
}