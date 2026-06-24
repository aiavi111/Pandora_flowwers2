'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global, dependency-free scroll-reveal.
 * Any element with `data-reveal` fades/rises into view once.
 * Add `style={{ transitionDelay }}` for staggered groups.
 * Fully disabled under prefers-reduced-motion (handled in CSS).
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveal = (el: Element) => el.classList.add('is-visible');

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));
    if (reduce) { els.forEach(reveal); return; }

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { reveal(e.target); obs.unobserve(e.target); }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    els.forEach((el) => {
      // Elements already in viewport on load reveal immediately (no flash).
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) reveal(el);
      else io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
