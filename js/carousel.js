/**
 * ICO — Carousel Controller
 * Handles all carousels on the site with dots, prev/next, and auto-play.
 */

function initCarousel({ trackId, prevId, nextId, dotsId, slidesPerView = 1, autoPlay = true, gap = 24 }) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  if (!track) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  let current = 0;
  let timer = null;

  // Build dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function getSlideWidth() {
    if (!slides[0]) return 0;
    return slides[0].getBoundingClientRect().width + gap;
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetTimer(); }
  });

  function resetTimer() {
    if (!autoPlay) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (autoPlay) resetTimer();

  // Recalculate on resize
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
    setTimeout(() => { track.style.transition = ''; }, 50);
  });
}

// ── Testimonials (index.html) ──
initCarousel({
  trackId: 'testimonialsTrack',
  prevId: 'testimonialsPrev',
  nextId: 'testimonialsNext',
  dotsId: 'testimonialsDots',
  slidesPerView: 1,
  gap: 0
});

// ── Program Areas (programs.html) ──
initCarousel({
  trackId: 'progTrack',
  prevId: 'progPrev',
  nextId: 'progNext',
  dotsId: 'progDots',
  slidesPerView: 3,
  gap: 24
});

// ── News (news.html) ──
initCarousel({
  trackId: 'newsCarouselTrack',
  prevId: 'newsPrev',
  nextId: 'newsNext',
  dotsId: 'newsDots',
  slidesPerView: 2,
  gap: 24
});

// ── Partners (membership.html) ──
initCarousel({
  trackId: 'partnersTrack',
  prevId: 'partnersPrev',
  nextId: 'partnersNext',
  dotsId: 'partnersDots',
  slidesPerView: 3,
  gap: 32,
  autoPlay: false
});
