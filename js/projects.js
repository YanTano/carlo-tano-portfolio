/* ============ DATA ============ */
const skills = [
  { name:'HTML', icon:'fa-brands fa-html5', level:90 },
  { name:'CSS', icon:'fa-brands fa-css3-alt', level:88 },
  { name:'JavaScript', icon:'fa-brands fa-js', level:80 },
  { name:'Python', icon:'fa-brands fa-python', level:80 },
  { name:'SQL', icon:'fa-solid fa-database', level:82 },
  { name:'Git', icon:'fa-brands fa-git-alt', level:85 },
  { name:'GitHub', icon:'fa-brands fa-github', level:88 },
  { name:'Jira', icon:'fa-brands fa-jira', level:90 },
  { name:'Playwright', icon:'fa-solid fa-robot', level:80 },
  { name:'Manual Testing', icon:'fa-solid fa-magnifying-glass', level:96 },
  { name:'Automation Testing', icon:'fa-solid fa-gears', level:80 },
  { name:'API Testing', icon:'fa-solid fa-plug', level:80 },
  { name:'Regression Testing', icon:'fa-solid fa-rotate', level:92 },
  { name:'Exploratory Testing', icon:'fa-solid fa-compass', level:93 },
  { name:'Responsive Design', icon:'fa-solid fa-mobile-screen', level:80 },
];

const projects = [
  { title:'Mathicsolve AI', desc:'AI-powered math scanner and solver that uses your camera to recognize mathematical problems and provide solutions with step-by-step explanations.', tags: ['AI', 'Math Scanner', 'OCR', 'Gemini AI', 'Computer Vision', 'React', 'TypeScript', 'Vite'], live: 'https://yantano.github.io/mathicsolve-ai/',
    github: 'https://github.com/YanTano/mathicsolve-ai', image: 'assets/images/projects/mathicsolve-ai.jpg'},
  { title:'Cat Run', desc:'A endless runner game where players dodge obstacles, collect fish, and compete for the highest score.', tags: ['HTML', 'CSS', 'JavaScript', 'Canvas API', 'Local Storage'], live: 'https://yantano.github.io/cat-run/',
    github: 'https://github.com/YanTano/cat-run', image: 'assets/images/projects/cat-run.jpg'},
  { title:'Chickein', desc:'A premium Chicken Inasal restaurant website showcasing cinematic visuals, immersive animations, smooth GSAP interactions, and a modern user experience designed to drive customer engagement.', tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Gemini AI', 'OCR', 'AI Mock Interview'], live: 'https://yantano.github.io/chickein/',
    github: 'https://github.com/YanTano/chickein', image: 'assets/images/projects/chickein.jpg'},
  { title:'Neural-Vision', desc:'Neural Vision is an AI-powered platform featuring image analysis, visual reasoning, OCR, and an adaptive AI Mock Interview coach that provides realistic interview practice, instant feedback, and personalized coaching to help users build confidence and land their next opportunity.', tags:['Python','Playwright','CI/CD'], live: 'https://yantano.github.io/neural-vision/',
    github: 'https://github.com/YanTano/neural-vision', image: 'assets/images/projects/neural-vision.jpg'},
    /*
  { title:'E-Commerce Testing', desc:'Full regression and exploratory test cycles across checkout, payments, and inventory flows.', tags:['Manual QA','Jira','API'], live: 'https://yantano.github.io/e-commerce-testing/',
    github: 'https://github.com/YanTano/e-commerce-testing', image: 'assets/images/projects/e-commerce-testing.jpg'},
  { title:'Zombie Survival Game', desc:'A browser-based survival game built for fun, then rigorously stress- and bug-tested.', tags:['JavaScript','Canvas','QA'], live: 'https://yantano.github.io/zombie-survival-game/',
    github: 'https://github.com/YanTano/zombie-survival-game', image: 'assets/images/projects/zombie-survival-game.jpg'},
    */
];

