# UNIVERSAL SCROLL-SCRUB SKILL
## Final Production Standard — GSAP + Lenis + ScrollTrigger

Version: 2.0
Purpose: Reusable skill for premium scroll-driven animations and cinematic scroll-controlled video across Next.js/React projects.

---

## 1. OBJECTIVE

Create cinematic scroll interactions where the user's scroll position directly controls the visual timeline.

For scroll-controlled media:

USER SCROLL
→ ScrollTrigger progress
→ target animation state
→ controlled render loop
→ video/canvas frame

Required UX:
- No unwanted autoplay.
- No unwanted audio.
- Slow scroll = slow visual progress.
- Fast scroll = fast visual progress.
- Stop scrolling = visual stops at that state.
- Reverse scroll = animation reverses naturally.

---

## 2. PREFERRED STACK

- Next.js
- React
- TypeScript
- GSAP
- GSAP ScrollTrigger
- Lenis
- Tailwind CSS or the project's existing styling system

Use Framer Motion only for simple UI/state animation when it already exists.
Use GSAP + ScrollTrigger for complex scroll-driven timelines.

Do not introduce another animation library without a specific technical reason.

---

## 3. INSPECT BEFORE IMPLEMENTING

Before writing code:
1. Inspect the existing project architecture.
2. Check whether GSAP is installed.
3. Check whether Lenis is installed.
4. Find existing ScrollTrigger utilities.
5. Find existing Framer Motion animation components.
6. Find the global layout/app entry point.
7. Find the existing global Lenis instance.
8. Inspect the target hero/section.
9. Inspect existing responsive behavior.
10. Reuse existing animation infrastructure.

Never create duplicate Lenis, GSAP, ScrollTrigger, providers, or scroll listeners when an existing implementation can be reused.

---

## 4. LENIS ARCHITECTURE

Use ONE global Lenis instance.

Preferred:

App
└── Global Lenis
    ├── Header
    ├── Hero
    ├── Sections
    └── Footer

Do not instantiate Lenis inside individual animated sections.

Synchronize Lenis with GSAP's ticker/ScrollTrigger.

Multiple smooth-scroll systems can cause jitter, incorrect pinning, inaccurate progress, and excessive CPU usage.

---

## 5. SCROLLTRIGGER

Use ScrollTrigger for:
- pinning
- scrubbing
- parallax
- timelines
- horizontal scrolling
- cinematic media
- progressive reveals
- section transitions

For direct scroll mapping, use `ease: "none"` unless a deliberate easing effect is required.

---

# 6. CRITICAL: SCROLL-SCRUBBED VIDEO IS NOT A NORMAL VIDEO PLAYER

Do NOT use `video.play()` as the scroll interaction.

Do NOT autoplay.
Do NOT loop.
Do NOT allow audio.

The video should remain paused while scroll controls its timeline.

Mapping:

0% → first frame
25% → 25% of duration
50% → 50% of duration
75% → 75% of duration
100% → final frame

Scrolling upward must reverse the timeline.

The user should feel:
“MY SCROLL IS CONTROLLING THIS VIDEO.”

---

# 7. NEVER SEEK DIRECTLY ON EVERY RAW SCROLL UPDATE

Avoid:

`video.currentTime = progress * duration`

on every raw scroll event/update without control.

This can cause:
- stuttering
- frame drops
- decode pressure
- hanging/frozen frames
- high CPU usage
- delayed rendering

Use two states:

- `targetTime`
- `renderedTime`

ScrollTrigger updates `targetTime`.
A `requestAnimationFrame` loop moves `renderedTime` toward `targetTime`.

Architecture:

ScrollTrigger
→ targetTime
→ requestAnimationFrame
→ controlled interpolation/seek
→ video.currentTime
→ rendered frame

The system must remain responsive and must not introduce obvious input lag.

---

# 8. CONTROLLED VIDEO RENDER LOOP

Use a dedicated render loop.

Conceptual pattern:

```ts
let targetTime = 0;
let renderedTime = 0;

function renderVideo() {
  const difference = targetTime - renderedTime;

  renderedTime += difference * smoothing;

  if (Math.abs(difference) > threshold) {
    video.currentTime = renderedTime;
  }

  requestAnimationFrame(renderVideo);
}

requestAnimationFrame(renderVideo);
```

Treat this as architecture guidance, not a fixed copy-paste implementation.

Tune:
- smoothing
- threshold
- pin distance
- video FPS
- encoding

