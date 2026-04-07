/**
 * HatechLabs Theme Toggle System
 * Smooth animated Dark/Light mode with localStorage persistence
 */
(function () {
    // Initialize theme IMMEDIATELY to prevent FOUC
    var saved = localStorage.getItem('hatechlabs-theme');
    if (saved === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    }
    
    // If user has already seen the preloader this session, hide it immediately
    if (sessionStorage.getItem('hatechlabs-preloader-seen')) {
        var style = document.createElement('style');
        style.innerHTML = '#preloader { display: none !important; }';
        document.head.appendChild(style);
    }
})();

// Preloader Logic
window.addEventListener('load', function() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
        if (sessionStorage.getItem('hatechlabs-preloader-seen')) {
            preloader.remove(); // Remove instantly if already seen
        } else {
            preloader.classList.add('opacity-0');
            preloader.classList.add('pointer-events-none');
            setTimeout(function() {
                preloader.remove();
            }, 700);
            // Mark as seen for this session
            sessionStorage.setItem('hatechlabs-preloader-seen', 'true');
        }
    }
});

// DOM Ready handler
document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.getElementById('theme-toggle');
    var sunIcon = document.getElementById('theme-icon-sun');
    var moonIcon = document.getElementById('theme-icon-moon');

    if (!toggleBtn || !sunIcon || !moonIcon) return;

    // Set initial icon visibility
    function syncIcons() {
        var isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            // Show sun icon (click to go light)
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'rotate(0deg) scale(1)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'rotate(90deg) scale(0)';
        } else {
            // Show moon icon (click to go dark)
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'rotate(-90deg) scale(0)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'rotate(0deg) scale(1)';
        }
    }

    syncIcons();

    function syncLogos() {
        var isDark = document.documentElement.classList.contains('dark');
        var logos = document.querySelectorAll('.site-logo');
        logos.forEach(function(logo) {
            if (isDark) {
                logo.src = 'images/logo/bg-null.png';
            } else {
                logo.src = 'images/logo/white.jpeg';
            }
        });
    }

    syncLogos();

    // Toggle handler
    toggleBtn.addEventListener('click', function () {
        // Enable smooth transition on everything
        document.documentElement.classList.add('theme-transition');

        var isDark = document.documentElement.classList.contains('dark');

        if (isDark) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('hatechlabs-theme', 'light');
        } else {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('hatechlabs-theme', 'dark');
        }
        
        syncIcons();
        syncLogos();

        // Remove transition class after animation completes
        setTimeout(function () {
            document.documentElement.classList.remove('theme-transition');
        }, 600);
    });
});
