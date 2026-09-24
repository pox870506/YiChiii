# Travel site performance cleanup

The comparison used the previous `main` snapshot (`3c660296e519587a3dac4dc84fbbd46af0bd9d7b`) and the optimized production build. Each side used five fresh Edge sessions at a 390 × 844 viewport, four-times CPU slowdown, 150 ms network latency, and 200 kB/s download speed. The figures are medians; this local throttled test is useful for comparing versions, but actual phone and network conditions will vary.

| Measure | Previous | Optimized | Change |
| --- | ---: | ---: | ---: |
| Largest contentful paint | 2,668 ms | 2,028 ms | 24% faster |
| First contentful paint | 2,344 ms | 920 ms | 61% faster |
| Page load event | 3,369 ms | 2,004 ms | 41% faster |
| Open the daily itinerary tab | 1,470 ms | 463 ms | 68% faster |
| Change the selected day | 505 ms | 256 ms | 49% faster |
| Open a photo at full resolution | 2,180 ms | 1,917 ms | 12% faster |
| Advance to the next full-resolution photo | 2,269 ms | 2,252 ms | 1% faster |
| Initial JavaScript downloaded | 233.6 kB | 228.8 kB | 2% less |
| CSS output, raw / gzip | 244.5 / 39.1 kB | 60.1 / 13.5 kB | 75% / 65% less |

The largest repeatable gains came from limiting Tailwind's scan to the live app, which removed unused generated CSS without changing the rendered layout, and from creating story text and story galleries only when a reader opens them. Page snapshots for all unrelated tabs matched; the Cologne lunch page changed only for the specifically requested restaurant addition. The photo viewer now uses the displayed responsive preview when it opens the larger image, warms the next full image after the current one is ready, and keeps its in-memory preload cache bounded to eight images. On this test, full-resolution photo changes remain close to the previous version.

The cleanup removed 64 unreferenced starter, legacy, and voice-expense modules, while retaining the Input component used by the legacy budget page. Ten unused direct dependencies were removed, along with their transitive packages. The existing journey JSON migration and ledger calculations were checked against the previous code for six plan revisions, custom expenses, packing items, CSV export, and the existing family settlement cases.

The requested Cologne lunch was also added to 14 November: Brauhaus FRÜH am Dom is the first choice, with Malzmühle and Keule as alternatives when it is busy. The food card includes a WebP venue photo and its reuse credit. The photo is 224 kB, with a 94 kB responsive thumbnail. The itinerary item records the photo license and image-page links.

Verification: `pnpm build` passed. The isolated mobile and desktop browser checks passed for daily navigation, story expansion, photo zoom and next/previous controls, ledger create/edit/delete, existing browser data, CSV and JSON backup round-trip, packing edits, IndexedDB ticket receipts, shopping categories, and horizontal overflow. The browser reported no page errors. All 343 referenced photo and thumbnail paths in the photo catalog exist.
