// --- Setup ---
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Global Initialization (Only once) ---
let cursor, xSet, ySet;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

function initGlobal() {
    cursor = document.getElementById('cursor');
    if (cursor) {
        xSet = gsap.quickSetter(cursor, "x", "px");
        ySet = gsap.quickSetter(cursor, "y", "px");

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            xSet(cursorX);
            ySet(cursorY);
        });
    }

    // Menu logic (shared across pages)
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuToggle && menuOverlay) {
        let isMenuOpen = false;
        const tlMenu = gsap.timeline({ paused: true });

        tlMenu.to(".menu-bg", {
            clipPath: "circle(150% at 0% 100%)",
            duration: 1.2,
            ease: "power3.inOut"
        })
            .set(".menu-content", { visibility: "visible" }, "-=0.6")
            .to(".menu-logo-container", {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6")
            .to(".menu-link", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.5)"
            }, "-=0.6");

        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                lenis.stop();
                menuToggle.classList.add('is-open');
                menuOverlay.classList.add('is-active');
                tlMenu.play();
            } else {
                lenis.start();
                menuToggle.classList.remove('is-open');
                menuOverlay.classList.remove('is-active');
                tlMenu.reverse();
            }
        });
        
        // Close menu on link click for SPA
        menuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    lenis.start();
                    menuToggle.classList.remove('is-open');
                    menuOverlay.classList.remove('is-active');
                    tlMenu.reverse();
                }
            });
        });
    }
}

