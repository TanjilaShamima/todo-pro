'use client';

import { useEffect } from "react";

function MSWLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/@mocks/browser").then(({ worker }) =>
        worker.start({ onUnhandledRequest: "bypass" })
      );
    }
  }, []);
  return null;
}

export default MSWLoader;