/* ================================================================
   WEDDING WEBSITE — script.js
   ================================================================
   QUICK CUSTOMIZATION MAP:
   ★ weddingDate      → line ~30  — change the wedding date
   ★ scheduleData     → line ~50  — edit the wedding day timeline
   ★ galleryImages    → line ~100 — list your gallery images
   ★ tablesData       → line ~140 — manage tables & guest names
   ================================================================ */

/* ----------------------------------------------------------------
   1. WEDDING DATE — COUNTDOWN TIMER
   ★ CUSTOMIZE: Change this date to your wedding date
   Format: 'YYYY-MM-DDTHH:MM:SS' (local time)
   ---------------------------------------------------------------- */
const WEDDING_DATE = new Date('2025-09-06T15:30:00');

function updateCountdown() {
  const now   = new Date();
  const diff  = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins  = Math.floor((diff / (1000 * 60)) % 60);
  const secs  = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ----------------------------------------------------------------
   2. SCHEDULE DATA
   ★ CUSTOMIZE: Edit, add or remove items from this array.
   Fields:
     time  — displayed time string
     event — event name (main title)
     desc  — short description (subtitle, italic)
     key   — true = highlighted as key moment (filled dot)
   ---------------------------------------------------------------- */
const scheduleData = [
  {
    time:  '2:30 PM',
    event: 'Guests Arrive',
    desc:  'Doors open — welcome to the Chapelle Sainte-Anne',
    key:   false
  },
  {
    time:  '3:30 PM',
    event: 'Ceremony Begins',
    desc:  'The moment we\'ve been waiting for',
    key:   true
  },
  {
    time:  '4:15 PM',
    event: 'Champagne & Photographs',
    desc:  'Garden terrace at the chapel — group portraits and candid moments',
    key:   false
  },
  {
    time:  '5:15 PM',
    event: 'Shuttle to Villa Rothschild',
    desc:  'Complimentary shuttle departs from the chapel',
    key:   false
  },
  {
    time:  '6:00 PM',
    event: 'Welcome Cocktails',
    desc:  'Aperitivo hour on the garden terrace',
    key:   false
  },
  {
    time:  '7:30 PM',
    event: 'Dinner Service',
    desc:  'Seated dinner in the grand ballroom',
    key:   true
  },
  {
    time:  '9:00 PM',
    event: 'First Dance & Speeches',
    desc:  'Toasts from family and friends',
    key:   false
  },
  {
    time:  '9:45 PM',
    event: 'Dancing Begins',
    desc:  'Live band until midnight, DJ until 2 AM',
    key:   false
  },
  {
    time:  '11:45 PM',
    event: 'Late Night Bites',
    desc:  'Dessert bar and midnight snacks open',
    key:   false
  },
  {
    time:  '12:00 AM',
    event: 'First Shuttle Returns',
    desc:  'Shuttle to Hôtel Martinez — second shuttle at 1:30 AM',
    key:   false
  },
];

/* Render schedule */
function renderSchedule() {
  const container = document.getElementById('scheduleTimeline');
  if (!container) return;

  container.innerHTML = scheduleData.map(item => `
    <div class="schedule-item ${item.key ? 'schedule-item--key' : ''}">
      <div class="schedule-time">${item.time}</div>
      <div class="schedule-body">
        <div class="schedule-event">${item.event}</div>
        ${item.desc ? `<div class="schedule-desc">${item.desc}</div>` : ''}
      </div>
    </div>
  `).join('');
}

renderSchedule();


/* ----------------------------------------------------------------
   3. GALLERY IMAGES
   ★ CUSTOMIZE: Add your images to the images/ folder and list
   them here. Each item:
     src  — path relative to index.html, e.g. 'images/gallery-1.jpg'
     alt  — accessible description

   The first image spans 2 rows for a featured look.
   Recommended: 6–9 images for best layout balance.
   ---------------------------------------------------------------- */
const galleryImages = [
  { src: 'images/gallery-1.jpg', alt: 'Emma and James at sunset' },
  { src: 'images/gallery-2.jpg', alt: 'Engagement session in the park' },
  { src: 'images/gallery-3.jpg', alt: 'The proposal moment' },
  { src: 'images/gallery-4.jpg', alt: 'Our first trip together' },
  { src: 'images/gallery-5.jpg', alt: 'At our favourite restaurant' },
  { src: 'images/gallery-6.jpg', alt: 'Celebrating with friends' },
];

/* Render gallery */
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = galleryImages.map((img, idx) => `
    <div class="gallery-item reveal" data-delay="${idx * 80}" data-index="${idx}">
      <img
        src="${img.src}"
        alt="${img.alt}"
        loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=\\'gallery-placeholder\\'>${String(idx + 1).padStart(2, '0')}</div>'"
      />
    </div>
  `).join('');

  /* Attach lightbox events */
  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
  });
}

