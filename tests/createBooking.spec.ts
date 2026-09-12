import { test, expect } from '@playwright/test';
import { BookingClient } from '../apis/clients/bookingClient';
import { BookingBuilder } from '../data/builders/bookingBuilder';
test('Create Booking', async ({ request }) => {
  let bookingClient = new BookingClient(request)
  let bookingBuilder =new BookingBuilder()
  await bookingClient.createBooking(bookingBuilder.getBooking())


});
