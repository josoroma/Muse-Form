# Quality evidence

The current product is MUSE + FORM. This folder records the repository cleanup and navigation/import smoke checks; `qa/` retains the final character reviews and reproducible browser-check output. A successful automated check establishes the behavior it measures, not photographic quality or medical accuracy.

## Current project checks

Run `npm run check:project` after changing project structure, navigation or documentation. It checks local Markdown/HTML links, relative module imports, all thirteen study routes, finite posed geometry, visible pose change, exact five-second return, basic selection and current home-page responsiveness. It also confirms that current viewers make no requests into the historical archive or removed SVG/skill paths.

[Latest project result](cleanup-checks.json) · [Cleanup inventory](cleanup.json)

For changes to character geometry, materials, motion or interaction, run the fuller suites:

```sh
npm run check:three
npm run playback:three
npm run check:expressions
npm run playback:expressions
npm run check:assets
```

- [FORM checks](../../qa/three/checks.json), [unpaused playback](../../qa/three/playback.json) and [visual review](../../qa/three/art-review.json).
- [MUSE checks](../../qa/expressions/checks.json), [unpaused playback](../../qa/expressions/playback.json) and [visual review](../../qa/expressions/art-review.json).
- [Shared character comparison](../../qa/character/cross-view.json).
- [Enlarged integrated portraits](../../qa/character/portrait-v6/review.json), [complexion review](../../qa/character/complexion/review.json) and [mouth/normal diagnosis](../../qa/character/oral-v2/review.json).

Those detailed art and playback records were captured before this repository cleanup. Their source fingerprints and dates remain intact: they have not been relabeled as fresh runs. The cleanup changes project packaging, navigation and tooling, and removes unused geometry helpers; it does not alter character geometry, materials, acting recipes or the active movement envelope. The project check independently exercises the retained runtime after cleanup.

Only final render sets remain in the active `qa/` tree. Intermediate trials were removed. Original JSON records are preserved in [the historical QA archive](../../archive/qa-records-before-cleanup/); every prior tracked render is recoverable from commit `6b21c15`. The [development study](../../README-STUDY.md) uses pinned Git images and records exactly which images were cropped into its collages.

The current model uses stylized realtime skin and textured hair, authored expressions and approximate anatomical surface labels. Enlarged portrait reviews are deliberately separate from the automated movement checks. One earlier camera-framing failure is recorded in the mouth review's check history; focused reproductions and the final full suite passed without a runtime repair.
