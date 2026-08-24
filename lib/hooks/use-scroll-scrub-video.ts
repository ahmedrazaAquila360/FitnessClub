"use client";

import { useEffect, useState, type RefObject } from "react";
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
  threshold?: number;
};

/**
 * Pins the hero section and maps scroll progress directly onto the video's
 * timeline (paused, scroll-controlled — never `play()`d). Uses a
 * targetTime/renderedTime render loop instead of seeking on every raw
 * ScrollTrigger update, since this asset only has ~1 keyframe/0.25s and
 * naive seeking on every tick stutters badly.
 *
 * Mobile and reduced-motion never mount the video at all (see `showVideo`) —
 * scroll-driven seeking is heavy enough to hang low-powered phones, so those
 * get a plain static background image instead.
 */
export function useScrollScrubVideo({
  sectionRef,
  videoRef,
  fadeRef,
  end = "+=2200",
  textFadeEnd = 0.22,
  smoothing = 0.12,
  threshold = 0.01,
}: UseScrollScrubVideoOptions) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowVideo(!isMobile && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !showVideo) return;

    let duration = 0;
    let targetTime = 0;
    let renderedTime = 0;
    let rafId = 0;

    const initDuration = () => {
      duration = video.duration || 0;
    };

    if (video.readyState >= 1) {
      initDuration();
    } else {
      video.addEventListener("loadedmetadata", initDuration, { once: true });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end,
          pin: true,
          pinType: "transform",
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            targetTime = self.progress * duration;
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

    const renderVideo = () => {
      renderedTime += (targetTime - renderedTime) * smoothing;
      renderedTime = Math.min(Math.max(renderedTime, 0), duration || renderedTime);
      if (Math.abs(video.currentTime - renderedTime) > threshold) {
        video.currentTime = renderedTime;
      }
      rafId = requestAnimationFrame(renderVideo);
    };
    rafId = requestAnimationFrame(renderVideo);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", initDuration);
      ctx.revert();
    };
  }, [sectionRef, videoRef, fadeRef, end, textFadeEnd, smoothing, threshold, showVideo]);

  return { showVideo };
}
