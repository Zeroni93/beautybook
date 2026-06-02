# ScaleHub MVP Testing Checklist

This document lists a curated end-to-end checklist to validate the ScaleHub MVP. The goal is to stop adding new features and verify the core booking flow works end-to-end.

---

## Provider Flow

- Provider can sign up
- Provider can log in
- Provider can create profile
- Provider can edit/manage profile
- Provider can add services
- Provider can delete or update services if supported
- Provider can set availability
- Provider can delete availability
- Provider dashboard loads correctly


## Public Provider Flow

- Provider public profile loads at `/providers/[id]`
- Public profile shows provider name, category, services, availability, service area, and booking form
- Public profile does not require customer login


## Customer Booking Flow

- Customer can browse providers
- Customer can open provider profile
- Customer can submit booking request using only:
  - name
  - phone
  - service
  - preferred date
  - preferred time
  - notes
- Customer is not asked to create an account
- Customer is not asked for debit/credit card info
- Booking request saves to `booking_requests`
- Booking success message appears


## Provider Booking Management

- New booking request appears in provider dashboard
- Provider can confirm booking
- Provider can decline booking
- Provider can mark booking completed
- Booking status updates correctly in Supabase
- Status timeline updates correctly in UI


## Business Model Validation

- App clearly states $15/month provider plan
- App clearly states no commissions
- App clearly states no booking fees
- App clearly states providers keep 100% of earnings
- Customers book for free


## Security / Env Checks

- `.env.local` is ignored by Git
- `node_modules` is ignored by Git
- `.next` is ignored by Git
- No Supabase service role key is exposed in frontend code
- Public Supabase anon key is only used where appropriate
- Service role key is only used in server API routes


## Build / Test Checks

- `npm run build` passes
- `npm run dev` starts successfully
- No 404 image errors
- No missing logo errors
- No broken route links
- No TypeScript errors
- No browser console errors during core flow


---

## Manual Test Results

| Test | Status | Notes |
|---|---|---|
| Provider sign up | Needs Review | |
| Provider login | Needs Review | |
| Provider create profile | Needs Review | |
| Provider edit/manage profile | Needs Review | |
| Provider add services | Needs Review | |
| Provider delete/update services | Needs Review | |
| Provider set availability | Needs Review | |
| Provider delete availability | Needs Review | |
| Provider dashboard loads | Needs Review | |
| Public provider profile load | Needs Review | |
| Customer booking request | Needs Review | |
| Booking saved to booking_requests | Needs Review | |
| Provider sees new booking | Needs Review | |
| Provider confirms/declines/completes booking | Needs Review | |
| App pricing statements present | Needs Review | |
| Env/security checks | Needs Review | |
| Build & runtime checks | Needs Review | |


---

## Known Issues To Fix

| Issue | Priority | Suggested Fix |
|---|---|---|
|  |  |  |


---

## Notes on verification performed automatically by this checklist

I inspected the repository for obvious issues related to the checklist (env exposure, image references, booking flow code paths). See the verification summary below.
