"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth scrolling.
 *
 * Lenis animates `scrollTop` rather than transforming the page, so the fixed
 * header and the floating action rail keep working. Anchor links are handled
 * through Lenis too, offset by the header height.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch devices feels better than a simulated one.
      syncTouch: false,
    });

    // CSS smooth-scroll would fight Lenis for control of the same scroll.
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const headerHeight = () => {
      const value = getComputedStyle(root).getPropertyValue("--header-h").trim();
      return parseInt(value, 10) || 86;
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      event.preventDefault();
      // Resolve the destination ourselves: passing a number sidesteps both
      // `scroll-padding-top` and Lenis's own element offset handling, which
      // would otherwise subtract the header height twice.
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight();
      lenis.scrollTo(Math.max(0, top), { duration: 1.4 });
      history.replaceState(null, "", href);
    };

    document.addEventListener("click", onClick);

    // Lenis drives window.scrollTo itself, so `overflow: hidden` on the body
    // does not stop it. The modal, preloader, disclaimer gate and mobile menu
    // all lock scrolling that way, so mirror that lock here.
    const syncLock = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    syncLock();

    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      document.removeEventListener("click", onClick);
      lockObserver.disconnect();
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
