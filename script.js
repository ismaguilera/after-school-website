// Casa Taller Amelie - After School Website
// Interactive behaviors and animations

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. Smooth Scroll for Anchor Links
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const menuToggle = document.getElementById('menuToggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.querySelector('i').classList.remove('ph-x');
                        menuToggle.querySelector('i').classList.add('ph-list');
                    }
                }
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =========================================================================
    // 2. Mobile Menu Toggle
    // =========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // =========================================================================
    // 3. FAQ Accordion
    // =========================================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // =========================================================================
    // 4. Scroll Reveal Animations (IntersectionObserver)
    // =========================================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select ALL animatable elements
    const animatableElements = document.querySelectorAll(
        '.activity-card, .time-block, .why-card, .testimonial-card, .faq-item, .pricing-card, .conocenos-video-wrapper, .conocenos-content > *'
    );

    animatableElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out ' + (index % 4 * 0.1) + 's, transform 0.6s ease-out ' + (index % 4 * 0.1) + 's';
        observer.observe(el);
    });

    // =========================================================================
    // 5. Navbar Background on Scroll
    // =========================================================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            } else {
                navbar.style.backgroundColor = 'transparent';
                navbar.style.backdropFilter = 'none';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // =========================================================================
    // 5b. Hero 3D Parallax Mouse Tracking
    // =========================================================================
    const hero3dScene = document.getElementById('hero3dScene');
    const heroSection = document.querySelector('.hero');

    if (hero3dScene && heroSection) {
        const house3d = hero3dScene.querySelector('.house-3d');
        const floatingElements = hero3dScene.querySelectorAll('.floating-element');
        const warmGlow = hero3dScene.querySelector('.warm-glow');
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHovering = false;
        let animFrame;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

            if (!isHovering) {
                isHovering = true;
                if (house3d) house3d.style.animation = 'none';
                animate();
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            isHovering = false;
            mouseX = 0;
            mouseY = 0;

            // Smoothly return to default
            const returnToDefault = () => {
                currentX += (0 - currentX) * 0.05;
                currentY += (0 - currentY) * 0.05;

                if (house3d) {
                    const rotY = -12 + currentX * 45;
                    const rotX = 5 + currentY * -30;
                    house3d.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                }

                floatingElements.forEach(el => {
                    const depth = parseFloat(el.dataset.depth) || 0.5;
                    const moveX = currentX * 30 * depth;
                    const moveY = currentY * 20 * depth;
                    el.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });

                if (warmGlow) {
                    warmGlow.style.transform = `translate(calc(-50% + ${currentX * 10}px), calc(-50% + ${currentY * 10}px))`;
                }

                if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
                    requestAnimationFrame(returnToDefault);
                } else {
                    // Restore float animation
                    if (house3d) {
                        house3d.style.animation = '';
                        house3d.style.transform = '';
                    }
                    floatingElements.forEach(el => {
                        el.style.transform = '';
                    });
                    if (warmGlow) warmGlow.style.transform = '';
                }
            };
            cancelAnimationFrame(animFrame);
            requestAnimationFrame(returnToDefault);
        });

        function animate() {
            if (!isHovering) return;

            // Smooth interpolation (lerp)
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            // Rotate house
            if (house3d) {
                const rotY = -12 + currentX * 45;
                const rotX = 5 + currentY * -30;
                house3d.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            }

            // Move floating elements with parallax depth
            floatingElements.forEach(el => {
                const depth = parseFloat(el.dataset.depth) || 0.5;
                const moveX = currentX * 30 * depth;
                const moveY = currentY * 20 * depth;
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            // Shift warm glow
            if (warmGlow) {
                warmGlow.style.transform = `translate(calc(-50% + ${currentX * 10}px), calc(-50% + ${currentY * 10}px))`;
            }

            animFrame = requestAnimationFrame(animate);
        }
    }

    // =========================================================================
    // 6. Timeline Scroll Reveal & Line Fill (Un Día en Amelie)
    // =========================================================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineSection = document.querySelector('.ruta-amelie');
    const timelineLineFill = document.querySelector('.timeline-line-fill');

    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: "0px 0px -80px 0px"
        });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Animate the timeline connecting line fill based on scroll
    if (timelineSection && timelineLineFill) {
        window.addEventListener('scroll', () => {
            const sectionRect = timelineSection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const windowHeight = window.innerHeight;

            // Calculate fill percentage based on how much of the section is scrolled past
            const scrolledIntoSection = windowHeight - sectionTop;
            const totalScrollableArea = sectionHeight + windowHeight * 0.3;
            let fillPercentage = (scrolledIntoSection / totalScrollableArea) * 100;

            fillPercentage = Math.max(0, Math.min(100, fillPercentage));
            timelineLineFill.style.height = fillPercentage + '%';
        });
    }

    // =========================================================================
    // 7. 3D Tilt Effect on Activity Cards (Spline-inspired)
    //    Disabled on touch devices to avoid conflicts with carousel swipe
    // =========================================================================
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const activityCards = document.querySelectorAll('.activity-card');

    if (!isTouchDevice) {
        activityCards.forEach(card => {
            card.style.transformStyle = 'preserve-3d';
            card.style.perspective = '1000px';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease-out';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
                card.style.transition = 'transform 0.5s ease-out';
            });
        });
    }

    // =========================================================================
    // 7b. 3D House Touch Interactivity (Mobile)
    // =========================================================================
    if (isTouchDevice && hero3dScene && heroSection) {
        const house3dTouch = hero3dScene.querySelector('.house-3d');
        const touchHint = document.getElementById('touchHint');
        let touchStartX = 0, touchStartY = 0;
        let touchCurrentX = 0, touchCurrentY = 0;
        let isTouching = false;

        hero3dScene.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isTouching = true;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                if (house3dTouch) house3dTouch.style.animation = 'none';
                // Hide touch hint after first interaction
                if (touchHint) touchHint.classList.add('hidden');
                e.preventDefault();
            }
        }, { passive: false });

        hero3dScene.addEventListener('touchmove', (e) => {
            if (!isTouching || e.touches.length !== 1) return;
            e.preventDefault();

            const deltaX = (e.touches[0].clientX - touchStartX) / 100;
            const deltaY = (e.touches[0].clientY - touchStartY) / 100;

            touchCurrentX = Math.max(-1, Math.min(1, deltaX));
            touchCurrentY = Math.max(-1, Math.min(1, deltaY));

            if (house3dTouch) {
                const rotY = -12 + touchCurrentX * 60;
                const rotX = 5 + touchCurrentY * -40;
                house3dTouch.style.transform = `translate(-50%, -50%) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            }

            // Move floating elements
            const floatingEls = hero3dScene.querySelectorAll('.floating-element');
            floatingEls.forEach(el => {
                const depth = parseFloat(el.dataset.depth) || 0.5;
                const moveX = touchCurrentX * 30 * depth;
                const moveY = touchCurrentY * 20 * depth;
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }, { passive: false });

        hero3dScene.addEventListener('touchend', () => {
            isTouching = false;
            // Smoothly return to default position
            if (house3dTouch) {
                house3dTouch.style.transition = 'transform 0.8s ease-out';
                house3dTouch.style.transform = '';
                setTimeout(() => {
                    house3dTouch.style.transition = '';
                    house3dTouch.style.animation = '';
                }, 800);
            }
            const floatingEls = hero3dScene.querySelectorAll('.floating-element');
            floatingEls.forEach(el => {
                el.style.transition = 'transform 0.5s ease-out';
                el.style.transform = '';
                setTimeout(() => { el.style.transition = ''; }, 500);
            });
        });

        // Auto-hide touch hint after 6 seconds
        if (touchHint) {
            setTimeout(() => {
                touchHint.classList.add('hidden');
            }, 6000);
        }
    }

    // =========================================================================
    // 8. Mobile Carousel Dot Tracking & Click Navigation
    // =========================================================================
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carousel => {
        const carouselName = carousel.dataset.carousel;
        const dotsContainer = document.querySelector(`.carousel-dots[data-for="${carouselName}"]`);
        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        const cards = Array.from(carousel.children);

        // Track scroll position to update dots
        const observerOptions = {
            root: carousel,
            rootMargin: '0px',
            threshold: 0.6
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = cards.indexOf(entry.target);
                    if (index >= 0) {
                        dots.forEach(d => d.classList.remove('active'));
                        if (dots[index]) dots[index].classList.add('active');
                    }
                }
            });
        }, observerOptions);

        cards.forEach(card => cardObserver.observe(card));

        // Click dot to scroll to card
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                if (cards[index]) {
                    cards[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            });
        });

        // Arrow Navigation
        const wrapper = carousel.closest('.carousel-wrapper');
        if (wrapper) {
            const prevBtn = wrapper.querySelector('.carousel-nav.prev');
            const nextBtn = wrapper.querySelector('.carousel-nav.next');

            if (prevBtn && nextBtn) {
                const getScrollAmount = () => {
                    const firstCard = cards[0];
                    // Compute card width + gap (approx 24px/1.5rem)
                    return firstCard ? firstCard.offsetWidth + 24 : 320;
                };

                prevBtn.addEventListener('click', () => {
                    carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                });

                nextBtn.addEventListener('click', () => {
                    carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                });
            }
        }
    });

    // =========================================================================
    // 8b. Timeline Activities Grid Navigation (Ruta Amelie)
    // =========================================================================
    const timelineGrids = document.querySelectorAll('.timeline-activities-grid');

    timelineGrids.forEach(grid => {
        const wrapper = grid.closest('.carousel-wrapper');
        if (!wrapper) return;

        const prevBtn = wrapper.querySelector('.carousel-nav.prev');
        const nextBtn = wrapper.querySelector('.carousel-nav.next');
        const firstCard = grid.querySelector('.activity-card');

        if (prevBtn && nextBtn && firstCard) {
            const getScrollAmount = () => {
                // Card width + 1.5rem gap (approx 24px)
                return firstCard.offsetWidth + 24;
            };

            prevBtn.addEventListener('click', () => {
                grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });
        }
    });

    // Timeline dots (uses timeline-wrapper as scroll container)
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const timelineDots = document.querySelector('.carousel-dots[data-for="timeline"]');

    if (timelineWrapper && timelineDots) {
        const tlDots = timelineDots.querySelectorAll('.carousel-dot');
        const tlItems = Array.from(timelineWrapper.querySelectorAll('.timeline-item'));

        const tlObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = tlItems.indexOf(entry.target);
                    if (index >= 0) {
                        tlDots.forEach(d => d.classList.remove('active'));
                        if (tlDots[index]) tlDots[index].classList.add('active');
                    }
                }
            });
        }, { root: timelineWrapper, threshold: 0.6 });

        tlItems.forEach(item => tlObserver.observe(item));

        tlDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                if (tlItems[index]) {
                    tlItems[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            });
        });
    }

    // =========================================================================
    // 9. Mascota Amelie — Scroll-Aware Speech Bubbles
    // =========================================================================
    const mascotContainer = document.getElementById('mascotContainer');
    const mascotSpeech = document.getElementById('mascotSpeech');
    const mascotText = document.getElementById('mascotText');
    const mascotCharacter = document.getElementById('mascotCharacter');
    const speechClose = document.getElementById('speechClose');

    if (mascotContainer && mascotSpeech && mascotText && mascotCharacter) {
        let speechVisible = true;
        let isSpeechClosed = false;
        let currentSection = 'hero';

        // Section-specific messages
        const sectionMessages = {
            'about': '¡Hola! Soy Amelie 🌸 ¡Te doy la bienvenida a nuestro sitio web!',
            'why-us': '¿Sabías que somos el after school más cálido? 🏡 ¡Los papás confían en nosotros!',
            'ruta-amelie': '🕐 Así es nuestra ruta diaria ¡Me encantan los talleres! 🎨',
            'gallery': '👀 ¡Esto hacemos en nuestro after school! 📸',
            'testimonials': '💜 La satisfacción de las mamás y los papás nos llena de alegría.',
            'instagram-community': '😮 Nos sorprende el afecto en redes sociales.',
            'conocenos': '✨ ¡Conoce a nuestra fundadora! Ella creó este hermoso espacio de amor.',
            'schedule': '📅 ¡Apúrate, los cupos son limitados! Inscribe a tus hijos pronto.',
            'pricing': '💰 ¡Tenemos planes para todas las familias! Elige el que más te convenga.',
            'faq': '🤔 ¿Tienes dudas? ¡Aquí encuentras las respuestas más comunes!',
            'contact': '📱 ¡Escríbenos por WhatsApp! Estamos felices de ayudarte 😊'
        };

        // Auto-minimize on mobile after 8 seconds (allows reading after 3.5s entrance)
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                if (speechVisible && !isSpeechClosed) {
                    mascotSpeech.style.animation = 'none';
                    mascotSpeech.style.transform = '';
                    mascotSpeech.classList.add('hidden');
                    mascotContainer.classList.add('speech-closed');
                    speechVisible = false;
                }
            }, 8000);
        }

        // Close speech bubble
        if (speechClose) {
            speechClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                mascotSpeech.style.animation = 'none'; // Clear CSS animation override
                mascotSpeech.style.transform = ''; // Clear inline styles
                mascotSpeech.classList.add('hidden');
                mascotContainer.classList.add('speech-closed');
                speechVisible = false;
                isSpeechClosed = true; // Mark as closed by user
            });
        }

        // Click mascot to toggle speech
        mascotCharacter.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mascotSpeech.style.animation = 'none'; // Clear CSS animation override
            mascotSpeech.style.transform = ''; // Clear inline styles

            if (!speechVisible) {
                mascotSpeech.classList.remove('hidden');
                mascotContainer.classList.remove('speech-closed');
                speechVisible = true;
                isSpeechClosed = false; // Reset if opened manually
                // Wiggle animation
                mascotCharacter.style.animation = 'none';
                mascotCharacter.offsetHeight; // trigger reflow
                mascotCharacter.style.animation = '';

                // Ensure text is up to date immediately when reopening
                if (sectionMessages[currentSection]) {
                    mascotText.textContent = sectionMessages[currentSection];
                }
            } else {
                mascotSpeech.classList.add('hidden');
                mascotContainer.classList.add('speech-closed');
                speechVisible = false;
                isSpeechClosed = true;
            }
        });

        // Detect which section is visible and update message
        const sections = document.querySelectorAll('section[id], footer');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id || 'contact';
                    if (sectionMessages[id] && id !== currentSection) {
                        currentSection = id;
                        // Animate text change
                        if (speechVisible && !isSpeechClosed) {
                            mascotSpeech.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                mascotText.textContent = sectionMessages[id];
                                mascotSpeech.style.transform = ''; // Empty string so CSS handles it
                            }, 200);
                        } else {
                            mascotText.textContent = sectionMessages[id];
                        }
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -20% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // =========================================================================
    // 10. Analytics Tracking (GA4 & Meta Pixel)
    // =========================================================================

    // Helper function to safely send events
    const trackEvent = (eventName, eventParams = {}) => {
        if (typeof gtag === 'function') {
            gtag('event', eventName, eventParams);
        }
        if (typeof fbq === 'function') {
            if (eventName === 'generate_lead') {
                fbq('track', 'Lead', eventParams);
            } else if (eventName === 'view_item_list') {
                fbq('track', 'ViewContent', eventParams);
            } else {
                fbq('trackCustom', eventName, eventParams);
            }
        }
    };

    // 10.1 Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('generate_lead', {
                method: 'whatsapp',
                content_type: 'contact_button'
            });
        });
    });

    // 10.2 Track Pricing Plan clicks
    document.querySelectorAll('.pricing-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const planCard = e.target.closest('.pricing-card');
            const planName = planCard ? planCard.querySelector('h3').innerText : 'Unknown Plan';

            trackEvent('select_item', {
                item_list_name: 'pricing_plans',
                items: [{ item_name: planName }]
            });

            // Re-trigger lead for WA intent with plan name
            trackEvent('generate_lead', {
                method: 'whatsapp_pricing',
                plan_selected: planName
            });
        });
    });

    // =========================================================================
    // 11. Native Contact Form Submission with Cloudflare Worker
    // =========================================================================
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("contact-submit-btn");
    const successMsg = document.getElementById("contact-success");
    const errorMsg = document.getElementById("contact-error");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Get form data
            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const phone = document.getElementById("contact-phone").value;
            const message = document.getElementById("contact-message").value;

            // Get Turnstile response
            const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]')?.value;

            if (!turnstileResponse) {
                errorMsg.textContent = "Por favor, completa la verificación de seguridad (Captcha).";
                errorMsg.style.display = "block";
                successMsg.style.display = "none";
                return;
            }

            // UI Feedback
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span> <i class="ph ph-spinner ph-spin" style="animation: spin 1s linear infinite;"></i><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>';
            submitBtn.disabled = true;
            errorMsg.style.display = "none";
            successMsg.style.display = "none";

            try {
                // Determine API URL based on environment
                // Use production Cloudflare Worker URL:
                const API_URL = "https://amelie-contact-form.ismael-aguilera.workers.dev";

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        message,
                        turnstileResponse
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    successMsg.textContent = "¡Hemos recibido tu mensaje! Gracias por contactarnos.";
                    successMsg.style.display = "block";
                    contactForm.reset();
                    // Reset Turnstile widget
                    if (window.turnstile) {
                        window.turnstile.reset();
                    }

                    // Analytics tracking for new form
                    trackEvent('generate_lead', {
                        method: 'contact_form_success',
                        content_type: 'contact'
                    });
                } else {
                    throw new Error(data.error || "Error al enviar el formulario.");
                }
            } catch (err) {
                errorMsg.textContent = err.message || "Hubo un error de conexión. Inténtalo de nuevo.";
                errorMsg.style.display = "block";
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});



// Cookie Consent Logic
document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.style.animation = 'slideDownCookie 0.5s forwards';
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    });
});

// Add slide down animation dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDownCookie {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
`;
document.head.appendChild(style);

