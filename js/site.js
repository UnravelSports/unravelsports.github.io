/**
 * Core site functionality for UnravelSports
 * Handles markdown loading, parsing, and rendering
 */

/**
 * Parse frontmatter-style metadata from markdown
 * Since posts don't have YAML frontmatter, we extract from the first H2
 */
function parseMarkdown(markdown) {
  const lines = markdown.split('\n');
  let title = '';
  let content = markdown;

  // Find first H2 (## Title)
  const titleMatch = markdown.match(/^##\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
    // Remove the first H2 title from content to avoid duplication
    content = markdown.replace(/^##\s+.+$/m, '').trim();
  }

  return {
    title,
    content
  };
}

/**
 * Load markdown file
 */
async function loadMarkdown(filename) {
  try {
    const response = await fetch(`posts/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.statusText}`);
    }
    const markdown = await response.text();
    return parseMarkdown(markdown);
  } catch (error) {
    console.error('Error loading markdown:', error);
    return null;
  }
}

/**
 * Render markdown to HTML using marked.js
 */
function renderMarkdown(markdown) {
  if (typeof marked === 'undefined') {
    console.error('marked.js library not loaded');
    return markdown;
  }

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
  });

  return marked.parse(markdown);
}

/**
 * Load and render a post
 */
async function loadAndRenderPost(postId) {
  const post = getPostById(postId);

  if (!post) {
    return {
      error: true,
      message: 'Post not found'
    };
  }

  const markdownData = await loadMarkdown(post.filename);

  if (!markdownData) {
    return {
      error: true,
      message: 'Failed to load post content'
    };
  }

  const html = renderMarkdown(markdownData.content);

  return {
    error: false,
    post,
    html,
    title: markdownData.title || post.title
  };
}

/**
 * Get query parameter from URL
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Find previous and next posts
 */
function getAdjacentPosts(currentPostId) {
  const currentIndex = postsData.findIndex(p => p.id === currentPostId);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? postsData[currentIndex - 1] : null,
    next: currentIndex < postsData.length - 1 ? postsData[currentIndex + 1] : null
  };
}

/**
 * Initialize syntax highlighting after content is loaded
 */
function initializeSyntaxHighlighting() {
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

/**
 * Handle image lazy loading
 */
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Setup external links to open in new tab
 */
function setupExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/**
 * Smooth scroll to anchor links
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Setup share functionality
 */
function setupShareButtons() {
  const shareButtons = document.querySelectorAll('[data-share]');

  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const platform = button.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);

      let shareUrl = '';

      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${title}&body=${url}`;
          break;
      }

      if (shareUrl) {
        if (platform === 'email') {
          window.location.href = shareUrl;
        } else {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      }
    });
  });
}

/**
 * Initialize Twitter embeds
 */
function initializeTwitterEmbeds() {
  if (typeof twttr !== 'undefined' && twttr.widgets) {
    twttr.widgets.load();
  }
}

/**
 * Setup copy code button for code blocks
 */
function setupCopyCodeButtons() {
  document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');

    button.addEventListener('click', async () => {
      const code = block.textContent;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    });

    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.insertBefore(button, block);
  });
}

/**
 * Format date for display
 */
function formatPostDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get reading time estimate
 */
function getReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Update page meta tags for SEO
 */
function updateMetaTags(post) {
  // Update title
  document.title = `${post.title} | UnravelSports`;

  // Update or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', post.excerpt);

  // Update Open Graph tags
  updateOrCreateMeta('og:title', post.title);
  updateOrCreateMeta('og:description', post.excerpt);
  updateOrCreateMeta('og:url', window.location.href);
  updateOrCreateMeta('og:type', 'article');

  // Twitter Card tags
  updateOrCreateMeta('twitter:card', 'summary_large_image', 'name');
  updateOrCreateMeta('twitter:title', post.title, 'name');
  updateOrCreateMeta('twitter:description', post.excerpt, 'name');
}

function updateOrCreateMeta(property, content, attributeName = 'property') {
  let meta = document.querySelector(`meta[${attributeName}="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Initialize mobile menu
 */
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute(
        'aria-expanded',
        menuToggle.classList.contains('active')
      );
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Initialize back to top button
 */
function setupBackToTop() {
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * Global initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  setupBackToTop();
  setupSmoothScroll();
  setupLazyLoading();
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadMarkdown,
    renderMarkdown,
    loadAndRenderPost,
    getQueryParam,
    getAdjacentPosts,
    initializeSyntaxHighlighting,
    setupExternalLinks,
    setupShareButtons,
    formatPostDate,
    getReadingTime,
    updateMetaTags
  };
}
