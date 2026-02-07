// ========== UTILITY FUNCTIONS ==========
function formatTime(date) {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ========== CLOCK FUNCTION (WIB) ==========
function initClock() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    
    function updateClock() {
        try {
            const now = new Date();
            const wibTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
            
            if (clockElement) {
                clockElement.textContent = formatTime(wibTime);
            }
            if (dateElement) {
                dateElement.textContent = formatDate(wibTime);
            }
        } catch (e) {
            console.error('Clock error:', e);
        }
    }
    
    if (clockElement || dateElement) {
        updateClock();
        setInterval(updateClock, 1000);
    }
}

// ========== LOADING INCLUDES ==========
async function loadIncludes() {
    const includes = document.querySelectorAll('[data-include]');
    if (!includes.length) return;
    
    const loadPromises = Array.from(includes).map(async (el) => {
        const url = el.getAttribute('data-include');
        if (!url) return;
        
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('HTTP error! status: ' + res.status);
            }
            
            const text = await res.text();
            el.innerHTML = text;
            
            const scripts = el.querySelectorAll('script');
            scripts.forEach((oldScript) => {
                const newScript = document.createElement('script');
                
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                    newScript.async = false;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                
                Array.from(oldScript.attributes).forEach((attr) => {
                    if (attr.name !== 'src') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                document.head.appendChild(newScript);
                oldScript.remove();
            });
            
            el.removeAttribute('data-include');
            
        } catch (e) {
            console.error('Include failed:', url, e);
            el.innerHTML = '<p style="color:red;">Failed to load: ' + url + '</p>';
        }
    });
    
    await Promise.all(loadPromises);
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// ========== PROJECT CARDS ANIMATION ==========
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// ========== LAZY LOADING IMAGES ==========
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach((img) => imageObserver.observe(img));
    } else {
        // Fallback untuk browser lama
        images.forEach((img) => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ========== SCROLL TO TOP BUTTON ==========
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== NAVBAR SCROLL EFFECT ==========
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ========== FORM VALIDATION ==========
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach((form) => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach((input) => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                console.log('Form valid, submitting...');
                // this.submit(); // Uncomment untuk submit form
            } else {
                console.log('Form has errors');
            }
        });
    });
}

// ========== DARK MODE TOGGLE ==========
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    toggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach((el) => observer.observe(el));
    } else {
        // Fallback untuk browser lama
        animatedElements.forEach((el) => {
            el.classList.add('animate-in');
        });
    }
}

// ========== LOCAL STORAGE UTILITY ==========
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return false;
        }
    },
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return null;
        }
    },
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return false;
        }
    }
};

// ========== MAIN INITIALIZATION ==========
async function init() {
    try {
        document.body.classList.add('loading');
        
        await loadIncludes();
        
        initClock();
        initSmoothScroll();
        initProjectCards();
        initLazyLoading();
        initScrollToTop();
        initNavbarScroll();
        initFormValidation();
        initDarkMode();
        initScrollAnimations();
        
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        console.log('Website initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        document.body.classList.remove('loading');
    }
}

// ========== EVENT LISTENERS ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Handle online/offline
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
});