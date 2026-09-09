(() => {
  'use strict';
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const frame=document.querySelector('.legacy-frame');
  if(frame){
    const slides=[...frame.querySelectorAll('.legacy-slide')],dots=[...frame.querySelectorAll('[data-slide]')];
    const pause=frame.querySelector('.slider-pause');
    let index=0,timer=null,userPaused=false,hover=false,focused=false,visible=true;
    function show(next,announce=false){
      index=(next+slides.length)%slides.length;
      slides.forEach((slide,i)=>{slide.classList.toggle('active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});
      dots.forEach((dot,i)=>{if(i===index)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
      if(announce)frame.querySelector('#slide-status').textContent=`Projektfoto ${index+1} von ${slides.length}`;
    }
    function stop(){if(timer!==null)window.clearInterval(timer);timer=null;}
    function sync(){
      stop();
      pause.hidden=motion.matches;
      pause.setAttribute('aria-pressed',String(userPaused));
      pause.setAttribute('aria-label',userPaused?'Automatischen Bildwechsel starten':'Automatischen Bildwechsel pausieren');
      pause.innerHTML=userPaused?'▶ <span>Abspielen</span>':'Ⅱ <span>Pause</span>';
      if(!motion.matches&&!userPaused&&!hover&&!focused&&!document.hidden&&visible)timer=window.setInterval(()=>show(index+1),4800);
    }
    function manual(next){show(next,true);sync();}
    frame.querySelector('.slider-prev').addEventListener('click',()=>manual(index-1));
    frame.querySelector('.slider-next').addEventListener('click',()=>manual(index+1));
    dots.forEach(dot=>dot.addEventListener('click',()=>manual(Number(dot.dataset.slide))));
    pause.addEventListener('click',()=>{userPaused=!userPaused;sync();});
    frame.addEventListener('mouseenter',()=>{hover=true;sync();});
    frame.addEventListener('mouseleave',()=>{hover=false;sync();});
    frame.addEventListener('focusin',()=>{focused=true;sync();});
    frame.addEventListener('focusout',event=>{if(!frame.contains(event.relatedTarget)){focused=false;sync();}});
    frame.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();manual(index-1);}if(event.key==='ArrowRight'){event.preventDefault();manual(index+1);}});
    document.addEventListener('visibilitychange',sync);
    motion.addEventListener('change',sync);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(frame);
    let touch=null;
    frame.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')touch={x:event.clientX,y:event.clientY,id:event.pointerId};});
    frame.addEventListener('pointerup',event=>{if(!touch||touch.id!==event.pointerId)return;const dx=event.clientX-touch.x,dy=event.clientY-touch.y;touch=null;if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy))manual(index+(dx<0?1:-1));});
    frame.addEventListener('pointercancel',()=>{touch=null;});
    show(0);sync();
  }
  document.querySelectorAll('.comparison').forEach(comparison=>{
    const range=comparison.querySelector('input[type="range"]'),images=comparison.querySelector('.comparison-images');
    const before=comparison.querySelector('.comparison-tag.before'),after=comparison.querySelector('.comparison-tag.after');
    let pointer=null;
    function setValue(value){
      const percent=Math.max(0,Math.min(100,Number(value)));
      range.value=String(Math.round(percent));images.style.setProperty('--reveal',percent+'%');
      range.setAttribute('aria-valuetext',`${Math.round(percent)} Prozent Vorher, ${100-Math.round(percent)} Prozent Nachher`);
      before.style.opacity=String(Math.min(1,percent/16));after.style.opacity=String(Math.min(1,(100-percent)/16));
    }
    function fromX(x){const bounds=images.getBoundingClientRect();if(bounds.width>0)setValue((x-bounds.left)/bounds.width*100);}
    range.addEventListener('input',()=>setValue(range.value));
    // The native range remains available to keyboard and screen-reader users.
    // Pointer capture keeps the image handle attached to a drag outside the frame.
    images.addEventListener('pointerdown',event=>{
      if(event.isPrimary===false||event.button!==0)return;
      pointer={id:event.pointerId,x:event.clientX,y:event.clientY,active:event.pointerType!=='touch'};
      images.setPointerCapture(event.pointerId);
      if(pointer.active){event.preventDefault();range.focus({preventScroll:true});images.classList.add('is-dragging');fromX(event.clientX);}
    });
    images.addEventListener('pointermove',event=>{
      if(!pointer||pointer.id!==event.pointerId)return;
      if(!pointer.active){const dx=Math.abs(event.clientX-pointer.x),dy=Math.abs(event.clientY-pointer.y);if(dx<6||dx<=dy)return;pointer.active=true;images.classList.add('is-dragging');}
      if(event.cancelable)event.preventDefault();fromX(event.clientX);
    });
    function end(event){
      if(!pointer||pointer.id!==event.pointerId)return;
      if(event.type==='pointerup')fromX(event.clientX);
      pointer=null;images.classList.remove('is-dragging');
      if(images.hasPointerCapture(event.pointerId))images.releasePointerCapture(event.pointerId);
    }
    images.addEventListener('pointerup',end);images.addEventListener('pointercancel',end);images.addEventListener('lostpointercapture',end);
    images.addEventListener('dragstart',event=>event.preventDefault());
    setValue(range.value);
  });
  // Progressive enhancement: all sections are visible without JavaScript or when motion is reduced.
  const revealTargets=[...document.querySelectorAll('.legacy-hero .hero-copy, .legacy-image-wrap, .section-heading, .legacy-about, .service-card, .reference-teasers>a, .steps article, .comparison, .coverage-map-frame')];
  let revealObserver;
  function revealSetup(){
    revealObserver?.disconnect();
    if(motion.matches||!('IntersectionObserver' in window)){revealTargets.forEach(el=>el.classList.remove('reveal-pending'));return;}
    revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}});},{threshold:.08});
    revealTargets.forEach((el,i)=>{if(el.classList.contains('revealed'))return;el.style.setProperty('--reveal-delay',(i%3)*65+'ms');el.classList.add('reveal-pending');revealObserver.observe(el);});
  }
  revealSetup();motion.addEventListener('change',revealSetup);
})();
