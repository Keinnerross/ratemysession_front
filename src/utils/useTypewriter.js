'use client';
import { useState, useEffect } from 'react';

/**
 * Custom hook for typewriter effect
 * @param {string[]} phrases - Array of phrases to cycle through
 * @param {number} typingSpeed - Speed of typing in milliseconds (default: 100ms)
 * @param {number} deletingSpeed - Speed of deleting in milliseconds (default: 50ms)
 * @param {number} pauseTime - Pause time after completing a phrase (default: 2000ms)
 * @returns {string} Current text to display
 */
export function useTypewriter(
  phrases = [],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
) {
  const [currentText, setCurrentText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    const currentPhrase = phrases[currentPhraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
}
