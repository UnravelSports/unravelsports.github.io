/**
 * Carousel functionality for UnravelSports category sections
 * Handles navigation, touch/swipe support, and responsive behavior
 */

class Carousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.prevButton = container.querySelector('.carousel-control.prev');
    this.nextButton = container.querySelector('.carousel-control.next');
    this.indicators = container.querySelectorAll('.carousel-indicator');

    this.currentIndex = 0;
    this.cardsToShow = this.getCardsToShow();
    this.totalCards = this.track.children.length;
    this.maxIndex = Math.max(0, this.totalCards - this.cardsToShow);

    this.init();
  }

  init() {
    // Set up event listeners
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Indicator click events
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Touch/swipe support
    this.setupTouchEvents();

    // Keyboard navigation
    this.setupKeyboardNav();

    // Window resize handler
    window.addEventListener('resize', () => this.handleResize());

    // Initial update
    this.updateCarousel();
  }

  getCardsToShow() {
    const width = window.innerWidth;
    if (width >= 1200) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  handleResize() {
    const newCardsToShow = this.getCardsToShow();
    if (newCardsToShow !== this.cardsToShow) {
      this.cardsToShow = newCardsToShow;
      this.maxIndex = Math.max(0, this.totalCards - this.cardsToShow);

      // Adjust current index if needed
      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = this.maxIndex;
      }

      this.updateCarousel();
    }
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    if (index >= 0 && index <= this.maxIndex) {
      this.currentIndex = index;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    // Calculate transform
    const cardWidth = this.track.children[0]?.offsetWidth || 320;
    const gap = 20; // Must match CSS gap
    const offset = -(this.currentIndex * (cardWidth + gap));

    this.track.style.transform = `translateX(${offset}px)`;

    // Update button states
    if (this.prevButton) {
      this.prevButton.classList.toggle('disabled', this.currentIndex === 0);
    }

    if (this.nextButton) {
      this.nextButton.classList.toggle('disabled', this.currentIndex === this.maxIndex);
    }

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      touchEndX = e.touches[0].clientX;
    }, { passive: true });

    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });

    // Mouse drag support for desktop
    let mouseStartX = 0;
    let mouseEndX = 0;
    let isMouseDragging = false;

    this.track.addEventListener('mousedown', (e) => {
      mouseStartX = e.clientX;
      isMouseDragging = true;
      this.track.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isMouseDragging) return;
      mouseEndX = e.clientX;
    });

    document.addEventListener('mouseup', () => {
      if (!isMouseDragging) return;
      isMouseDragging = false;
      this.track.style.cursor = 'grab';

      const diff = mouseStartX - mouseEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }

  setupKeyboardNav() {
    // Allow keyboard navigation when carousel is focused
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });
  }
}

/**
 * Initialize all carousels on the page
 */
function initCarousels() {
  const carouselContainers = document.querySelectorAll('.carousel-container');
  const carousels = [];

  carouselContainers.forEach(container => {
    // Only initialize if there are cards to show
    const track = container.querySelector('.carousel-track');
    if (track && track.children.length > 0) {
      carousels.push(new Carousel(container));
    }
  });

  return carousels;
}

/**
 * Intersection Observer for fade-in animations
 */
function setupScrollAnimations() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all category sections
  document.querySelectorAll('.category-section').forEach(section => {
    observer.observe(section);
  });
}

/**
 * Format date string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Create a post card element
 */