Required behavior:
- fast scroll → fast response
- slow scroll → smooth response
- stop → settles at the current visual
- reverse → reverses naturally

---

# 9. VIDEO METADATA: HANDLE BOTH LOAD CASES

Never assume duration is immediately available.

Handle:

1. `loadedmetadata` has not fired → attach a listener.
2. Metadata is already loaded before the listener is attached → check `readyState` and initialize immediately.

This prevents the hero from becoming permanently stuck on the poster because a cached response caused the metadata event to be missed.

---

# 10. VIDEO ENCODING

`faststart` is important but is NOT sufficient for smooth scrubbing.

A previous failure can occur when the MP4 `moov` atom is at the end of the file.

Use:

```bash
ffmpeg -i input.mp4 -movflags +faststart output.mp4
```

Then also verify:
- codec
- FPS
- resolution
- bitrate
- keyframe/GOP interval
- duration
- file size
- browser seeking behavior

A correct `moov` atom only fixes metadata/index placement. It does not guarantee smooth frame seeking.

---

# 11. WEB-OPTIMIZED SCRUB VIDEO

Preferred starting target:
- H.264
- 24–30 FPS
- up to 1920x1080 for most desktop heroes
- reasonable bitrate
- frequent keyframes
- faststart
- no audio
- web-optimized file size

Example:

`public/videos/hero-scrub.mp4`

If the original video is not suitable for interactive seeking, create a dedicated scrub version.

---

# 12. REMOVE AUDIO

If a generated hero video contains music/audio, remove it from the scroll asset unless sound is explicitly required.

Benefits:
- smaller file
- no unexpected audio
- no autoplay audio problems
- cleaner UX

The scroll hero should normally be silent.

---

# 13. VIDEO ELEMENT

Recommended:

```tsx
<video
  muted
  playsInline
  preload="auto"
  aria-hidden="true"
/>
```

Do not show controls.
Do not autoplay.
Do not loop.
Keep the video paused.

---

# 14. HERO PINNING

Preferred cinematic sequence:

Enter hero
→ first frame visible
→ hero pins
→ scroll controls video
→ final frame
→ hero unpins
→ next section

Use ScrollTrigger:
- trigger
- start
- end
- pin
- scrub

Choose a sensible scroll distance. Do not make the pinned section unnecessarily long.

---

# 15. HERO TEXT

Initial:
- headline visible
- subtitle visible
- CTA visible

During the early portion of the hero scroll:
- headline fades
- subtitle fades
- CTA fades
- visual becomes dominant

The animation must be reversible when scrolling upward.

Keep text as real HTML, not baked into the video.

---

# 16. FLOATING CARDS

Cards should feel alive but premium.

Use:
- subtle vertical drift
- small rotation
- subtle scale
- depth/parallax
- hover interaction
- staggered timing

Avoid:
- aggressive bouncing
- synchronized movement
- large constant motion
- distracting animation

Cards should float, not bounce.

---

# 17. ANIMATE ALL MAJOR SECTIONS INTENTIONALLY

Examples:

Hero:
- cinematic reveal
- scroll scrub
- text fade
- parallax

Services:
- staggered cards
- floating cards
- hover interaction

About:
- image reveal
- text reveal
- subtle parallax

Products:
- image movement
- hover scale
- stagger

Testimonials:
- card reveal
- subtle floating
- controlled carousel

Gallery:
- image reveal
- parallax
- hover

CTA:
- background movement
- reveal
- subtle floating visuals

Animation must support hierarchy and storytelling.

---

# 18. DO NOT OVER-ANIMATE

Avoid:
- everything moving simultaneously
- excessive scale/blur/rotation
- random movement
- constant infinite animations everywhere
- motion that hurts readability
- motion that slows navigation

Premium motion is controlled and intentional.

---

# 19. MOBILE

Test real mobile behavior.

For mobile:
- keep scrolling usable
- reduce animation complexity if needed
- reduce pin distance if needed
- prevent horizontal overflow
- keep video silent
- use a mobile video or poster fallback where appropriate
- reduce resolution for low-powered devices

If video scrubbing is not performant on mobile, use a static poster or simplified animation rather than damaging the whole experience.

---

# 20. REDUCED MOTION

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:
- disable cinematic scrubbing
- disable excessive parallax
- disable unnecessary floating animations
- show a static poster/hero state
- preserve all content and functionality

---

# 21. CLEANUP

Every GSAP/ScrollTrigger setup must be cleaned up on unmount.

