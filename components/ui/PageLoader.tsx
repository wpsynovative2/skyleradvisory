"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";

/**
 * Brand preloader shown on first paint. It hides once the window `load`
 * event fires (or after a short ceiling, so a slow third-party asset can
 * never trap the visitor behind the overlay).
 */
export default function PageLoader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const finish = () => setDone(true);

    if (document.readyState === "complete") {
      const t = window.setTimeout(finish, 450);
      return () => window.clearTimeout(t);
    }

    window.addEventListener("load", finish);
    const ceiling = window.setTimeout(finish, 4000);
    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(ceiling);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    document.body.style.removeProperty("overflow");
    const t = window.setTimeout(() => setHidden(true), 600);
    return () => window.clearTimeout(t);
  }, [done]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[200] grid place-items-center bg-white transition-opacity duration-500 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <Loader size={120} variant="brand" label="Loading Skyler Advisory" />
        <p className="font-display text-lg tracking-[0.3em] text-navy">SKYLER</p>
      </div>
    </div>
  );
}
