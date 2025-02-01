// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Carousel functionality
const carouselInner = document.querySelector('.carousel-inner');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let currentIndex = 0;
let autoCarouselInterval;

// Function to update the carousel
function updateCarousel() {
  const offset = -currentIndex * 100;
  carouselInner.style.transform = `translateX(${offset}%)`;

  // Update indicators
  document.querySelectorAll('.carousel-indicators .indicator').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentIndex);
  });
}

// Add indicators
if (carouselItems.length > 0 && indicatorsContainer) {
  carouselItems.forEach((item, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
    indicatorsContainer.appendChild(indicator);
  });
}

// Previous button
if (prevButton) {
  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
    updateCarousel();
  });
}

// Next button
if (nextButton) {
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });
}

// Touch support for carousel
let touchStartX = 0;
let touchEndX = 0;

if (carouselInner) {
  carouselInner.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  carouselInner.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });
}

function handleSwipe() {
  if (touchEndX < touchStartX) {
    // Swipe left
    currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
  } else if (touchEndX > touchStartX) {
    // Swipe right
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
  }
  updateCarousel();
}

// Automatic carousel swiping
function startAutoCarousel() {
  autoCarouselInterval = setInterval(() => {
    currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  }, 5000); // Change slide every 5 seconds
}

// Pause auto carousel on hover
if (carouselInner) {
  carouselInner.addEventListener('mouseenter', () => {
    clearInterval(autoCarouselInterval);
  });

  carouselInner.addEventListener('mouseleave', () => {
    startAutoCarousel();
  });
}

// Start auto carousel when the Portfolio section is visible
const portfolioSection = document.querySelector('#portfolio');
if (portfolioSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoCarousel();
          observer.unobserve(portfolioSection); // Stop observing once visible
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the section is visible
  );
  observer.observe(portfolioSection);
}

// Form validation
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const message = form.querySelector('textarea[name="message"]');

    if (!name.value) {
      showError('Please enter your name.');
      return;
    }
    if (!email.value || !validateEmail(email.value)) {
      showError('Please enter a valid email address.');
      return;
    }
    if (!message.value) {
      showError('Please enter your message.');
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      form.reset();
      showSuccess('Your message has been sent successfully!');
    }, 1000);
  });
}

// Show error message
function showError(message) {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('error-message');
  errorContainer.textContent = message;
  form.appendChild(errorContainer);
  setTimeout(() => errorContainer.remove(), 3000);
}

// Show success message
function showSuccess(message) {
  const successContainer = document.createElement('div');
  successContainer.classList.add('success-message');
  successContainer.textContent = message;
  form.appendChild(successContainer);
  setTimeout(() => successContainer.remove(), 3000);
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Modal functionality
const learnMoreButtons = document.querySelectorAll('.learn-more');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close');

// Open modal when "Learn More" is clicked
learnMoreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
  });
});

// Close modal when close button is clicked
closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    modal.classList.remove('active');
  });
});

// Close modal when clicking outside the modal content
modals.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

// Fade-In Animation Trigger for the About Section
const aboutSection = document.querySelector('#about');
if (aboutSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('fade-in');
          observer.unobserve(aboutSection); // Stop observing after animation
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of the section is visible
  );
  observer.observe(aboutSection);
}

// Fullscreen functionality for the carousel
const fullscreenButton = document.querySelector('.carousel-control.fullscreen');
const carousel = document.querySelector('.carousel');

if (fullscreenButton && carousel) {
  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (carousel.requestFullscreen) {
        carousel.requestFullscreen();
      } else if (carousel.mozRequestFullScreen) { // Firefox
        carousel.mozRequestFullScreen();
      } else if (carousel.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        carousel.webkitRequestFullscreen();
      } else if (carousel.msRequestFullscreen) { // IE/Edge
        carousel.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
  });

  // Change the icon and adjust image size when entering/exiting fullscreen mode
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>'; // Compress icon
      // Enlarge the image when in fullscreen mode
      const carouselItems = document.querySelectorAll('.carousel-item img');
      carouselItems.forEach(img => {
        img.style.maxWidth = '90%'; // Adjust this value as needed
      });
    } else {
      fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>'; // Expand icon
      // Reset the image size when exiting fullscreen mode
      const carouselItems = document.querySelectorAll('.carousel-item img');
      carouselItems.forEach(img => {
        img.style.maxWidth = '600px'; // Reset to original size
      });
    }
  });
}