function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card';

  // Add featured class if post is featured
  if (post.featured) {
    card.classList.add('post-card-featured');

    // Add holographic shimmer effect on hover
    card.addEventListener('mouseenter', function(e) {
      // Get mouse position relative to card center
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate angle from center to cursor
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const angleToCenter = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // The light band should be perpendicular to the direction from cursor to center
      // Add 90 degrees to get perpendicular angle
      const shimmerAngle = angleToCenter + 90;

      // Calculate start and end positions for the sweep based on cursor direction
      // The light should sweep across the card in the direction away from the cursor
      // Increase distance to ensure full card coverage with the enlarged gradient layer
      const distance = 200; // Sweep distance in percentage
      const startX = -distance * Math.cos(angleToCenter * Math.PI / 180);
      const startY = -distance * Math.sin(angleToCenter * Math.PI / 180);
      const endX = distance * Math.cos(angleToCenter * Math.PI / 180);
      const endY = distance * Math.sin(angleToCenter * Math.PI / 180);

      // Set CSS variables for the gradient angle and animation positions
      card.style.setProperty('--shimmer-angle', `${shimmerAngle}deg`);
      card.style.setProperty('--shimmer-start-x', `${startX}%`);
      card.style.setProperty('--shimmer-start-y', `${startY}%`);
      card.style.setProperty('--shimmer-end-x', `${endX}%`);
      card.style.setProperty('--shimmer-end-y', `${endY}%`);

      // Force animation restart by removing and re-adding the class
      card.classList.remove('shimmer-active');
      // Trigger reflow to restart the animation
      void card.offsetWidth;
      card.classList.add('shimmer-active');

      // Clear any existing timeout
      if (card.shimmerTimeout) {
        clearTimeout(card.shimmerTimeout);
      }

      // Remove class after animation completes
      card.shimmerTimeout = setTimeout(() => {
        card.classList.remove('shimmer-active');
        card.shimmerTimeout = null;
      }, 2800);
    });
  }

  // Determine the primary URL for cards without "Read more"
  // Prefer non-PDF URLs over paper URLs
  let primaryUrl = null;
  if (post.hideReadMore) {
    // Priority order: websiteUrl, githubUrl, youtubeUrl, spotifyUrl, articleUrl, paperUrl
    primaryUrl = post.websiteUrl || post.githubUrl || post.youtubeUrl ||
                 post.spotifyUrl || post.articleUrl || post.paperUrl;
  }

  // Set onclick behavior based on whether there's a "Read more" link
  if (post.hideReadMore && primaryUrl) {
    card.onclick = () => window.open(primaryUrl, '_blank', 'noopener,noreferrer');
    card.style.cursor = 'pointer';
  } else {
    card.onclick = () => window.location.href = `post.html?id=${post.id}`;
  }

  // Remove emoji and any leading emoji characters from title
  const titleWithoutEmoji = post.title
    .replace(/^[\u{1F000}-\u{1FFFF}]/u, '') // Remove emoji
    .replace(/^[\u{2600}-\u{27BF}]/u, '')   // Remove misc symbols
    .replace(/^[🌀🎙️🔬💻📱]\s*/, '')        // Fallback for specific emojis
    .trim();

  // Build links section
  let linksHtml = '';

  // Paper clip icon if paper URL exists
  if (post.paperUrl) {
    linksHtml += `
      <a href="${post.paperUrl}" class="post-card-icon-link" onclick="event.stopPropagation();" target="_blank" rel="noopener" title="View paper">
        <svg xmlns="https://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
      </a>
    `;
  }

  // GitHub icon if GitHub URL exists
  if (post.githubUrl) {
    linksHtml += `
      <a href="${post.githubUrl}" class="post-card-icon-link" onclick="event.stopPropagation();" target="_blank" rel="noopener" title="View on GitHub">
        <svg xmlns="https://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>
    `;
  }

  // Website/Globe icon if website URL exists
  if (post.websiteUrl) {
    linksHtml += `
      <a href="${post.websiteUrl}" class="post-card-icon-link" onclick="event.stopPropagation();" target="_blank" rel="noopener" title="Visit website">
        <svg xmlns="https://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      </a>
    `;
  }

  // YouTube icon if YouTube URL exists
  if (post.youtubeUrl) {
    linksHtml += `
      <a href="${post.youtubeUrl}" class="post-card-icon-link" onclick="event.stopPropagation();" target="_blank" rel="noopener" title="Watch on YouTube">
        <svg xmlns="https://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
    `;
  }

  // Spotify icon if Spotify URL exists
  if (post.spotifyUrl) {
    linksHtml += `
      <a href="${post.spotifyUrl}" class="post-card-icon-link" onclick="event.stopPropagation();" target="_blank" rel="noopener" title="Listen on Spotify">
        <svg xmlns="https://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>
    `;
  }

  // Article/Newspaper icon if article URL exists
  if (post.articleUrl) {
    linksHtml += `
      <a href="${post.articleUrl}" class="post-card-icon-link" onclick="event.stopPropagation();" target="_blank" rel="noopener" title="Read article">
        <svg xmlns="https://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
          <path d="M18 14h-8"></path>
          <path d="M15 18h-5"></path>
          <path d="M10 6h8v4h-8V6Z"></path>
        </svg>
      </a>
    `;
  }

  // Determine if "Read more" should be shown
  const readMoreLink = post.hideReadMore ? '' : `<a href="post.html?id=${post.id}" class="post-card-link" onclick="event.stopPropagation();">Read more</a>`;

  card.innerHTML = `
    <div class="post-card-date">${formatDate(post.date)}</div>
    <div class="post-card-title">${titleWithoutEmoji}</div>
    <div class="post-card-excerpt">${post.excerpt}</div>
    <div class="post-card-footer">
      ${readMoreLink}
      <div class="post-card-links">${linksHtml}</div>
    </div>
  `;

  return card;
}

/**
 * Create carousel indicators
 */
function createIndicators(containerElement, totalCards, cardsToShow) {
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'carousel-indicators';

  const maxIndex = Math.max(0, totalCards - cardsToShow);

  for (let i = 0; i <= maxIndex; i++) {
    const indicator = document.createElement('button');
    indicator.className = 'carousel-indicator';
    if (i === 0) indicator.classList.add('active');
    indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
    indicatorsContainer.appendChild(indicator);
  }

  containerElement.appendChild(indicatorsContainer);
}

/**
 * Build a category carousel section
 */
function buildCategorySection(categoryKey, categoryData, posts) {
  const section = document.createElement('section');
  section.className = 'category-section';
  section.setAttribute('data-category', categoryKey);

  // Category header
  const header = document.createElement('div');
  header.className = 'category-header';
  header.innerHTML = `
    <div class="category-title">
      <span class="category-emoji">${categoryData.emoji}</span>
      <div>
        <h2 class="category-name">${categoryData.name} <span class="category-count">(${categoryData.count})</span></h2>
        <p class="category-description">${categoryData.description}</p>
      </div>
    </div>
  `;
  section.appendChild(header);

  // Carousel container
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'carousel-container';

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-control prev';
  prevButton.innerHTML = '‹';
  prevButton.setAttribute('aria-label', 'Previous');
  carouselContainer.appendChild(prevButton);

  // Carousel wrapper and track
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  // Add post cards
  posts.forEach(post => {
    track.appendChild(createPostCard(post));
  });

  wrapper.appendChild(track);
  carouselContainer.appendChild(wrapper);

  // Next button
  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-control next';
  nextButton.innerHTML = '›';
  nextButton.setAttribute('aria-label', 'Next');
  carouselContainer.appendChild(nextButton);

  section.appendChild(carouselContainer);

  // Add indicators
  const cardsToShow = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  createIndicators(carouselContainer, posts.length, cardsToShow);

  return section;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Carousel,
    initCarousels,
    setupScrollAnimations,
    createPostCard,
    buildCategorySection,
    formatDate
  };
}
