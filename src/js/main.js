document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Navigation - Active Link Highlighting
    // ============================================
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // Navbar Background on Scroll
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-category, .stat-card, .project-card').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // Typing Effect for Code Window (Optional)
    // ============================================
    
    const codeLines = document.querySelectorAll('.code-line');
    if (codeLines.length > 0) {
        codeLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-10px)';
            
            setTimeout(() => {
                line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, 100 * index);
        });
    }

    // ============================================
    // Project Card Hover Effects
    // ============================================
    
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // ============================================
    // Skill Tags Interactive Filter (Optional)
    // ============================================
    
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Could add filtering logic here for projects
            // based on selected skills
        });
    });

    // ============================================
    // Console Easter Egg
    // ============================================
    
    console.log('%c👋 Ahoj!', 'font-size: 20px; font-weight: bold;');
    console.log('%cZaujíma ťa kód tejto stránky? Pozri si ho na GitHube!', 'font-size: 14px;');
    console.log('%chttps://github.com/tvojemeno', 'font-size: 12px; color: #8b0000;');
});

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function for performance optimization
 */
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

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}