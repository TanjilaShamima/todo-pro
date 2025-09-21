"use client";

import { useEffect } from "react";

function MSWLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
    if (!useMocks) {
      if (!window.__msw_ready) {
        window.__msw_ready = true;
        window.dispatchEvent(new Event("msw:ready"));
      }
      return;
    }
    import("@/@mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        window.__msw_ready = true;
        window.dispatchEvent(new Event("msw:ready"));
      })
    );
  }, []);
  return null;
}

export default MSWLoader;
