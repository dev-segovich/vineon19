// ==================== Image Carousel ==================== 
document.addEventListener('DOMContentLoaded', function() {
    // ========== Timestamp Setup ==========
    const timestampInput = document.getElementById('formTimestamp');
    if (timestampInput) {
        timestampInput.value = Math.floor(Date.now() / 1000);
    }

    const indicators = document.querySelectorAll('.indicator');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let autoPlayInterval;

    // Function to show specific image
    function showImage(index) {
        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            indicators[i].classList.remove('active');
        });
        
        carouselItems[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    // Indicator click handler
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            clearInterval(autoPlayInterval);
            currentIndex = index;
            showImage(currentIndex);
            startAutoPlay();
        });
    });

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

// ==================== Navbar Fix on Scroll ==================== 
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ==================== Form Submission ==================== 
document.querySelector('.newsletter-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        const formData = new FormData(this);
        const response = await fetch('send.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            submitBtn.textContent = '✓ Thank You!';
            submitBtn.style.backgroundColor = '#4a9d6f';
            this.reset();
            
            // Reset button after 2 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 2000);
        } else {
            throw new Error('Error sending');
        }
    } catch (error) {
        submitBtn.textContent = 'Error. Try again';
        submitBtn.style.backgroundColor = '#e74c3c';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
        }, 2000);
    }
});

// ==================== Intersection Observer for Animations ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
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
