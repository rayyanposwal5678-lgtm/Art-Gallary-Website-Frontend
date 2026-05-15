// ========== PRELOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.querySelector('.hero').classList.add('visible');
  }, 2000);
});

// ========== CUSTOM CURSOR ==========
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX - 4 + 'px';
  dot.style.top = mouseY - 4 + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX - 18 + 'px';
  ring.style.top = ringY - 18 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .art-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  navbar.classList.toggle('scrolled', currentScroll > 80);
  lastScroll = currentScroll;
});

// ========== MOBILE MENU ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========== GALLERY FILTERS ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const artCards = document.querySelectorAll('.art-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    artCards.forEach((card, i) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      if (show) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, i * 80);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 400);
      }
    });
  });
});

// ========== LIGHTBOX ==========
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxArtist = document.getElementById('lightboxArtist');
const lightboxClose = document.getElementById('lightboxClose');

artCards.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('.art-card-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = card.dataset.title;
    lightboxTitle.textContent = card.dataset.title;
    lightboxArtist.textContent = card.dataset.artist + ' — ' + card.dataset.meta;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ========== COUNTER ANIMATION ==========
const statNumbers = document.querySelectorAll('.stat-number');
let statsCounted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsCounted) {
      statsCounted = true;
      statNumbers.forEach(num => {
        const target = parseInt(num.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function updateCount(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          num.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(updateCount);
          else num.textContent = target.toLocaleString() + '+';
        }
        requestAnimationFrame(updateCount);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-section').forEach(s => statsObserver.observe(s));

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== PARALLAX ON HERO & SECTIONS ==========
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && scrolled < window.innerHeight) {
    heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
  }
  
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  parallaxBgs.forEach(bg => {
    const parent = bg.parentElement;
    const parentTop = parent.offsetTop;
    const parentHeight = parent.offsetHeight;
    if (scrolled + window.innerHeight > parentTop && scrolled < parentTop + parentHeight) {
      const yPos = (scrolled - parentTop) * 0.2;
      bg.style.transform = `scale(1.1) translateY(${yPos}px)`;
    }
  });
});

// ========== TILT EFFECT ON ART CARDS ==========
artCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) perspective(1000px) rotateY(0) rotateX(0)';
  });
});

// ========== FORM HANDLING ==========
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'SENT ✓';
  btn.style.background = 'var(--gold)';
  btn.style.color = 'var(--bg-deep)';
  setTimeout(() => {
    btn.textContent = 'SEND MESSAGE';
    btn.style.background = 'transparent';
    btn.style.color = 'var(--gold)';
    e.target.reset();
  }, 3000);
});

document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.newsletter-btn');
  btn.textContent = 'SUBSCRIBED ✓';
  setTimeout(() => {
    btn.textContent = 'SUBSCRIBE';
    e.target.reset();
  }, 3000);
});

// ========== MAGNETIC BUTTON EFFECT ==========
document.querySelectorAll('.hero-cta, .exhibition-btn, .form-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ========== NAVBAR ACTIVE LINK ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
});