const experience = [
  { date:'2023 — 2026', role:'Software QA Engineer', company:'Forty Degrees Celcius Inc.', points:[
      'Executed comprehensive manual testing for web and mobile applications, ensuring high product quality before releases.',
      'Designed and maintained detailed test cases, test scenarios, and regression test suites for new features and bug fixes.',
      'Identified, documented, and tracked software defects using Jira while collaborating closely with developers and product teams.',
      'Performed functional, regression, UI, cross-browser, and exploratory testing across multiple projects.',
      'Verified payment workflows, coupon systems, admin tools, and user-facing features to ensure compliance with business requirements.',
      'Participated in Agile sprint planning, daily stand-ups, sprint reviews, and release validation activities.']
  },
  { date:'2022 — 2023', role:'Technical Support / System Administrator', company:'Alliance Software Inc.', points:[
      'Performed end-to-end manual testing for web and mobile applications with nearly 3 years of QA experience.',
      'Created and executed hundreds of detailed test cases, test plans, and regression test scenarios.',
      'Reported and tracked defects in Jira, working closely with developers to verify fixes and improve software quality.',
      'Conducted functional, regression, UI, exploratory, and cross-browser testing across multiple releases.',
      'Validated payment features, booking systems, coupons, admin portals, and user account management functionalities.',
      'Collaborated with cross-functional Agile teams to deliver stable, high-quality software on schedule.']
  }
];

const services = [
  { icon:'fa-solid fa-magnifying-glass', title:'Manual QA', desc:'Thorough functional and exploratory testing to catch what automation misses.' },
  { icon:'fa-solid fa-robot', title:'Automation Testing', desc:'Reliable, maintainable test suites built with Playwright and Python.' },
  { icon:'fa-solid fa-code', title:'Website Development', desc:'Clean, responsive front-end builds with quality baked in from the start.' },
  { icon:'fa-solid fa-bug', title:'Bug Reporting', desc:'Clear, reproducible bug reports that get fixed fast, not argued about.' },
  { icon:'fa-solid fa-object-ungroup', title:'UI Testing', desc:'Pixel-level and cross-device UI verification for a consistent experience.' },
  { icon:'fa-solid fa-gauge-high', title:'Performance Testing', desc:'Load and stress testing to make sure your app holds up under pressure.' },
];

const testimonials = [
  { name:'Mary Joy Lopez', role:'QA, FDCI', text:'Carlo consistently demonstrates professionalism, attention to detail, and a strong commitment to quality. He collaborates effectively with the team and always strives to deliver reliable, high-quality results.' },
   /*
   { name:'Innabel Sildora', role:'QA Lead, FDCI', text:'Carlo catches issues before they ever reach our users. His test reports are the clearest I\'ve worked with.' },
  { name:'Lester Padul', role:'QA, FDCI', text:'Meticulous, communicative, and genuinely curious about how things break. Exactly who you want testing your product.' },
   */
];

