/* ============================================================
   SPACE CAT MASCOT — behavior (single animated-WebP version)
   Self-contained: reads/writes only #spaceCat and its children.

   Architecture:
   - One <img id="spaceCatFrame" src="assets/1.webp">. The walking
     motion itself is baked into the WebP as a native looping
     animation — the browser decodes and plays it automatically,
     so there is no manual frame-swapping/preloading logic here.
   - JS is only responsible for: moving the cat across the screen,
     flipping it at each edge, and pointer-based dragging.
   - Position is driven by a single requestAnimationFrame loop
     using `transform: translate3d(x, y, 0)` on the container —
     GPU accelerated, no layout thrashing. left/top are set to 0
     once at init and never touched again.
   - Dragging (pointerdown/move/up) takes over the same transform
     property directly; the walk loop simply skips updates while
     `dragging` is true, then resumes from wherever it was dropped.
   ============================================================ */
(function(){
  const cat = document.getElementById('spaceCat');
  const frameImg = document.getElementById('spaceCatFrame');
  if(!cat || !frameImg) return;

  const catVisual = cat.querySelector('.cat-visual');
  const speechBubble = document.getElementById('spaceCatSpeech');

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = reducedMotionQuery.matches;
  reducedMotionQuery.addEventListener?.('change', (e) => { reducedMotion = e.matches; });

  /* ============ Positioning state (all via translate3d) ============ */
  const MARGIN = 6;
  const SPEED = 46; // px per second
  const TURN_PAUSE_MS = 220; // brief pause/"decelerate" moment at each edge

  function catWidth(){ return cat.offsetWidth || 92; }
  function catHeight(){ return cat.offsetHeight || 70; }

  let x = 40;
  let y = Math.max(MARGIN, window.innerHeight - catHeight() - 26);
  let dir = 1; // 1 = walking right, -1 = walking left
  let dragging = false;
  let turnPauseUntil = 0;
  let lastTime = null;
  let dustAccumulator = 0;
  const DUST_INTERVAL = 300; // ms between paw prints while walking

  function applyTransform(){
    cat.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  applyTransform();

  function setFacing(direction){
    cat.classList.toggle('facing-left', direction === -1);
  }
  setFacing(dir);

  function maxX(){ return window.innerWidth - catWidth() - MARGIN; }
  function maxY(){ return window.innerHeight - catHeight() - MARGIN; }
  function clamp(val, min, max){ return Math.min(Math.max(val, min), max); }

  /* ============ Paw prints / moon dust ============ */
  function spawnPawPrint(){
    const rect = cat.getBoundingClientRect();
    const footX = rect.left + (dir === 1 ? rect.width * 0.28 : rect.width * 0.72);
    const footY = rect.bottom - 8;
    const dot = document.createElement('div');
    dot.className = 'paw-print';
    dot.style.left = footX + 'px';
    dot.style.top = footY + 'px';
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 1400);
  }

  /* ============ Main loop: horizontal movement + edge flip ============ */
  function tick(timestamp){
    if(lastTime === null) lastTime = timestamp;
    const dt = timestamp - lastTime; // ms
    lastTime = timestamp;

    if(!dragging && !reducedMotion){
      const paused = timestamp < turnPauseUntil;

      if(!paused){
        x += SPEED * dir * (dt / 1000);
        const upper = maxX();
        if(x >= upper){
          x = upper;
          dir = -1; setFacing(dir);              // flip at right edge
          turnPauseUntil = timestamp + TURN_PAUSE_MS;
        } else if(x <= MARGIN){
          x = MARGIN;
          dir = 1; setFacing(dir);                // flip at left edge
          turnPauseUntil = timestamp + TURN_PAUSE_MS;
        }
        applyTransform();

        dustAccumulator += dt;
        if(dustAccumulator >= DUST_INTERVAL){
          dustAccumulator = 0;
          spawnPawPrint();
        }
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Keep the cat inside the viewport if the window is resized/rotated.
  window.addEventListener('resize', () => {
    x = clamp(x, MARGIN, Math.max(MARGIN, maxX()));
    y = clamp(y, MARGIN, Math.max(MARGIN, maxY()));
    applyTransform();
  });

  /* ============ Dragging (pointerdown / pointermove / pointerup) ============ */
  let pointerId = null;
  let dragOffsetX = 0, dragOffsetY = 0;
  let downX = 0, downY = 0;
  let moved = false;
  const CLICK_THRESHOLD = 6; // px of movement allowed before it counts as a drag, not a click

  cat.addEventListener('pointerdown', (e) => {
    pointerId = e.pointerId;
    cat.setPointerCapture(pointerId);
    const rect = cat.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    downX = e.clientX; downY = e.clientY;
    moved = false;
    dragging = true;
    cat.classList.add('dragging');
    if(catVisual){
      catVisual.style.transition = 'transform .15s ease';
      catVisual.style.transform = `scaleX(${dir === -1 ? -1 : 1}) scale(1.12)`;
    }
  });

  cat.addEventListener('pointermove', (e) => {
    if(!dragging || e.pointerId !== pointerId) return;
    if(Math.abs(e.clientX - downX) > CLICK_THRESHOLD || Math.abs(e.clientY - downY) > CLICK_THRESHOLD){
      moved = true;
    }

    x = clamp(e.clientX - dragOffsetX, 0, Math.max(0, window.innerWidth - catWidth()));
    y = clamp(e.clientY - dragOffsetY, 0, Math.max(0, window.innerHeight - catHeight()));
    applyTransform();
  });

  function endDrag(e){
    if(!dragging || (e && e.pointerId !== pointerId)) return;
    dragging = false;
    cat.classList.remove('dragging');
    if(catVisual){ catVisual.style.transform = ''; }
    // Resume walking cleanly from wherever it was dropped, current direction preserved.
    lastTime = null;
    turnPauseUntil = 0;

    if(!moved){
      handleClick();
    }
    pointerId = null;
  }

  cat.addEventListener('pointerup', endDrag);
  cat.addEventListener('pointercancel', endDrag);

  /* ============ Click => "Meow! 🚀" ============ */
  let speechTimeout = null;
  function handleClick(){
    if(!speechBubble) return;
    speechBubble.classList.add('show');
    clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => speechBubble.classList.remove('show'), 1500);
  }

  /* ============ Double-click => jump + sparkles ============ */
  cat.addEventListener('dblclick', () => {
    if(catVisual){
      catVisual.style.transition = 'transform .22s ease';
      const jumpUp = () => { catVisual.style.transform = `scaleX(${dir === -1 ? -1 : 1}) translateY(-24px)`; };
      const jumpDown = () => {
        catVisual.style.transform = `scaleX(${dir === -1 ? -1 : 1}) translateY(0)`;
        setTimeout(() => { catVisual.style.transform = ''; }, 240);
      };
      jumpUp();
      setTimeout(jumpDown, 260);
    }
    spawnSparkles();
  });

  function spawnSparkles(){
    const rect = cat.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = reducedMotion ? 3 : 7;
    for(let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count;
      const dist = 22 + Math.random() * 14;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 12;
      const s = document.createElement('div');
      s.className = 'cat-sparkle';
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      s.style.setProperty('--sparkle-end', `translate(${dx}px, ${dy}px)`);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }
})();
