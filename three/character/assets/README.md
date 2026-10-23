# Shared adult character assets

FORM and MUSE use the same authored, skinned human mesh and identity. The mesh is derived from MakeHuman system assets, with joint-aware skin weights, continuous hands and feet, embedded skin and eye textures, and textured flowing hair. This is an illustrative character, not a scan of Sydney Sweeney or a medically validated anatomical model.

## Source and permission

The source exports were retrieved on 2026-10-23 from [Kasper Olesen's CharacterCreator](https://github.com/kblood/CharacterCreator/tree/852e48f316b90a0937234886630e4fb4cdfd1f78), commit `852e48f316b90a0937234886630e4fb4cdfd1f78`.

The author's [asset-specific license notes](https://github.com/kblood/CharacterCreator/blob/852e48f316b90a0937234886630e4fb4cdfd1f78/LICENSE-NOTES.md#generated-files-owner-decision-2026-10-03) explicitly release generated body, hair, morph, texture and JSON data under **CC0 1.0** when all source data is CC0. The listed MakeHuman system assets are CC0. The local [license notes](licenses/CharacterCreator-LICENSE-NOTES.md), [upstream asset inventory](licenses/MakeHuman-asset-licenses.json) and [download audit](licenses/source-audit.json) retain the evidence. [CC0 1.0 public-domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

CharacterCreator's generator and runtime code have a separate GPL-3.0-or-later license. That code is not imported into this application. The local character adapter and material implementation are new code that consumes standard glTF asset data.

## Included data

| Local file | Upstream data | License |
|---|---|---|
| `adult-female-source.glb` | `output/base_body.glb`, extended locally with the official MakeHuman expression-unit data documented alongside its build | CC0-1.0 |
| `hair-long.glb` | `output/hair_long01.glb`, unchanged source bytes | CC0-1.0 |
| `body-joints.json` | `output/base_body.joints.json`, unchanged source bytes | CC0-1.0 |

The source skin is MakeHuman `young_caucasian_female`; accessories are `eyes/high-poly`, `lightblue`, `eyebrow001`, `eyelashes01`, `teeth_base`, `tongue01` and `hair/long01`. All texture images are embedded in the GLBs. No source photograph, celebrity photograph or external rendered portrait is shipped.

The unextended source body has 14,517 render vertices and 26,756 triangles. Its face accessories bring the source total to 36,924 triangles. The rig contains 53 bones, including three joints for each finger. The source's 92 shape targets cover body and face proportions, blink and gaze. Local expression targets extend the same topology; the app retains one fixed adult female identity across its views.

The additional 52 expression targets are from Mika Suominen's official [MakeHuman Face Units 01 pack](https://static.makehumancommunity.org/assets/assetpacks/faceunits01.html), whose pack index explicitly marks every target CC0. The [downloaded archive](https://files2.makehumancommunity.org/functional/faceunits01.zip) has SHA-256 `d113107bd7eb59f3af4df6fc0ec29bfcc593f496d0b336aec14f086a80ce7146`. The local build maps those targets to the base mesh through matching UV coordinates and fits accessories using their MakeHuman proxy weights. The [official asset-pack overview](https://static.makehumancommunity.org/assets/assetpacks.html) identifies this functional asset collection as CC0. The selected source inputs and complete CC0 text are preserved beside the derivative build.

## Material treatment and limits

`../materials.mjs` creates independent material instances while preserving the source maps. It applies restrained normal strength, blue iris tint, ash/honey blonde hair and a quiet gray bodysuit material. Skin uses physically based lighting with a small diffuse-wrap approximation; it is **not** volumetric subsurface scattering. Hair uses alpha-cutout textured geometry; eyebrows and eyelashes use soft alpha blending. The hair surface receives two restrained Loop-subdivision passes after the identity is applied, retaining its UVs, skin weights and source texture. Authored longitudinal fiber shading adds 6.5% tonal variation, with derivative-based fading of each frequency below pixel scale. The source GLB bytes remain unchanged. This is a textured hair mesh, rather than a simulated strand groom. These implementation details are kept here instead of the viewer's interface.

Original download SHA-256 values and byte sizes are recorded in [source-audit.json](licenses/source-audit.json). The derivative body has different bytes because expression targets and their provenance were added. Front, profile and three-quarter render inspection is recorded separately under `qa/`; source topology and a successful load do not by themselves certify visual quality.
