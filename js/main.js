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
     SUBJECT MODEL — dithered pixel bust
     A head-and-shoulders mask filled with shade blocks; density
     falls off toward the edges, with per-cell dither noise.
     ============================================================ */

  function renderBust() {
    var pre = document.getElementById('bust');
    if (!pre) return;

    var MASK = [
      '..........########..........',
      '.........##########.........',
      '........############........',
      '.......##############.......',
      '.......##############.......',
      '.......##############.......',
      '.......##############.......',
      '........############........',
      '........############........',
      '.........##########.........',
      '..........########..........',
      '...........######...........',
      '...........######...........',
      '.........##########.........',
      '.......##############.......',
      '.....##################.....',
      '...######################...',
      '..########################..',
      '.##########################.',
      '############################',
      '############################',
      '############################',
      '############################',
      '############################'
    ];

    var RAMP = ['░', '▒', '▓', '█'];
    var out = [];

    for (var y = 0; y < MASK.length; y++) {
      var row = MASK[y];
      var line = '';
      // find the filled extent of this row for edge-based shading
      var first = row.indexOf('#');
      var last = row.lastIndexOf('#');
      for (var x = 0; x < row.length; x++) {
        if (row[x] !== '#') { line += ' '; continue; }
        var span = Math.max(1, last - first);
        var center = (first + last) / 2;
        var edge = Math.abs(x - center) / (span / 2); // 0 center → 1 edge
        var level = 2 - Math.floor(edge * 2.6);
        // dither noise, strong enough to break up solid runs
        var r = Math.random();
        if (r < 0.3) level -= 1;
        else if (r > 0.72) level += 1;
        level = Math.max(0, Math.min(3, level));
        line += RAMP[level];
      }
      out.push(line);
    }

    pre.textContent = out.join('\n');
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
     MENUBAR CLOCK + TALK COUNTDOWN
     ============================================================ */

  function clock() {
    var el = document.getElementById('clock');
    if (!el) return;
    var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var d = new Date();
      el.textContent = pad(d.getDate()) + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
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
    renderBust();
    windowChrome();
    draggable();
    scrollspy();
    clock();
    countdown();
    boot();
  });
})();
