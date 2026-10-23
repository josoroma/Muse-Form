---
name: muse-expression
description: Extend MUSE with expressive Three.js facial acting, new expression studies, and targeted face, mouth, skin or lighting refinements in the MUSE + FORM project. Use for its existing skinned character and interactive portrait viewer, not generic UI animation or standalone portrait generation.
---

# MUSE Expression

Create readable facial performances on the selected project's existing character. Keep the face coherent across angles, expressions and the FORM body viewer.

## Establish the project

Locate the user-selected MUSE + FORM checkout before editing. Check the supplied workspace, or the enclosing repository when this skill lives in `.agents/skills/`; confirm `AGENTS.md`, `expressions/character-face.mjs`, `three/character/character.mjs` and `package.json`. If several checkouts are plausible, resolve the intended one before mutations. Do not assume the shell directory or a fixed home path is correct.

Read that checkout's `AGENTS.md` and relevant implementation. Use [implementation.md](references/implementation.md) for extension hooks, existing diagnostic traps and validation coverage. Recheck these hooks against current source because the project may have evolved.

## Implement the requested performance

- For a new expression, define its acting intention, visible facial changes, asymmetry and recovery. Reuse available morph targets before considering new asset conversion. Coordinate lids, brows, cheeks, lips and jaw; keep teeth, tongue, lashes and brows attached.
- For a refinement, inspect an actual enlarged browser render first. Isolate geometry, albedo, normals and lighting before editing several at once. A requested cosmetic adjustment does not require replacing the character or redesigning the interface.
- Preserve the current shared licensed adult identity for ordinary extensions. A separately requested identity or collection needs its own explicit scope and compatibility decisions; do not silently alter all existing studies.
- Use the existing absolute-time update contract and five-second cycle by default. Pose reset, neutral endpoints and reverse seeking must remain deterministic. Manual orbit must continue to interrupt guided camera motion.
- Retain conforming mint selections, moving labels, portrait/body framing and responsive controls. Keep historical archives unchanged and avoid copying old corpus, skill bundles or assets into the live product.

## Finish with evidence

Update the expression registration, route/UI entry, source metadata and catalog together. Check that validation actually includes every added ID; the current scripts contain fixed expression lists and counts.

For facial changes, run affected expression checks and unpaused playback, inspect rest/peak/recovery from front, profile and three-quarter views, and review an actual browser face at least 450 pixels high. Verify selected regions, mobile layout and the intended local feature motion; changing screenshot hashes alone is insufficient. Shared character/material changes also require affected FORM checks and playback. For documentation-only work use link/navigation checks instead of geometry suites.

Report what changed, the new route or invocation, checks run and any remaining visual limitation. Keep fresh QA separate from historical evidence. Regenerate viewer catalogs after metadata edits; preserve the hand-authored root READMEs and local asset licensing records.
