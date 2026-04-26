(function () {
  'use strict';

  var WHATSAPP_NUMBER = '4915172377683';

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initIcons();

    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var nav = document.querySelector('.nav');
    var menuToggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var menuIcon = document.getElementById('menu-icon');

    function setScrolled() {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 6);
    }

    function setMenu(open) {
      if (!menu || !menuToggle || !menuIcon) return;
      menu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menuIcon.setAttribute('data-lucide', open ? 'x' : 'menu');
      initIcons();
    }

    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });

    if (menuToggle && menu) {
      menuToggle.addEventListener('click', function () {
        setMenu(!menu.classList.contains('open'));
      });

      menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) setMenu(false);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') setMenu(false);
      });
    }

    initHeroSlider();
    initBeforeAfterSliders();
    initGallery();
    initLightbox();
    initContactForm();
    initCookieBanner();
    optimizeImages();
  });

  window.addEventListener('load', initIcons);

  function initHeroSlider() {
    var slidesWrap = document.getElementById('hero-slides');
    var dotsWrap = document.getElementById('hero-dots');
    var prevBtn = document.getElementById('hero-prev');
    var nextBtn = document.getElementById('hero-next');

    if (!slidesWrap || !dotsWrap) return;

    var slides = Array.prototype.slice.call(slidesWrap.querySelectorAll('.hero-slide'));
    if (slides.length < 2) return;

    var idx = Math.max(0, slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    }));
    var autoplay = null;

    dotsWrap.textContent = '';

    var dots = slides.map(function (_, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot';
      dot.setAttribute('aria-label', 'Bild ' + (index + 1) + ' anzeigen');
      dot.addEventListener('click', function () { go(index, true); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function render() {
      slides.forEach(function (slide, index) {
        slide.classList.toggle('active', index === idx);
        slide.setAttribute('aria-hidden', index === idx ? 'false' : 'true');
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('active', index === idx);
        dot.setAttribute('aria-current', index === idx ? 'true' : 'false');
      });
    }

    function go(index, userAction) {
      idx = (index + slides.length) % slides.length;
      render();
      if (userAction) restart();
    }

    function next(userAction) {
      go(idx + 1, userAction);
    }

    function prev() {
      go(idx - 1, true);
    }

    function start() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stop();
      autoplay = window.setInterval(function () { next(false); }, 4800);
    }

    function stop() {
      if (autoplay) window.clearInterval(autoplay);
      autoplay = null;
    }

    function restart() {
      stop();
      start();
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', function () { next(true); });

    slidesWrap.addEventListener('mouseenter', stop);
    slidesWrap.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    var startX = 0;
    var startY = 0;

    slidesWrap.addEventListener('touchstart', function (event) {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }, { passive: true });

    slidesWrap.addEventListener('touchend', function (event) {
      if (!event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - startX;
      var dy = event.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? next(true) : prev();
      }
    }, { passive: true });

    render();
    start();
  }

  function initBeforeAfterSliders() {
    Array.prototype.forEach.call(document.querySelectorAll('.ba-slider'), function (slider) {
      var after = slider.querySelector('.ba-after');
      var line = slider.querySelector('.ba-line');
      var labelBefore = slider.querySelector('.ba-label-before');
      var labelAfter = slider.querySelector('.ba-label-after');
      if (!after || !line) return;
      var dragging = false;
      var currentPct = 50;

      function setPct(pct) {
        pct = Math.max(0, Math.min(100, pct));
        currentPct = pct;
        after.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
        line.style.left = pct + '%';
        slider.setAttribute('aria-valuenow', String(Math.round(pct)));
        if (labelBefore) labelBefore.style.opacity = String(Math.max(0, Math.min(1, pct / 18)));
        if (labelAfter) labelAfter.style.opacity = String(Math.max(0, Math.min(1, (100 - pct) / 18)));
      }

      function pctFromClientX(clientX) {
        var rect = slider.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      }

      function clientXFromEvent(event) {
        if (event.touches && event.touches.length) return event.touches[0].clientX;
        if (event.changedTouches && event.changedTouches.length) return event.changedTouches[0].clientX;
        return event.clientX;
      }

      function startDrag(event) {
        dragging = true;
        slider.classList.add('is-dragging');
        if (event.cancelable) event.preventDefault();
        setPct(pctFromClientX(clientXFromEvent(event)));
      }

      function moveDrag(event) {
        if (!dragging) return;
        if (event.cancelable) event.preventDefault();
        setPct(pctFromClientX(clientXFromEvent(event)));
      }

      function stopDrag() {
        dragging = false;
        slider.classList.remove('is-dragging');
      }

      if (window.PointerEvent) {
        slider.addEventListener('pointerdown', startDrag);
        document.addEventListener('pointermove', moveDrag);
        document.addEventListener('pointerup', stopDrag);
        document.addEventListener('pointercancel', stopDrag);
      } else {
        slider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', stopDrag);
        slider.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', moveDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
        document.addEventListener('touchcancel', stopDrag);
      }

      slider.addEventListener('dragstart', function (event) {
        event.preventDefault();
      });

      slider.setAttribute('tabindex', '0');
      slider.setAttribute('role', 'slider');
      slider.setAttribute('aria-label', 'Vorher-Nachher Vergleich');
      slider.setAttribute('aria-valuemin', '0');
      slider.setAttribute('aria-valuemax', '100');
      slider.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          setPct(currentPct - 5);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          setPct(currentPct + 5);
        }
      });

      setPct(50);
    });
  }

  function initGallery() {
    var initialVisible = 9;
    var grid = document.getElementById('gallery-grid');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.gallery-tab[data-filter]'));
    var showAllBtn = document.getElementById('show-all-btn');
    var countEl = document.getElementById('gallery-count');

    if (!items.length) return;
    if (countEl) countEl.textContent = String(items.length);
    if (grid) grid.classList.add('gallery-ready');

    var revealObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          });
        }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' })
      : null;

    function revealVisible() {
      var visibleItems = items.filter(function (item) {
        return !item.classList.contains('hidden');
      });

      if (revealObserver) {
        items.forEach(function (item) { revealObserver.unobserve(item); });
      }

      visibleItems.forEach(function (item, index) {
        item.classList.remove('is-visible');
        item.style.setProperty('--reveal-delay', Math.min(index, 8) * 55 + 'ms');
      });

      window.requestAnimationFrame(function () {
        visibleItems.forEach(function (item) {
          if (revealObserver) revealObserver.observe(item);
          else item.classList.add('is-visible');
        });
      });
    }

    function visibleForCategory(category) {
      return items.filter(function (item) {
        return category === 'all' || item.dataset.cat === category;
      });
    }

    function applyFilter(category, expanded) {
      var visibleItems = visibleForCategory(category);
      items.forEach(function (item) {
        var isMatch = visibleItems.indexOf(item) !== -1;
        var shouldLimit = category === 'all' && !expanded;
        var isOverLimit = shouldLimit && visibleItems.indexOf(item) >= initialVisible;
        item.classList.toggle('hidden', !isMatch || isOverLimit);
      });

      tabs.forEach(function (tab) {
        var active = tab.dataset.filter === category;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (showAllBtn) {
        showAllBtn.style.display = category === 'all' && visibleItems.length > initialVisible && !expanded ? '' : 'none';
      }

      revealVisible();
    }

    tabs.forEach(function (tab) {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', function () {
        applyFilter(tab.dataset.filter || 'all', false);
      });
    });

    if (showAllBtn) {
      showAllBtn.addEventListener('click', function () {
        applyFilter('all', true);
      });
    }

    applyFilter('all', false);
  }

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeBtn = document.getElementById('lightbox-close');
    var prevBtn = document.getElementById('lightbox-prev');
    var nextBtn = document.getElementById('lightbox-next');

    if (!lightbox || !lightboxImg) return;

    var currentIndex = 0;
    var currentItems = [];

    function getVisibleItems() {
      return Array.prototype.slice.call(
        document.querySelectorAll('.gallery-item:not(.hidden)')
      );
    }

    function show() {
      var item = currentItems[currentIndex];
      if (!item) return;
      var img = item.querySelector('img');
      var caption = item.querySelector('.gallery-overlay span');
      lightboxImg.src = img ? img.src : '';
      lightboxImg.alt = img ? (img.alt || '') : '';
      if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    function prev() {
      currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
      show();
    }

    function next() {
      currentIndex = (currentIndex + 1) % currentItems.length;
      show();
    }

    var grid = document.getElementById('gallery-grid');
    if (grid) {
      grid.addEventListener('click', function (event) {
        var item = event.target.closest('.gallery-item');
        if (!item) return;
        currentItems = getVisibleItems();
        currentIndex = currentItems.indexOf(item);
        if (currentIndex === -1) return;
        show();
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) close();
    });

    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();
    });

    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (event) {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (event) {
      var dx = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    }, { passive: true });
  }

  var WEB3FORMS_KEY = '3ffcab5f-8a20-4624-8bf7-bbebddd8b882';

  function showFormSuccess() {
    var wrap = document.getElementById('contact-form-wrap');
    if (!wrap) return;
    wrap.innerHTML =
      '<div class="form-success">' +
        '<div class="form-success-icon" aria-hidden="true">' +
          '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5">' +
            '<polyline points="20 6 9 17 4 12"></polyline>' +
          '</svg>' +
        '</div>' +
        '<h3>Nachricht gesendet!</h3>' +
        '<p>Vielen Dank! Ich melde mich so schnell wie möglich bei Ihnen.</p>' +
      '</div>';
  }

  function setSubmitLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Wird gesendet …' : 'Nachricht senden';
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var payload = {
        name:    (data.get('name')    || '').trim(),
        phone:   (data.get('phone')   || '').trim(),
        email:   (data.get('email')   || '').trim() || null,
        message: (data.get('message') || '').trim()
      };

      var btn = form.querySelector('[type="submit"]');
      setSubmitLoading(btn, true);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          from_name: 'Andrii Ryndia Website',
          subject: 'Neue Anfrage von der Website — ' + payload.name,
          name: payload.name,
          email: payload.email || 'nicht@angegeben.de',
          phone: payload.phone || '—',
          message: payload.message,
          botcheck: ''
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            showFormSuccess();
          } else {
            alert('Fehler: ' + (json.message || 'Unbekannter Fehler'));
            setSubmitLoading(btn, false);
          }
        })
        .catch(function () {
          alert('Verbindungsfehler. Bitte versuchen Sie es später erneut oder schreiben Sie uns per WhatsApp.');
          setSubmitLoading(btn, false);
        });
    });
  }

  function optimizeImages() {
    Array.prototype.forEach.call(document.querySelectorAll('img'), function (img, index) {
      img.decoding = 'async';
      if (index > 1 && !img.hasAttribute('loading')) img.loading = 'lazy';
    });
  }

  function initCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    var acceptBtn = document.getElementById('cookie-accept');
    var declineBtn = document.getElementById('cookie-decline');

    if (!banner) return;
    if (localStorage.getItem('cookie-consent')) return;

    window.setTimeout(function () {
      banner.classList.add('visible');
    }, 1200);

    function dismiss() {
      banner.classList.remove('visible');
      window.setTimeout(function () {
        banner.style.display = 'none';
      }, 400);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookie-consent', 'accepted');
        dismiss();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookie-consent', 'declined');
        dismiss();
      });
    }
  }
})();
