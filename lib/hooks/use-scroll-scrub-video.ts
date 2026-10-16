"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type UseScrollScrubVideoOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  fadeRef: RefObject<HTMLElement | null>;
  end?: string;
  textFadeEnd?: number;
  smoothing?: number;
};

/**
 * Pins the hero section and maps scroll progress directly onto the video's
 * timeline (paused, scroll-controlled — never `play()`d).
 *
 * Smoothness notes:
 * - The video asset must be encoded with a keyframe on (nearly) every frame
 *   (see public/videos/hero-scrub.mp4). With sparse keyframes every seek has
 *   to decode a whole GOP, which is what makes scrubbing stutter.
 * - Smoothing happens in exactly one place (the lerp below). Lenis already
 *   smooths the scroll itself, so ScrollTrigger uses `scrub: true`.
 * - A new seek is only issued once the previous one finished, so seeks never
 *   queue up behind a slow decode.
 *
 * Teardown: the pin wraps `sectionRef` in a GSAP-created spacer element that
 * React does not know about. It is reverted in a *layout* effect cleanup,
 * which React runs before it removes DOM nodes — a passive `useEffect`
 * cleanup runs after, so React would try to remove a node whose parent had
 * changed and the route transition would throw.
 *
 * Mobile and reduced-motion never mount the video (see `showVideo`) —
 * scroll-driven seeking is heavy enough to hang low-powered phones, so those
 * get a plain static background image instead.
 */
export function useScrollScrubVideo({
  sectionRef,
  videoRef,
  fadeRef,
  end = "+=2200",
  textFadeEnd = 0.22,
  smoothing = 0.2,
}: UseScrollScrubVideoOptions) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- viewport is only known on the client
    setShowVideo(!isMobile && !prefersReducedMotion);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !showVideo) return;

    let duration = 0;
    let targetTime = 0;
    let renderedTime = 0;
    let rafId = 0;
    let running = false;

    const initDuration = () => {
      duration = video.duration || 0;
    };

    if (video.readyState >= 1) {
      initDuration();
    } else {
      video.addEventListener("loadedmetadata", initDuration, { once: true });
    }

    // Half a frame at 24fps — below this a seek would not change what is shown.
    const EPSILON = 1 / 48;

    const renderVideo = () => {
      renderedTime += (targetTime - renderedTime) * smoothing;
      if (Math.abs(targetTime - renderedTime) < EPSILON) renderedTime = targetTime;
      renderedTime = Math.min(Math.max(renderedTime, 0), duration || renderedTime);

      if (!video.seeking && Math.abs(video.currentTime - renderedTime) > EPSILON) {
        video.currentTime = renderedTime;
      }

      // Stop the loop once the video has caught up; the next scroll update
      // restarts it. Avoids a permanent per-frame callback.
      if (renderedTime === targetTime && !video.seeking) {
        running = false;
        return;
      }
      rafId = requestAnimationFrame(renderVideo);
    };

    const kick = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(renderVideo);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end,
          pin: true,
          pinType: "transform",
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            targetTime = self.progress * duration;
            kick();
          },
        },
      });

      if (fadeRef.current) {
        tl.to(fadeRef.current, { opacity: 0, y: -32, ease: "none", duration: textFadeEnd }, 0).to(
          {},
          { duration: 1 - textFadeEnd },
        );
      }
    }, section);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", initDuration);
      ctx.revert();
    };
  }, [sectionRef, videoRef, fadeRef, end, textFadeEnd, smoothing, showVideo]);

  return { showVideo };
}