Prevent:
- duplicate triggers
- duplicate timelines
- stale references
- memory leaks
- animation stacking

Use GSAP context/proper cleanup.

React Strict Mode must not duplicate animations.

---

# 22. RESIZE

When viewport/layout changes:
- keep pinning accurate
- keep video dimensions correct
- refresh ScrollTrigger when necessary
- resize canvas/image sequences correctly

Do not repeatedly call expensive refresh operations unnecessarily.

---

# 23. WHEN MP4 IS STILL NOT SMOOTH ENOUGH

If optimized MP4 scrubbing still produces:
- frame jumps
- stuttering
- delayed seeking
- inconsistent frame rendering

switch to Canvas + Image Sequence.

Architecture:

ScrollTrigger progress
→ frame index
→ canvas
→ `drawImage(frame)`

This gives deterministic frame-by-frame control and is often better for highly cinematic hero sequences.

Use this for:
- product rotations
- cinematic product reveals
- precise scroll storytelling
- high-precision frame animation

Do not use it unnecessarily because image sequences increase asset complexity and memory usage.

---

# 24. IMAGE-SEQUENCE STRATEGY

For Canvas sequences:
1. Show the first frame immediately.
2. Preload strategically.
3. Load remaining frames progressively.
4. Map scroll progress to frame index.
5. Draw only the required frame.
6. Resize canvas responsively.
7. Avoid loading hundreds of full-resolution frames simultaneously.

Use WebP/AVIF/JPEG as appropriate.

---

# 25. FALLBACK HIERARCHY

Preferred:

Desktop:
→ optimized scroll video

Mobile:
→ optimized mobile video OR poster

Low-performance device:
→ poster/simplified animation

Reduced motion:
→ poster/static hero

Network failure:
→ poster

The website must remain functional without animation.

---

# 26. ADMIN/CMS SUPPORT

If the project has an admin panel, make appropriate animation settings configurable.

Possible settings:
- enable/disable scroll animation
- desktop video
- mobile video
- poster
- scroll distance
- text fade progress
- animation intensity
- overlay opacity
- fallback mode

Do not hard-code CMS-managed values.

For uploaded videos, validate and normalize them automatically when possible.

---

# 27. VIDEO UPLOAD PIPELINE

Preferred:

Upload
→ validate
→ inspect metadata
→ FFmpeg normalization
→ H.264 web output
→ faststart
→ remove audio if required
→ optimize keyframes
→ store final asset
→ save URL

Do not require developers to manually remember video processing for every upload when the project has an admin/upload pipeline.

---

# 28. JSON / CONFIG-DRIVEN ANIMATION

Where appropriate:

```ts
const scrollConfig = {
  enabled: true,
  pin: true,
  start: "top top",
  end: "+=1800",
  scrub: true,
  textFadeEnd: 0.2,
  parallaxIntensity: 0.15,
  videoScrub: true
};
```

Adapt the schema to the existing project.

Do not expose technical controls to admins unless they have a real business use.

---

# 29. REUSABLE COMPONENT

A reusable component can expose:

```ts
type ScrollScrubVideoProps = {
  src: string;
  poster?: string;
  mobileSrc?: string;
  start?: string;
  end?: string;
  pin?: boolean;
  scrub?: boolean | number;
  textFade?: boolean;
  className?: string;
};
```

The component should:
- handle metadata
- handle cached metadata
- remain paused
- calculate target time
- render smoothly
- clean up GSAP
- handle resize
- support fallback
- support reduced motion

Adapt the API to the existing codebase rather than forcing a new architecture.

---

# 30. NEXT.JS RULES

Keep server-rendered content server-rendered where possible.

Isolate animation into client components.

Preferred:

Homepage Server Component
→ Hero content
→ Client ScrollScrubVideo

Do not make the entire homepage a client component just because one hero uses GSAP.

---

# 31. COMMON FAILURE MODES AND FIXES

### A. Poster never changes
Likely:
- metadata unavailable
- duration unavailable
- missed `loadedmetadata`

Fix:
- check `readyState`
- listen for `loadedmetadata`
- initialize immediately when metadata already exists

### B. Video loads but hangs during scrolling
Likely:
- seeking on every update
- heavy MP4
- poor keyframe interval
- excessive currentTime writes

Fix:
- targetTime/renderedTime
- requestAnimationFrame
- controlled seeking
- optimized encoding

### C. Hero behaves like a normal playing video
Likely:
- `play()`
- autoplay
- loop

Fix:
- keep paused
- control `currentTime` only

