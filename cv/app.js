document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    let isAnimating = false;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const slideIndicator = document.getElementById('slideIndicator');

    // Theme Toggle Elements
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    let isLightMode = localStorage.getItem('theme') === 'light';

    // Initialize Theme
    if (isLightMode) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
    }

    // Theme Toggle Listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            isLightMode = !isLightMode;
            if (isLightMode) {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            }
        });
    }

    // Init display
    updateProgress();

    function goToSlide(index) {
        if (isAnimating || index === currentSlideIndex) return;
        if (index < 0 || index >= totalSlides) return;

        isAnimating = true;

        // Remove active class from current and add prev class to manage transform visually if needed
        slides[currentSlideIndex].classList.remove('active');
        if (index > currentSlideIndex) {
            slides[currentSlideIndex].classList.add('prev');
        } else {
            slides[currentSlideIndex].classList.remove('prev');
        }

        currentSlideIndex = index;

        slides[currentSlideIndex].classList.remove('prev');
        slides[currentSlideIndex].classList.add('active');

        updateProgress();

        // Release lock
        setTimeout(() => {
            isAnimating = false;
        }, 800); // matches CSS transition time
    }

    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            goToSlide(currentSlideIndex + 1);
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            goToSlide(currentSlideIndex - 1);
        }
    }

    function updateProgress() {
        slideIndicator.innerText = `${currentSlideIndex + 1} / ${totalSlides}`;

        // Progress bar logic (horizontal for mobile, vertical for desktop)
        const progressPercentage = ((currentSlideIndex) / (totalSlides - 1)) * 100;

        if (window.innerWidth <= 600) {
            progressBar.style.height = '100%';
            progressBar.style.width = `${progressPercentage}%`;
        } else {
            progressBar.style.width = '100%';
            progressBar.style.height = `${progressPercentage}%`;
        }
    }

    // Expose layout/nav functions globally for HTML onclick use
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Event Listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            prevSlide();
        }
    });

    // Mouse wheel navigation (only if not scrolling inside panel)
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        if (isAnimating) return;
        if (wheelTimeout) return;

        const panel = e.target.closest('.glass-panel');
        if (panel) {
            const isAtTop = panel.scrollTop === 0;
            const isAtBottom = Math.abs(panel.scrollHeight - panel.clientHeight - panel.scrollTop) < 1;

            if (e.deltaY < 0 && !isAtTop) return; // Allow normal scroll up
            if (e.deltaY > 0 && !isAtBottom) return; // Allow normal scroll down
        }

        const delta = e.deltaY;

        if (delta > 50) {
            nextSlide();
            wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 1000);
        } else if (delta < -50) {
            prevSlide();
            wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 1000);
        }
    }, { passive: false });

    // Touch swipe navigation
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe(e);
    }, { passive: true });

    function handleSwipe(e) {
        if (isAnimating) return;
        const swipeThreshold = 50;

        const panel = e.target.closest('.glass-panel');
        if (panel) {
            const isAtTop = panel.scrollTop === 0;
            const isAtBottom = Math.abs(panel.scrollHeight - panel.clientHeight - panel.scrollTop) < 1;
            const isSwipingUp = touchEndY < touchStartY;
            const isSwipingDown = touchEndY > touchStartY;

            if (isSwipingUp && !isAtBottom) return; // Allow normal scroll down
            if (isSwipingDown && !isAtTop) return; // Allow normal scroll up
        }

        if (touchEndY < touchStartY - swipeThreshold) {
            // swiped up -> next slide
            nextSlide();
        } else if (touchEndY > touchStartY + swipeThreshold) {
            // swiped down -> prev slide
            prevSlide();
        }
    }

    // Adjust progress bar on resize
    window.addEventListener('resize', updateProgress);
});
