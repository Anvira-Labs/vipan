// Progressive enhancement only. With JS off, all content is visible and the OS theme applies.
(function () {
  var root = document.documentElement;
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

  // Audience modes. The raw HTML is three stacked sections with plain jump links.
  // Only here do they become ARIA tabs, so JS-off visitors and crawlers get all three.
  var modeNav = document.querySelector('.mode-tabs');
  if (modeNav) {
    var tabs = Array.prototype.slice.call(modeNav.querySelectorAll('a'));
    var ids = tabs.map(function (a) { return a.getAttribute('href').slice(1); });
    var list = modeNav.querySelector('ul');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', modeNav.getAttribute('aria-label'));
    modeNav.removeAttribute('aria-label');
    tabs.forEach(function (a, i) {
      var panel = document.getElementById(ids[i]);
      a.id = 'tab-' + ids[i];
      a.setAttribute('role', 'tab');
      a.setAttribute('aria-controls', ids[i]);
      a.parentNode.setAttribute('role', 'presentation');
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', a.id);
      panel.setAttribute('tabindex', '0');
    });
    var selectMode = function (id, focus) {
      tabs.forEach(function (a, i) {
        var on = ids[i] === id;
        a.setAttribute('aria-selected', on ? 'true' : 'false');
        a.setAttribute('tabindex', on ? '0' : '-1');
        document.getElementById(ids[i]).hidden = !on;
        if (on && focus) a.focus();
      });
    };
    var hashMode = function () {
      var h = location.hash.slice(1);
      return ids.indexOf(h) > -1 ? h : null;
    };
    var showHash = function () {
      var h = hashMode();
      if (!h) return;
      selectMode(h);
      document.getElementById(h).scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    var choose = function (id, focus) {
      selectMode(id, focus);
      // Keeps the address shareable without jumping the page.
      try { history.replaceState(null, '', '#' + id); } catch (e) { /* the address just will not update */ }
    };
    selectMode(hashMode() || modeNav.getAttribute('data-default') || ids[0]);
    tabs.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); choose(ids[i]); });
      a.addEventListener('keydown', function (e) {
        var n = tabs.length, next = null;
        if (e.key === 'ArrowRight') next = (i + 1) % n;
        else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = n - 1;
        else if (e.key === ' ') next = i;
        if (next === null) return;
        e.preventDefault();
        choose(ids[next], true);
      });
    });
    window.addEventListener('hashchange', showHash);
    // Hiding panels moves the page after the browser's own jump, so re-aim. CSS scroll-margin keeps the tabs in view.
    if (hashMode()) { showHash(); window.addEventListener('load', showHash); }
  }

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
