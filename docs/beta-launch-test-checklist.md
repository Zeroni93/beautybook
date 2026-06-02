# Beta Launch Manual Test Checklist

Provider tests
- Signup (create provider via /auth/signup with role 'seller')
- Login (/auth/login)
- Create profile (/join)
- Add service (Provider Dashboard -> Add Service)
- Add availability (Provider Dashboard -> Add Availability)
- Upload profile photo (Provider Dashboard -> Media Gallery)
- Upload cover photo (Provider Dashboard -> Media Gallery)
- Upload gallery photo (Provider Dashboard -> Media Gallery)
- View public profile (/providers/[id])
- Copy public booking link and open it
- Download QR code from Provider Dashboard

Customer tests
- Browse providers (/browse-pros)
- Open provider profile (public)
- Submit booking request without account (Booking form)
- Submit review (Review form on provider page)
- Confirm no card/payment requirement

Provider booking lifecycle
- Provider receives booking in Provider Dashboard
- Confirm booking
- Decline booking
- Mark completed

Database checks
- booking_requests row created
- services row created
- availability_rules row created
- seller_portfolio_media row created
- provider_reviews row created

Security checks
- Ensure no `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- Ensure `.env.local` is in `.gitignore`
