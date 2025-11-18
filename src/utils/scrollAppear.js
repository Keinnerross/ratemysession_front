'use client';
import { useEffect, useRef } from 'react';

export function useScrollAppear(ref, onVisible, onHidden, delayThreshold = 0.3, delayMs = 0) {
  // Store callbacks in refs to prevent observer recreation
  const onVisibleRef = useRef(onVisible);
  const onHiddenRef = useRef(onHidden);

  // Update refs when callbacks change
  useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  useEffect(() => {
    onHiddenRef.current = onHidden;
  }, [onHidden]);

  useEffect(() => {
    let timeoutId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          if (entry.intersectionRatio > delayThreshold) {
            onVisibleRef.current();
          } else if (entry.intersectionRatio === 0) {
            onHiddenRef.current();
          }
        }, delayMs);
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, delayThreshold, delayMs]);
}