/* ============ SKILLS GRID RENDER ============ */
const skillsGrid = document.getElementById('skillsGrid');
skills.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'tilt-card glass glow-border rounded-2xl p-6 group';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', String((i % 4) * 100));
  card.innerHTML = `
    <i class="${s.icon} text-3xl text-cyan-400 mb-4 group-hover:text-purple-400 transition-colors"></i>
    <h3 class="font-semibold mb-3">${s.name}</h3>
    <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div class="skill-bar-fill h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500" data-level="${s.level}"></div>
    </div>
    <span class="text-xs text-gray-500 mt-2 inline-block">${s.level}%</span>
  `;
  skillsGrid.appendChild(card);

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-py*10}deg) rotateY(${px*10}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ============ PROJECTS RENDER ============ */
const projectsGrid = document.getElementById('projectsGrid');
projects.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'tilt-card glass glow-border rounded-2xl overflow-hidden group';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', String((i % 3) * 100));
  card.innerHTML = `
    <div class="h-48 bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-purple-600/30 flex items-center justify-center relative overflow-hidden">
      <img src="${p.image}" alt="${p.title} screenshot" loading="lazy"
           class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
           onerror="this.remove();" />
      <i class="fa-solid fa-layer-group text-5xl text-white/30 group-hover:scale-110 transition-transform duration-500 relative z-0"></i>
    </div>
    <div class="p-6">
      <h3 class="font-display font-semibold text-lg mb-2">${p.title}</h3>
      <p class="text-gray-400 text-sm leading-relaxed mb-4">${p.desc}</p>
      <div class="flex flex-wrap gap-2 mb-5">
        ${p.tags.map(t => `<span class="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300">${t}</span>`).join('')}
      </div>
      <div class="flex gap-4 text-sm font-medium">
        <a href="${p.live}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
        <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-gray-300 hover:text-white"><i class="fa-brands fa-github"></i> GitHub</a>
      </div>
    </div>
  `;
  projectsGrid.appendChild(card);

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-py*6}deg) rotateY(${px*6}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ============ EXPERIENCE TIMELINE RENDER ============ */
const timelineItems = document.getElementById('timelineItems');
experience.forEach((job, i) => {
  const side = i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse';
  const item = document.createElement('div');
  item.className = `relative flex ${side} items-start gap-8 pl-12 md:pl-0`;
  item.setAttribute('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
  item.innerHTML = `
    <div class="absolute left-4 md:left-1/2 top-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 md:-translate-x-1/2 ring-4 ring-void"></div>
    <div class="md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}">
      <span class="text-xs text-cyan-400 font-semibold tracking-wide">${job.date}</span>

      <div class="glass glow-border rounded-2xl p-6 mt-3 text-left">
        <h3 class="font-display font-semibold text-lg">${job.role}</h3>
        <p class="text-purple-400 text-sm mb-3">${job.company}</p>
        <ul class="text-gray-400 text-sm space-y-1 ${i % 2 === 0 ? 'md:text-left' : ''}">
          ${job.points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="hidden md:block md:w-1/2"></div>
  `;
  timelineItems.appendChild(item);
});

/* ============ SERVICES RENDER ============ */
const servicesGrid = document.getElementById('servicesGrid');
services.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'tilt-card glass glow-border rounded-2xl p-8';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', String((i % 3) * 100));
  card.innerHTML = `
    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-5">
      <i class="${s.icon} text-2xl text-cyan-400"></i>
    </div>
    <h3 class="font-display font-semibold text-lg mb-2">${s.title}</h3>
    <p class="text-gray-400 text-sm leading-relaxed">${s.desc}</p>
  `;
  servicesGrid.appendChild(card);
});

/* ============ TESTIMONIALS CAROUSEL ============ */
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialDots = document.getElementById('testimonialDots');
let currentTestimonial = 0;

function renderTestimonial(idx){
  const t = testimonials[idx];
  testimonialTrack.style.opacity = 0;
  setTimeout(() => {
    testimonialTrack.innerHTML = `
      <i class="fa-solid fa-quote-left text-3xl text-cyan-400/50 mb-6"></i>
      <p class="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">"${t.text}"</p>
      <div class="flex flex-col items-center gap-2">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-display font-bold text-lg">
          ${t.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <h4 class="font-semibold">${t.name}</h4>
        <span class="text-sm text-gray-500">${t.role}</span>
      </div>
    `;
    testimonialTrack.style.opacity = 1;
  }, 250);

  [...testimonialDots.children].forEach((d, i) => {
    d.classList.toggle('bg-cyan-400', i === idx);
    d.classList.toggle('bg-white/15', i !== idx);
  });
}

testimonials.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'w-2.5 h-2.5 rounded-full bg-white/15 transition-colors';
  dot.addEventListener('click', () => { currentTestimonial = i; renderTestimonial(i); });
  testimonialDots.appendChild(dot);
});
renderTestimonial(0);
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  renderTestimonial(currentTestimonial);
}, 5000);
