document.addEventListener("DOMContentLoaded", function () {
    // Initialize Nav Bar functionality
    initNavBar();
    // Initialize Nav Bar Animation
    initNavAnimation();
    // Initialize Service Carousel
    initServiceCarousel();
});

// Navigation Bar Functionality
function initNavBar() {
    function scrollTo(sectionID) {
        const section = document.getElementById(sectionID);
        if (section) {
            section.scrollIntoView({behavior: "smooth"});
        } else {
            console.error(`Section with ID ${sectionID} not found!`)
        }
    }

    const navButtons = document.querySelectorAll(".individual-nav-bar");
    navButtons.forEach(function(button) {
        button.addEventListener("click", function (event) {
            const targetID = button.getAttribute("data-target");
            scrollTo(targetID);
        })
    })
}

// Navigation Bar home fade in animation
function initNavAnimation() {
    // Navigation Bar Home Section Fade in animation
    const navbar = document.querySelector('.nav-bar');
    const homeSection = document.querySelector('#home');
    let homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
    let isTransparent = false;
    let lastScrollY = window.scrollY;
    let scheduledAnimationFrame = false;
    function updateNavbar() {
        const currentScrollY = window.scrollY;

        // Updates DOM only when we cross this threshold
        const shouldBeTransparent = currentScrollY < homeSectionBottom;
        if (shouldBeTransparent !== isTransparent) {
            if (shouldBeTransparent) {
                navbar.classList.add('nav-bar-transparent');
            } else {
                navbar.classList.remove('nav-bar-transparent');
            }
            isTransparent = shouldBeTransparent
        }
        scheduledAnimationFrame = false; //Controller variable for throttling
    }

    // Throttled the scroll event listener using requestAnimationFrame
    window.addEventListener('scroll', function() {
        lastScrollY = this.window.scrollY;
        if (!scheduledAnimationFrame) {
            scheduledAnimationFrame = true;
            this.window.requestAnimationFrame(updateNavbar);
        }
    }, { passive: true }); // Passive flag for improved performance

    // Recalculation of dimensions on window resize
    window.addEventListener('resize', function() {
        homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
        updateNavbar();
    }, { passive: true });
    updateNavbar(); // Initial function call on page load
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
