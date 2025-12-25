// script.js

// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-level');

// Initialize the application
function initApp() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Contact form submission
    contactForm.addEventListener('submit', handleContactFormSubmit);

    // Animate skill bars when in viewport
    animateSkillBars();

    // Add scroll event listener for skill bars animation
    window.addEventListener('scroll', animateSkillBars);

    // Add active class to navbar on scroll
    window.addEventListener('scroll', highlightNavOnScroll);
}

// Toggle mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close mobile menu
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();

    // Configuration: Aapka email yahan set hai
    const email = "saqibabdulraouf15@gmail.com";
    const url = `https://formsubmit.co/ajax/${email}`;

    const formData = new FormData(contactForm);

    // FormSubmit Optimizations
    formData.append('_subject', `New Message from ${formData.get('name')} | Portfolio`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    // 1. Security Check: Honeypot (Bot Detection)
    if (formData.get('_honey')) {
        console.warn('Bot detected via honeypot');
        return; // Silently ignore bot submissions
    }

    // 2. Security Check: Bad Patterns (Virus/Script Detection)
    const badPatterns = [
        /<script/i, /javascript:/i, /onerror/i, /onload/i, /eval\(/i,
        /document\./i, /window\./i, /<iframe/i, /<object/i
    ];

    let isMalicious = false;
    formData.forEach((value) => {
        if (typeof value === 'string' && badPatterns.some(pattern => pattern.test(value))) {
            isMalicious = true;
        }
    });

    if (isMalicious) {
        showNotification('❌ Warning: Malicious input detected. Submission blocked.');
        console.error('Security alert: Malicious pattern detected in form input.');
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('🌟 Thank you! Your message has been sent successfully. I will get back to you soon!');
            contactForm.reset();
        } else {
            console.error('FormSubmit Error:', data);
            showNotification('❌ Error: Could not send message.');
        }
    } catch (err) {
        console.error('Submission failed', err);
        showNotification('❌ Error: Network problem.');
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(to right, var(--primary), var(--secondary));
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1300;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 3s forwards;
    `;

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3300);
}

// Animate skill bars when they come into view
function animateSkillBars() {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;

    const sectionPosition = skillsSection.getBoundingClientRect();
    const screenPosition = window.innerHeight / 1.2;

    // If skills section is in viewport
    if (sectionPosition.top < screenPosition) {
        skillBars.forEach(bar => {
            // Remove any existing transition delay
            bar.style.transitionDelay = '0s';
            // Set the width to the actual value (it's already set via inline style)
            // We just need to trigger the animation by re-setting the width
            const currentWidth = bar.style.width;
            bar.style.width = '0';

            // Use setTimeout to trigger the animation
            setTimeout(() => {
                bar.style.width = currentWidth;
            }, 100);
        });

        // Remove event listener after animation
        window.removeEventListener('scroll', animateSkillBars);
    }
}

// Highlight active navigation link on scroll
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);