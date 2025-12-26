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

// --- Quote Form Handler (mailto) ---
document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    if (!quoteForm) return;

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('q-name')?.value.trim() || '';
        const email = document.getElementById('q-email')?.value.trim() || '';
        const details = document.getElementById('q-details')?.value.trim() || '';

        if (!name || !email || !details) {
            alert('Por favor completa todos los campos para solicitar la cotización.');
            return;
        }

        const to = 'contacto@construccionessosa.com';
        const subject = encodeURIComponent('Solicitud de Cotización - ' + name);
        const bodyLines = [
            'Nombre: ' + name,
            'Email: ' + email,
            '',
            'Detalles del proyecto:',
            details
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));

        // Build mailto link
        const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

        // Open default mail client
        window.location.href = mailto;
    });
});

// --- Counters (animated) & Testimonials Carousel ---
document.addEventListener('DOMContentLoaded', () => {
    // Animated counters
    const counters = document.querySelectorAll('.number[data-target]');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                    const duration = 1500; // ms
                    const start = performance.now();

                    const step = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        el.textContent = Math.floor(progress * target).toString();
                        if (progress < 1) requestAnimationFrame(step);
                        else el.textContent = target.toString();
                    };

                    requestAnimationFrame(step);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // Testimonials carousel (simple) with dots
    const carousels = document.querySelectorAll('.testimonial-carousel');
    carousels.forEach(car => {
        const track = car.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        const nextBtn = car.querySelector('.testimonial-next');
        const prevBtn = car.querySelector('.testimonial-prev');
        const dotsContainer = car.parentElement.querySelector('.testimonial-dots');
        let index = 0;
        let autoplay = null;

        // create dots
        const dots = [];
        if (dotsContainer) {
            slides.forEach((s, i) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('aria-label', `Ir al testimonio ${i+1}`);
                if (i === 0) b.classList.add('active');
                b.addEventListener('click', () => { index = i; update(); reset(); });
                dotsContainer.appendChild(b);
                dots.push(b);
            });
        }

        const updateDots = () => {
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        };

        const update = () => {
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 20;
            const slideWidth = slides[0].getBoundingClientRect().width + gap;
            track.style.transform = `translateX(-${index * slideWidth}px)`;
            updateDots();
        };

        const next = () => {
            index = (index + 1) % slides.length;
            update();
        };

        const prev = () => {
            index = (index - 1 + slides.length) % slides.length;
            update();
        };

        nextBtn?.addEventListener('click', () => { next(); reset(); });
        prevBtn?.addEventListener('click', () => { prev(); reset(); });

        const start = () => { autoplay = setInterval(next, 5000); };
        const stop = () => { clearInterval(autoplay); }
        const reset = () => { stop(); start(); };

        car.addEventListener('mouseenter', stop);
        car.addEventListener('mouseleave', start);
        window.addEventListener('resize', update);

        // init
        update();
        start();
    });
});
