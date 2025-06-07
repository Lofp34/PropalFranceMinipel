let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateSlideCounter();
    updateProgressBar();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Add touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Auto-advance timer (optional - commented out by default)
    // setInterval(nextSlide, 30000); // 30 seconds
});

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        slides[currentSlide].classList.remove('active');
        currentSlide++;
        slides[currentSlide].classList.add('active');
        updateSlideCounter();
        updateProgressBar();
        updateNavButtons();
        
        // Trigger animations for the new slide
        triggerSlideAnimations();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        slides[currentSlide].classList.remove('active');
        currentSlide--;
        slides[currentSlide].classList.add('active');
        updateSlideCounter();
        updateProgressBar();
        updateNavButtons();
        
        // Trigger animations for the new slide
        triggerSlideAnimations();
    }
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides && index !== currentSlide) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateSlideCounter();
        updateProgressBar();
        updateNavButtons();
        
        // Trigger animations for the new slide
        triggerSlideAnimations();
    }
}

// Add updateIndicators function at global scope
let updateIndicators = function() {};  // Will be overridden by createSlideIndicators

function updateSlideCounter() {
    document.getElementById('current-slide').textContent = currentSlide + 1;
    document.getElementById('total-slides').textContent = totalSlides;
}

function updateProgressBar() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

function handleKeyNavigation(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'PageUp':
            e.preventDefault();
            prevSlide();
            break;
        case 'Home':
            e.preventDefault();
            window.goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            window.goToSlide(totalSlides - 1);
            break;
        case 'Escape':
            toggleFullscreen();
            break;
    }
}

function triggerSlideAnimations() {
    const currentSlideElement = slides[currentSlide];
    
    // Remove and re-add animation classes to retrigger animations
    const animatedElements = currentSlideElement.querySelectorAll('.achievement-card, .signal-card, .advantage-card, .phase-item');
    
    animatedElements.forEach((element, index) => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `fadeInScale 0.6s ease forwards`;
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Special animations for specific slides
    switch(currentSlide) {
        case 0: // Title slide
            animateTitleSlide();
            break;
        case 1: // Context slide
            animateContextSlide();
            break;
        case 7: // Advantages slide
            animateAdvantagesSlide();
            break;
        case 8: // Investment slide
            animateInvestmentSlide();
            break;
    }
}

function animateTitleSlide() {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        box.style.animation = 'none';
        box.offsetHeight;
        box.style.animation = `slideInUp 0.8s ease forwards`;
        box.style.animationDelay = `${0.5 + index * 0.2}s`;
    });
}

function animateContextSlide() {
    const challengeBox = document.querySelector('.challenge-box');
    if (challengeBox) {
        challengeBox.style.animation = 'slideInUp 0.8s ease forwards';
        challengeBox.style.animationDelay = '0.5s';
    }
}

function animateAdvantagesSlide() {
    // Animate ROI calculation
    const roiItems = document.querySelectorAll('.roi-item, .roi-operator, .roi-result');
    roiItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function animateInvestmentSlide() {
    // Animate price reveal
    const priceAmount = document.querySelector('.price-amount');
    if (priceAmount) {
        priceAmount.style.transform = 'scale(0)';
        setTimeout(() => {
            priceAmount.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            priceAmount.style.transform = 'scale(1)';
        }, 500);
    }
    
    // Animate comparison bars
    const barFills = document.querySelectorAll('.bar-fill');
    barFills.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = width || (index === 0 ? '5%' : '100%');
        }, 1000 + index * 500);
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Utility functions for enhanced UX
function preloadImages() {
    // Preload any background images or icons that might be needed
    const images = [
        // Add any image URLs here if needed
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Analytics and tracking (optional)
function trackSlideView(slideIndex) {
    // Add analytics tracking here if needed
    console.log(`Viewing slide ${slideIndex + 1}`);
}

// Performance optimization
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

// Smooth scrolling for better UX
function smoothScrollToSlide(index) {
    window.goToSlide(index);
}

// Add slide indicator dots (optional enhancement)
function createSlideIndicators() {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'slide-indicators';
    indicatorsContainer.style.cssText = `
        position: fixed;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    `;
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'slide-indicator';
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        if (i === 0) {
            indicator.style.background = 'rgba(255, 255, 255, 0.8)';
        }
        
        indicator.addEventListener('click', () => window.goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
    
    document.body.appendChild(indicatorsContainer);
    
    // Update indicators when slide changes
    const originalGoToSlide = goToSlide;
    window.goToSlide = function(index) {
        originalGoToSlide(index);
        updateIndicators();
    };
    
    updateIndicators = function() {
        const indicators = document.querySelectorAll('.slide-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.style.background = 'rgba(255, 255, 255, 0.8)';
                indicator.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            } else {
                indicator.style.background = 'transparent';
                indicator.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }
        });
    }
}

// Initialize slide indicators after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createSlideIndicators, 1000);
});

// Add presentation mode toggle
function togglePresentationMode() {
    const nav = document.querySelector('.slide-nav');
    const progress = document.querySelector('.progress-bar');
    
    if (nav.style.display === 'none') {
        nav.style.display = 'flex';
        progress.style.display = 'block';
    } else {
        nav.style.display = 'none';
        progress.style.display = 'none';
    }
}

// Add keyboard shortcut for presentation mode
document.addEventListener('keydown', function(e) {
    if (e.key === 'p' || e.key === 'P') {
        togglePresentationMode();
    }
});

// Auto-save presentation state
function saveCurrentSlide() {
    localStorage.setItem('currentSlide', currentSlide);
}

function loadSavedSlide() {
    const saved = localStorage.getItem('currentSlide');
    if (saved !== null) {
        const slideIndex = parseInt(saved);
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            window.goToSlide(slideIndex);
        }
    }
}

// Save slide position on change
const originalNextSlide = nextSlide;
const originalPrevSlide = prevSlide;

window.nextSlide = function() {
    originalNextSlide();
    saveCurrentSlide();
    trackSlideView(currentSlide);
    updateIndicators();
};

window.prevSlide = function() {
    originalPrevSlide();
    saveCurrentSlide();
    trackSlideView(currentSlide);
    updateIndicators();
};

// Load saved position on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadSavedSlide, 100);
});

// Add mouse wheel navigation
document.addEventListener('wheel', debounce(function(e) {
    if (Math.abs(e.deltaY) > 50) { // Threshold to avoid accidental triggers
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}, 300));

// Initialize navigation buttons state
document.addEventListener('DOMContentLoaded', function() {
    updateNavButtons();
});

// Add click handlers for specific interactive elements
function addInteractiveElements() {
    // Add click handlers for stat boxes, cards, etc.
    document.querySelectorAll('.achievement-card, .signal-card, .advantage-card').forEach(card => {
        card.addEventListener('click', function() {
            // Add interactive feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

document.addEventListener('DOMContentLoaded', addInteractiveElements); 