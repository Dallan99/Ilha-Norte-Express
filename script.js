// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (!mobileMenu.contains(event.target) && !toggle.contains(event.target)) {
        mobileMenu.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Service cards hover effects for desktop
if (window.innerWidth > 768) {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Touch handling for mobile service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Scroll to top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px)';
        scrollBtn.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.5)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
    });
}

// Mobile responsive adjustments for scroll to top
function adjustScrollButtonForMobile() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn && window.innerWidth <= 768) {
        scrollBtn.style.bottom = '15px';
        scrollBtn.style.right = '15px';
        scrollBtn.style.width = '45px';
        scrollBtn.style.height = '45px';
        scrollBtn.style.fontSize = '18px';
    }
}

// Optimize animations for mobile
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Reduce animation intensity on mobile
        document.documentElement.style.setProperty('--animation-intensity', '0.7');
        
        // Disable parallax on mobile for better performance
        window.removeEventListener('scroll', parallaxEffect);
    } else {
        document.documentElement.style.setProperty('--animation-intensity', '1');
    }
}

// Parallax effect function (separated for mobile optimization)
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Close mobile menu on orientation change
        closeMobileMenu();
        
        // Recalculate layout
        window.scrollTo(0, window.scrollY);
        
        // Adjust scroll button for new orientation
        adjustScrollButtonForMobile();
    }, 100);
});

// Optimize performance
window.addEventListener('resize', debounce(function() {
    optimizeForMobile();
    adjustScrollButtonForMobile();
}, 250));

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization - lazy load images (if any images are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Enhanced mobile menu accessibility
document.addEventListener('keydown', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Close mobile menu with Escape key
    if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    createScrollToTopButton();
    
    // Optimize for mobile on initial load
    optimizeForMobile();
    adjustScrollButtonForMobile();
    
    // Add loading animation complete
    document.body.classList.add('loaded');
    
    // Performance optimizations
    if (window.innerWidth > 768) {
        // Add parallax only on desktop
        window.addEventListener('scroll', parallaxEffect);
    }
    
    // Preload critical resources if needed
    // Add any additional initialization here
});

// Form handling (if form is added later)
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.classList.contains('contact-form-element')) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Obrigado! Recebemos sua solicitação e entraremos em contato em breve.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }
});

// Add smooth animations for better UX
function addSmoothTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .loaded .fade-in {
            transition-delay: 0.1s;
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize smooth transitions
addSmoothTransitions();