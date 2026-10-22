# Five-second native SVG motion

The current delivery is **static SVG + animated SVG**, with a five-second loop. No video export is required. SVG SMIL runs at the browser's display rate and supports seeking through `pauseAnimations()` and `setCurrentTime(t)`.

## Author the action

Make the requested feature change visibly. Facial acting changes several coordinated features; finger movement follows joints; muscle contours respond to load; characters move their bodies and held objects toward an intention. Global wobble, faint color changes and subdegree head tilts were rejected as too static.

Use a short preparation, a distinct action, an extreme that reads, and a resolved recovery. Match the first and last pose exactly. Give the return enough time to avoid a snap. Use ease-in/out near resting endpoints; blinks need shorter local timing than a whole arm gesture.

Keep props rigid, grips attached, bone lengths credible and planted contacts anchored. For a blink, animate both visible lids and the iris clipping aperture. For finger flexion, account for the thumb's different opposition axis. Author new pose geometry when the silhouette or occlusion changes materially.

## Source contract

Static geometry lives in corpus/svg/<id>.svg. Metadata in corpus/hairline/*.json contains explicit animations:

~~~json
{
  "target": "upper-lid",
  "attribute": "d",
  "values": ["M...C...", "M...C...", "M...C..."],
  "keyTimes": [0, 0.5, 1]
}
~~~

Every value in a `d` track must have matching path-command topology. Transform tracks use `type` (`rotate`, `translate` or `scale`) instead of an attribute name. Pivots use the drawing's local viewBox: faces use 400×300, while anatomy and stories use 1200×900. All deliver at 1200×900. Do not mix these coordinate systems.

The compositor inserts `dur="5s"`, `repeatCount="indefinite"`, normalized key times and spline interpolation. It rejects missing targets, open loops, mismatched topology and competing tracks on one attribute. Nest groups when multiple transforms need independent pivots. There is no fallback color pulse for unanimated assets.

## Inspect the SVG

~~~sh
npm run compose
npm run catalog
npm run check
npm run verify
npm run install-skill
npm run bundle
~~~

Compose/check accept selected IDs for a local repair. Full corpus revisions require all assets checked. Inspect the generated pose sheets and full-size peaks, then watch actual browser playback. Record what was inspected accurately.

The portable helper captures a QA still:

~~~sh
node scripts/render-svg.mjs assets/corpus/animated/105216.svg peak.png 2.5
~~~

QA needs Node.js 22+, local Chrome/Chromium and pinned playwright-core 1.64.1. Set CHROME_PATH for a nonstandard browser. Existing SVG playback needs only a browser; no library, network service or encoder is required.

## Gates

- Valid native geometry, accessible title/description, unique IDs and internal references; no embedded bitmap, scripts, gradients or filters.
- Exactly five seconds on every track, identical first/last values, stable endpoints and repeatable reverse seeking.
- Readable geometric movement at a 300×225 native viewport. The current check requires at least 15% changed visible ink with a 16/255 channel difference and 100 changed pixels. This detects nearly static outputs; it cannot prove anatomy or acting quality.
- Coherent anatomy, support, grip and occlusion at every authored extreme. Compare the actual requested feature, not only total changed pixels.
- For endpoint rasterization, require equal source values and permit at most 0.01% differing antialias pixels with mean RGB difference ≤0.005/255; report exact equality separately.
- Gallery autoplays ordinary selection, starts paused for reduced motion, supports pause/restart/scrub/keyboard, and pauses when hidden.

Offer static SVGs for reduced-motion embeddings because standalone animated SVGs autoplay. Keep both deliverables portable and independently usable.
