/**
 * Hatechlabs SPA Navigation Engine
 * Handles seamless page transitions, content injection, and History API state management.
 */

class Navigation {
    constructor() {
        this.container = document.querySelector('.scroll-container');
        this.overlay = document.querySelector('.page-transition-overlay');
        this.logo = document.querySelector('.transition-logo');
        this.isNavigating = false;

        this.init();
    }

    init() {
        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (this.isValidLink(link)) {
                e.preventDefault();
                this.navigate(link.href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.navigate(window.location.href, false);
        });
    }

    isValidLink(link) {
        if (!link) return false;
        const href = link.getAttribute('href');

        // Only internal links, not hashes, not target="_blank"
        return (
            href &&
            !href.startsWith('#') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            link.hostname === window.location.hostname &&
            link.target !== '_blank'
        );
    }

    async navigate(url, pushState = true) {
        if (this.isNavigating || url === window.location.href && pushState) return;
        this.isNavigating = true;

        // Start Transition
        await this.transitionIn();

        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update Content
            const newContent = doc.querySelector('.scroll-container').innerHTML;
            const newTitle = doc.querySelector('title').innerText;

            this.container.innerHTML = newContent;
            document.title = newTitle;

            if (pushState) {
                history.pushState({}, '', url);
            }

            // Scroll to top
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }

            // Re-initialize animations
            if (window.initPage) {
                window.initPage();
            }

        } catch (error) {
            console.error('Navigation failed:', error);
            // Fallback: hard redirect
            window.location.href = url;
        }

        // End Transition
        await this.transitionOut();
        this.isNavigating = false;
    }

    transitionIn() {
        return new Promise((resolve) => {
            document.body.classList.add('transition-active');

            const tl = gsap.timeline({ onComplete: resolve });
            tl.to(this.overlay, {
                y: '0%',
                duration: 0.8,
                ease: "power4.inOut"
            })
                .to(this.logo, {
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.5
                }, "-=0.2");
        });
    }

    transitionOut() {
        return new Promise((resolve) => {
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.classList.remove('transition-active');
                    resolve();
                }
            });

            tl.to(this.logo, {
                opacity: 0,
                filter: "blur(10px)",
                duration: 0.4
            })
                .to(this.overlay, {
                    y: '-100%',
                    duration: 0.8,
                    ease: "power4.inOut"
                })
                // Reset position for next transition
                .set(this.overlay, { y: '100%' });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.spaNavigation = new Navigation();
});
