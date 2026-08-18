/* ============ CONTACT FORM (EmailJS) ============ */
emailjs.init("G9ad5pirgo32YHPSw");

const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const button = form.querySelector("button");

    button.disabled = true;
    button.innerHTML = "Sending...";

    emailjs.send(
        "service_i62tdgi",      // Your Service ID
        "template_ydr83mf",     // <-- Replace this
        {
            from_name: document.getElementById("nameInput").value,
            reply_to: document.getElementById("emailInput").value,
            subject: document.getElementById("subjectInput").value,
            message: document.getElementById("messageInput").value
        }
    )

    .then(function(){

        note.innerHTML = "✅ Message sent successfully!";
        note.className = "text-center text-green-400";

        form.reset();

    })

    .catch(function(error){

        console.error(error);

        note.innerHTML = "❌ Failed to send message.";
        note.className = "text-center text-red-400";

    })

    .finally(function(){

        button.disabled = false;
        button.innerHTML = "Send Message";

    });

});

/* ============ CARLO AI — Chat Engine ============ */
(function(){
  /* ------------------------------------------------------------
     Carlo AI runs fully client-side on a local knowledge base
     built from this site's own data (skills / projects / experience
     / contact). No API key is embedded here on purpose — shipping a
     real OpenAI/Gemini/Claude key in front-end JS would expose it to
     anyone who views source. To go fully "live", point sendToBackend()
     below at your own serverless endpoint that holds the key server-side.
     ------------------------------------------------------------ */

  const CONTACT = {
    email: 'tano.carlom@gmail.com',
    github: 'https://github.com/YanTano',
    linkedin: 'https://www.linkedin.com/in/carlo-tano-7375bb1bb/',
    facebook: 'https://www.facebook.com/carlo.tano.9/',
    resume: 'documents/Carlo_Tano_Software_QA_Engineer_Resume.pdf',
    location: 'Philippines · Open to Remote',
  };

  // Reuses the same data already defined in projects.js
  const kbSkills = (typeof skills !== 'undefined') ? skills : [];
  const kbProjects = (typeof projects !== 'undefined') ? projects : [];
  const kbExperience = (typeof experience !== 'undefined') ? experience : [];
  const kbServices = (typeof services !== 'undefined') ? services : [];

  /* ============ DOM refs ============ */
  const widget = document.getElementById('aiWidget');
  const toggleBtn = document.getElementById('aiToggleBtn');
  const chatWindow = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('aiCloseBtn');
  const clearBtn = document.getElementById('aiClearBtn');
  const themeBtn = document.getElementById('aiThemeBtn');
  const voiceOutBtn = document.getElementById('aiVoiceOutBtn');
  const messagesEl = document.getElementById('aiMessages');
  const suggestedEl = document.getElementById('aiSuggested');
  const aiForm = document.getElementById('aiForm');
  const input = document.getElementById('aiInput');
  const sendBtn = document.getElementById('aiSendBtn');
  const micBtn = document.getElementById('aiMicBtn');
  const orb = document.getElementById('aiOrb');
  const badge = document.getElementById('aiBadge');

  let voiceOutEnabled = false;
  let history = [];

  /* ============ Persistence ============ */
  function saveHistory(){
    try{ localStorage.setItem('carloAiHistory', JSON.stringify(history)); }catch(e){}
  }
  function loadHistory(){
    try{ return JSON.parse(localStorage.getItem('carloAiHistory') || '[]'); }catch(e){ return []; }
  }

  /* ============ Markdown-lite renderer (escapes HTML first) ============ */
  function escapeHtml(str){
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function renderMarkdown(raw){
    let text = escapeHtml(raw);

    // fenced code blocks ```lang\ncode```
    text = text.replace(/```([a-zA-Z]*)\n?([\s\S]*?)```/g, (m, lang, code) => {
      const id = 'code_' + Math.random().toString(36).slice(2, 9);
      return `<div class="ai-code-block"><button class="ai-code-copy" data-copy-target="${id}"><i class="fa-regular fa-copy"></i> Copy</button><pre id="${id}">${code.trim()}</pre></div>`;
    });
    // inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // bullet lists
    text = text.replace(/(^|\n)- (.+)/g, '$1\u0001LI\u0001$2');
    if(text.includes('\u0001LI\u0001')){
      const lines = text.split('\n');
      let out = []; let inList = false;
      lines.forEach(line => {
        if(line.startsWith('\u0001LI\u0001')){
          if(!inList){ out.push('<ul>'); inList = true; }
          out.push('<li>' + line.replace('\u0001LI\u0001','') + '</li>');
        } else {
          if(inList){ out.push('</ul>'); inList = false; }
          out.push(line);
        }
      });
      if(inList) out.push('</ul>');
      text = out.join('\n');
    }
    // paragraphs
    text = text.split(/\n{2,}/).map(p => p.startsWith('<ul>') ? p : `<p>${p.replace(/\n/g,'<br>')}</p>`).join('');
    return text;
  }

  /* ============ Rendering messages ============ */
  function scrollToBottom(){ messagesEl.scrollTop = messagesEl.scrollHeight; }

  function appendMessage(role, html, extraNode){
    const wrap = document.createElement('div');
    wrap.className = `ai-msg ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar-sm';
    avatar.innerHTML = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    const bubbleWrap = document.createElement('div');

    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    bubble.innerHTML = html;
    bubbleWrap.appendChild(bubble);

    if(extraNode) bubbleWrap.appendChild(extraNode);

    if(role === 'bot'){
      const tools = document.createElement('div');
      tools.className = 'ai-msg-tools';
      tools.innerHTML = `<button class="ai-copy-msg" title="Copy"><i class="fa-regular fa-copy"></i> Copy</button>
                          <button class="ai-regen-msg" title="Regenerate"><i class="fa-solid fa-rotate"></i> Regenerate</button>`;
      bubbleWrap.appendChild(tools);
      tools.querySelector('.ai-copy-msg').addEventListener('click', () => {
        navigator.clipboard?.writeText(bubble.innerText);
      });
      tools.querySelector('.ai-regen-msg').addEventListener('click', () => {
        const lastUser = [...history].reverse().find(m => m.role === 'user');
        if(lastUser) handleUserMessage(lastUser.content, true);
      });
    }

    wrap.appendChild(avatar);
    wrap.appendChild(bubbleWrap);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return bubble;
  }

  function showTyping(){
    const wrap = document.createElement('div');
    wrap.className = 'ai-msg bot';
    wrap.id = 'aiTypingIndicator';
    wrap.innerHTML = `<div class="ai-avatar-sm"><i class="fa-solid fa-robot"></i></div>
      <div class="ai-bubble ai-typing"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(wrap);
    scrollToBottom();
    orb.classList.add('thinking');
  }
  function hideTyping(){
    document.getElementById('aiTypingIndicator')?.remove();
    orb.classList.remove('thinking');
  }

  function streamText(el, fullHtml, plainForVoice){
    // reveal the rendered HTML progressively by animating opacity of chunks
    el.innerHTML = fullHtml;
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity .25s ease';
      el.style.opacity = '1';
    });
    if(voiceOutEnabled && 'speechSynthesis' in window && plainForVoice){
      const utter = new SpeechSynthesisUtterance(plainForVoice);
      utter.rate = 1.02;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    }
  }

  function attachCodeCopyHandlers(scope){
    scope.querySelectorAll('.ai-code-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-copy-target'));
        if(target){
          navigator.clipboard?.writeText(target.innerText);
          const old = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
          setTimeout(() => btn.innerHTML = old, 1400);
        }
      });
    });
  }

  /* ============ Rich reply builders ============ */
  function actionRow(buttons){
    const row = document.createElement('div');
    row.className = 'ai-action-row';
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-action-btn';
      btn.innerHTML = `<i class="${b.icon}"></i> ${b.label}`;
      btn.addEventListener('click', b.onClick);
      row.appendChild(btn);
    });
    return row;
  }

  function projectCardsNode(){
    const wrap = document.createElement('div');
    kbProjects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'ai-proj-card';
      card.innerHTML = `
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <div class="ai-proj-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="ai-action-row" style="margin-top:0;">
          <a href="${p.live}" target="_blank" rel="noopener noreferrer" class="ai-action-btn" style="text-decoration:none;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
          <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="ai-action-btn" style="text-decoration:none;"><i class="fa-brands fa-github"></i> GitHub</a>
        </div>`;
      wrap.appendChild(card);
    });
    return wrap;
  }

  function resumeNode(){
    return actionRow([
      { icon:'fa-solid fa-download', label:'Download Resume', onClick:() => { window.open(CONTACT.resume, '_blank'); } }
    ]);
  }
  function githubNode(){
    return actionRow([{ icon:'fa-brands fa-github', label:'Open GitHub', onClick:() => window.open(CONTACT.github,'_blank') }]);
  }
  function linkedinNode(){
    return actionRow([{ icon:'fa-brands fa-linkedin', label:'Open LinkedIn', onClick:() => window.open(CONTACT.linkedin,'_blank') }]);
  }
  function emailNode(){
    return actionRow([
      { icon:'fa-solid fa-envelope', label: CONTACT.email, onClick:() => window.open('mailto:'+CONTACT.email) },
      { icon:'fa-regular fa-copy', label:'Copy Email', onClick:(e) => {
          navigator.clipboard?.writeText(CONTACT.email);
          const btn = e.currentTarget; const old = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => btn.innerHTML = old, 1400);
        } },
    ]);
  }
  function recruiterNode(){
    return actionRow([
      { icon:'fa-solid fa-download', label:'Download Resume', onClick:() => window.open(CONTACT.resume,'_blank') },
      { icon:'fa-solid fa-envelope', label:'Contact Carlo', onClick:() => window.open('mailto:'+CONTACT.email) },
    ]);
  }

  /* ============ Page navigation (voice + text) ============ */
  // Sections the assistant is allowed to jump to, with the phrases that
  // should trigger a jump. Works identically whether the request came in
  // by typing or by voice (both funnel through handleUserMessage below).
  const SECTIONS = [
    { id:'home',         selector:'#home',         label:'Home',         keywords:['home','main page','top of the page','start of the page','beginning'] },
    { id:'about',        selector:'#about',        label:'About',        keywords:['about','about me','about carlo','who is carlo','bio'] },
    { id:'skills',       selector:'#skills',       label:'Skills',       keywords:['skill','skills','tech stack','technologies'] },
    { id:'projects',     selector:'#projects',     label:'Projects',     keywords:['project','projects','portfolio section','work samples','featured work'] },
    { id:'experience',   selector:'#experience',   label:'Experience',   keywords:['experience','work history','career','timeline','job history'] },
    { id:'services',     selector:'#services',     label:'Services',     keywords:['service','services','what he offers','offerings'] },
    { id:'testimonials', selector:'#testimonials', label:'Testimonials', keywords:['testimonial','testimonials','review','reviews','feedback'] },
    { id:'contact',      selector:'#contact',      label:'Contact',      keywords:['contact form','contact section','get in touch','message him','reach out'] },
  ];

  const NAV_VERBS = [
    'go to','take me to','bring me to','navigate to','scroll to','scroll down to',
    'jump to','redirect me to','show me the','open the','can you show me the',
    'take me there','head to','move to',
  ];

  function detectNavigation(q){
    const hasNavVerb = NAV_VERBS.some(v => q.includes(v)) || /^(go|navigate|scroll|jump|open|show)\b/.test(q.trim());
    if(!hasNavVerb) return null;
    for(const sec of SECTIONS){
      if(sec.keywords.some(k => q.includes(k)) || q.includes(sec.id)){
        return sec;
      }
    }
    return null;
  }

  function scrollToSection(selector){
    const el = document.querySelector(selector);
    if(!el) return false;
    if(typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function'){
      lenis.scrollTo(el, { offset: -20 });
    } else {
      el.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    return true;
  }

  /* ============ Knowledge base response engine ============ */
  function topSkills(n){ return [...kbSkills].sort((a,b)=>b.level-a.level).slice(0,n).map(s=>s.name); }

  function getResponse(rawQuery){
    const q = rawQuery.toLowerCase();

    const has = (...words) => words.some(w => q.includes(w));

    // --- Navigate the page (voice or text) ---
    const navTarget = detectNavigation(q);
    if(navTarget){
      const moved = scrollToSection(navTarget.selector);
      return moved
        ? { text: `Sure — taking you to the **${navTarget.label}** section now. 🚀`, icon:'fa-solid fa-location-arrow' }
        : { text: `I couldn't find the **${navTarget.label}** section on this page.`, icon:'fa-solid fa-triangle-exclamation' };
    }

    // --- Special commands ---
    if(has('resume', 'cv')) return { text: `Here's Carlo's resume — up to date with his QA and automation background.`, node: resumeNode(), icon:'fa-solid fa-download' };
    if(has('github')) return { text: `Here's Carlo's GitHub profile.`, node: githubNode(), icon:'fa-brands fa-github' };
    if(has('linkedin')) return { text: `Here's Carlo's LinkedIn profile.`, node: linkedinNode(), icon:'fa-brands fa-linkedin' };
    if(has('email', 'e-mail')) return { text: `You can reach Carlo directly at **${CONTACT.email}**.`, node: emailNode(), icon:'fa-solid fa-envelope' };
    if(has('contact', 'reach him', 'get in touch', 'hire')) return {
      text: `Best ways to reach Carlo:\n- Email: **${CONTACT.email}**\n- LinkedIn or GitHub (buttons below)\n- Or use the contact form on this page`,
      node: actionRow([
        { icon:'fa-solid fa-envelope', label:'Email', onClick:() => window.open('mailto:'+CONTACT.email) },
        { icon:'fa-brands fa-linkedin', label:'LinkedIn', onClick:() => window.open(CONTACT.linkedin,'_blank') },
        { icon:'fa-brands fa-github', label:'GitHub', onClick:() => window.open(CONTACT.github,'_blank') },
      ]),
      icon:'fa-solid fa-address-card'
    };
    if(has('project')) return { text: `Here are a few things Carlo has built and tested:`, node: projectCardsNode(), icon:'fa-solid fa-diagram-project' };

    // --- Recruiter quick summary ---
    if(has('recruiter', 'summary', 'overview', 'quick look', 'tell me about carlo', 'who is carlo', 'about carlo')) return {
      text: `**Carlo Tano** — Software QA Engineer & Computer Engineer\n\n` +
        `- **Experience:** ~3 years across manual and automation QA\n` +
        `- **Core strengths:** ${topSkills(4).join(', ')}\n` +
        `- **QA expertise:** functional, regression, exploratory, UI, and cross-browser testing\n` +
        `- **Automation:** Playwright + Python frameworks integrated with CI/CD\n` +
        `- **Currently:** Software QA Engineer at Forty Degrees Celcius Inc.\n\n` +
        `Want his resume or a way to reach him directly?`,
      node: recruiterNode(),
      icon:'fa-solid fa-id-badge'
    };

    // --- QA / testing ---
    if(has('qa experience', 'quality assurance', 'manual test', 'test experience', 'testing experience')) return {
      text: `Carlo has around 3 years of hands-on QA experience:\n` +
        `- **Manual testing:** functional, regression, UI, cross-browser, and exploratory testing\n` +
        `- **Automation:** builds Playwright + Python test suites wired into CI/CD\n` +
        `- **Defect tracking:** Jira, with clear, reproducible bug reports\n` +
        `- **Domains tested:** payment workflows, coupon systems, booking flows, and admin tools\n` +
        `- Comfortable in Agile teams — sprint planning, stand-ups, and release validation`,
      icon:'fa-solid fa-clipboard-check'
    };
    if(has('automation testing', 'automated test', 'playwright')) return {
      text: `Carlo builds test automation with **Playwright** and **Python**, structured as modular, CI-integrated frameworks for regression and API testing — the kind of setup that scales past a handful of scripts.`,
      icon:'fa-solid fa-robot'
    };
    if(has('api test')) return { text: `Yes — Carlo does API testing as part of his regression and QA automation work, verifying endpoints alongside UI flows.`, icon:'fa-solid fa-plug' };
    if(has('regression')) return { text: `Regression testing is one of Carlo's core skills — he maintains detailed regression suites (${kbSkills.find(s=>s.name==='Regression Testing')?.level ?? 90}% proficiency) to make sure new changes don't break existing functionality.`, icon:'fa-solid fa-rotate' };
    if(has('exploratory')) return { text: `Exploratory testing is where Carlo digs in without a script — probing edge cases and unexpected flows that formal test cases might miss.`, icon:'fa-solid fa-compass' };

    // --- Skills / languages ---
    if(has('programming language', 'languages does he know', 'what language')) return {
      text: `Carlo works with **JavaScript**, **Python**, **HTML**, **CSS**, and **SQL** — plus tools like **Git**, **GitHub**, **Jira**, and **Playwright** for testing and automation.`,
      icon:'fa-solid fa-code'
    };
    if(has('skill')) return {
      text: `Carlo's core skill set:\n` +
        kbSkills.map(s => `- **${s.name}** — ${s.level}%`).join('\n'),
      icon:'fa-solid fa-layer-group'
    };
    if(has('git', 'version control')) return { text: `Carlo uses **Git** and **GitHub** daily for version control and collaboration on both dev and QA projects.`, icon:'fa-brands fa-git-alt' };
    if(has('jira')) return { text: `Carlo uses **Jira** for defect tracking, sprint planning, and coordinating with dev teams during releases.`, icon:'fa-brands fa-jira' };
    if(has('html') || has('css')) return { text: `Carlo is comfortable with **HTML** and **CSS** for building and testing responsive front-ends — this very site is a good example.`, icon:'fa-brands fa-html5' };
    if(has('sql') || has('database')) return { text: `Carlo has working SQL knowledge for querying and validating data during backend and integration testing.`, icon:'fa-solid fa-database' };

    // --- Experience ---
    if(has('experience', 'work history', 'career', 'job')) return {
      text: kbExperience.map(job => `**${job.role}** — ${job.company} (${job.date})\n${job.points.slice(0,2).map(p=>'- '+p).join('\n')}`).join('\n\n'),
      icon:'fa-solid fa-briefcase'
    };
    if(has('current job', 'currently working', 'current role', 'current company')) {
      const cur = kbExperience[0];
      return { text: `Carlo is currently a **${cur.role}** at **${cur.company}** (${cur.date}).`, icon:'fa-solid fa-briefcase' };
    }

    // --- Education / certifications (not provided — be honest, no fabrication) ---
    if(has('education', 'degree', 'university', 'college')) return {
      text: `Carlo studied Computer Engineering. For specific degree details, it's best to ask him directly — feel free to use the contact options below.`,
      node: emailNode(),
      icon:'fa-solid fa-graduation-cap'
    };
    if(has('certification', 'certificate', 'certified')) return {
      text: `Carlo hasn't listed formal certifications on this site yet. If that's important for your role, reach out directly and he can share the latest.`,
      node: emailNode(),
      icon:'fa-solid fa-award'
    };

    // --- Services ---
    if(has('service', 'what can he do', 'what does he offer')) return {
      text: kbServices.map(s => `- **${s.title}** — ${s.desc}`).join('\n'),
      icon:'fa-solid fa-gears'
    };

    // --- Greetings ---
    if(has('hello','hi ','hey','good morning','good afternoon','yo') || q.trim()==='hi' || q.trim()==='hey') return {
      text: `Hey! 👋 I'm **Carlo AI** — ask me about his QA experience, skills, projects, or how to get in touch.`,
      icon:'fa-solid fa-hand-sparkles'
    };
    if(has('thank')) return { text: `You're welcome! Anything else you'd like to know about Carlo?`, icon:'fa-solid fa-face-smile' };
    if(has('bug')) return { text: `Fitting question for a QA portfolio 😄 — Carlo's whole job is finding these before your users do. Want to see his testing experience or automation projects?`, icon:'fa-solid fa-bug' };

    // --- Fallback: question isn't related to this page/portfolio ---
    return {
      text: `That doesn't seem related to Carlo's portfolio, so I can't help with it here.\n\n` +
        `I can:\n` +
        `- Answer questions about Carlo's **skills**, **QA/testing experience**, **projects**, or **work history**\n` +
        `- **Navigate this page for you** — just say something like *"take me to your projects"* or *"go to the contact section"*\n` +
        `- Help you **contact** Carlo or grab his **resume**\n\n` +
        `Try one of the suggestions below, or ask again.`,
      icon:'fa-solid fa-circle-question'
    };
  }

  /* ============ Handling a user message ============ */
  function handleUserMessage(text, isRegenerate){
    if(!isRegenerate){
      appendMessage('user', escapeHtml(text));
      history.push({ role:'user', content:text });
      saveHistory();
    }
    input.value = '';
    autoGrow();
    showTyping();

    const thinkTime = 550 + Math.random()*500;
    setTimeout(() => {
      hideTyping();
      const res = getResponse(text);
      const html = renderMarkdown(res.text);
      appendMessage('bot', '', res.node);
      // bubble element is inside bubbleWrap; grab the .ai-bubble we just created
      const lastBubble = messagesEl.querySelector('.ai-msg.bot:last-child .ai-bubble');
      streamText(lastBubble, html, res.text.replace(/[*_`#]/g,''));
      attachCodeCopyHandlers(lastBubble);
      history.push({ role:'bot', content:res.text });
      saveHistory();
    }, thinkTime);
  }

  /* ============ Textarea auto-grow ============ */
  function autoGrow(){
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  }
  input.addEventListener('input', autoGrow);
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      aiForm.requestSubmit();
    }
  });

  aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    handleUserMessage(text);
  });

  suggestedEl.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-q]');
    if(chip) handleUserMessage(chip.getAttribute('data-q'));
  });

  /* ============ Open / close ============ */
  function openChat(){
    chatWindow.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    badge.style.display = 'none';
    localStorage.setItem('carloAiSeen','1');
    setTimeout(() => input.focus(), 200);
  }
  function closeChat(){
    chatWindow.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.contains('open') ? closeChat() : openChat();
  });
  closeBtn.addEventListener('click', closeChat);
  // Prevent any click inside the chat window (including buttons that swap
  // their own icon, like theme/voice toggles) from bubbling to the
  // document-level "click outside closes the chat" listener below.
  chatWindow.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && chatWindow.classList.contains('open')) closeChat();
  });
  document.addEventListener('click', (e) => {
    if(!chatWindow.classList.contains('open')) return;
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    const clickedInsideChat = path.includes(chatWindow) || chatWindow.contains(e.target);
    const clickedToggle = path.includes(toggleBtn) || toggleBtn.contains(e.target);
    if(!clickedInsideChat && !clickedToggle){
      // click-away close only on larger screens to avoid mis-taps on mobile keyboards
      if(window.innerWidth > 768) closeChat();
    }
  });

  if(localStorage.getItem('carloAiSeen') === '1'){ badge.style.display = 'none'; }

  /* ============ Clear chat ============ */
  clearBtn.addEventListener('click', () => {
    history = [];
    saveHistory();
    messagesEl.innerHTML = '';
    seedWelcome();
  });

  /* ============ Theme toggle (scoped to widget only) ============ */
  themeBtn.addEventListener('click', () => {
    const isLight = widget.getAttribute('data-ai-theme') === 'light';
    widget.setAttribute('data-ai-theme', isLight ? 'dark' : 'light');
    themeBtn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('carloAiTheme', isLight ? 'dark' : 'light');
  });
  const savedTheme = localStorage.getItem('carloAiTheme');
  if(savedTheme === 'light'){
    widget.setAttribute('data-ai-theme','light');
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  /* ============ Voice output toggle ============ */
  voiceOutBtn.addEventListener('click', () => {
    voiceOutEnabled = !voiceOutEnabled;
    voiceOutBtn.classList.toggle('active', voiceOutEnabled);
    voiceOutBtn.setAttribute('aria-pressed', String(voiceOutEnabled));
    voiceOutBtn.innerHTML = voiceOutEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    if(!voiceOutEnabled) speechSynthesis.cancel();
  });

  /* ============ Voice input (Web Speech API) ============ */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SpeechRecognition){
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;   // show words as they're spoken, not just at the end
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    let listening = false;

    function stopListeningUI(){
      listening = false;
      micBtn.classList.remove('listening');
    }

    function showVoiceNotice(msg){
      const bubble = appendMessage('bot', '');
      streamText(bubble, renderMarkdown(msg));
    }

    micBtn.addEventListener('click', () => {
      if(listening){ recognition.stop(); return; }
      try{
        recognition.start();
        listening = true;
        micBtn.classList.add('listening');
      }catch(err){
        console.warn('Speech recognition failed to start', err);
        stopListeningUI();
      }
    });

    recognition.addEventListener('result', (e) => {
      // Rebuild the transcript from every result so far so the input box
      // fills in live while the person is still talking.
      let transcript = '';
      for(let i = 0; i < e.results.length; i++){
        transcript += e.results[i][0].transcript;
      }
      input.value = transcript;
      autoGrow();

      const lastResult = e.results[e.results.length - 1];
      if(lastResult.isFinal){
        recognition.stop();
        if(transcript.trim()){
          aiForm.requestSubmit();
        }
      }
    });

    recognition.addEventListener('end', stopListeningUI);

    recognition.addEventListener('error', (e) => {
      stopListeningUI();
      let msg = `I didn't catch that — please try again.`;
      if(e.error === 'not-allowed' || e.error === 'permission-denied' || e.error === 'service-not-allowed'){
        msg = `I need microphone access to hear you. Please allow the mic permission for this site in your browser, and make sure the page is loaded over **https://** or **localhost** — voice input won't work when opened directly from a file.`;
      } else if(e.error === 'no-speech'){
        msg = `I didn't hear any speech — tap the mic and try again whenever you're ready.`;
      } else if(e.error === 'audio-capture'){
        msg = `I couldn't find a working microphone on this device.`;
      } else if(e.error === 'network'){
        msg = `Voice recognition needs an internet connection — please check yours and try again.`;
      }
      showVoiceNotice(msg);
    });
  } else {
    micBtn.style.display = 'none';
  }

  /* ============ Welcome message ============ */
  function seedWelcome(){
    const bubble = appendMessage('bot', '');
    const html = renderMarkdown(
      `Hi, I'm **Carlo AI** 👋\n\nI can walk you through Carlo's QA background, automation skills, projects, and how to reach him — just ask, or tap a suggestion below.`
    );
    streamText(bubble, html);
  }

  /* ============ Init: restore history or seed welcome ============ */
  const saved = loadHistory();
  if(saved.length){
    history = saved;
    saved.forEach(m => {
      const html = renderMarkdown(m.content);
      const bubble = appendMessage(m.role, html);
      attachCodeCopyHandlers(bubble);
    });
  } else {
    seedWelcome();
  }

})();
