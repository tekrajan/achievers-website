// The Achievers — shared UI (vanilla, deferred, < 7KB)
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

  // Static mode (screenshots/print)
  var staticMode=/[?&](shot|static|print)=1/.test(location.search);

  // Scroll progress bar
  var bar=document.createElement('div');bar.id='scrollBar';document.body.appendChild(bar);
  function onScroll(){var h=document.documentElement;var max=(h.scrollHeight-h.clientHeight)||1;bar.style.width=Math.min(100,(h.scrollTop/max)*100)+'%';
    var t=$('#toTop');if(t)t.classList.toggle('show',window.scrollY>600);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Counters
  var counters=$$('[data-count]');
  if(staticMode){counters.forEach(function(el){el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||'')});}
  else if('IntersectionObserver' in window && counters.length){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
      var target=parseFloat(el.getAttribute('data-count'));var suf=el.getAttribute('data-suffix')||'';var t0=null,dur=1200;
      function tick(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(target*(0.2+0.8*p))+suf;if(p<1)requestAnimationFrame(tick);else el.textContent=target+suf}
      requestAnimationFrame(tick);})},{threshold:.4});
    counters.forEach(function(c){io.observe(c)});
  }

  // Reveal + heading underline
  var rev=$$('.reveal');
  var heads=$$('.sec-head h2');
  if(staticMode){rev.forEach(function(r){r.classList.add('in')});heads.forEach(function(h){h.classList.add('in-underline')});}
  else if('IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io2.unobserve(e.target)}})},{threshold:.12});
    rev.forEach(function(r){io2.observe(r)});
    var io3=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-underline');io3.unobserve(e.target)}})},{threshold:.6});
    heads.forEach(function(h){io3.observe(h)});
  } else {rev.forEach(function(r){r.classList.add('in')});heads.forEach(function(h){h.classList.add('in-underline')});}

  // Testimonial slider: dots + autoplay + swipe
  $$('[data-slider]').forEach(function(wrap){
    var track=$('.slides',wrap); if(!track)return;
    var n=track.children.length, i=0, timer=null;
    var dotsWrap=$('[data-dots]',wrap);
    // build dots
    var dots=document.createElement('span');dots.className='dots';
    for(var k=0;k<n;k++){(function(k){var b=document.createElement('button');b.className='dot'+(k===0?' on':'');b.type='button';b.setAttribute('aria-label','Slide '+(k+1));b.addEventListener('click',function(){go(k);restart()});dots.appendChild(b)})(k)}
    if(dotsWrap){dotsWrap.className='dots';dotsWrap.textContent='';dotsWrap.appendChild(dots)} else {
      var nav=$('.slider-nav',wrap); if(nav)nav.appendChild(dots)}
    function go(k){i=(k+n)%n;track.scrollTo({left:track.clientWidth*i,behavior:'smooth'});
      $$('.dot',dots).forEach(function(d,idx){d.classList.toggle('on',idx===i)})}
    var prev=$('[data-prev]',wrap), next=$('[data-next]',wrap);
    if(prev)prev.addEventListener('click',function(){go(i-1);restart()});
    if(next)next.addEventListener('click',function(){go(i+1);restart()});
    function start(){if(staticMode||n<2)return;timer=setInterval(function(){go(i+1)},5000)}
    function restart(){clearInterval(timer);start()}
    wrap.addEventListener('mouseenter',function(){clearInterval(timer)});
    wrap.addEventListener('mouseleave',start);
    // swipe
    var sx=0;track.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    track.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){go(dx<0?i+1:i-1);restart()}},{passive:true});
    go(0);start();
  });

  // Course filter — correct active class (btn-brand) + search
  var tabs=$$('[data-filter-btn]');
  if(tabs.length){
    tabs.forEach(function(b){b.addEventListener('click',function(){
      tabs.forEach(function(x){x.classList.remove('btn-brand');x.classList.add('btn-outline')});
      b.classList.add('btn-brand');b.classList.remove('btn-outline');
      var f=b.getAttribute('data-filter-btn');
      $$('[data-cat]').forEach(function(card){card.style.display=(f==='all'||card.getAttribute('data-cat')===f)?'':'none'});
    })});
    var q=$('#courseSearch');
    if(q)q.addEventListener('input',function(){var v=q.value.toLowerCase();$$('[data-cat]').forEach(function(c){c.style.display=c.textContent.toLowerCase().indexOf(v)>-1?'':'none'})});
  }

  // Form validation
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

  // Button ripple origin (for radial highlight)
  document.addEventListener('pointermove',function(e){var b=e.target.closest?e.target.closest('.btn'):null;if(!b)return;var r=b.getBoundingClientRect();b.style.setProperty('--x',((e.clientX-r.left)/r.width*100)+'%');b.style.setProperty('--y',((e.clientY-r.top)/r.height*100)+'%')},{passive:true});

  // To top
  var top=$('#toTop');
  if(top){top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});}
})();
