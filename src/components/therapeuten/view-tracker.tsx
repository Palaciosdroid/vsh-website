"use client";

import { useEffect } from "react";

export function ViewTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    // Debounce: wait 2 seconds before counting the view
    const timer = setTimeout(() => {
      fetch("/api/therapeuten/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      }).catch(() => {
        // Silently ignore errors
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [profileId]);

  return null;
}
