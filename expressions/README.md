# MUSE — The language of a face

A separate Three.js facial-expression explorer alongside [FORM / Anatomy](../three/index.html). One original adult woman performs **eight five-second studies**: joy, sadness, anger, fear, surprise, disgust, wink and laughter. The accepted SVG collection remains unchanged.

[Open MUSE](index.html) · [Portable source bundle](../exports/form-and-muse-threejs.zip) · [Facial anatomy sources](SOURCES.md)

## Run locally

From the project root, run `npm start` and open **http://127.0.0.1:4173/expressions/**. All browser dependencies are included locally in the sibling three/ directory. Keep expressions/ and three/ together and serve over HTTP.

## Inspect the movement

Choose an expression and follow its five-second action. Pause, restart or scrub any pose; select a label or facial feature to read its role. Drag to orbit, use Front or Profile, or frame a selected feature. Manual camera gestures stop guidance; explicitly enable Guided camera to resume it. Reduced motion starts paused, and hidden tabs stop advancing.

The names describe authored acting poses. This illustrated portrait is not a scan, a clinical anatomical model, or a system for inferring internal emotion. Highlights mark the selected feature; they do not show measured muscle activation.

## Source and reproduction

- [face.mjs](face.mjs): native portrait geometry, features and coordinated expression poses.
- [app.mjs](app.mjs): renderer, camera, selection, anchored labels and five-second playback.
- [manifest.json](manifest.json): complete reproducible prompts, phases and feature descriptions.
- [Shared Three.js engine](../three/vendor/LICENSE): bundled MIT-licensed engine and controls.
- [Browser checks](../qa/expressions/checks.json), [unpaused playback](../qa/expressions/playback.json) and [visual review](../qa/expressions/art-review.json).

Repository maintenance commands (install the pinned dependencies with `npm ci` first):

~~~sh
npm run catalog:expressions
npm run check:expressions
npm run playback:expressions
npm run bundle:three
~~~

## Corpus prompts

### joy — A quiet joy

[Open expression](index.html#joy) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105196.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Raise the mouth corners into a quiet smile. Lift the cheeks and soften the lower eyelids together; keep the upper lip and chin volumes coherent. Let the face settle gently back to neutral.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Smile: The mouth corners lift and widen while the cheeks rise into the lower lids. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### sadness — A tender sadness

[Open expression](index.html#sadness) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105197.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Raise the inner eyebrows while the outer brows relax. Turn the mouth corners slightly downward, soften the eyelids and lower the chin just enough to support a tender, restrained acting pose.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Feel: The inner brows rise and draw together; the mouth corners fall and the gaze softens. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### anger — Contained anger

[Open expression](index.html#anger) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105198.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Draw the eyebrows down and inward, narrow the eyelid openings and press the lips. Preserve a composed face with readable tension, avoiding grotesque distortion or detached brow shapes.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Focus: The inner brows draw down toward the bridge; the lids narrow and the lips press together. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### fear — A moment of fear

[Open expression](index.html#fear) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105199.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Raise and draw together the brows, widen the eyes, stretch the mouth corners slightly sideways and part the lips with a small jaw release. Coordinate the features so this differs clearly from surprise.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Startle: Raised inner brows and widened eyes accompany a stretched, slightly open mouth. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### surprise — Open wonder

[Open expression](index.html#surprise) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105200.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Lift both brows, open both eyelid apertures and lower the jaw into a rounded mouth opening. Maintain a convincing mouth cavity and attached lip, chin and cheek surfaces through the strongest pose.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Wonder: Both brows lift, the upper lids rise and the jaw opens beneath a rounded mouth. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### disgust — A passing distaste

[Open expression](index.html#disgust) · [Editable portrait](face.mjs)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Lift the upper lip asymmetrically, tighten the nose and lower brow region, and gently narrow the eyes. Use a fleeting, restrained recoil with a coherent nasal and cheek surface.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Recoil: The upper lip rises asymmetrically and the nose wings lift; the eyes narrow with the cheek. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### wink — A knowing wink

[Open expression](index.html#wink) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105203.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Close one eyelid aperture fully, hide the iris behind the lid, lift the same cheek and add a small asymmetric smile. Keep the opposite eye open; reopen the closed eye smoothly before recovering neutral.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Wink: One aperture closes fully over its iris. The same cheek lifts into a small asymmetric smile. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.

### laughter — Uncontained delight

[Open expression](index.html#laughter) · [Editable portrait](face.mjs) · [SVG acting reference](../corpus/animated/105202.svg)

Create an original elegant adult woman as a native Three.js sculptural portrait, with balanced facial proportions, a continuous modeled face, swept hair, actual eye and mouth openings, and a modest clothed shoulder bust. Use quiet warm porcelain surfaces, restrained lips and irises, and a dark studio stage. Keep the same identity across every expression. Animate exactly five seconds: neutral, preparation, a readable expression, a short hold, recovery and the identical neutral endpoint. Coordinate brow, eyelid, cheek, lip and jaw geometry. Preserve clean occlusion, anatomical attachments and clean silhouettes from front, three-quarter and profile views. Provide selectable facial features, source-backed explanatory labels, a seekable timeline and a guided camera that yields immediately to manual orbit. Open a broad smile with raised cheeks, softened eyes and a visible jaw release. Add a restrained head lift. Make the mouth and lips remain convincing from the profile camera, and return to the shared neutral portrait.

**Action:** Presence: A quiet neutral portrait establishes the same identity across every expression. Gather: The first changes begin around the eyes and mouth, with the surrounding face following. Laugh: The jaw releases beneath an open smile; lifted cheeks narrow both eyes and the head rises gently. Release: The features recover together without changing the identity or resetting abruptly. Rest: The original neutral pose returns and holds through the matching five-second endpoint.
