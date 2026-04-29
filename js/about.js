/**
 * About Page Motion Engine
 * Handles Parallel X horizontal scrolling and cinematic text reveals.
 */

window.initAbout = function() {
    console.log("Initializing About Page Motion...");

    // Horizontal Scroll - Parallel X
    const horizontalSection = document.querySelector('.horizontal-container');
    const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
    
    if (horizontalSection && scrollWrapper) {
        let scrollTween = gsap.to(scrollWrapper, {
            x: () => -(scrollWrapper.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: horizontalSection,
                pin: true,
                scrub: 1,
                end: () => "+=" + scrollWrapper.scrollWidth,
                invalidateOnRefresh: true,
            }
        });

        // Parallax elements inside panels
        gsap.utils.toArray(".panel-number").forEach(num => {
            gsap.to(num, {
                x: -100,
                scrollTrigger: {
                    trigger: num,
                    containerAnimation: scrollTween,
                    scrub: true
                }
            });
        });
    }

    // Marquee Scroll Interaction
    const marqueeInner = document.querySelector('.marquee-inner');
    if (marqueeInner) {
        gsap.to(".marquee-inner", {
            xPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".marquee-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5
            }
        });
    }

    // Hero Text Split Reveal
    gsap.to(".split-line span", {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        delay: 0.5
    });

    // Color shift on scroll
    ScrollTrigger.create({
        trigger: ".horizontal-container",
        start: "top center",
        onEnter: () => gsap.to("body", { backgroundColor: "#000", duration: 1 }),
        onLeaveBack: () => gsap.to("body", { backgroundColor: "#0a0a0a", duration: 1 })
    });
};

// Auto-init if navigation.js is not present or for direct page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.about-page-wrapper')) {
        window.initAbout();
    }
});
