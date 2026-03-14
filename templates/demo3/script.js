document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const countdown = document.querySelector("[data-countdown]");
    if (countdown) {
        const targetDate = new Date(countdown.dataset.countdown).getTime();
        const daysEl = countdown.querySelector('[data-unit="days"]');
        const hoursEl = countdown.querySelector('[data-unit="hours"]');
        const minutesEl = countdown.querySelector('[data-unit="minutes"]');
        const secondsEl = countdown.querySelector('[data-unit="seconds"]');

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance <= 0) {
                daysEl.textContent = "0";
                hoursEl.textContent = "0";
                minutesEl.textContent = "0";
                secondsEl.textContent = "0";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / (1000 * 60)) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            daysEl.textContent = String(days);
            hoursEl.textContent = String(hours).padStart(2, "0");
            minutesEl.textContent = String(minutes).padStart(2, "0");
            secondsEl.textContent = String(seconds).padStart(2, "0");
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    const backToTop = document.querySelector(".back-to-top");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".site-nav a");

    const updateScrollUI = () => {
        const scrollY = window.scrollY;

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollY > 500);
        }

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
                });
            }
        });
    };

    window.addEventListener("scroll", updateScrollUI);
    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealItems.length) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");

            faqItems.forEach((faq) => {
                faq.classList.remove("open");
                faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
                faq.querySelector(".faq-answer").style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add("open");
                button.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = document.querySelector(".lightbox-image");
    const lightboxClose = document.querySelector(".lightbox-close");
    const galleryButtons = document.querySelectorAll("[data-lightbox]");

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    if (lightbox && lightboxImage && galleryButtons.length) {
        galleryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                lightboxImage.src = button.dataset.lightbox;
                lightboxImage.alt = button.dataset.alt || "Immagine gallery";
                lightbox.classList.add("open");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
            });
        });

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeLightbox();
            }
        });
    }
});