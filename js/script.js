// --- Setup ---
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scroll
window.lenis = new Lenis({
    duration: 1.8, // Slightly more weighted for premium feel
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.2,
    smoothTouch: true,
    touchMultiplier: 1.5,
    lerp: 0.1, // Added for buttery smoothness
});

// Optimization for high-frequency displays
gsap.ticker.lagSmoothing(0);

// Sync Lenis with GSAP ScrollTrigger
window.lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    window.lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Global Initialization (Only once) ---
let cursor, xSet, ySet;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

function initGlobal() {
    // Disable browser default scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
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

        // High-performance menu reveal
        tlMenu.to(".menu-bg", {
            clipPath: "circle(150% at 90% 10%)",
            duration: 1,
            ease: "expo.inOut"
        })
        .set(".menu-content", { visibility: "visible" }, "-=0.6")
        .fromTo(".menu-logo-container", {
            opacity: 0,
            y: -20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6")
        .fromTo(".menu-link", {
            opacity: 0,
            y: 40,
            rotateX: -15
        }, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            force3D: true
        }, "-=0.8");

        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                window.lenis.stop();
                menuToggle.classList.add('is-open');
                menuOverlay.classList.add('is-active');
                tlMenu.play();
                
                // Hamburger icon custom animation
                gsap.to(".line-1", { y: 8, rotate: 45, duration: 0.5, ease: "expo.inOut" });
                gsap.to(".line-2", { opacity: 0, scaleX: 0, duration: 0.4 });
                gsap.to(".line-3", { y: -8, rotate: -45, duration: 0.5, ease: "expo.inOut" });
            } else {
                window.lenis.start();
                menuToggle.classList.remove('is-open');
                menuOverlay.classList.remove('is-active');
                tlMenu.reverse();

                // Reset hamburger
                gsap.to(".line-1", { y: 0, rotate: 0, duration: 0.5, ease: "expo.inOut" });
                gsap.to(".line-2", { opacity: 1, scaleX: 1, duration: 0.4 });
                gsap.to(".line-3", { y: 0, rotate: 0, duration: 0.5, ease: "expo.inOut" });
            }
        });

        // Close menu on link click
        menuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    window.lenis.start();
                    menuToggle.classList.remove('is-open');
                    menuOverlay.classList.remove('is-active');
                    tlMenu.reverse();
                    
                    // Reset hamburger
                    gsap.to(".line-1", { y: 0, rotate: 0, duration: 0.5, ease: "expo.inOut" });
                    gsap.to(".line-2", { opacity: 1, scaleX: 1, duration: 0.4 });
                    gsap.to(".line-3", { y: 0, rotate: 0, duration: 0.5, ease: "expo.inOut" });
                }
            });
        });
    }

    updateActiveNavLink();
}

function updateActiveNavLink() {
    // Set active navbar link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.desktop-nav-link, .menu-link');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// --- Page Specific Initialization (Every navigate) ---
window.initPage = function () {
    // Force scroll to top on page load/navigation
    if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
        window.lenis.resize(); // Recalculate height
    }
    window.scrollTo(0, 0);

    updateActiveNavLink();

    // Kill existing ScrollTriggers to prevent memory leaks and ghost triggers
    ScrollTrigger.getAll().forEach(t => t.kill());

    if (typeof window.initLanding === 'function' && (document.querySelector("#scene-2") || document.querySelector("#scene-3") || document.querySelector("#scene-4"))) {
        window.initLanding();
    }

    if (typeof window.initAbout === 'function' && document.querySelector(".about-page-wrapper")) {
        window.initAbout();
    }

    if (typeof window.initWhyUs === 'function' && document.querySelector(".why-page-wrapper")) {
        window.initWhyUs();
    }

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

    // Footer & CTA fade in
    const tlFooter = gsap.timeline({
        scrollTrigger: {
            trigger: "#scene-footer",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    tlFooter.fromTo("#scene-footer .content-wrapper", 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    ).fromTo(".footer-brand", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
        "-=0.3"
    ).fromTo(".social-link", 
        { opacity: 0, y: 15, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" }, 
        "-=0.3"
    ).fromTo(".footer-bottom", 
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power1.out" }, 
        "-=0.2"
    );


    // Final ScrollTrigger refresh with a slight delay for safety
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);

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


// --- Random Glitch Burst on Hero Title ---
function initHeroGlitch() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    // Set data-glitch = visible text content for CSS pseudo-element
    const titleText = heroTitle.innerText.trim();
    heroTitle.setAttribute('data-glitch', titleText);

    function triggerBurst() {
        heroTitle.classList.add('glitch-burst');
        // Remove after animation completes (0.18s * 2 steps + buffer)
        setTimeout(() => heroTitle.classList.remove('glitch-burst'), 350);
    }

    // Fire a burst every 4–9 seconds at random
    function scheduleNext() {
        const delay = 4000 + Math.random() * 5000;
        setTimeout(() => {
            triggerBurst();
            scheduleNext();
        }, delay);
    }

    // First burst after 2s
    setTimeout(() => {
        triggerBurst();
        scheduleNext();
    }, 2000);
}

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
    initHeroGlitch();
});
