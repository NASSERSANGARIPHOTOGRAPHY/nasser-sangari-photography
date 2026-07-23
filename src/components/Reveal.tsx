"use client";

import { useEffect } from "react";

/**
 * Fades elements in as they scroll into view.
 * Add `className="reveal"` to anything you want animated — no props needed.
 * Mounted once in the root layout; watches for elements added later too.
 */
export function Reveal() {
  useEffect(() => {
    // Tells the failsafe timer in layout.tsx that the app is alive.
    document.documentElement.dataset.hydrated = "1";

    // No IntersectionObserver (very old browser)? Show everything, skip the animation.
    if (typeof IntersectionObserver === "undefined") {
      document.documentElement.classList.remove("js");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    const observeAll = () => {
      document
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));
    };

    observeAll();
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
