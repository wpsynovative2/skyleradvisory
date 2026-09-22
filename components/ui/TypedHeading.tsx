"use client";

import { useEffect, useRef, useState } from "react";

type Heading = { prefix: string; typed: string; suffix?: string };

type TypedHeadingProps = {
  heading: Heading;
  className?: string;
  prefixClassName?: string;
  typedClassName?: string;
  /** Milliseconds per character — the original runs at 50. */
  speed?: number;
  /** Delay before typing starts — the original waits 2500ms. */
  delay?: number;
  as?: "h1" | "h2" | "h3";
};

/**
 * Reproduces the site's split headings: a static prefix followed by an accent
 * phrase that types itself in once, then a static suffix.
 *
 * The typed phrase is always present in the DOM (visually hidden behind a
 * clip) so the heading is complete for search engines and screen readers, and
 * the layout never reflows as characters appear.
 */
export default function TypedHeading({
  heading,
  className = "",
  prefixClassName = "",
  typedClassName = "",
  speed = 50,
  delay = 2500,
  as = "h2",
}: TypedHeadingProps) {
  const Tag = as;
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => {
        setStarted(true);
        setCount(heading.typed.length);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [heading.typed.length]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    let interval: number | undefined;

    const startTimer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setCount(index);
        if (index >= heading.typed.length && interval) window.clearInterval(interval);
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(startTimer);
      if (interval) window.clearInterval(interval);
    };
  }, [started, heading.typed, speed, delay]);

  const visible = heading.typed.slice(0, count);
  const pending = heading.typed.slice(count);

  return (
    <Tag ref={ref} className={className}>
      <span className={prefixClassName}>{heading.prefix}</span>{" "}
      <span className={typedClassName}>
        {visible}
        {/* Keeps the full phrase in the accessibility tree and reserves its width */}
        <span aria-hidden="true" className="invisible">
          {pending}
        </span>
      </span>
      {heading.suffix ? <span className={prefixClassName}> {heading.suffix}</span> : null}
    </Tag>
  );
}
