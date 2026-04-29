/**
 * Landing Page Motion Engine
 * Handles cinematic 3D transitions, service carousel, and the antigravity card stack.
 */

window.initLanding = function () {
    console.log("Initializing Landing Page Motion...");

    // --- Scene 2: Glitch Text Reveal ---
    const scene2 = document.querySelector('#scene-2');
    if (scene2) {
        gsap.to("#scene-2 .glitch-text", {
            scrollTrigger: {
                trigger: scene2,
                start: "top 60%",
                onEnter: () => {
                    document.querySelector('#scene-2 .glitch-text').classList.add('glitch-active');
                    gsap.to("#scene-2 .glitch-text", { opacity: 1, duration: 0.5 });
                }
            }
        });

        gsap.from("#scene-2 .glitch-desc", {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: scene2,
                start: "top 60%",
            }
        });
    }

    // --- Scene Features 3D: Service Carousel ---
    const featuresScene = document.querySelector('.features-3d-scene');
    const carousel = document.querySelector('.features-carousel');
    const cards = gsap.utils.toArray('.feature-card');
    const dots = gsap.utils.toArray('.nav-dots .dot');

    if (featuresScene && carousel && cards.length > 0) {
        const tlCarousel = gsap.timeline({
            scrollTrigger: {
                trigger: featuresScene,
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
                end: () => "+=" + (window.innerHeight * 3),
                onUpdate: (self) => {
                    const index = Math.round(self.progress * (cards.length - 1));
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                }
            }
        });

        // Initialize cards
        cards.forEach((card, i) => {
            if (i !== 0) {
                gsap.set(card, { opacity: 0, xPercent: 100, rotateY: -45, scale: 0.8 });
            }
        });

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                // Current card slides out
                tlCarousel.to(card, {
                    xPercent: -100,
                    rotateY: 45,
                    opacity: 0,
                    scale: 0.8,
                    duration: 1,
                    ease: "power2.inOut"
                }, i);

                // Next card slides in
                tlCarousel.to(cards[i + 1], {
                    xPercent: 0,
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power2.inOut"
                }, i);
            }
        });

        // Entrance animation for the whole section
        gsap.from(".features-title, .features-underline", {
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: featuresScene,
                start: "top 80%",
            }
        });
    }

    // --- Scene 3: 3D Cinematic Approach ---
    const scene3 = document.querySelector('#scene-3');
    if (scene3) {
        const tl3 = gsap.timeline({
            scrollTrigger: {
                trigger: scene3,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Grid floor perspective
        tl3.fromTo(".s3-grid-floor", { opacity: 0, rotateX: 45 }, { opacity: 1, rotateX: 65, duration: 1 });

        // Floating words parallax
        tl3.to(".s3-layer-back .s3-float-word", { y: -100, opacity: 0.1, stagger: 0.1 }, 0);
        tl3.to(".s3-layer-mid .s3-float-word", { y: -200, opacity: 0.15, stagger: 0.1 }, 0);

        // Orbs movement
        tl3.to(".s3-orb-1", { x: 50, y: -50, opacity: 0.4 }, 0);
        tl3.to(".s3-orb-2", { x: -30, y: 30, opacity: 0.3 }, 0);
        tl3.to(".s3-orb-3", { x: 20, y: -20, opacity: 0.2 }, 0);

        // Center Content Reveal
        gsap.to(".s3-title", {
            opacity: 1,
            translateZ: 0,
            rotateX: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: scene3,
                start: "top 40%",
            }
        });

        gsap.to(".s3-subtitle", {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: scene3,
                start: "top 40%",
            }
        });

        gsap.to(".s3-line", {
            width: "100px",
            duration: 1.2,
            delay: 0.5,
            ease: "expo.out",
            scrollTrigger: {
                trigger: scene3,
                start: "top 40%",
            }
        });
    }

    // --- Scene 4: Zero Compromises (Glass Card) ---
    const scene4 = document.querySelector('#scene-4');
    if (scene4) {
        gsap.to(".reveal-text", {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: scene4,
                start: "top 60%",
            }
        });

        gsap.to(".glass-card", {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: scene4,
                start: "top 60%",
            }
        });

        gsap.to(".card-subtitle", {
            opacity: 1,
            duration: 1,
            delay: 0.4,
            scrollTrigger: {
                trigger: scene4,
                start: "top 60%",
            }
        });
    }

    // --- Stacking Cards (Antigravity Scroll) ---
    const stackingContainer = document.querySelector('.stacking-container');
    const stackCards = gsap.utils.toArray('.stack-card');

    if (stackingContainer && stackCards.length > 0) {
        const tlStack = gsap.timeline({
            scrollTrigger: {
                trigger: stackingContainer,
                start: "top top",
                end: () => "+=" + (window.innerHeight * 3),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        stackCards.forEach((card, i) => {
            // Initial state for all cards except the first one
            if (i > 0) {
                gsap.set(card, { 
                    yPercent: 120,
                    opacity: 0,
                    scale: 0.9,
                    rotateX: -10
                });
            } else {
                gsap.set(card, { opacity: 1, scale: 1, rotateX: 0 });
            }

            if (i > 0) {
                // Animate card coming in
                tlStack.to(card, {
                    yPercent: 0,
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    duration: 1,
                    ease: "power2.out"
                }, i * 0.8);

                // Slightly shrink and fade previous card
                tlStack.to(stackCards[i - 1], {
                    scale: 0.92,
                    yPercent: -5,
                    opacity: 0.6,
                    duration: 1,
                    ease: "power2.inOut"
                }, i * 0.8);
            }
        });
    }

    // --- Tech Stack Marquee (Optional extra JS) ---
    // The CSS handles most of it, but we can add a fade-in
    const techStack = document.querySelector('.tech-stack-scene');
    if (techStack) {
        gsap.to(".tech-eyebrow, .tech-main-title, .tech-main-desc, .tech-stats", {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: techStack,
                start: "top 70%",
            }
        });
    }

    // Refresh ScrollTrigger to ensure all markers and calculations are correct
    ScrollTrigger.refresh();
};

// Handle resize events
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});