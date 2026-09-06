(() => {
  const frame=document.querySelector('.legacy-frame');
  if(frame){
    const slides=[...frame.querySelectorAll('.legacy-slide')],dots=[...frame.querySelectorAll('[data-slide]')];let index=0;
    function show(next){index=(next+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);dots.forEach((d,i)=>{if(i===index)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});frame.querySelector('#slide-status').textContent=`Projektfoto ${index+1} von ${slides.length}`;}
    frame.querySelector('.slider-prev').addEventListener('click',()=>show(index-1));frame.querySelector('.slider-next').addEventListener('click',()=>show(index+1));dots.forEach(d=>d.addEventListener('click',()=>show(Number(d.dataset.slide))));
    frame.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}});
  }
  document.querySelectorAll('.comparison').forEach(comparison=>{const range=comparison.querySelector('input[type="range"]'),images=comparison.querySelector('.comparison-images');range.addEventListener('input',()=>images.style.setProperty('--reveal',range.value+'%'));});
})();