### D. Scrub feels delayed
Likely:
- excessive interpolation
- excessive Lenis smoothing
- huge pin distance

Fix:
- reduce interpolation delay
- tune Lenis
- reduce pin distance

### E. Scroll jumps
Likely:
- multiple Lenis instances
- duplicate ScrollTriggers
- conflicting scroll listeners
- layout changes during pin

Fix:
- one global Lenis
- clean GSAP contexts
- remove duplicate listeners
- refresh after layout stabilization

### F. Desktop works but mobile stutters
Likely:
- heavy decode
- excessive GPU work
- large canvas/image sequence

Fix:
- mobile asset
- lower resolution
- poster fallback
- simplified animation

---

# 32. PERFORMANCE TESTING

Do not declare success because the video:
- exists
- returns HTTP 200
- loads metadata
- changes currentTime

Actually test:
1. slow scrolling
2. continuous scrolling
3. fast scrolling
4. forward/backward scrolling
5. stopping halfway
6. repeated entry/exit
7. refresh
8. desktop
9. mobile

Check:
- frame jumps
- stutter
- frozen frames
- delayed response
- CPU/memory
- Lenis conflicts
- ScrollTrigger conflicts
- layout shifts
- long tasks

Use Chrome DevTools Performance when needed.

---

# 33. DO NOT BREAK THE EXISTING PROJECT

When adding this skill:
- do not redesign unrelated sections
- do not replace branding
- do not replace CMS/database
- do not replace existing animation infrastructure without reason
- do not change unrelated content

Implement the requested animation within the current architecture.

---

# 34. FINAL IMPLEMENTATION WORKFLOW

When an AI coding agent receives this skill:

1. Inspect the existing app.
2. Inspect current animation/scroll architecture.
3. Reuse global GSAP/Lenis infrastructure.
4. Do not create duplicate Lenis/ScrollTrigger.
5. Inspect the video asset.
6. Verify metadata and encoding.
7. Apply faststart if needed.
8. Remove audio for visual scrub assets.
9. Implement ScrollTrigger progress mapping.
10. Update targetTime rather than aggressively seeking on every raw scroll event.
11. Use a controlled requestAnimationFrame render loop.
12. Keep the video paused.
13. Implement pinning.
14. Implement reversible text animation.
15. Add mobile/fallback behavior.
16. Test slow scroll.
17. Test continuous scroll.
18. Test fast scroll.
19. Test reverse scroll.
20. Test stopping halfway.
21. Test mobile.
22. Profile performance if necessary.
23. Only declare complete after the interaction is genuinely smooth.

---

# 35. LESSONS FROM PREVIOUS IMPLEMENTATIONS

These mistakes MUST NOT be repeated.

### Mistake 1
Assuming `faststart` alone guarantees smooth scrubbing.

Correct:
Faststart fixes MP4 index placement. Encoding, keyframes, seeking frequency, and rendering architecture also matter.

### Mistake 2
Seeking `currentTime` directly on every scroll update.

Correct:
Use targetTime + controlled requestAnimationFrame rendering.

### Mistake 3
Treating the hero as a normal video player.

Correct:
Keep it paused. Scroll controls its timeline.

### Mistake 4
Ignoring metadata race conditions.

Correct:
Handle both `loadedmetadata` and already-ready `readyState`.

### Mistake 5
Creating multiple Lenis instances.

Correct:
Use one global Lenis instance.

### Mistake 6
Calling it fixed because HTTP 200 works.

Correct:
Test actual visual smoothness under continuous, fast, slow, forward, and reverse scrolling.

### Mistake 7
Keeping generated audio.

Correct:
Remove audio from visual hero scrub assets unless sound is explicitly required.

### Mistake 8
Ignoring mobile.

Correct:
Provide mobile/fallback behavior and test it.

### Mistake 9
Over-animating.

Correct:
Premium animation should feel controlled, smooth, and intentional.

---

# 36. DEFINITION OF DONE

The feature is complete only when:

User enters
→ first frame appears
→ user scrolls
→ hero pins smoothly
→ visual responds immediately
→ video progresses smoothly
→ no obvious stutter
→ no autoplay
→ no audio
→ stopping scroll stops the visual state
→ reverse scroll reverses the animation
→ final frame is reached
→ hero unpins cleanly
→ next section continues normally

The final experience must feel like:

“THE USER IS DIRECTING THE ANIMATION WITH THEIR SCROLL.”

That is the quality standard for every project using this skill.