// --- Page Specific Initialization (Every navigate) ---
window.initPage = function () {
    // Kill existing ScrollTriggers to prevent memory leaks and ghost triggers
    ScrollTrigger.getAll().forEach(t => t.kill());
    
    // Magnetic Hover Effect
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach((elem) => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(elem, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        elem.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('active');
        });

        elem.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('active');
            gsap.to(elem, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // 3D Tilt Effect for Desktop Navbar
    const desktopNav = document.querySelector('.desktop-nav-links');
    if (desktopNav) {
        window.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = desktopNav.getBoundingClientRect();
            const navCenterX = rect.left + rect.width / 2;
            const navCenterY = rect.top + rect.height / 2;
            const mx = e.clientX - navCenterX;
            const my = e.clientY - navCenterY;
            const distance = Math.sqrt(mx * mx + my * my);
            if (distance < 400) {
                gsap.to(desktopNav, {
                    rotateX: (my / 20) * -1,
                    rotateY: (mx / 20),
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                gsap.to(desktopNav, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power2.out" });
            }
        });
        desktopNav.addEventListener('mouseleave', () => {
            gsap.to(desktopNav, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        });
    }

// --- Loader ---

    // --- Animations ---

    // Loader / Initial Scene 1 Animation
    const tlLoad = gsap.timeline();

    // Fade in the hero logo
    tlLoad.fromTo(".logo-container", {
        opacity: 0,
        y: 30,
        scale: 0.8
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.5)"
    });

    // Fade in the subtitle
    tlLoad.to(".hero-subtitle-container", {
        opacity: 1,
        y: -10,
        duration: 1,
        ease: "power2.out",
        delay: -0.5
    });

    // Fade in the desktop navbar
    tlLoad.fromTo(".desktop-nav", {
        opacity: 0,
        y: -20,
        rotateX: -20
    }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.8");

    // Fade in the background circle
    tlLoad.to(".hero-circle", {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power3.out"
    }, "-=0.8");

    // Animate the mask-layer expanding
    gsap.to(".mask-layer", {
        clipPath: "circle(150% at 50% 50%)",
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "#scene-1",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // Scene 1 Exit on Scroll
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: "#scene-1",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
        },
        opacity: 0,
        y: -150,
        ease: "power1.inOut"
    });

    // Scene 2 Enter (Glitch)
    ScrollTrigger.create({
        trigger: "#scene-2",
        start: "top 75%",
        onEnter: () => {
            const el = document.querySelector('.glitch-text');
            if (el) {
                el.classList.add('glitch-active');
                gsap.to(el, { opacity: 1, duration: 0.1 });
            }
            gsap.to(".glitch-desc", { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 });
        },
        onLeaveBack: () => {
            const el = document.querySelector('.glitch-text');
            if (el) {
                el.classList.remove('glitch-active');
                gsap.to(el, { opacity: 0, duration: 0.1 });
            }
            gsap.to(".glitch-desc", { opacity: 0, y: 20, duration: 0.3 });
        }
    });

    // Scene 2 Exit
    gsap.to("#scene-2 .content-wrapper", {
        scrollTrigger: {
            trigger: "#scene-2",
            start: "bottom 30%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: -50,
        duration: 0.5
    });

    // Scene 3 — Full 3D Cinematic Experience (Scrub-driven)
    const tlS3 = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-3",
            start: "top 85%",
            end: "top 10%",
            scrub: 1.5
        }
    });

    // Grid floor rises into view
    tlS3.to(".s3-grid-floor", { opacity: 0.6, duration: 1 }, 0);

    // Orbs pulse in
    tlS3.to(".s3-orb-1", { opacity: 1, scale: 1.2, x: 30, duration: 1.5 }, 0);
    tlS3.to(".s3-orb-2", { opacity: 0.8, scale: 1.1, x: -20, duration: 1.5 }, 0.2);
    tlS3.to(".s3-orb-3", { opacity: 0.6, scale: 1.3, y: -20, duration: 1.5 }, 0.3);

    // Back-layer words drift in from extreme positions
    tlS3.fromTo(".s3-fw-1",
        { opacity: 0, x: -300, rotateZ: -5 },
        { opacity: 1, x: 0, rotateZ: 0, duration: 1.5, ease: "power2.out" }, 0.1);
    tlS3.fromTo(".s3-fw-2",
        { opacity: 0, x: 400, rotateZ: 3 },
        { opacity: 1, x: 0, rotateZ: 0, duration: 1.5, ease: "power2.out" }, 0.2);
    tlS3.fromTo(".s3-fw-3",
        { opacity: 0, y: 200, scale: 0.6 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 0.15);

    // Mid-layer words
    tlS3.fromTo(".s3-fw-4",
        { opacity: 0, x: 200, y: -100 },
        { opacity: 1, x: 0, y: 0, duration: 1.2, ease: "power2.out" }, 0.3);
    tlS3.fromTo(".s3-fw-5",
        { opacity: 0, x: -200, y: 100 },
        { opacity: 1, x: 0, y: 0, duration: 1.2, ease: "power2.out" }, 0.35);

    // Title flies from deep Z-space
    tlS3.fromTo(".s3-title",
        { opacity: 0, z: -600, rotateX: 25, filter: "blur(20px)", scale: 0.5 },
        { opacity: 1, z: 0, rotateX: 0, filter: "blur(0px)", scale: 1, duration: 2, ease: "power3.out" },
        0.2);

    // Subtitle slides up
    tlS3.fromTo(".s3-subtitle",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        0.6);

    // Accent line expands
    tlS3.to(".s3-line", { width: "180px", duration: 1, ease: "power2.inOut" }, 0.7);

    // Scene 3 Exit — everything collapses back
    const tlS3Exit = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-3",
            start: "bottom 45%",
            end: "bottom top",
            scrub: 1
        }
    });

    tlS3Exit.to(".s3-title", { opacity: 0, z: -300, rotateX: -15, filter: "blur(15px)", scale: 0.85, duration: 1 }, 0);
    tlS3Exit.to(".s3-subtitle", { opacity: 0, y: -30, duration: 0.6 }, 0);
    tlS3Exit.to(".s3-line", { width: 0, opacity: 0, duration: 0.5 }, 0);
    tlS3Exit.to(".s3-float-word", { opacity: 0, duration: 0.5 }, 0);
    tlS3Exit.to(".s3-orb", { opacity: 0, scale: 0.5, duration: 0.6 }, 0);
    tlS3Exit.to(".s3-grid-floor", { opacity: 0, duration: 0.5 }, 0);

    // Mouse-tracking parallax on Scene 3
    const scene3El = document.getElementById('scene-3');
    if (scene3El) {
        scene3El.addEventListener('mousemove', (e) => {
            const rect = scene3El.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
            const my = (e.clientY - rect.top) / rect.height - 0.5;

            // Back layer moves less (far away)
            gsap.to(".s3-layer-back", { x: mx * 20, y: my * 15, duration: 1, ease: "power2.out" });
            // Mid layer moves more (closer)
            gsap.to(".s3-layer-mid", { x: mx * 40, y: my * 30, duration: 0.8, ease: "power2.out" });
            // Orbs drift
            gsap.to(".s3-orb-1", { x: 30 + mx * 50, y: my * 35, duration: 1.2, ease: "power2.out" });
            gsap.to(".s3-orb-2", { x: -20 + mx * -40, y: my * -25, duration: 1.2, ease: "power2.out" });
            // Title subtle tilt
            gsap.to(".s3-title", { rotateY: mx * 8, rotateX: -my * 5, duration: 0.8, ease: "power2.out" });
        });

        scene3El.addEventListener('mouseleave', () => {
            gsap.to(".s3-layer-back, .s3-layer-mid", { x: 0, y: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" });
            gsap.to(".s3-orb-1", { x: 30, y: 0, duration: 1.5 });
            gsap.to(".s3-orb-2", { x: -20, y: 0, duration: 1.5 });
            gsap.to(".s3-title", { rotateY: 0, rotateX: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" });
        });
    }

    // Scene 4 Cinematic Reveal (Glass Card)
    const tlCard = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-4",
            start: "top 75%",
            toggleActions: "play reverse play reverse"
        }
    });

    tlCard.fromTo(".glass-card",
        {
            opacity: 0,
            y: 100,
            rotateX: -15,
            scale: 0.95
        },
        {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            ease: "power3.out",
            duration: 1.2
        }
    ).fromTo(".reveal-text",
        {
            opacity: 0,
            scale: 1.05,
            letterSpacing: "0.5vw",
            filter: "blur(5px)"
        },
        {
            opacity: 1,
            scale: 1,
            letterSpacing: "-2px",
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 1
        },
        "-=0.6"
    ).fromTo(".card-subtitle",
        {
            opacity: 0,
            y: 15
        },
        {
            opacity: 1,
            y: 0,
            ease: "power1.out",
            duration: 0.8
        },
        "-=0.4"
    );

    // Scene 5 (Parallax & Typography)
    const tlParallax = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-5",
            start: "top 80%",
            end: "bottom top",
            scrub: 1.5
        }
    });

    tlParallax.fromTo(".parallax-title",
        { filter: "blur(20px)", opacity: 0, scale: 1.5, y: -100 },
        { filter: "blur(0px)", opacity: 1, scale: 1, y: 0, duration: 2, ease: "power2.out" }
    );

    tlParallax.fromTo(".parallax-desc",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        "-=1"
    );

    // Individual floating elements parallax effect
    const floatElements = document.querySelectorAll(".float-wrapper");
    floatElements.forEach((el, index) => {
        // Determine random direction and speed
        const directionY = index % 2 === 0 ? -1 : 1;
        const directionX = index % 3 === 0 ? 1 : -1;
        const speed = 100 + (index * 50);

        gsap.to(el, {
            scrollTrigger: {
                trigger: "#scene-5",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: speed * directionY,
            x: (speed / 2) * directionX,
            rotation: directionX * 15,
            ease: "none"
        });
    });



    // --- Antigravity Stacking Cards Effect ---

    // Initialize default positions
    gsap.set(".card-1", { opacity: 1, y: 0, scale: 1 });
    gsap.set(".card-2", { opacity: 1, y: window.innerHeight, scale: 1 });
    gsap.set(".card-3", { opacity: 0, y: window.innerHeight, scale: 0.5, rotateX: 60, rotateY: 20, rotateZ: -10, z: -800 });
    gsap.set(".card-4", { opacity: 1, y: window.innerHeight, scale: 1 });

    const tlStack = gsap.timeline({
        scrollTrigger: {
            trigger: "#stacking-cards-scene",
            start: "top top",
            end: "+=300%", // 300vh scroll space
            pin: true,
            scrub: 1
        }
    });

    // Animate Card 1 out, Card 2 in
    tlStack.to(".card-1", {
        scale: 0.85,
        y: -40,
        opacity: 0.4,
        duration: 1,
        ease: "none"
    }, 0).to(".card-2", {
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, 0);

    // Animate Card 2 out, Card 3 in
    tlStack.to(".card-1", {
        scale: 0.75,
        y: -80,
        opacity: 0.1,
        duration: 1,
        ease: "none"
    }, 1).to(".card-2", {
        scale: 0.85,
        y: -40,
        opacity: 0.4,
        duration: 1,
        ease: "none"
    }, 1).to(".card-3", {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        z: 0,
        duration: 1,
        ease: "power3.out"
    }, 1);

    // Animate Card 3 out, Card 4 in
    tlStack.to(".card-2", {
        scale: 0.75,
        y: -80,
        opacity: 0.1,
        duration: 1,
        ease: "none"
    }, 2).to(".card-3", {
        scale: 0.85,
        y: -40,
        rotateX: -10,
        opacity: 0.4,
        duration: 1,
        ease: "none"
    }, 2).to(".card-4", {
        y: 0,
        duration: 1,
        ease: "power2.out"
    }, 2);

    // --- Stagger Text Animations ---
    const staggerSections = document.querySelectorAll('.stagger-section');
    staggerSections.forEach((section) => {
        gsap.to(section.querySelectorAll('.stagger-text'), {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    });

    // Footer & CTA fade in
    const tlFooter = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-footer",
            start: "top bottom",
            toggleActions: "play reverse play reverse"
        }
    });

    tlFooter.from("#scene-footer .content-wrapper", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out"
    }).from(".footer-brand", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.3").from(".social-link", {
        opacity: 0,
        y: 15,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.5)"
    }, "-=0.3").from(".footer-bottom", {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out"
    }, "-=0.2");

    // Tell ScrollTrigger to refresh after everything is set
    ScrollTrigger.refresh();

    // --- Contact Form AJAX Handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    alert("Message sent successfully!");
                    this.reset();
                } else {
                    alert("Something went wrong!");
                }
            } catch (error) {
                alert("Something went wrong!");
                console.error(error);
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
};

// --- Start the App ---
window.addEventListener('load', () => {
    initGlobal();
    
    // Hide loader
    const tlLoader = gsap.timeline();
    tlLoader.to(".loader-bar", { width: "100%", duration: 0.8, ease: "power2.inOut" })
        .to(".loader-content", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
        .to(".loader-wrapper", {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                document.querySelector('.loader-wrapper').style.display = 'none';
            }
        });

    window.initPage();
});
