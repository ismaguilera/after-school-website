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
        '.activity-card, .time-block, .why-card, .testimonial-card, .faq-item'
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
                    const rotY = -12 + currentX * 15;
                    const rotX = 5 + currentY * -10;
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
                const rotY = -12 + currentX * 15;
                const rotX = 5 + currentY * -10;
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
    const timelineSection = document.querySelector('.day-timeline');
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
    // =========================================================================
    const activityCards = document.querySelectorAll('.activity-card');

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
        let currentSection = 'hero';

        // Section-specific messages
        const sectionMessages = {
            'about': '¡Hola! Soy Amelie 🌸 ¡Te doy la bienvenida a nuestro sitio web!',
            'why-us': '¿Sabías que somos el after school más cálido? 🏡 ¡Los papás confían en nosotros!',
            'activities': '🎨 ¡Me encantan los talleres! Cada día hacemos algo diferente y divertido.',
            'testimonials': '💜 ¡Mira lo que dicen los papás! Sus palabras nos llenan de alegría.',
            'day': '🕐 Así es un día típico conmigo... ¡Nunca nos aburrimos!',
            'schedule': '📅 ¡Apúrate, los cupos son limitados! Inscribe a tus hijos pronto.',
            'faq': '🤔 ¿Tienes dudas? ¡Aquí encuentras las respuestas más comunes!',
            'contact': '📱 ¡Escríbenos por WhatsApp! Estamos felices de ayudarte 😊'
        };

        // Close speech bubble
        if (speechClose) {
            speechClose.addEventListener('click', (e) => {
                e.stopPropagation();
                mascotSpeech.classList.add('hidden');
                mascotContainer.classList.add('speech-closed');
                speechVisible = false;
            });
        }

        // Click mascot to toggle speech
        mascotCharacter.addEventListener('click', () => {
            if (!speechVisible) {
                mascotSpeech.classList.remove('hidden');
                mascotContainer.classList.remove('speech-closed');
                speechVisible = true;
                // Wiggle animation
                mascotCharacter.style.animation = 'none';
                mascotCharacter.offsetHeight; // trigger reflow
                mascotCharacter.style.animation = '';
            } else {
                mascotSpeech.classList.add('hidden');
                mascotContainer.classList.add('speech-closed');
                speechVisible = false;
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
                        if (speechVisible) {
                            mascotSpeech.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                mascotText.textContent = sectionMessages[id];
                                mascotSpeech.style.transform = 'scale(1)';
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
});