/* Lightbox */
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = galleryImages[index].src;
  img.alt = galleryImages[index].alt;
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  const img = document.getElementById('lightboxImg');
  img.src = galleryImages[currentLightboxIndex].src;
  img.alt = galleryImages[currentLightboxIndex].alt;
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => lightboxNav(-1));
document.getElementById('lightboxNext').addEventListener('click', () => lightboxNav(1));

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('lightbox-img-wrap')) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').style.display !== 'none') {
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  }
});

renderGallery();


/* ----------------------------------------------------------------
   4. SEATING TABLES DATA
   ★ CUSTOMIZE: This is the main place to edit your seating plan.

   To update tables:
   - Change the 'name' of any table
   - Add/remove guest names in the 'guests' array
   - Add a new table object to the array (copy/paste any existing block)
   - Delete a table object to remove it

   The layout is generated automatically from this data.
   ---------------------------------------------------------------- */
const tablesData = [
  {
    number: 1,
    name:   'Table Magnolia',
    guests: [
      'Emma Thompson',       // bride
      'James Richardson',    // groom
      'Catherine Thompson',
      'Robert Thompson',
      'Margaret Richardson',
      'William Richardson',
      'Olivia Hart',
      'Thomas Hart',
    ]
  },
  {
    number: 2,
    name:   'Table Gardenia',
    guests: [
      'Sophie Bennett',
      'Daniel Bennett',
      'Amelia Clarke',
      'Edward Clarke',
      'Charlotte Moore',
      'George Moore',
    ]
  },
  {
    number: 3,
    name:   'Table Lavender',
    guests: [
      'Isabella Taylor',
      'Lucas Taylor',
      'Mia Evans',
      'Noah Evans',
      'Grace Wilson',
      'Liam Wilson',
      'Ava Johnson',
    ]
  },
  {
    number: 4,
    name:   'Table Wisteria',
    guests: [
      'Emily Martin',
      'Henry Martin',
      'Chloe White',
      'Jack White',
      'Zoe Davies',
      'Oliver Davies',
    ]
  },
  {
    number: 5,
    name:   'Table Peony',
    guests: [
      'Lily Anderson',
      'James Anderson',
      'Hannah Thomas',
      'Benjamin Thomas',
      'Ella Jackson',
      'Alexander Jackson',
      'Scarlett Harris',
    ]
  },
  {
    number: 6,
    name:   'Table Iris',
    guests: [
      'Victoria Lewis',
      'Samuel Lewis',
      'Alice Walker',
      'Christopher Walker',
      'Maya Robinson',
      'Ethan Robinson',
    ]
  },
  {
    number: 7,
    name:   'Table Jasmine',
    guests: [
      'Eleanor Scott',
      'Charles Scott',
      'Sophie King',
      'Harry King',
      'Francesca Wright',
      'Julian Wright',
      'Penelope Green',
    ]
  },
  {
    number: 8,
    name:   'Table Dahlia',
    guests: [
      'Rebecca Adams',
      'Matthew Adams',
      'Lauren Baker',
      'Nathan Baker',
      'Jessica Nelson',
      'Ryan Nelson',
    ]
  },
];

