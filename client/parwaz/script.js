// =========================================================
// Parwaz — placeholder prototype JS
// Minor interactivity only, to demonstrate structure/behavior.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // Close mobile nav after clicking a link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });

  /* ---------- Animated stat counters ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goToSlide(current - 1));
  nextBtn.addEventListener('click', () => goToSlide(current + 1));

  // Auto-advance every 6 seconds
  setInterval(() => goToSlide(current + 1), 6000);

  /* ---------- Donation amount buttons ---------- */
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmount = document.getElementById('customAmount');

  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      customAmount.value = btn.dataset.amount;
    });
  });

  customAmount.addEventListener('input', () => {
    amountButtons.forEach(b => b.classList.remove('selected'));
  });

  /* ---------- Form placeholder handlers ---------- */
  const donateForm = document.getElementById('donateForm');
  const donateFeedback = document.getElementById('donateFeedback');

  donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    donateFeedback.textContent = '[ placeholder: payment flow would begin here ]';
  });

  const joinForm = document.getElementById('joinForm');
  const joinFeedback = document.getElementById('joinFeedback');

  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    joinFeedback.textContent = '[ placeholder: application would be submitted here ]';
  });

  const newsletterForm = document.getElementById('newsletterForm');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('[ placeholder: subscription confirmation would appear here ]');
    newsletterForm.reset();
  });

  /* ---------- Smooth scroll for nav links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
