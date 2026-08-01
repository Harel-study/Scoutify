import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for delayed loading state with minimum visible duration.
 *
 * 1. Prevents flicker: Only shows loading screen if loading exceeds `delay` (default: 100ms).
 * 2. Minimum visible duration: Once displayed, stays visible for at least `minDuration` (default: 900ms)
 *    to prevent unpleasant quick flashes if the server responds shortly after the 100ms threshold.
 *
 * @param isLoading Actual loading status from API or router
 * @param delay Delay threshold in ms before showing overlay (default: 100ms)
 * @param minDuration Minimum duration in ms the overlay remains visible once shown (default: 900ms)
 * @returns boolean state indicating whether to render the loading overlay
 */
export function useDelayedLoading(
  isLoading: boolean,
  delay: number = 100,
  minDuration: number = 900
): boolean {
  const [shouldShowOverlay, setShouldShowOverlay] = useState<boolean>(false);
  const showTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let delayTimer: number | NodeJS.Timeout;
    let minDurationTimer: number | NodeJS.Timeout;

    if (isLoading) {
      // Start delay timer before showing loader
      delayTimer = setTimeout(() => {
        showTimeRef.current = Date.now();
        setShouldShowOverlay(true);
      }, delay);
    } else {
      // Loading finished: check if loader was displayed
      if (showTimeRef.current !== null) {
        const elapsedTime = Date.now() - showTimeRef.current;
        const remainingTime = Math.max(0, minDuration - elapsedTime);

        minDurationTimer = setTimeout(() => {
          setShouldShowOverlay(false);
          showTimeRef.current = null;
        }, remainingTime);
      } else {
        // Loader was never shown because loading finished before delay threshold
        setShouldShowOverlay(false);
      }
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (minDurationTimer) clearTimeout(minDurationTimer);
    };
  }, [isLoading, delay, minDuration]);

  return shouldShowOverlay;
}

export default useDelayedLoading;
