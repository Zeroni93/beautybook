# Supabase media setup (provider-media)

This document explains how to configure Supabase Storage for ScaleHub provider media.

1) Create a storage bucket named `provider-media` in the Supabase dashboard.

2) For MVP, set the bucket to public so `publicUrlFor` returns a reachable URL. If you want private media, keep the bucket private and implement a server-signed URL route (not included in this doc).

3) Run migration `migrations/provider-media-storage.sql` in the Supabase SQL editor to add `profile_photo_path`, `cover_photo_path`, and `seller_portfolio_media` table.

4) (Optional) Apply RLS policies noted in the migration file. Example policies are commented; adapt them to your auth model.

5) Test uploads:
  - Sign in as a provider and use the MediaGallery in the provider dashboard to upload a profile photo, cover photo, and gallery image.
  - Verify files appear in Storage > provider-media and DB table `seller_portfolio_media` contains rows with `path` fields.
  - Open a public provider page and confirm images render using `getSafeImageSrc`.

6) Troubleshooting:
  - If images show a placeholder, check that `publicUrlFor` returns a URL and that the bucket path is correct.
  - If RLS is enabled, ensure your policies allow inserts/selects for the actions you need.
