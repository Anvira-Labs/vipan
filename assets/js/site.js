// Progressive enhancement only. With JS off, all content is visible and the OS theme applies.
(function () {
  var root = document.documentElement;

  // Older shared links pointed at sections that have since moved. Send them to the new home.
  if (document.getElementById('services')) {
    var moved = {
      consultant: '#services', outsourcing: '#engagement',
      'path-leader': 'experience.html', 'path-builder': 'experience.html',
      career: 'experience.html#career', skills: 'experience.html#skills', industries: 'experience.html#industries',
      education: 'experience.html#education', references: 'experience.html#references'
    };
    var dest = moved[location.hash.slice(1)];
    if (dest) location.replace(dest);
  }

  // Mobile menu. With JS off, the links simply stay visible in the header.
  (function () {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('site-nav');
    if (!toggle || !menu) return;
    function setOpen(open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    }
    toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !e.target.closest('.site-head')) setOpen(false);
    });
  })();

  // Contact form. The site is static, so there is no server to receive a submission. The form builds an
  // email draft instead, and never claims the message was sent: only the visitor's email app can do that.
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = form.querySelector('.form-status');
    var topic = form.elements.topic;

    // "Discuss This Service" links arrive with the matching topic already chosen.
    Array.prototype.forEach.call(document.querySelectorAll('[data-topic]'), function (a) {
      a.addEventListener('click', function () { topic.value = a.getAttribute('data-topic'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var v = function (k) { return form.elements[k].value.trim(); };
      var to = form.getAttribute('data-to');
      var subject = 'Consulting enquiry: ' + v('topic') + (v('company') ? ' (' + v('company') + ')' : '');
      var body = [
        'Name: ' + v('name'),
        'Business email: ' + v('email'),
        'Company: ' + (v('company') || 'Not given'),
        'Needs help with: ' + v('topic'),
        '',
        v('description')
      ].join('\n');

      status.hidden = false;
      status.textContent = '';
      var msg = document.createElement('p');
      msg.textContent = 'Your email app should have opened with a draft. Your message is not sent until you press Send there. If no draft appeared, copy the message and email it to ' + to + '.';
      var copy = document.createElement('button');
      copy.type = 'button';
      copy.textContent = 'Copy message';
      copy.addEventListener('click', function () {
        var text = 'To: ' + to + '\nSubject: ' + subject + '\n\n' + body;
        var done = function (ok) { copy.textContent = ok ? 'Message copied' : 'Could not copy. Please select and copy your text.'; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else { done(false); }
      });
      status.appendChild(msg);
      status.appendChild(copy);

      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  })();
  var btn = document.querySelector('.theme-btn');

  function current() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paint() {
    if (!btn) return;
    var t = current();
    btn.textContent = t === 'dark' ? 'Light' : 'Dark';
    btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: theme lasts this page only */ }
      paint();
    });
    paint();
  }

  // Career timeline. The HTML is a plain list (newest first) for JS-off visitors and crawlers.
  // Here it becomes a sideways carousel, oldest to newest, with the active role always centred.
  (function () {
    var sec = document.getElementById('career');
    var ol = sec && sec.querySelector('ol');
    if (!ol || !ol.children.length) return;
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var roles = Array.prototype.slice.call(ol.children).reverse();

    function el(tag, cls, html) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (html != null) n.innerHTML = html;
      return n;
    }

    var tl = el('div', 'tl');
    tl.setAttribute('role', 'region');
    tl.setAttribute('aria-roledescription', 'carousel');
    tl.setAttribute('aria-label', 'Career timeline. Swipe or scroll sideways, or use the arrow keys.');

    var head = el('div', 'tl-head');
    var yearEl = el('div', 'tl-year');
    var subEl = el('p', 'tl-sub');
    subEl.setAttribute('aria-live', 'polite');
    head.appendChild(yearEl);
    head.appendChild(subEl);

    var view = el('div', 'tl-view');
    var prev = el('button', 'tl-nav tl-prev', '<span aria-hidden="true">&#8592;</span>');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Earlier role');
    var next = el('button', 'tl-nav tl-next', '<span aria-hidden="true">&#8594;</span>');
    next.type = 'button';
    next.setAttribute('aria-label', 'Later role');
    var track = el('div', 'tl-track');
    track.tabIndex = 0;

    var cards = [], dots = [], years = [];
    var dotRow = el('div', 'tl-dots');

    roles.forEach(function (li, i) {
      var when = (li.querySelector('.role-when') || {}).textContent || '';
      var body = li.children[1];
      var h3 = body.querySelector('h3');
      var org = (body.querySelector('.org') || {}).textContent || '';
      var ys = when.match(/\d{4}/g) || [''];
      var startYear = ys[0];
      years.push({ start: startYear, when: when, org: org, title: h3 ? h3.textContent : '' });

      var card = el('div', 'tl-card');
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', (i + 1) + ' of ' + roles.length + ': ' + org);
      var pin = el('div', 'tl-pin', '<span class="tl-pinyear">' + startYear + '</span><i class="tl-node"></i>');
      pin.setAttribute('aria-hidden', 'true');
      var panel = el('div', 'tl-body');
      panel.appendChild(el('p', 'tl-when', when));
      panel.appendChild(body);
      var tr = panel.querySelector('.track');
      if (tr) tr.classList.add('in');
      card.appendChild(pin);
      card.appendChild(panel);
      track.appendChild(card);
      cards.push(card);

      var d = el('button', 'tl-dot');
      d.type = 'button';
      d.setAttribute('aria-label', startYear + ', ' + org);
      d.innerHTML = '<i></i><span>' + startYear + '</span>';
      d.addEventListener('click', function () { go(i); });
      dotRow.appendChild(d);
      dots.push(d);

      card.addEventListener('click', function (e) {
        if (i !== active && !e.target.closest('a')) go(i);
      });
    });

    cards[0].classList.add('is-first');
    cards[cards.length - 1].classList.add('is-last');
    var capL = el('div', 'tl-cap', '<span>Where it started</span><b>' + years[0].start + '</b>');
    var capR = el('div', 'tl-cap', '<span>Where it is now</span><b>Today</b>');
    capL.setAttribute('aria-hidden', 'true');
    capR.setAttribute('aria-hidden', 'true');
    track.insertBefore(capL, track.firstChild);
    track.appendChild(capR);
    view.appendChild(prev);
    view.appendChild(track);
    view.appendChild(next);
    tl.appendChild(head);
    tl.appendChild(view);
    tl.appendChild(dotRow);
    tl.appendChild(el('p', 'tl-hint', 'Swipe, drag or use the arrows to move through time.'));

    var axis = sec.querySelector('.axis');
    if (axis) axis.parentNode.removeChild(axis);
    ol.parentNode.replaceChild(tl, ol);
    var lead = sec.querySelector('.section-head p');
    if (lead) lead.textContent = 'Every role, oldest to newest. Swipe or scroll sideways. Each bar is drawn to scale on the same 2011–2026 axis.';

    var active = -1;
    function paint(i) {
      if (i === active) return;
      active = i;
      cards.forEach(function (c, k) {
        c.classList.toggle('is-active', k === i);
        c.classList.toggle('is-near', Math.abs(k - i) === 1);
      });
      dots.forEach(function (d, k) {
        if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        d.classList.toggle('on', k === i);
      });
      var y = years[i];
      yearEl.textContent = y.start;
      subEl.innerHTML = '<b></b><span></span>';
      subEl.firstChild.textContent = y.org;
      subEl.lastChild.textContent = y.when;
      prev.disabled = i === 0;
      next.disabled = i === cards.length - 1;
      var dot = dots[i];
      if (dotRow.scrollWidth > dotRow.clientWidth) {
        dotRow.scrollLeft = dot.offsetLeft - dotRow.clientWidth / 2 + dot.offsetWidth / 2;
      }
    }

    function target(i) {
      var c = cards[i];
      return c.offsetLeft + c.offsetWidth / 2 - track.clientWidth / 2;
    }
    function go(i, instant) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: target(i), behavior: (calm || instant) ? 'auto' : 'smooth' });
      paint(i);
    }
    function nearest() {
      var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
      cards.forEach(function (c, k) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bd) { bd = d; best = k; }
      });
      return best;
    }

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; paint(nearest()); });
    }, { passive: true });
    prev.addEventListener('click', function () { go(active - 1); });
    next.addEventListener('click', function () { go(active + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(cards.length - 1); }
    });

    // Mouse drag. Touch and trackpads already scroll and snap natively.
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('a,button')) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 4) return;
      if (!drag.moved) { drag.moved = true; track.classList.add('is-drag'); }
      track.scrollLeft = drag.left - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!drag) return;
      var moved = drag.moved;
      drag = null;
      track.classList.remove('is-drag');
      if (moved) go(nearest());
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { go(active, true); }, 120);
    });

    // Start on the newest role, once layout and fonts have settled.
    paint(cards.length - 1);
    go(cards.length - 1, true);
    window.addEventListener('load', function () { go(active, true); });
  })();

  var items = document.querySelectorAll('.reveal');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
