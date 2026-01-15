document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation
    const roles = [
        "I'm Saqib Abdul Raouf",
        "Web Developer",
        "AI Agent Creator",
        "Programmer",
        "IT Graduate"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRole() {
        const currentRole = roles[roleIndex];
        const typedElement = document.getElementById('typed-text');

        if (!typedElement) return;

        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeRole, typingSpeed);
    }

    // Start typing animation
    typeRole();

    // Dark Mode Toggle
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        const icon = themeToggleButton.querySelector('i');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
    }

    window.toggleTheme = () => {
        body.classList.toggle('light-mode');
        const icon = themeToggleButton.querySelector('i');

        if (body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    };

    // UI Toggles
    let projectModal;

    window.openAboutModal = () => {
        const content = document.getElementById('full-about-content').innerHTML;
        const modalTitle = document.getElementById('projectModalLabel');
        const modalBody = document.getElementById('projectModalBody');

        modalTitle.textContent = "About Me";
        modalBody.innerHTML = `<div class="p-2">${content}</div>`;

        if (!projectModal) {
            projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
        }
        projectModal.show();
    };

    window.toggleDetails = (btn, id) => {
        const details = document.getElementById(id);
        const projectCard = btn.closest('.project-card');

        // Extract data
        const projectTitle = projectCard.querySelector('h4').textContent;
        const imgSrc = projectCard.querySelector('.project-img').src;
        const projectDate = projectCard.querySelector('.project-date').textContent;
        const mainDesc = projectCard.querySelector('.project-card-body > p').textContent;
        const detailedContent = details.innerHTML;

        const modalTitle = document.getElementById('projectModalLabel');
        const modalBody = document.getElementById('projectModalBody');

        // Populate modal with rich content (Two columns to reduce scrolling)
        modalTitle.textContent = projectTitle;
        modalBody.innerHTML = `
            <div class="modal-content-wrapper">
                <img src="${imgSrc}" alt="${projectTitle}" class="modal-project-img">
                <div class="modal-project-info">
                    <span class="modal-project-date"><i class="far fa-calendar-alt me-2"></i> ${projectDate}</span>
                    <p class="modal-project-desc">${mainDesc}</p>
                    <hr class="my-3 opacity-10">
                    <div class="detailed-info">
                        ${detailedContent}
                    </div>
                </div>
            </div>
        `;

        // Show modal using Bootstrap API
        if (!projectModal) {
            projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
        }
        projectModal.show();
    };

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const navHeight = navbar.offsetHeight;
            if (window.scrollY >= sectionTop - navHeight - 10) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Fade-in Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // Stat Counting Animation
    const stats = document.querySelectorAll('.stat-number');

    const countUp = (el) => {
        // Clear any previous interval to prevent overlapping
        if (el.intervalId) clearInterval(el.intervalId);

        const target = parseInt(el.getAttribute('data-target'));
        const suffix = (el.getAttribute('data-target') === '2') ? '' : '+';
        let current = 0;

        const duration = 1000; // 1 second for a snappier feel on repeat
        const steps = 30;
        const increment = target / steps;
        const stepTime = duration / steps;

        el.intervalId = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target + suffix;
                clearInterval(el.intervalId);
            } else {
                el.innerText = Math.floor(current) + suffix;
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
            } else {
                // Reset to 0 when out of view so it can restart
                const suffix = (entry.target.getAttribute('data-target') === '2') ? '' : '+';
                entry.target.innerText = '0' + suffix;
            }
        });
    }, { threshold: 0.1 });

    stats.forEach(stat => statsObserver.observe(stat));

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
            btn.disabled = true;

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => data[key] = value);

            fetch(this.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(result => {
                    alert('Success! Your message has been sent to Saqib Abdul Raouf.');
                    this.reset();
                })
                .catch(error => {
                    alert('Oops! Something went wrong. Please try again later.');
                })
                .finally(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Google Login & Access Control Logic
    const loginModalElement = document.getElementById('loginModal');
    let loginModal;
    if (loginModalElement) {
        loginModal = new bootstrap.Modal(loginModalElement);
    }

    const googleLoginBtn = document.getElementById('googleLoginBtn');
    let pendingUrl = null;

    // Helper to check login status
    const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';

    // Handle restricted access links
    const restrictedLinks = document.querySelectorAll('.restricted-access, .social-links-hero a, .social-links-contact a');

    restrictedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isLoggedIn()) {
                e.preventDefault();
                pendingUrl = link.href;
                if (loginModal) loginModal.show();
            }
            // If logged in, let the default action happen
        });
    });

    // Handle Google Login Simulation
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            // Loading state
            const originalText = googleLoginBtn.innerHTML;
            googleLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Signing in...';
            googleLoginBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');

                // Success State
                googleLoginBtn.innerHTML = '<i class="fas fa-check me-2"></i> Signed In';
                googleLoginBtn.classList.add('btn-success');

                setTimeout(() => {
                    if (loginModal) loginModal.hide();

                    if (pendingUrl) {
                        window.open(pendingUrl, '_blank');
                        pendingUrl = null;
                    }

                    // Reset button style after a delay (optional cleanup)
                    setTimeout(() => {
                        googleLoginBtn.innerHTML = originalText;
                        googleLoginBtn.disabled = false;
                        googleLoginBtn.classList.remove('btn-success');
                    }, 500);
                }, 800);
            }, 1500);
        });
    }
});