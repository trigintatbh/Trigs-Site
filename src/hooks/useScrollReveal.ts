import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Watches every element with the `.reveal` class currently in the DOM and
 * adds `.reveal--visible` once it scrolls into view, triggering the CSS
 * fade/rise transition defined in index.css. Re-scans on route change so
 * newly-mounted pages pick up their own reveal elements.
 */
export function useScrollReveal() {
    const location = useLocation();

    useEffect(() => {
        const elements = Array.from(
            document.querySelectorAll<HTMLElement>(".reveal:not(.reveal--visible)")
        );
        if (elements.length === 0) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            elements.forEach((el) => el.classList.add("reveal--visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal--visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [location.pathname]);
}
