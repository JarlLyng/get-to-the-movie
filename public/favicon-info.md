# Favicon Requirements

Next.js automatically handles `favicon.ico` from `src/app/favicon.ico`.

For optimal cross-platform support, add these files to `/public/`:

## Required Files:
1. **favicon.ico** - Already exists in `src/app/` (Next.js handles this automatically)
2. **icon-16x16.png** - 16×16 pixels (browser tabs)
3. **icon-32x32.png** - 32×32 pixels (browser tabs, bookmarks)
4. **apple-touch-icon.png** - 180×180 pixels (iOS home screen)

## Optional but Recommended:
- **icon-192x192.png** - 192×192 pixels (Android)
- **icon-512x512.png** - 512×512 pixels (Android, PWA)

## Design Tips:
- Use simple, recognizable icon
- Ensure it's readable at small sizes (16×16)
- Match your brand colors (primary: #D0FF00 in dark mode)
- Consider dark background for dark mode theme
