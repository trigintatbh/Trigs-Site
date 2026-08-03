import { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    radius: number;
    baseAlpha: number;
    twinkleSpeed: number;
    twinklePhase: number;
    depth: number; // how strongly this star reacts to parallax (0 = far, 1 = near)
}

interface Meteor {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    length: number;
}

const NUM_STARS = 170;
const NUM_CONSTELLATIONS = 4;
const METEOR_MIN_DELAY = 3500;
const METEOR_MAX_DELAY = 9000;

export default function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let stars: Star[] = [];
        let constellations: { a: Star; b: Star }[] = [];

        function buildField() {
            stars = Array.from({ length: NUM_STARS }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.2 + 0.4,
                baseAlpha: Math.random() * 0.5 + 0.35,
                twinkleSpeed: Math.random() * 0.0015 + 0.0004,
                twinklePhase: Math.random() * Math.PI * 2,
                depth: Math.random() * 0.7 + 0.15,
            }));

            constellations = [];
            for (let c = 0; c < NUM_CONSTELLATIONS; c++) {
                const clusterSize = 3 + Math.floor(Math.random() * 3);
                const originIdx = Math.floor(Math.random() * stars.length);
                const origin = stars[originIdx];
                const nearby = stars
                    .map((s, i) => ({ s, i, d: Math.hypot(s.x - origin.x, s.y - origin.y) }))
                    .filter((o) => o.i !== originIdx)
                    .sort((a, b) => a.d - b.d)
                    .slice(0, clusterSize);
                let prev = origin;
                nearby.forEach(({ s }) => {
                    constellations.push({ a: prev, b: s });
                    prev = s;
                });
            }
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas!.width = width * dpr;
            canvas!.height = height * dpr;
            canvas!.style.width = `${width}px`;
            canvas!.style.height = `${height}px`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildField();
        }
        resize();

        // ── Parallax on mouse move ──────────────────────────────────────
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        function handleMouse(e: MouseEvent) {
            targetX = (e.clientX / width - 0.5) * 2;
            targetY = (e.clientY / height - 0.5) * 2;
        }
        if (!prefersReducedMotion) window.addEventListener("mousemove", handleMouse);

        // ── Fade away on scroll ─────────────────────────────────────────
        let scrollRaf = 0;
        function handleScroll() {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                const fadeDistance = Math.max(height * 0.85, 400);
                const opacity = Math.max(0, 1 - window.scrollY / fadeDistance);
                if (wrapper) wrapper.style.opacity = String(opacity);
                scrollRaf = 0;
            });
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        // ── Meteors ──────────────────────────────────────────────────────
        let meteors: Meteor[] = [];
        let nextMeteorAt = performance.now() + 1800;
        function spawnMeteor() {
            const startX = Math.random() * width * 0.7 + width * 0.15;
            meteors.push({
                x: startX,
                y: -30,
                vx: -0.34 - Math.random() * 0.22,
                vy: 0.5 + Math.random() * 0.22,
                life: 0,
                maxLife: 65 + Math.random() * 30,
                length: 75 + Math.random() * 55,
            });
        }

        let raf = 0;
        function draw(time: number) {
            if (!prefersReducedMotion) {
                mouseX += (targetX - mouseX) * 0.045;
                mouseY += (targetY - mouseY) * 0.045;
            }

            ctx!.clearRect(0, 0, width, height);

            // Constellations (subtle lines, drawn under stars)
            ctx!.strokeStyle = "rgba(154, 91, 255, 0.16)";
            ctx!.lineWidth = 1;
            constellations.forEach(({ a, b }) => {
                const ax = a.x + mouseX * a.depth * 16;
                const ay = a.y + mouseY * a.depth * 16;
                const bx = b.x + mouseX * b.depth * 16;
                const by = b.y + mouseY * b.depth * 16;
                ctx!.beginPath();
                ctx!.moveTo(ax, ay);
                ctx!.lineTo(bx, by);
                ctx!.stroke();
            });

            // Stars
            stars.forEach((s) => {
                const twinkle = prefersReducedMotion ? 1 : Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
                const alpha = s.baseAlpha * (0.5 + twinkle * 0.5);
                const x = s.x + mouseX * s.depth * 16;
                const y = s.y + mouseY * s.depth * 16;
                ctx!.beginPath();
                ctx!.arc(x, y, s.radius, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx!.fill();

                // subtle constellation-star glow for slightly larger stars
                if (s.radius > 1.3) {
                    ctx!.beginPath();
                    ctx!.arc(x, y, s.radius * 2.4, 0, Math.PI * 2);
                    ctx!.fillStyle = `rgba(154,91,255,${alpha * 0.12})`;
                    ctx!.fill();
                }
            });

            // Meteors
            if (!prefersReducedMotion) {
                if (time > nextMeteorAt) {
                    spawnMeteor();
                    nextMeteorAt = time + METEOR_MIN_DELAY + Math.random() * (METEOR_MAX_DELAY - METEOR_MIN_DELAY);
                }
                meteors.forEach((m) => {
                    m.life += 1;
                    m.x += m.vx * 4.2;
                    m.y += m.vy * 4.2;
                    const progress = m.life / m.maxLife;
                    const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
                    const tailX = m.x - m.vx * m.length;
                    const tailY = m.y - m.vy * m.length;
                    const grad = ctx!.createLinearGradient(m.x, m.y, tailX, tailY);
                    grad.addColorStop(0, `rgba(255,255,255,${Math.max(fade, 0)})`);
                    grad.addColorStop(1, "rgba(154,91,255,0)");
                    ctx!.strokeStyle = grad;
                    ctx!.lineWidth = 1.6;
                    ctx!.beginPath();
                    ctx!.moveTo(m.x, m.y);
                    ctx!.lineTo(tailX, tailY);
                    ctx!.stroke();
                });
                meteors = meteors.filter((m) => m.life < m.maxLife && m.y < height + 100 && m.x > -100);
            }

            raf = requestAnimationFrame(draw);
        }
        raf = requestAnimationFrame(draw);

        function handleResize() {
            resize();
        }
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(raf);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            window.removeEventListener("mousemove", handleMouse);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div ref={wrapperRef} className="star-background" aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}
