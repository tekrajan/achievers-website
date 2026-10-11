// The Achievers — shared UI (vanilla, deferred, < 5KB)
(function(){
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  // Year
  $$('[data-year]').forEach(function(el){el.textContent=new Date().getFullYear()});

  // Mobile nav
  var btn=$('#navToggle'), nav=$('#navLinks');
  if(btn&&nav){btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false')});
    $$('#navLinks a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});}

  // Active link
  var path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  $$('#navLinks a').forEach(function(a){var h=(a.getAttribute('href')||'').toLowerCase();if(h===path||(path===''&&h==='index.html'))a.classList.add('active')});

  // Counters (skip animation for screenshots/PDF: add ?shot=1 to URL)
  var staticMode=/[?&](shot|static|print)=1/.test(location.search);
  var counters=$$('[data-count]');
  if(staticMode){counters.forEach(function(el){el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'')});}
  else if('IntersectionObserver' in window && counters.length){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
      var target=parseFloat(el.getAttribute('data-count'));var suf=el.getAttribute('data-suffix')||'';var t0=null,dur=1200;
      function tick(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(target*(0.2+0.8*p))+suf;if(p<1)requestAnimationFrame(tick);else el.textContent=target+suf}
      requestAnimationFrame(tick);})},{threshold:.4});
    counters.forEach(function(c){io.observe(c)});
  }

  // Reveal
  var rev=$$('.reveal');
  if(staticMode){rev.forEach(function(r){r.classList.add('in')})}
  else if('IntersectionObserver' in window && rev.length){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target)}})},{threshold:.12});
    rev.forEach(function(r){io2.observe(r)});
  } else {rev.forEach(function(r){r.classList.add('in')})}

  // Testimonial slider
  $$('[data-slider]').forEach(function(wrap){
    var track=$('.slides',wrap); if(!track)return;
    var i=0, n=track.children.length;
    function go(k){i=(k+n)%n;track.scrollTo({left:track.clientWidth*i,behavior:'smooth'});var d=$('[data-dots]',wrap);if(d)d.textContent=(i+1)+' / '+n}
    var prev=$('[data-prev]',wrap), next=$('[data-next]',wrap);
    if(prev)prev.addEventListener('click',function(){go(i-1)});
    if(next)next.addEventListener('click',function(){go(i+1)});
    go(0);
  });

  // Course filter (courses.html)
  var tabs=$$('[data-filter-btn]');
  if(tabs.length){
    tabs.forEach(function(b){b.addEventListener('click',function(){
      tabs.forEach(function(x){x.classList.remove('btn-navy');x.classList.add('btn-outline')});
      b.classList.add('btn-navy');b.classList.remove('btn-outline');
      var f=b.getAttribute('data-filter-btn');
      $$('[data-cat]').forEach(function(card){card.style.display=(f==='all'||card.getAttribute('data-cat')===f)?'':'none'});
    })});
    var q=$('#courseSearch');
    if(q)q.addEventListener('input',function(){var v=q.value.toLowerCase();$$('[data-cat]').forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(v)>-1?'':'none'})});
  }

  // Demo / contact form validation
  $$('form[data-validate]').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var ok=true;
      $$('[required]',f).forEach(function(inp){
        var err=f.querySelector('[data-err-for="'+inp.name+'"]');
        var v=(inp.value||'').trim(); var bad=!v;
        if(!bad&&inp.name==='phone')bad=!/(^(\+?977[\-\s]?)?9[678]\d{8}$|^[0-9+\-\s]{7,15}$)/.test(v);
        if(err)err.textContent=bad?('Please enter a valid '+inp.name)+'.':'';
        if(bad)ok=false;
      });
      var s=$('.success',f); if(s)s.style.display=ok?'block':'none';
      if(ok)f.reset();
    });
  });

  // Promo videos: reset to blank state when finished
  $$('.video-wrap video').forEach(function(v){
    v.addEventListener('ended',function(){try{v.load()}catch(e){try{v.currentTime=0}catch(_){}v.pause()}});
  });

  // Sliding nav cursor (vanilla NavHeader port; hover-capable pointers only)
  if(window.matchMedia&&matchMedia('(hover:hover)').matches){
    var nav=$('#navLinks');
    var cur=nav?$('.nav-cursor',nav):null;
    if(nav&&cur){
      var links=$$('#navLinks a').filter(function(a){return !a.classList.contains('btn')});
      var cta=$('#navLinks a.btn');
      function move(a){cur.style.left=a.offsetLeft+'px';cur.style.top=a.offsetTop+'px';cur.style.width=a.offsetWidth+'px';cur.style.height=a.offsetHeight+'px';cur.style.opacity='1';
        links.forEach(function(x){x.classList.toggle('on-pill',x===a)})}
      function hide(){cur.style.opacity='0';links.forEach(function(x){x.classList.remove('on-pill')})}
      links.forEach(function(a){
        a.addEventListener('mouseenter',function(){move(a)});
        a.addEventListener('focus',function(){move(a)});
      });
      if(cta)cta.addEventListener('mouseenter',hide);
      nav.addEventListener('mouseleave',hide);
      window.addEventListener('resize',hide);
    }
  }

  // To top
  var top=$('#toTop');
  if(top){window.addEventListener('scroll',function(){top.style.display=window.scrollY>600?'block':'none'},{passive:true});
    top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});}
})();
