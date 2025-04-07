document.addEventListener("DOMContentLoaded", function () {
    // Initialize Nav Bar Animation
    initNavAnimation();
    // Initialize Hamburger Nav bar
    initHamburgerNav();
    // Initialize Service Carousel
    initServiceCarousel();
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
//Hamburger Navbar
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
    const totalItems = items.length;

    // Current active index (center)
    let activeIndex = 0;
    let isAnimating = false;

    // Associated function calls for carousel

    updateCarousel();
    // Allows for keyboard navigation
    setupKeyboardNavigation();
    // Allows for mobile swipe navigation
    setupTouchEvents();

    function updateCarousel() {
        items.forEach((item, index) => {
            // Remove all positional classes
            item.classList.remove('left', 'center', 'right', 'far-left', 'far-right');
    
            // Calculate relative positions with proper modulo for looping
            const relativePos = (((index - activeIndex) % totalItems) + totalItems) % totalItems;
    
            // Add proper positional class
            //  *POTENTIALLY change relativePos if statements to be structured with SWITCH statement
            if (relativePos === 0) {
                item.classList.add('center');
                // aria changes
            } else if (relativePos === totalItems - 1) {
                item.classList.add('left');
                // aria changes
            } else if (relativePos === 1) {
                item.classList.add('right');
                // aria changes
            } else if (relativePos === totalItems - 2) {
                item.classList.add('far-left');
                
            } else if (relativePos === 2) {
                item.classList.add('far-right');
               
            } else {
                // For any other than 3 displayed, hide them completely
                item.style.display = 'none';
               
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
    }
    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating || index === activeIndex) return;
        isAnimating = true;
    
        activeIndex = index;
        updateCarousel();
    
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match transition duration. Prevents to many updates at once.
    }
    
    // Move to previous slide
    function moveLeft() {
        if(isAnimating) return;
        isAnimating = true;
    
        activeIndex = (activeIndex - 1 + totalItems) % totalItems
        updateCarousel();
    
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match transition duration
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
    
    // Keyboard Navigation
    function setupKeyboardNavigation() {
        // Add unique IDs to items if they don't have them
        items.forEach((item, index) => {
            if (!item.id) {
                item.id = `carousel-item-${index}`;
            }
        });
    
        // Keyboard event listeners
        carousel.addEventListener('keydown', e => {
            switch (e.key) {
                case 'ArrowLeft':
                    moveLeft();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    moveRight();
                    e.preventDefault();
                    break;
                case 'Home':
                    goToSlide(0);
                    e.preventDefault();
                    break;
                case 'End':
                    goToSlide(totalItems - 1);
                    e.preventDefault();
                    break;
            }
        });
    
        // Ensure focus management
        items.forEach(item => {
            item.addEventListener('focus', () => {
                goToSlide(parseInt(item.dataset.index));
            });
        });
    }

    //Event listeners for buttons
    prevButton.addEventListener('click', moveLeft);
    nextButton.addEventListener('click', moveRight);
}
