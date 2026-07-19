/* ============================================================
   SIVOV_OS — Red Sands Terminal
   Plain vanilla JS, no dependencies, no build step.
   Everything here is progressive enhancement: the page is
   fully readable with JS disabled.
   ============================================================ */

(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = function () { return window.matchMedia('(min-width: 901px)').matches; };

  /* ============================================================
     BOOT SEQUENCE
     Runs once per tab session; skipped entirely for
     reduced-motion users; click/keypress skips instantly.
     ============================================================ */

  function boot() {
    if (REDUCED || sessionStorage.getItem('sivov_booted')) return ready();

    var overlay = document.createElement('div');
    overlay.className = 'boot';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-label', 'Loading');
    overlay.innerHTML =
      '<pre class="boot__screen"></pre>' +
      '<p class="boot__hint">PRESS ANY KEY TO SKIP</p>';
    document.body.appendChild(overlay);

    var screen = overlay.querySelector('.boot__screen');
    var lines = [
      'SIVOV_OS v26.07 — RED SANDS TERMINAL',
      'MEM CHECK ................. 640K <span class="ok">OK</span>',
      'LOADING PSYCHOLOGY.SYS .... <span class="ok">OK</span>',
      'LOADING QUANT_METHODS.PKG . <span class="ok">OK</span>',
      'LOADING AI_SAFETY.KRN ..... <span class="ok">OK</span>',
      'MOUNTING /RESEARCH ........ <span class="ok">OK</span>',
      'IDENTITY: SIVOV, ANDREI ... <span class="ok">VERIFIED</span>',
      '',
      '> WELCOME, VISITOR_'
    ];

    var i = 0;
    var timer = setInterval(function () {
      if (i >= lines.length) { clearInterval(timer); setTimeout(finish, 350); return; }
      screen.innerHTML += lines[i] + '\n';
      i++;
    }, 130);

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      sessionStorage.setItem('sivov_booted', '1');
      overlay.classList.add('is-done');
      setTimeout(function () { overlay.remove(); }, 300);
      ready();
    }

    overlay.addEventListener('click', finish);
    document.addEventListener('keydown', finish, { once: true });
  }

  /* ============================================================
     HERO TYPEWRITER
     Text lives in the HTML (works without JS); we retype it.
     ============================================================ */

  function ready() {
    if (REDUCED) return;
    var el = document.querySelector('[data-typed]');
    if (!el) return;
    var full = el.textContent;
    el.textContent = '';
    var i = 0;
    (function tick() {
      if (i > full.length) return;
      el.textContent = full.slice(0, i);
      i++;
      setTimeout(tick, 16);
    })();
  }

  /* ============================================================
     WINDOW CHROME — [–] collapse, [x] denied easter egg
     Buttons injected by JS so markup stays clean without it.
     ============================================================ */

  function windowChrome() {
    var wins = document.querySelectorAll('[data-window]');
    Array.prototype.forEach.call(wins, function (win, n) {
      var bar = win.querySelector('.window__bar');
      var body = win.querySelector('.window__body');
      if (!bar || !body) return;

      body.id = body.id || 'winbody-' + n;

      var stripes = document.createElement('span');
      stripes.className = 'window__stripes';
      stripes.setAttribute('aria-hidden', 'true');

      var min = document.createElement('button');
      min.className = 'window__btn';
      min.type = 'button';
      min.textContent = '–';
      min.setAttribute('aria-label', 'Collapse window');
      min.setAttribute('aria-expanded', 'true');
      min.setAttribute('aria-controls', body.id);
      min.addEventListener('click', function () {
        var collapsed = win.classList.toggle('is-collapsed');
        min.setAttribute('aria-expanded', String(!collapsed));
        min.setAttribute('aria-label', collapsed ? 'Expand window' : 'Collapse window');
      });

      var close = document.createElement('button');
      close.className = 'window__btn';
      close.type = 'button';
      close.textContent = '×';
      close.setAttribute('aria-label', 'Close window (denied)');
      var title = bar.querySelector('.window__title');
      var orig = title ? title.textContent : '';
      close.addEventListener('click', function () {
        if (!title || win.classList.contains('is-denied')) return;
        win.classList.add('is-denied');
        title.textContent = '▪ ACCESS DENIED — NICE TRY';
        setTimeout(function () {
          title.textContent = orig;
          win.classList.remove('is-denied');
        }, 900);
      });

      bar.appendChild(stripes);
      bar.appendChild(min);
      bar.appendChild(close);
    });
  }

  /* ============================================================
     DRAGGABLE WINDOWS (desktop only)
     Drag moves via transform so document flow never breaks.
     Double-click a title bar to snap the window home.
     ============================================================ */

  function draggable() {
    var z = 10;
    var bars = document.querySelectorAll('[data-drag-handle]');
    Array.prototype.forEach.call(bars, function (bar) {
      var win = bar.closest('.window');
      var dx = 0, dy = 0;

      bar.addEventListener('pointerdown', function (e) {
        if (!DESKTOP()) return;
        if (e.target.closest('button')) return;
        var startX = e.clientX - dx;
        var startY = e.clientY - dy;
        win.style.zIndex = ++z;
        win.classList.add('is-dragging');
        bar.setPointerCapture(e.pointerId);

        function move(ev) {
          dx = ev.clientX - startX;
          dy = ev.clientY - startY;
          win.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        }
        function up(ev) {
          bar.releasePointerCapture(ev.pointerId);
          win.classList.remove('is-dragging');
          bar.removeEventListener('pointermove', move);
          bar.removeEventListener('pointerup', up);
        }
        bar.addEventListener('pointermove', move);
        bar.addEventListener('pointerup', up);
      });

      bar.addEventListener('dblclick', function () {
        dx = 0; dy = 0;
        win.style.transform = '';
      });
    });
  }

  /* ============================================================
     TASKBAR SCROLLSPY
     ============================================================ */

  function scrollspy() {
    var links = document.querySelectorAll('.taskbar__btn');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    Array.prototype.forEach.call(links, function (a) {
      map[a.getAttribute('href').slice(1)] = a;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Array.prototype.forEach.call(links, function (a) { a.removeAttribute('aria-current'); });
        var link = map[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    Array.prototype.forEach.call(document.querySelectorAll('.zone'), function (s) {
      observer.observe(s);
    });
  }

  /* ============================================================
     SPECIAL MENU — "LET THE DUCK OUT" easter egg
     A pixel duck (site palette) roams the screen for a few
     seconds, then dashes off the nearest edge. Ducks stack.
     ============================================================ */

  var DUCK_SVG = (function () {
    // 16×12 pixel map: R rust, C crimson, S sand, . empty
    var MAP = [
      '........RRRR....',
      '.......RRRRRR...',
      '.......RS.RRRCC.',
      '.......RRRRRR...',
      '..R...RRRRRR....',
      '..RR.RRRRRRR....',
      '...RRRCCRRRRR...',
      '...RRRCRRRRRR...',
      '....RRRRRRRR....',
      '.....RRRRRR.....',
      '.....C..C.......',
      '....CC..CC......'
    ];
    var FILL = { R: '#8C2E1B', C: '#B23A22', S: '#F4E8D1' };
    var rects = '';
    for (var y = 0; y < MAP.length; y++) {
      for (var x = 0; x < MAP[y].length; x++) {
        var c = MAP[y][x];
        if (FILL[c]) {
          rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + FILL[c] + '"/>';
        }
      }
    }
    return '<svg class="duck__sprite" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12" shape-rendering="crispEdges">' + rects + '</svg>';
  })();

  function spawnDuck() {
    var el = document.createElement('div');
    el.className = 'duck';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = DUCK_SVG;
    document.body.appendChild(el);

    var W = window.innerWidth, H = window.innerHeight;
    var fromLeft = Math.random() < 0.5;
    var x = fromLeft ? -60 : W + 60;
    var y = 60 + Math.random() * Math.max(80, H - 220);
    var speed = 140 + Math.random() * 120;           // px/s
    var vx = (fromLeft ? 1 : -1) * speed;
    var vy = 0;
    var life = 5000 + Math.random() * 5000;          // roaming time, ms
    var born = performance.now();
    var lastTurn = born;
    var leaving = false;
    var last = born;

    function frame(t) {
      var dt = Math.min(50, t - last) / 1000;
      last = t;
      W = window.innerWidth;
      H = window.innerHeight;

      if (!leaving && t - born > life) {
        // time's up: dash straight off the nearest side
        leaving = true;
        vx = (x > W / 2 ? 1 : -1) * speed * 1.7;
        vy = 0;
      }

      if (!leaving && t - lastTurn > 400 + Math.random() * 900) {
        // pick a new direction, biased horizontal so it reads as running
        lastTurn = t;
        var s = speed * (0.7 + Math.random() * 0.6);
        var ang = (Math.random() * 2 - 1) * 0.9;
        vx = Math.cos(ang) * s * (Math.random() < 0.5 ? -1 : 1);
        vy = Math.sin(ang) * s * 0.6;
      }

      x += vx * dt;
      y += vy * dt;

      if (!leaving) {
        // bounce off screen edges (menubar/taskbar respected)
        if (x < 8 && vx < 0) vx = -vx;
        if (x > W - 56 && vx > 0) vx = -vx;
        if (y < 44 && vy < 0) vy = -vy;
        if (y > H - 110 && vy > 0) vy = -vy;
      }

      el.style.transform = 'translate(' + x + 'px,' + y + 'px)' + (vx < 0 ? ' scaleX(-1)' : '');

      if (leaving && (x < -80 || x > W + 80)) { el.remove(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function specialMenu() {
    var btn = document.getElementById('menu-special');
    var list = document.getElementById('menu-special-list');
    var release = document.getElementById('duck-release');
    var countEl = document.getElementById('duck-count');
    if (!btn || !list || !release) return;

    var released = 0;

    function close() { list.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    function open() { list.hidden = false; btn.setAttribute('aria-expanded', 'true'); }

    btn.addEventListener('click', function () {
      if (list.hidden) open(); else close();
    });

    document.addEventListener('click', function (e) {
      if (!list.hidden && !e.target.closest('.menu')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    release.addEventListener('click', function () {
      released++;
      if (countEl) {
        countEl.hidden = false;
        countEl.textContent = 'DUCKS RELEASED: ' + released;
      }
      spawnDuck();
      close();
    });
  }

  /* ============================================================
     MENUBAR CLOCK + TALK COUNTDOWN
     ============================================================ */

  function clock() {
    var el = document.getElementById('clock');
    if (!el) return;
    var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var narrow = window.matchMedia('(max-width: 640px)');
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var d = new Date();
      if (narrow.matches) {
        el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      } else {
        el.textContent = pad(d.getDate()) + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() +
          ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      }
    }
    tick();
    setInterval(tick, 1000);
    narrow.addEventListener('change', tick);
  }

  function countdown() {
    var el = document.getElementById('talk-countdown');
    if (!el) return;
    var talk = new Date('2026-07-28T09:00:00');
    var days = Math.ceil((talk - new Date()) / 86400000);
    if (days > 1) el.textContent = 'T−' + (days < 10 ? '0' : '') + days + ' DAYS';
    else if (days >= 0) el.textContent = 'HAPPENING NOW';
    else el.textContent = 'PRESENTED';
  }

  /* ============================================================
     INIT
     ============================================================ */

  document.addEventListener('DOMContentLoaded', function () {
    windowChrome();
    draggable();
    specialMenu();
    scrollspy();
    clock();
    countdown();
    boot();
  });
})();
