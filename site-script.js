document.addEventListener("DOMContentLoaded", function () {
    
    initNavAnimation();
    
    initHamburgerNav();
    
    initServiceCarousel();
    
    initObfu();

    initModals();
});

// Navigation Bar home fade in animation
function initNavAnimation() {
    const navbar = document.querySelector('.nav-bar');
    const hamburgerNav = document.querySelector('.hamburger-menu');
    const homeSection = document.querySelector('#home');

    // Sentinel element for bottom of home section. Used to watch if navbar is intersecting home
    const bottomSentinel = document.createElement('div');

    // Sentinel styles
    [bottomSentinel].forEach(element => {
        element.style.height = '1px';
        element.style.width = '100%';
        element.style.position = 'absolute';
        element.style.left = '0';
        element.style.visibility = 'hidden';
    });

    // Positioning of sentinel
    bottomSentinel.style.bottom = '0';
    
    // Appending sentinel to Home Section
    homeSection.appendChild(bottomSentinel);

    // Intersection observer
    const navObserver = new IntersectionObserver((sentinels) => {
        console.log('is observing');
        // Executes when sentinel enter/exit viewport
        const isOverHomeSection = sentinels.some(sentinel => sentinel.isIntersecting);
        if (isOverHomeSection) {
            // If either sentinel are visible, navbar is still over the homepage
            navbar.classList.add('nav-bar-transparent');
            hamburgerNav.classList.add('nav-bar-transparent');
        } else {
            //If both sentinels are not visible, navbar is past the homepage
            navbar.classList.remove('nav-bar-transparent');
            hamburgerNav.classList.remove('nav-bar-transparent');
        }
    }, {
        threshold: 0, // Threshold for how much navbar needs to enter/exit viewport before observed
        rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px` // Observer takes height of navbar into account.
    });
    navObserver.observe(bottomSentinel);
}
// Hamburger Navbar
function initHamburgerNav() {
    const menuIcon = document.querySelector(".icon");
    const menuLinks = document.getElementById("myLinks");
    const navbar = document.querySelector('.nav-container');

    //Open menu when clicking hamburger icon
    menuIcon.addEventListener('click', () => {
        menuLinks.classList.toggle('show');
    });
    menuIcon.addEventListener("keydown", (e) => {
        if (e.key === 'Enter') {
            console.log('enter pressed inside added')
            menuLinks.classList.toggle("show");
        }
    });
    
    // Close menu when clicking a link
    menuLinks.addEventListener('click', () => {
        menuLinks.classList.toggle('show');
    });
    menuLinks.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'a' && e.key === 'Enter') {
            console.log('enter pressed inside remove');
            menuLinks.classList.toggle('show');
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        if (!menuIcon.contains(event.target) && !menuLinks.contains(event.target)) {
            menuLinks.classList.remove("show");
            }
        });
}
// Service Carousel
function initServiceCarousel() { 
    const items = Array.from(document.querySelectorAll('.service-item'));
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const carousel = document.getElementById('carousel');
    const viewport = document.getElementById('carouselViewport');
    const srControls = document.querySelector('.carousel-controls');
    const totalItems = items.length;

    // Current active index (center)
    let activeIndex = 0;
    let isAnimating = false;

    // Create indicators buttons for screen readers and keyboard navigation
    items.forEach((item, index) => {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-label', `Go to service ${index + 1}`);
        button.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
        button.classList.add('sr-only');
        button.addEventListener('click', () => {
            goToSlide(index);
        });
        srControls.appendChild(button);
    });

    const indicators = Array.from(srControls.querySelectorAll('button'));

    // Associated function calls for carousel setup

    updateCarousel();
    // Allows for mobile swipe navigation
    setupTouchEvents();

    function updateCarousel() {
        items.forEach((item, index) => {
            // Remove all positional classes
            item.classList.remove('left', 'center', 'right', 'far-left', 'far-right');
    
            // Calculate relative positions with proper modulo for looping
            const relativePos = (((index - activeIndex) % totalItems) + totalItems) % totalItems;
    
            // Add proper positional class
           switch(true) {
            case relativePos === 0:
                item.classList.add('center');
                item.setAttribute('aria-hidden', 'false');
                item.tabIndex = 0;
                break;
            case relativePos === totalItems - 1:
                item.classList.add('left');
                item.setAttribute('aria-hidden', 'false');
                item.tabIndex = 0;
                break;
            case relativePos === 1:
                item.classList.add('right');
                item.setAttribute('aria-hidden', 'false');
                item.tabIndex = 0;
                break;
            case relativePos === totalItems - 2:
                item.classList.add('far-left');
                item.setAttribute('aria-hidden', 'true');
                item.tabIndex = -1;
                break;
            case relativePos === 2:
                item.classList.add('far-right');
                item.setAttribute('aria-hidden', 'true');
                item.tabIndex = -1;
                break;
            default:
                // For any other than the 3 displayed, hide them completely
                item.style.display = 'none';
                item.tabIndex = -1;
                break;
           }

            // Ensure all classified items are displayed
            if (item.classList.contains('left') ||
                item.classList.contains('center') ||
                item.classList.contains('right') ||
                item.classList.contains('far-left') ||
                item.classList.contains('far-right')) {
                    item.style.display = 'flex';
                }
        });
        
        // Update accessibility info
        carousel.setAttribute('aria-activedescendant', items[activeIndex].id || '');

        // Update indicator buttons
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
        });

        // Announce slide change to screen readers
        announceSlideChange();
    }
    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating || index === activeIndex) return;
        isAnimating = true;
    
        activeIndex = index;
        updateCarousel();
        items[index].focus();
    
        setTimeout(() => {
            isAnimating = false;
        }, 500); //Prevents to many updates at once.
    }
    
    // Move to previous slide
    function moveLeft() {
        if(isAnimating) return;
        isAnimating = true;
    
        activeIndex = (activeIndex - 1 + totalItems) % totalItems
        updateCarousel();
    
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Move to next slide
    function moveRight() {
        if (isAnimating) return;
        isAnimating = true;
    
        activeIndex = (activeIndex + 1) % totalItems;
        updateCarousel();
    
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    //Touch event for mobile swipe
    function setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
    
        viewport.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true});
        viewport.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left --> move right
                moveRight();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right --> move left
                moveLeft();
            }
        }
    }
    
    //Announce slide changes to screen readers
    function announceSlideChange() {
        const liveRegion = document.getElementById('carousel-live-region');
        if (!liveRegion) {
            const newRegion = document.createElement('div');
            newRegion.id = 'carousel-live-region';
            newRegion.setAttribute('aria-live', 'polite');
            newRegion.setAttribute('aria-atomic', 'true');
            newRegion.className = 'sr-only';
            document.body.appendChild(newRegion);
        }
        const announcement = `Service ${activeIndex + 1} of ${totalItems}, ${items[activeIndex].textContent}`;
        document.getElementById('carousel-live-region').textContent = announcement;
    }
    //Event listeners for buttons
    prevButton.addEventListener('click', moveLeft);
    nextButton.addEventListener('click', moveRight);
}

function initObfu() {
    let e = String.fromCharCode(106,111,104,110,115,111,110,46,100,117,110,110,108,108,99,64,103,109,97,105,108,46,99,111,109);
    document.getElementById('eml').innerText = e;   
}
function initModals() {
    let accessibilityModal = document.getElementById('accessibility-modal');
    let privacyModal = document.getElementById('privacy-modal');
    let openAccess = document.getElementById('accessibility');
    let openPrivacy = document.getElementById('privacy');
    let formPrivacyIcon = document.getElementById('form-privacy-icon');
    let closeAccess = document.getElementsByClassName('close-modal')[0];
    let srCloseAccess = document.getElementsByClassName('sr-close-modal')[0];
    let closePrivacy = document.getElementsByClassName('close-modal')[1];
    let srClosePrivacy = document.getElementsByClassName('sr-close-modal')[1];
    let iconFocus;
    
    function openPrivacyModal() {
        privacyModal.style.display = 'block';
        privacyModal.focus();
    }
    function openAccessibilityModal() {
        accessibilityModal.style.display = 'block'
        accessibilityModal.focus();
    }
    function closeModals() {
        if (iconFocus === true) {
            privacyModal.style.display = 'none';
            formPrivacyIcon.focus();
        } else {
            privacyModal.style.display = 'none';
            openPrivacy.focus();
        }
        accessibilityModal.style.display = 'none';
    }
    formPrivacyIcon.onclick = function() {
        iconFocus = true;
        openPrivacyModal();
    }
    openAccess.onclick = function() {
        openAccessibilityModal();
    }
    openPrivacy.onclick = function() {
        iconFocus = false;
        openPrivacyModal();
    }
    closeAccess.onclick = function() {
        closeModals();
        openAccess.focus();
    }
    srCloseAccess.onclick = function() {
        closeModals();
        openAccess.focus();
    }
    closePrivacy.onclick = function () {
        closeModals();
    }
    srClosePrivacy.onclick = function () {
        closeModals();
    }
    
    window.onclick = function(event) {
        if (event.target === accessibilityModal || event.target === privacyModal) {
            closeModals();
        }
    }

}