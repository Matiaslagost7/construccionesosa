document.addEventListener("DOMContentLoaded", () => {
  // Navbar: collapse menu on link click (mobile) and update active link on scroll
  const navCollapseEl = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".navbar-collapse .nav-link");

  // Always observe scroll to toggle header state, even if nav links aren't present yet
  const sections = document.querySelectorAll("section[id]");
  const header = document.querySelector(".site-header");

  const onScroll = () => {
    if (header) {
      // toggle header background when scrolled past threshold
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // update active link only if nav links exist
    if (navLinks && navLinks.length) {
      const fromTop = window.scrollY + 130; // offset for header height
      sections.forEach((section) => {
        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          navLinks.forEach((l) => l.classList.remove("active"));
          const link = document.querySelector(
            `.nav-link[href="#${section.id}"]`
          );
          if (link) link.classList.add("active");
        }
      });
    }
  };
  window.addEventListener("scroll", onScroll);
  // mobile touch move can trigger scrolling; ensure header state updates
  window.addEventListener("touchmove", onScroll, { passive: true });
  window.addEventListener("orientationchange", onScroll);
  onScroll();

  // Collapse menu on link click (mobile)
  if (navLinks.length && navCollapseEl) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // hide collapse on small screens after click
        if (navCollapseEl.classList.contains("show")) {
          const bsCollapse =
            bootstrap.Collapse.getInstance(navCollapseEl) ||
            new bootstrap.Collapse(navCollapseEl, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  // Disable body scroll when mobile menu is open, restore on close
  if (navCollapseEl) {
    navCollapseEl.addEventListener("show.bs.collapse", () => {
      document.body.classList.add("no-scroll");
    });
    navCollapseEl.addEventListener("hide.bs.collapse", () => {
      document.body.classList.remove("no-scroll");
    });
  }

  // Navbar behavior removed (header toggling, collapse handling).

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Run once
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: "0px",
    }
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // --- Projects Carousel ---
  const track = document.querySelector(".carousel-track");

  if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".carousel-btn.next");
    const prevButton = document.querySelector(".carousel-btn.prev");
    const dotsContainer = document.querySelector(".projects-dots");
    const liveRegion = document.querySelector(".carousel-status");

    let currentIndex = 0;
    const dots = [];

    const createDots = () => {
      if (!dotsContainer) return;
      slides.forEach((s, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Ir al proyecto ${i + 1}`);
        b.setAttribute("role", "tab");
        b.dataset.index = i;
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", () => {
          currentIndex = i;
          updateCarousel();
          // move focus to first item in view for keyboard users
          slides[currentIndex]?.focus();
        });
        dotsContainer.appendChild(b);
        dots.push(b);
      });
    };

    const updateDots = () => {
      if (!dots.length) return;
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === currentIndex);
        if (i === currentIndex) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });
    };

    const announce = () => {
      if (!liveRegion) return;
      const total = slides.length;
      const title =
        slides[currentIndex].querySelector(".project-overlay h3")
          ?.textContent || `Proyecto ${currentIndex + 1}`;
      liveRegion.textContent = `${title} — ${currentIndex + 1} de ${total}`;
    };

    const updateCarousel = () => {
      // Get width of one slide + gap
      const slideWidth = slides[0].getBoundingClientRect().width;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 0;
      const moveAmount = slideWidth + gap;

      track.style.transform =
        "translateX(-" + currentIndex * moveAmount + "px)";
      updateDots();
      announce();
    };

    // Resize handler to reset position or adjust
    window.addEventListener("resize", updateCarousel);

    // Determine how many items fit on screen (used for windowed navigation)
    const itemsPerScreen = () => {
      let items = 1;
      if (window.innerWidth >= 1024) items = 3;
      else if (window.innerWidth >= 768) items = 2;
      return Math.min(items, slides.length);
    };

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        // Advance the start index; when reaching the last window, wrap to 0
        const visible = itemsPerScreen();
        const maxStart = Math.max(0, slides.length - visible);
        if (currentIndex < maxStart) currentIndex++;
        else currentIndex = 0;
        updateCarousel();
        // Keep keyboard focus on the newly visible slide without scrolling
        slides[currentIndex]?.focus({ preventScroll: true });
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        const visible = itemsPerScreen();
        const maxStart = Math.max(0, slides.length - visible);
        if (currentIndex > 0) currentIndex--;
        else currentIndex = maxStart;
        updateCarousel();
        slides[currentIndex]?.focus({ preventScroll: true });
      });
    }

    // Keyboard navigation when focus is inside carousel container
    const carouselInner = document.querySelector(".projects-carousel-inner");
    carouselInner?.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevButton?.click();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextButton?.click();
      }
    });

    // init dots and announce
    createDots();
    updateCarousel();
  }
});

// --- Quote Form Handler (mailto) ---
document.addEventListener("DOMContentLoaded", () => {
  const quoteForm = document.getElementById("quote-form");
  if (!quoteForm) return;

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("q-name")?.value.trim() || "";
    const email = document.getElementById("q-email")?.value.trim() || "";
    const details = document.getElementById("q-details")?.value.trim() || "";

    if (!name || !email || !details) {
      alert(
        "Por favor completa todos los campos para solicitar la cotización."
      );
      return;
    }

    const to = "contacto@construccionessosa.com";
    const subject = encodeURIComponent("Solicitud de Cotización - " + name);
    const bodyLines = [
      "Nombre: " + name,
      "Email: " + email,
      "",
      "Detalles del proyecto:",
      details,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));

    // Build mailto link
    const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

    // Open default mail client
    window.location.href = mailto;
  });
});

// --- Counters (animated) & Testimonials Carousel ---
document.addEventListener("DOMContentLoaded", () => {
  // Animated counters (scoped to counters section)
  const countersSection = document.querySelector("#counters");
  if (countersSection) {
    const counters = countersSection.querySelectorAll(".number[data-target]");
    if (counters.length) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute("data-target"), 10) || 0;
              const duration = 1500; // ms
              const start = performance.now();

              const formatter = new Intl.NumberFormat("es-AR");
              const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const value = Math.floor(progress * target);
                const unit = el.getAttribute("data-unit") || "";
                el.textContent =
                  formatter.format(value) + (unit ? " " + unit : "");
                if (progress < 1) requestAnimationFrame(step);
                else
                  el.textContent =
                    formatter.format(target) + (unit ? " " + unit : "");
              };

              requestAnimationFrame(step);
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.3 }
      );

      counters.forEach((c) => counterObserver.observe(c));
    }
  }

  // Testimonials carousel (circular navigation similar to projects)
  const carousels = document.querySelectorAll(".testimonial-carousel");
  carousels.forEach((car) => {
    const track = car.querySelector(".testimonial-track");
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;

    const dotsContainer = car.querySelector(".testimonial-dots");
    const prevBtn = car.querySelector(".testimonial-prev");
    const nextBtn = car.querySelector(".testimonial-next");
    let index = 0;
    let autoplay = null;

    // create dots for accessibility (visually hidden via CSS)
    const dots = [];
    if (dotsContainer) {
      slides.forEach((s, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Ir al testimonio ${i + 1}`);
        b.dataset.index = i;
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", () => {
          index = i;
          update();
          reset();
          slides[index]?.focus({ preventScroll: true });
        });
        dotsContainer.appendChild(b);
        dots.push(b);
      });
      dotsContainer.setAttribute("aria-hidden", "true");
    }

    const updateDots = () => {
      if (!dots.length) return;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    };

    const itemsPerScreen = () => {
      // Match CSS: 1 item on mobile, 2 items on >=768px
      return window.innerWidth >= 768 ? Math.min(2, slides.length) : 1;
    };

    const update = () => {
      if (!slides.length) return;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 20;
      const slideWidth = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      updateDots();
    };

    const next = () => {
      const visible = itemsPerScreen();
      const maxStart = Math.max(0, slides.length - visible);
      if (index < maxStart) index++;
      else index = 0;
      update();
    };

    const prev = () => {
      const visible = itemsPerScreen();
      const maxStart = Math.max(0, slides.length - visible);
      if (index > 0) index--;
      else index = maxStart;
      update();
    };

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        next();
        reset();
        slides[index]?.focus({ preventScroll: true });
      });
    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        prev();
        reset();
        slides[index]?.focus({ preventScroll: true });
      });

    // keyboard navigation within carousel
    car.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevBtn?.click();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextBtn?.click();
      }
    });

    const start = () => {
      autoplay = setInterval(next, 5000);
    };
    const stop = () => {
      if (autoplay) clearInterval(autoplay);
    };
    const reset = () => {
      stop();
      start();
    };

    car.addEventListener("mouseenter", stop);
    car.addEventListener("mouseleave", start);

    // on resize ensure index is within bounds and update layout
    window.addEventListener("resize", () => {
      const visible = itemsPerScreen();
      const maxStart = Math.max(0, slides.length - visible);
      if (index > maxStart) index = maxStart;
      update();
    });

    // init
    update();
    start();
  });
});
