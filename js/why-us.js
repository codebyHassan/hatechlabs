/**
 * Why Us Page - Technical Motion Engine
 * Handles 3D card tilting, data stream simulations, and horizontal scroll pinning.
 */

window.initWhyUs = function () {
    console.log("Initializing Why Us Technical Motion...");

    // Kill any existing ScrollTriggers to avoid duplicates
    ScrollTrigger.getAll().filter(st => st.vars.id === "why-us-trigger").forEach(st => st.kill());

    // --- Hero Reveal ---
    const tlHero = gsap.timeline();
    gsap.set(".why-hero-title .filled", { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });
    tlHero.to(".why-hero-title .filled", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 2,
        ease: "power4.inOut",
        delay: 0.5
    }).from(".why-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
    }, "-=1").from(".scroll-indicator", {
        opacity: 0,
        height: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");

    // Floating Orbs Parallax
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 60;
        const yPos = (clientY / window.innerHeight - 0.5) * 60;

        gsap.to(".why-glow-orb", {
            x: xPos,
            y: yPos,
            duration: 2,
            ease: "power2.out"
        });
    });

    // --- Parallel X Horizontal Scroll ---
    const horizontalWrapper = document.querySelector('.horizontal-scroll-wrapper');
    const panels = gsap.utils.toArray('.horizontal-panel');

    if (horizontalWrapper && panels.length > 0) {
        gsap.to(horizontalWrapper, {
            x: () => -(horizontalWrapper.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-container",
                pin: true,
                scrub: 1.5,
                start: "top top",
                end: () => "+=" + horizontalWrapper.scrollWidth,
                id: "why-us-trigger",
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    }

    // --- Data Stream Animation ---
    const streamLines = gsap.utils.toArray('.stream-line');
    if (streamLines.length > 0) {
        streamLines.forEach((line, i) => {
            const speed = 25 + Math.random() * 40;
            gsap.to(line, {
                xPercent: -50,
                duration: speed,
                repeat: -1,
                ease: "none",
                delay: i * -3
            });
        });
    }

    // --- Vault Ring Rotations ---
    gsap.to(".vault-ring-1", {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    gsap.to(".vault-ring-2", {
        rotate: -360,
        duration: 35,
        repeat: -1,
        ease: "none"
    });

    // --- Scene Triggers ---

    // Scene 3: Data Stream Reveal
    const tlStream = gsap.timeline({
        scrollTrigger: {
            trigger: "#why-data-stream",
            start: "top 60%",
            toggleActions: "play none none reverse",
            id: "why-us-trigger"
        }
    });

    tlStream.from(".stream-label", {
        opacity: 0,
        x: -20,
        duration: 0.8
    }).from(".stream-title", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out"
    }, "-=0.4").from(".stream-desc", {
        opacity: 0,
        y: 20,
        duration: 0.8
    }, "-=0.6").from(".stream-background", {
        opacity: 0,
        scale: 0.9,
        duration: 1.5
    }, "-=1");

    // Scene 4: Vault Reveal
    gsap.from(".vault-lock-visual", {
        scrollTrigger: {
            trigger: "#why-vault",
            start: "top 60%",
            toggleActions: "play none none reverse",
            id: "why-us-trigger"
        },
        scale: 0.8,
        opacity: 0,
        rotate: -45,
        duration: 1.5,
        ease: "power4.out"
    });

    gsap.from(".vault-content > *", {
        scrollTrigger: {
            trigger: "#why-vault",
            start: "top 50%",
            toggleActions: "play none none reverse",
            id: "why-us-trigger"
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.5)"
    });

    // Refresh ScrollTrigger to ensure correct offsets
    ScrollTrigger.refresh();
};

// Auto-init logic
if (document.querySelector('.why-page-wrapper')) {
    // No auto-init here, called from script.js
}
