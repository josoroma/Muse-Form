---
name: form-motion
description: Extend FORM with anatomical movement studies, articulated hand and limb actions, surface selections, and coordinated study sets using its shared Three.js character. Use for FORM motion and anatomy work, not standalone illustrations or ordinary interface animation.
---

# FORM Motion

Build on FORM's existing skinned human character and inspectable movement. A useful study teaches one visible relationship between form and motion; a set combines related actions with coherent framing, names and controls.

## Find the working project

Locate the user's selected repository from the supplied workspace or path. Confirm its `AGENTS.md`, `package.json`, `three/app.mjs` and `three/character/anatomy.mjs` before editing; do not assume the shell directory or this skill's installation directory is the project. Read applicable project instructions and inspect the current rendered study, source metadata and relevant QA. Paths below are relative to that confirmed project root.

Use the requested references and action as the brief. If a detail is unspecified, choose a restrained movement suited to the existing rig and describe that choice. Retain unrelated work. A new study does not require rebuilding the character or redesigning the interface.

## Extend the movement

- Read [Implementation map](references/implementation.md) for the actual factory, region, catalog and validation hooks before adding or changing study IDs.
- Preserve the shared adult character identity, continuous skin, neutral anatomical bodysuit, local licensed assets and current camera/selection behavior. Changing shared geometry, materials or lighting also affects MUSE; review both when those modules change.
- Keep the current five-second deterministic loop unless the user explicitly requests another duration. Derive the complete pose from absolute time after restoring the captured rest pose. Do not accumulate per-frame joint rotations or let reverse seeking depend on playback history.
- Make movement anatomically legible. Coordinate joints rather than moving a detached limb: shoulder with clavicle, finger joints with knuckles and palm, heel rise with forefoot support. Check thumb opposition, little-finger attachment, joint transitions, contact and interpenetration through the whole action.
- Reuse actual surface triangles for translucent mint selections. Update skinning, anchors and posed picking together. Preserve Pectoralis, Back and Pelvis interactions in the body study and manual orbit's interruption of guided camera control.
- For a new set, add every requested action to navigation, source metadata, generated catalogs and QA coverage. The current five study IDs are a starting set, not a permanent limit. Preserve existing IDs and deep links unless the user asks to replace them.
- Keep `archive/` immutable. Historical experiments may inform a study but are not active dependencies. Do not copy archived runtime, corpus or asset bundles back into the product. Keep asset permission evidence and CC0 inputs; do not import upstream GPL generator/runtime code.

## Review and deliver

Run affected project checks and actual playback after updating their coverage for any added IDs. Inspect front, profile and three-quarter views at rest, peak and transitions; inspect contact surfaces and the selected region from a useful posterior or underside view when relevant. Check mobile framing, label visibility, pause/scrub/reverse seek and exact loop closure. A changing camera or screenshot hash alone does not establish skeletal motion: compare evaluated skinned vertices.

If a change touches the face, inspect an actual browser render with the face at least 450 pixels high, including teeth, complexion and posed normals. Keep mutable per-instance normal buffers private. Do not replace visual inspection with thumbnail review or a generative concept image.

Regenerate viewer catalogs after source metadata changes. Retain fresh QA with its source revision or hashes and state exactly what was inspected. Report the added study links, motion and selection behavior, validation results and remaining artistic limitations; do not describe illustrative regions as clinical anatomy or measured muscle activation. No video export is needed unless requested.
