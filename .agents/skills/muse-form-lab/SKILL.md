---
name: muse-form-lab
description: "Create new experimental character studies or themed sets on the MUSE + FORM codebase, with reusable anatomy, facial acting and visual comparisons. Use for a new collection or research direction, rather than a single existing-viewer repair."
---

# MUSE + FORM Lab

Build a runnable experiment from the project's existing character, interaction and review work. Keep its result inspectable and its evidence traceable.

## Establish the base

Find the user's selected MUSE + FORM checkout. Read its `AGENTS.md`, `README.md`, relevant source notes and `package.json`; confirm `expressions/character-face.mjs` and `three/character/anatomy.mjs` exist. Resolve paths against that checkout, not the installed skill directory. If no checkout is available, ask for its location while outlining the experiment; this skill contains instructions, not a bundled character or runtime.

Choose the smallest useful scope from the request:

- A new expression or movement belongs in the existing viewer when the user asks to extend that viewer.
- A separate themed set, mixed face/body performance, comparison view or material study can live under `experiments/<descriptive-slug>/`, or the user's chosen location. This is a suggested new layout, not an existing application registry.
- Historical SVG experiments use editable native paths and standalone animation when requested. Consult archived examples as read-only references; do not restore the retired corpus into the active product.

Use the shared licensed adult character by default. A new identity, creature or medium is a separate creative choice, not an excuse to distort the human rig. Follow explicit user direction, record new asset provenance, and keep the accepted identity available. Preserve archives and unrelated working changes.

## Build one complete study, then the set

Read [experiment workflow and record](references/experiment-workflow.md) for concrete integration points and a short record format.

Give the set a clear subject and each study a distinct observable action. Establish its rest, preparation, action, readable peak and recovery before multiplying variants. Use one complete study to validate the rendering, motion and controls, then implement the requested set in full. A useful concept is not a completed runnable experiment.

Reuse shared modules and asset paths instead of copying GLBs, vendor engines, whole viewers or the archive. Import a current adapter when its behavior fits; a new adapter can compose the shared character API when it does not. Read the actual loader, factory contract and update order before composing them. Never run two pose owners on the same character instance; resets in one can erase another's morphs or bones.

Default to exactly five-second, absolute-time loops, matching endpoints and reversible seeking. A different duration requested by the user must be applied consistently to the transport, pose envelope, controls, metadata and checks. Preserve user camera control, reduced-motion behavior, selection and surface-following labels where relevant. Keep the existing art direction unless the experiment explicitly tests an alternative.

## Compare and finish

For a material, geometry or lighting hypothesis, compare matched identity, time, camera and crop while changing only the intended variable. For a new performance, inspect its silhouette and local action through actual playback, not just a rest/peak sheet. Facial work needs a face at least 450 pixels high in front, profile and three-quarter views; hands need visible palm attachments, joint arcs and digit contacts.

Give every requested study direct route and motion coverage. Existing tests enumerate known IDs; a green run does not establish that a new route was exercised. Test the new viewer or adapter explicitly, including endpoints, reverse seeking, finite evaluated vertices/normals, moving selection and mobile framing. Run existing viewer checks when shared modules change. Documentation-only work needs link checks, not geometry suites.

Record actual repairs, inspected frames, browser conditions and unresolved limits. Link fresh evidence to its source revision without presenting concept images, older QA or subjective scores as new proof. Deliver the runnable route, source changes, prompts and experiment record. Add a home-page entry or portable-bundle inclusion when requested or needed to expose the new set; do not silently replace the product launcher. Do not publish, install unrelated tools or export video merely because an experiment was requested.
