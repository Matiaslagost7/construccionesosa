document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Scroll Effect ---
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger to X (optional simple rotation/color change handled in CSS or here)
        // For now simple toggle is fine
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Projects Carousel ---
    const track = document.querySelector('.carousel-track');
    
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');

        let currentIndex = 0;

        const updateCarousel = () => {
             // Get width of one slide + gap
            const slideWidth = slides[0].getBoundingClientRect().width;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            const moveAmount = slideWidth + gap;
            
            track.style.transform = 'translateX(-' + (currentIndex * moveAmount) + 'px)';
        };

        // Resize handler to reset position or adjust
        window.addEventListener('resize', updateCarousel);

        nextButton.addEventListener('click', () => {
            // Check visible items based on screen width to prevent empty space at end
            let itemsPerScreen = 1;
            if (window.innerWidth >= 1024) itemsPerScreen = 3;
            else if (window.innerWidth >= 768) itemsPerScreen = 2;

            if (currentIndex < slides.length - itemsPerScreen) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

});
