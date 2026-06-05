/**
 * ================================================================
 *   CORE INTERACTIVE LOGIC FOR PORTFOLIO
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements Selectors ---
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const scrollTopBtn = document.getElementById('scroll-top');
    const body = document.body;

    // Project Filter Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Contact Form Elements
    const contactForm = document.getElementById('contact-form');
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');
    const formSubject = document.getElementById('form-subject');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('btn-submit-form');
    const toast = document.getElementById('toast-message');

    // Hero Spheres
    const sphere1 = document.querySelector('.sphere-1');
    const sphere2 = document.querySelector('.sphere-2');

    // ================================================================
    // 1. NAVIGATION & MOBILE MENU
    // ================================================================
    
    // Toggle Mobile Navigation Menu
    mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close Mobile Menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Scroll Effects (Header Shrinking & Scroll-To-Top Visibility)
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Shrink Header
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/Hide Scroll to Top Button
        if (scrollPos > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // Scroll to Top Action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ================================================================
    // 2. THEME SWITCHER (DARK / LIGHT MODE)
    // ================================================================
    
    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ================================================================
    // 3. INTERSECT OBSERVER FOR ACTIVE NAV & SKILLS ANIMATION
    // ================================================================
    
    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navObserverOptions = {
        root: null,
        threshold: 0.25, // Highlight when 25% of section is visible
        rootMargin: "-80px 0px 0px 0px" // Account for header height
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Skills Animation Observer
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    const skillObserverOptions = {
        root: null,
        threshold: 0.1
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-percent');
                    bar.style.width = targetWidth;
                });
                // Unobserve once animated
                skillObserver.unobserve(entry.target);
            }
        });
    }, skillObserverOptions);

    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // ================================================================
    // 4. FILTERABLE PROJECTS GRID
    // ================================================================
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add fade out animation first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300); // Matches transition duration
            });
        });
    });

    // ================================================================
    // 5. CONTACT FORM VALIDATION & INTERACTIVE STATE
    // ================================================================
    
    // Helper to check valid email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Show error helper
    function showError(inputElement, errorId) {
        const errorSpan = document.getElementById(errorId);
        errorSpan.style.display = 'block';
        inputElement.style.borderColor = '#ef4444';
    }

    // Clear error helper
    function clearError(inputElement, errorId) {
        const errorSpan = document.getElementById(errorId);
        errorSpan.style.display = 'none';
        inputElement.style.borderColor = 'var(--border-color)';
    }

    // Input listeners to clear errors on typing
    formName.addEventListener('input', () => clearError(formName, 'name-error'));
    formEmail.addEventListener('input', () => clearError(formEmail, 'email-error'));
    formSubject.addEventListener('input', () => clearError(formSubject, 'subject-error'));
    formMessage.addEventListener('input', () => clearError(formMessage, 'message-error'));

    // Handle Form Submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Name validation
        if (formName.value.trim() === '') {
            showError(formName, 'name-error');
            isFormValid = false;
        } else {
            clearError(formName, 'name-error');
        }

        // Email validation
        if (!isValidEmail(formEmail.value.trim())) {
            showError(formEmail, 'email-error');
            isFormValid = false;
        } else {
            clearError(formEmail, 'email-error');
        }

        // Subject validation
        if (formSubject.value.trim() === '') {
            showError(formSubject, 'subject-error');
            isFormValid = false;
        } else {
            clearError(formSubject, 'subject-error');
        }

        // Message validation
        if (formMessage.value.trim() === '') {
            showError(formMessage, 'message-error');
            isFormValid = false;
        } else {
            clearError(formMessage, 'message-error');
        }

        if (isFormValid) {
            // Enter loading state
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                Mengirim Pesan... 
                <svg class="loading-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite; margin-left: 8px;">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
                </svg>
            `;

            // Spin animation styling injector
            if (!document.getElementById('spin-style')) {
                const styleSheet = document.createElement("style");
                styleSheet.id = 'spin-style';
                styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(styleSheet);
            }

            // Simulate API submission
            setTimeout(() => {
                // Success Actions
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show Success Toast
                toast.classList.add('show');
                
                // Hide Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
            }, 1800);
        }
    });

    // ================================================================
    // 6. HERO INTERACTIVE PARALLAX SPHERES
    // ================================================================
    
    document.addEventListener('mousemove', (e) => {
        if (!sphere1 || !sphere2) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        // Move spheres in opposite direction slightly
        const moveX1 = mouseX * -30;
        const moveY1 = mouseY * -30;
        const moveX2 = mouseX * 50;
        const moveY2 = mouseY * 50;
        
        sphere1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
        sphere2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
    });
});
