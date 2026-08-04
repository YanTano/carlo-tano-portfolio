/* ============ LENIS SMOOTH SCROLL ============ */
let lenis;
try{
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}catch(e){ console.warn('Lenis unavailable', e); }

/* ============ AOS INIT ============ */
AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

/* ============ MOUSE PARALLAX ON PORTRAIT ============ */
const portraitCard = document.getElementById('portraitCard');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  if(portraitCard) portraitCard.style.transform = `rotateY(${x*0.4}deg) rotateX(${-y*0.4}deg)`;
});

/* ============ BUTTON RIPPLE ============ */
document.querySelectorAll('.ripple-btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ============ STATS COUNT-UP + SKILL BARS (IntersectionObserver) ============ */
window.addEventListener('DOMContentLoaded', () => {
  const countEls = document.querySelectorAll('[data-count]');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target;
      if(el.hasAttribute('data-count') && !el.dataset.done){
        el.dataset.done = '1';
        const target = parseInt(el.getAttribute('data-count'), 10);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          cur += step;
          if(cur >= target){ el.textContent = target + (target===100?'':'+'); return; }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
      }
      if(el.classList.contains('skill-bar-fill') && !el.dataset.done){
        el.dataset.done = '1';
        el.style.width = el.getAttribute('data-level') + '%';
      }
    });
  }, { threshold: 0.4 });

  countEls.forEach(el => io.observe(el));
  skillBars.forEach(el => io.observe(el));
});
