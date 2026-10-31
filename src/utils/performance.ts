// ---------------------------------------------------------------------------
// LAZY LOAD WITH RETRY (React-specific)
// ---------------------------------------------------------------------------

import { lazy } from "react";

export function lazyWithRetry<T extends React.ComponentType>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
  initialDelay = 1000,
): ReturnType<typeof lazy> {
  return lazy(
    () =>
      new Promise((resolve, reject) => {
        let attempts = 0;

        const attemptLoad = () => {
          factory()
            .then(resolve)
            .catch((error) => {
              attempts++;
              if (attempts <= retries) {
                const delay = initialDelay * 2 ** (attempts - 1);
                console.warn(`[LazyLoad] Retry ${attempts}/${retries} for component in ${delay}ms`, error);
                setTimeout(attemptLoad, delay);
              } else {
                reject(error);
              }
            });
        };

        attemptLoad();
      }),
  );
}