/* Render tables */
function renderTables(filter = '') {
  const grid     = document.getElementById('tablesGrid');
  const notFound = document.getElementById('tablesNotFound');
  if (!grid) return;

  const query  = filter.trim().toLowerCase();
  let anyMatch = false;

  const html = tablesData.map(table => {
    /* Determine if any guest matches the search */
    const matchedGuests = table.guests.map(g => ({
      name: g,
      matched: query.length > 1 && g.toLowerCase().includes(query)
    }));

    const tableMatches = query.length < 2
      || table.name.toLowerCase().includes(query)
      || matchedGuests.some(g => g.matched);

    if (tableMatches) anyMatch = true;

    return `
      <div
        class="table-card reveal ${matchedGuests.some(g => g.matched) ? 'highlight' : ''}"
        style="display: ${tableMatches || query.length < 2 ? 'block' : 'none'}"
      >
        <p class="table-card-number">Table ${table.number}</p>
        <h3 class="table-card-name">${table.name}</h3>
        <div class="table-card-guests">
          ${matchedGuests.map(g =>
            `<div class="table-card-guest ${g.matched ? 'matched' : ''}">${g.name}</div>`
          ).join('')}
        </div>
        <p class="table-card-count">${table.guests.length} guest${table.guests.length !== 1 ? 's' : ''}</p>
      </div>
    `;
  }).join('');

  grid.innerHTML = html;

  /* Show/hide "not found" message */
  if (notFound) {
    notFound.style.display = (query.length > 1 && !anyMatch) ? 'block' : 'none';
  }

  /* Re-observe new elements for reveal animation */
  observeRevealElements();
}

/* Guest search */
const searchInput = document.getElementById('guestSearch');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    renderTables(this.value);
  });
}

renderTables();


/* ----------------------------------------------------------------
   5. RSVP FORM HANDLING
   ★ CUSTOMIZE: Set your Formspree endpoint in index.html
     action="https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT"

   HOW TO SET UP FORMSPREE (free, takes 2 minutes):
   1. Go to https://formspree.io and sign up for free
   2. Click "New Form" → give it a name like "Wedding RSVP"
   3. Copy the endpoint URL (looks like: https://formspree.io/f/xabcdefg)
   4. In index.html, find the <form> tag and replace
      "YOUR_FORMSPREE_ENDPOINT" with your actual endpoint
   5. Optional: in Formspree dashboard → Settings → Email Notifications
      to get emailed whenever someone RSVPs
   6. Responses appear in your Formspree dashboard automatically

   ALTERNATIVE: If you prefer Google Forms, you can embed a Google
   Form iframe inside the rsvp section instead of this form.
   ---------------------------------------------------------------- */
const rsvpForm       = document.getElementById('rsvpForm');
const successMsg     = document.getElementById('formSuccess');
const errorMsg       = document.getElementById('formError');
const submitBtn      = document.getElementById('rsvpSubmitBtn');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    /* Basic validation */
    const fullName = document.getElementById('fullName');
    const email    = document.getElementById('email');
    const attended = document.querySelector('input[name="attendance"]:checked');

    if (!fullName.value.trim()) { fullName.focus(); return; }
    if (!email.value.trim() || !email.value.includes('@')) { email.focus(); return; }
    if (!attended) { alert('Please select whether you will be attending.'); return; }

    /* Show loading state */
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled       = true;

    try {
      const data = new FormData(rsvpForm);
      const res  = await fetch(rsvpForm.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        rsvpForm.style.display  = 'none';
        successMsg.style.display = 'block';
        window.scrollTo({ top: document.getElementById('rsvp').offsetTop - 80, behavior: 'smooth' });
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      errorMsg.style.display = 'block';
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled       = false;
    }
  });
}


/* ----------------------------------------------------------------
   6. NAVBAR — scroll behaviour & active section
   ---------------------------------------------------------------- */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  /* Sticky nav style */
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Back to top button */
  const btt = document.getElementById('backToTop');
  if (window.scrollY > 600) {
    btt.classList.add('visible');
  } else {
    btt.classList.remove('visible');
  }

  /* Active nav link */
  let currentSection = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) {
      currentSection = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


/* ----------------------------------------------------------------
   7. MOBILE NAV TOGGLE
   ---------------------------------------------------------------- */
const navToggle  = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', function() {
  this.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

/* Close mobile nav on link click */
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* Close mobile nav on outside click */
document.addEventListener('click', function(e) {
  if (!navbar.contains(e.target) && navLinksEl.classList.contains('open')) {
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
  }
});


/* ----------------------------------------------------------------
   8. BACK TO TOP BUTTON
   ---------------------------------------------------------------- */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ----------------------------------------------------------------
   9. SCROLL REVEAL ANIMATION
   Uses IntersectionObserver to animate .reveal elements as they
   enter the viewport. data-delay attribute adds stagger (in ms).
   ---------------------------------------------------------------- */
function observeRevealElements() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

observeRevealElements();


/* ----------------------------------------------------------------
   10. SMOOTH SCROLL for all anchor links
   (CSS scroll-behavior: smooth is set but this provides
   offset for the fixed navbar height)
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});