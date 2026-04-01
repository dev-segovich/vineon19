// ==================== Image Carousel ==================== 
document.addEventListener('DOMContentLoaded', function() {
    // ========== Timestamp Setup ==========
    const timestampInput = document.getElementById('formTimestamp');
    if (timestampInput) {
        timestampInput.value = Math.floor(Date.now() / 1000);
    }

    // ========== Rotating Texts ==========
    const textItems = document.querySelectorAll('.text-item');
    let textIndex = 0;

    function rotateText() {
        const current = document.querySelector('.text-item.active');
        if (current) {
            current.classList.remove('active');
            current.classList.add('exit-up');
            setTimeout(() => current.classList.remove('exit-up'), 600);
        }
        textItems[textIndex].classList.add('active');
        textIndex = (textIndex + 1) % textItems.length;
    }

    if (textItems.length > 0) {
        rotateText();
        function scheduleNext() {
            const current = textItems[textIndex === 0 ? textItems.length - 1 : textIndex - 1];
            const type = current.getAttribute('data-type');
            const delay = type === 'body' ? 5000 : 3500;
            setTimeout(() => {
                rotateText();
                scheduleNext();
            }, delay);
        }
        scheduleNext();
    }

    const indicators = document.querySelectorAll('.indicator');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let autoPlayInterval;

    // Function to show specific image
    function showImage(index) {
        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            if (indicators.length > 0) {
                indicators[i].classList.remove('active');
            }
        });
        
        carouselItems[index].classList.add('active');
        if (indicators.length > 0) {
            indicators[index].classList.add('active');
        }
    }

    // Indicator click handler
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                clearInterval(autoPlayInterval);
                currentIndex = index;
                showImage(currentIndex);
                startAutoPlay();
            });
        });
    }

    // Auto-play carousel
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % carouselItems.length;
            showImage(currentIndex);
        }, 5000); // Change image every 5 seconds
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            clearInterval(autoPlayInterval);
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            showImage(currentIndex);
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            clearInterval(autoPlayInterval);
            currentIndex = (currentIndex + 1) % carouselItems.length;
            showImage(currentIndex);
            startAutoPlay();
        }
    });

    // Start auto-play on page load
    startAutoPlay();
});

// ==================== Smooth Scroll ==================== 
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

// ==================== Intersection Observer for Animations ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});
