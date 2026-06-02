Sprint 2 — Provider Media Uploads

Summary
- Implemented provider media upload UI and DB/storage migrations for ScaleHub MVP.

What I added
- Migration: `migrations/provider-media-storage.sql` (adds `profile_photo_path`, `cover_photo_path`, and `seller_portfolio_media` table)
- Library: `lib/storage.ts` helper with `publicUrlFor`, `uploadFile`, `removeFile`, and `createSignedUrl`
- Component: `components/MediaGallery.tsx` — provider dashboard media manager (profile, cover, gallery uploads, preview, delete)
- Integrated `MediaGallery` into `components/ProviderDashboardClient.tsx`
- Updated public provider page `app/providers/[id]/page.tsx` to display profile/cover and gallery images

Storage bucket
- Name: `provider-media`
- Recommended folder layout:
  - provider-media/{userId}/profile/{filename}
  - provider-media/{userId}/cover/{filename}
  - provider-media/{userId}/gallery/{filename}

Supabase configuration steps (manual)
1) Create storage bucket `provider-media` in Supabase dashboard.
2) If you want public URLs, set the bucket to public in Storage settings.
3) Run the SQL in `migrations/provider-media-storage.sql` in Supabase SQL editor to add DB fields and table. Review RLS policy sections and adapt to your auth strategy.

Testing checklist
- Provider logged in -> open Provider Dashboard
- Upload a profile photo -> verify it appears in preview and DB `seller_profiles.profile_photo_path` contains path
- Upload a cover photo -> verify it appears in preview and DB `seller_profiles.cover_photo_path` contains path
- Upload gallery photos -> verify rows present in `seller_portfolio_media` and images listed in dashboard
- Delete gallery photo -> verify file removed from storage and DB row deleted
- Public provider page -> displays cover/profile and gallery images as expected

Notes / Limitations
- RLS policy statements in migration file are commented templates. Apply policies according to your project's RLS setup. If bucket is private, signed URLs will be needed; `lib/storage.createSignedUrl` is available for that workflow.
- Uploads currently use the client anon key and the user's session. This assumes Supabase Storage policies allow authenticated users to upload to their own paths.

Files changed
- migrations/provider-media-storage.sql (new)
- lib/storage.ts (new)
- components/MediaGallery.tsx (new)
- components/ProviderDashboardClient.tsx (modified)
- app/providers/[id]/page.tsx (modified)
- docs/sprint-2-media-status.md (new)

*** End of sprint-2 media status
