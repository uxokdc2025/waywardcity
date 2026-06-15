/* Wayward City — featured-set hero slideshow.
   Self-contained custom element so its crossfade/parallax live entirely outside
   the host's React render cycle (persistent DOM = reliable CSS transitions). */
(function () {
  if (customElements.get('wayward-hero')) return;

  var SLIDES = [
    { img: 'assets/banner-paradox.webp',   game: 'Pokémon',                   label: 'Now Available', cta: 'Shop Paradox Rift', accent: '#ff4fa3', target: 'sec-drops' },
    { img: 'assets/banner-digimon.webp',   game: 'Digimon Card Game',         label: 'In Stock',      cta: 'Shop Digimon',     accent: '#38c6ff', target: 'sec-drops' },
    { img: 'assets/banner-doctorwho.webp', game: 'Magic · Universes Beyond',  label: 'Featured',      cta: 'Shop Doctor Who',  accent: '#38c6ff', target: 'sec-sealed' },
    { img: 'assets/banner-highseas.webp',  game: 'Flesh & Blood',             label: 'New Release',   cta: 'Shop High Seas',   accent: '#38c6ff', target: 'sec-sealed' }
  ];

  var STYLE = '\
.wh-root{position:relative;width:100%;height:480px;overflow:hidden;cursor:pointer;background:var(--void-900,#05050c);font-family:var(--font-heading,sans-serif);}\
.wh-px{position:absolute;inset:-28px;will-change:transform;transition:transform 220ms cubic-bezier(0.16,1,0.3,1);}\
.wh-slide{position:absolute;inset:0;opacity:0;pointer-events:none;}\
@keyframes wh-fadein{from{opacity:0;}to{opacity:1;}}\
@keyframes wh-fadeout{from{opacity:1;}to{opacity:0;}}\
.wh-art{position:absolute;inset:0;background-size:cover;background-position:center;animation:wh-kenburns 16s ease-in-out infinite alternate;}\
@keyframes wh-kenburns{0%{transform:scale(1.04);}100%{transform:scale(1.13);}}\
.wh-duotone{position:absolute;inset:0;background:linear-gradient(115deg,rgba(245,25,127,0.5) 0%,rgba(122,63,242,0.12) 48%,rgba(24,168,240,0.5) 100%);mix-blend-mode:soft-light;animation:wh-duotone 8s ease-in-out infinite;pointer-events:none;z-index:3;}\
@keyframes wh-duotone{0%,100%{opacity:0.10;}50%{opacity:0.26;}}\
.wh-scanlines{position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.16) 0px,rgba(0,0,0,0.16) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:3;}\
.wh-beam{position:absolute;left:0;right:0;top:0;height:36%;background:linear-gradient(180deg,transparent 0%,rgba(56,198,255,0.08) 50%,transparent 100%);animation:wh-scan 6s linear infinite;pointer-events:none;z-index:3;}\
@keyframes wh-scan{0%{transform:translateY(-110%);}100%{transform:translateY(260%);}}\
.wh-vig{position:absolute;inset:0;pointer-events:none;z-index:4;background:linear-gradient(180deg,rgba(5,5,12,0.55) 0%,rgba(5,5,12,0) 22%,rgba(5,5,12,0) 58%,rgba(5,5,12,0.92) 100%),linear-gradient(90deg,rgba(5,5,12,0.7) 0%,rgba(5,5,12,0) 32%,rgba(5,5,12,0) 70%,rgba(5,5,12,0.55) 100%);}\
.wh-corner{position:absolute;width:18px;height:18px;z-index:5;pointer-events:none;}\
.wh-cap{position:absolute;left:0;right:0;bottom:0;padding:0 0 46px;z-index:6;pointer-events:none;}\
.wh-cap-in{max-width:1280px;margin:0 auto;padding:0 64px;display:flex;flex-direction:column;gap:14px;align-items:flex-start;}\
.wh-fade{transition:opacity 380ms cubic-bezier(0.16,1,0.3,1),transform 380ms cubic-bezier(0.16,1,0.3,1);}\
.wh-chip{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#fff;background:rgba(5,5,12,0.55);backdrop-filter:blur(6px);border:1px solid rgba(56,198,255,0.55);border-radius:4px;padding:7px 13px;}\
.wh-chip-dot{width:6px;height:6px;border-radius:99px;}\
.wh-cta{pointer-events:auto;cursor:pointer;border:none;font-family:var(--font-heading,sans-serif);font-size:15px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#06060e;background:var(--magenta-500,#f5197f);padding:14px 26px;border-radius:6px;box-shadow:0 0 0 1px rgba(245,25,127,0.6),0 0 22px rgba(245,25,127,0.45);transition:filter 160ms,transform 160ms;}\
.wh-cta:hover{filter:brightness(1.08);}\
.wh-cta:active{transform:scale(0.97);}\
.wh-nav{position:absolute;top:50%;transform:translateY(-50%);width:46px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:99px;background:rgba(5,5,12,0.5);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.18);color:#fff;font-size:24px;line-height:1;z-index:7;cursor:pointer;transition:border-color 200ms,box-shadow 200ms,color 200ms;pointer-events:auto;}\
.wh-prev{left:18px;}.wh-next{right:18px;}\
.wh-prev:hover{border-color:#38c6ff;box-shadow:0 0 0 1px rgba(56,198,255,0.6),0 0 12px rgba(56,198,255,0.55);color:#7fe0ff;}\
.wh-next:hover{border-color:#ff4fa3;box-shadow:0 0 0 1px rgba(245,25,127,0.6),0 0 12px rgba(245,25,127,0.55);color:#ff86c2;}\
.wh-dots{position:absolute;right:64px;bottom:52px;display:flex;align-items:center;gap:9px;z-index:7;}\
.wh-dot{height:9px;width:9px;border-radius:99px;background:rgba(255,255,255,0.35);cursor:pointer;transition:width 320ms cubic-bezier(0.16,1,0.3,1),background 320ms,box-shadow 320ms;pointer-events:auto;}\
';

  function el(tag, cls, css) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (css) e.style.cssText = css;
    return e;
  }

  function corner(pos, color) {
    var c = el('span', 'wh-corner');
    var b = '2px solid ' + color;
    if (pos === 'tl') { c.style.cssText += 'top:18px;left:18px;border-top:' + b + ';border-left:' + b + ';'; }
    if (pos === 'tr') { c.style.cssText += 'top:18px;right:18px;border-top:' + b + ';border-right:' + b + ';'; }
    if (pos === 'bl') { c.style.cssText += 'bottom:18px;left:18px;border-bottom:' + b + ';border-left:' + b + ';'; }
    if (pos === 'br') { c.style.cssText += 'bottom:18px;right:18px;border-bottom:' + b + ';border-right:' + b + ';'; }
    return c;
  }

  class WaywardHero extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      this.i = 0;
      this.from = -1;
      this.style.display = 'block';
      this.style.width = '100%';

      if (!document.getElementById('wh-style')) {
        var st = document.createElement('style');
        st.id = 'wh-style';
        st.textContent = STYLE;
        document.head.appendChild(st);
      }

      var root = el('div', 'wh-root');

      // parallax layer + slides
      var px = el('div', 'wh-px');
      this.layers = SLIDES.map(function (s, idx) {
        var layer = el('div', 'wh-slide');
        var art = el('div', 'wh-art');
        art.style.backgroundImage = "url('" + s.img + "')";
        layer.appendChild(art);
        return layer;
      });
      this.layers.forEach(function (l) { px.appendChild(l); });
      root.appendChild(px);
      this.px = px;

      // overlays
      root.appendChild(el('div', 'wh-duotone'));
      root.appendChild(el('div', 'wh-scanlines'));
      root.appendChild(el('div', 'wh-beam'));
      root.appendChild(el('div', 'wh-vig'));
      root.appendChild(corner('tl', '#38c6ff'));
      root.appendChild(corner('tr', '#ff4fa3'));
      root.appendChild(corner('bl', '#ff4fa3'));
      root.appendChild(corner('br', '#38c6ff'));

      // caption
      var cap = el('div', 'wh-cap');
      var capIn = el('div', 'wh-cap-in wh-fade');
      var chip = el('span', 'wh-chip');
      var chipDot = el('span', 'wh-chip-dot');
      chip.appendChild(chipDot);
      var chipTxt = document.createTextNode('');
      chip.appendChild(chipTxt);
      var cta = el('button', 'wh-cta');
      capIn.appendChild(chip);
      capIn.appendChild(cta);
      cap.appendChild(capIn);
      root.appendChild(cap);
      this.capIn = capIn; this.chip = chip; this.chipDot = chipDot; this.chipTxt = chipTxt; this.cta = cta;

      // nav arrows
      var prev = el('div', 'wh-nav wh-prev'); prev.textContent = '‹';
      var next = el('div', 'wh-nav wh-next'); next.textContent = '›';
      root.appendChild(prev); root.appendChild(next);

      // dots
      var dots = el('div', 'wh-dots');
      this.dots = SLIDES.map(function () { var d = el('span', 'wh-dot'); dots.appendChild(d); return d; });
      root.appendChild(dots);

      this.appendChild(root);
      this.root = root;

      // interactions
      var self = this;
      prev.addEventListener('click', function (e) { e.stopPropagation(); self.go(self.i - 1, true); });
      next.addEventListener('click', function (e) { e.stopPropagation(); self.go(self.i + 1, true); });
      this.dots.forEach(function (d, idx) { d.addEventListener('click', function (e) { e.stopPropagation(); self.go(idx, true); }); });
      cta.addEventListener('click', function (e) { e.stopPropagation(); self.shop(); });
      root.addEventListener('click', function () { self.shop(); });

      // parallax
      this._onMove = function (e) {
        var r = root.getBoundingClientRect();
        var dx = ((e.clientX - r.left) / r.width - 0.5) * -20;
        var dy = ((e.clientY - r.top) / r.height - 0.5) * -14;
        if (self._raf) return;
        self._raf = requestAnimationFrame(function () {
          self._raf = null;
          px.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
        });
      };
      this._onLeave = function () { px.style.transform = 'translate3d(0,0,0)'; };
      root.addEventListener('mousemove', this._onMove);
      root.addEventListener('mouseleave', this._onLeave);

      // pause auto-advance on hover
      root.addEventListener('mouseenter', function () { self._paused = true; });
      root.addEventListener('mouseleave', function () { self._paused = false; });

      this.render();
      this._timer = setInterval(function () { if (!self._paused) self.go(self.i + 1, false); }, 6000);
    }

    disconnectedCallback() {
      clearInterval(this._timer);
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._tw) cancelAnimationFrame(this._tw);
    }

    startTween() {
      var self = this, from = this.from, to = this.i, dur = 900, t0 = performance.now();
      cancelAnimationFrame(this._tw);
      if (from === -1 || from === to) {
        this.layers.forEach(function (l, idx) { l.style.opacity = idx === to ? '1' : '0'; l.style.zIndex = idx === to ? '2' : '0'; });
        return;
      }
      function frame(now) {
        var p = Math.min(1, (now - t0) / dur);
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        self.layers.forEach(function (l, idx) {
          if (idx === to) { l.style.opacity = String(e); l.style.zIndex = '2'; }
          else if (idx === from) { l.style.opacity = String(1 - e); l.style.zIndex = '1'; }
          else { l.style.opacity = '0'; l.style.zIndex = '0'; }
        });
        if (p < 1) self._tw = requestAnimationFrame(frame);
      }
      self._tw = requestAnimationFrame(frame);
    }

    go(n) {
      var len = SLIDES.length;
      var ni = ((n % len) + len) % len;
      if (ni === this.i) return;
      this.from = this.i;
      this.i = ni;
      this.render();
    }

    render() {
      var i = this.i, s = SLIDES[i], self = this;
      this.startTween();
      this.capIn.style.opacity = '0';
      this.capIn.style.transform = 'translateY(8px)';
      clearTimeout(this._capT);
      this._capT = setTimeout(function () {
        self.chipTxt.nodeValue = s.game + ' · ' + s.label;
        self.chipDot.style.background = s.accent;
        self.chipDot.style.boxShadow = '0 0 8px ' + s.accent;
        self.chip.style.borderColor = s.accent === '#ff4fa3' ? 'rgba(245,25,127,0.55)' : 'rgba(56,198,255,0.55)';
        self.cta.textContent = s.cta;
        self.capIn.style.opacity = '1';
        self.capIn.style.transform = 'translateY(0)';
      }, 220);
      this.dots.forEach(function (d, idx) {
        var on = idx === i;
        d.style.width = on ? '26px' : '9px';
        d.style.background = on ? SLIDES[idx].accent : 'rgba(255,255,255,0.35)';
        d.style.boxShadow = on ? '0 0 10px ' + SLIDES[idx].accent : 'none';
      });
    }

    shop() {
      var t = SLIDES[this.i].target;
      var node = document.getElementById(t);
      if (node) window.scrollTo({ top: node.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }
  }

  customElements.define('wayward-hero', WaywardHero);
})();
