"use client";
import { useEffect, useState } from "react";

declare global {
    interface Window { __msw_ready?: boolean }
}

export function useMswReady() {
    const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
    const initialReady = process.env.NODE_ENV !== "development" || !useMocks;
    const [ready, setReady] = useState(initialReady);
    useEffect(() => {
        // Only wait for MSW ready event when in dev AND mocks are enabled
        if (process.env.NODE_ENV !== "development" || !useMocks) return;
        function onReady() {
            setReady(true);
        }
        if (window.__msw_ready) setReady(true);
        window.addEventListener("msw:ready", onReady);
        return () => window.removeEventListener("msw:ready", onReady);
    }, [useMocks]);
    return ready;
}
