# Booking Flow Test Checklist

Purpose: Manual checklist to verify end-to-end provider/customer booking flow during Sprint 1.

Environment:
- Run the app locally (dev or production build)
- Use a test provider account and a test customer phone/email (no account required for customer)

Test data (examples):
- Provider email: test+provider@example.com
- Provider password: TestPass123!
- Provider display name: Test Provider
- Customer name: Sam Customer
- Customer phone: 555-000-0100

Checklist
1. Provider signup
   - Action: Create provider profile via `/join`
   - Expect: Profile created (message shown). Profile appears in provider dashboard after login.
   - Result:

2. Provider login
   - Action: Sign in at `/auth/login`
   - Expect: Redirect to provider dashboard.
   - Result:

3. Create profile and set availability
   - Action: Fill details, add a service and availability rules
   - Expect: Service appears in Services list, availability appears in Availability list
   - Result:

4. Public profile loads
   - Action: Open `/providers/[providerId]` (link from dashboard)
   - Expect: Public profile loads with services and Booking form (no account required)
   - Result:

5. Customer booking request
   - Action: Submit a booking request from public profile with name & phone
   - Expect: Booking request saved and success message shown to customer
   - Result:

6. Dashboard receives request
   - Action: Refresh provider dashboard
   - Expect: New booking request appears under Booking Requests
   - Result:

7. Provider confirms request
   - Action: Click Confirm on booking request
   - Expect: Booking status updates to Confirmed; provider can mark Completed later
   - Result:

8. Provider declines request
   - Action: Click Decline on another booking request
   - Expect: Booking status updates to Declined
   - Result:

9. Provider marks complete
   - Action: Click Mark Completed on a confirmed booking
   - Expect: Booking status updates to Completed
   - Result:

10. Edge cases
   - Missing phone/name: Verify validation shows an error and user cannot submit
   - Invalid times (outside availability): Verify either prevented or provider notified
   - Concurrent requests: Verify DB handles multiple requests without overwriting

Notes
- Database table to watch: booking_requests
- Provider dashboard reads booking_requests by seller_id
- Do not run these tests against production data without a test provider


Manual test results table
| Test | Status (Pass/Fail) | Notes |
|---|---|---|
| Provider signup | | |
| Provider login | | |
| Create profile & availability | | |
| Public profile load | | |
| Customer booking request | | |
| Dashboard receives request | | |
| Provider confirms | | |
| Provider declines | | |
# Booking Flow Test Checklist — ScaleHub (Sprint 1)

Purpose: manual test checklist to validate the core booking MVP loop (provider signup → public booking → provider dashboard actions) and QR link behavior.

Checklist

- [ ] Provider can sign up (go to `/auth/signup`, choose 'seller' role)
- [ ] Provider can log in (go to `/auth/login`)
- [ ] Provider can create profile (complete `Join` form at `/join`)
- [ ] Provider can add services (in Provider Dashboard, add service)
- [ ] Provider can set availability (Add availability rules in dashboard)
- [ ] Public provider profile loads (`/providers/[id]`)
- [ ] Customer can submit booking request without account (use public profile booking form)
- [ ] Customer is not asked for card/payment (booking form contains no payment fields)
- [ ] Booking saves to `booking_requests` table (verify in Supabase or via dashboard list)
- [ ] Provider dashboard receives booking request (it appears in Booking Requests list)
- [ ] Provider can confirm request (Confirm button updates status to `confirmed`)
- [ ] Provider can decline request (Decline button updates status to `declined`)
- [ ] Provider can mark completed (Mark Completed updates status to `completed`)
- [ ] Status updates correctly in Supabase (check `booking_requests.status` values)
- [ ] QR code links to provider profile (scan or open the QR link)
- [ ] Copy booking link works (Click Copy Link in dashboard)
- [ ] Download QR works if supported by browser/device (Click Download QR)
- [ ] Print QR works if browser supports window.print (Click Print QR)

