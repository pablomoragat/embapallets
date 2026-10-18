const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const sent=new URLSearchParams(window.location.search).get('enviado');if(sent==='1'){alert('Tu solicitud fue enviada correctamente. Nos pondremos en contacto contigo.');window.history.replaceState({},document.title,window.location.pathname+'#contacto')}


// Solicitar dimensiones solo cuando el cliente elige "Otra medida".
const quoteDimensions=document.querySelector('#quote-dimensions');
const customDimensionsField=document.querySelector('#quote-custom-dimensions-field');
const customDimensionsInput=document.querySelector('#quote-custom-dimensions');
if(quoteDimensions&&customDimensionsField&&customDimensionsInput){
  const syncCustomDimensions=()=>{
    const isOther=quoteDimensions.value==='otra';
    customDimensionsField.hidden=!isOther;
    customDimensionsInput.disabled=!isOther;
    customDimensionsInput.required=isOther;
    if(!isOther)customDimensionsInput.value='';
  };
  quoteDimensions.addEventListener('change',syncCustomDimensions);
  syncCustomDimensions();
}

// El botón de cotizar del hero preselecciona el nuevo producto.
document.querySelectorAll('[data-quote-product]').forEach(link=>{
  link.addEventListener('click',()=>{
    const productSelect=document.querySelector('#quote-form select[name="producto"]');
    if(productSelect) productSelect.value=link.dataset.quoteProduct;
  });
});


// Carrusel del Hero: se activa solamente cuando exista una segunda diapositiva.
// Al agregarla dentro de .hero-carousel-viewport, usar .hero-carousel-slide y data-hero-slide.
const heroCarousel=document.querySelector('[data-hero-carousel]');
if(heroCarousel){
  const slides=Array.from(heroCarousel.querySelectorAll('[data-hero-slide]'));
  const controls=heroCarousel.querySelector('.hero-carousel-controls');
  if(slides.length>1&&controls){
    const dotsContainer=controls.querySelector('.hero-carousel-dots');
    let activeIndex=0;
    const showSlide=(nextIndex)=>{
      activeIndex=(nextIndex+slides.length)%slides.length;
      slides.forEach((slide,index)=>{
        const active=index===activeIndex;
        slide.hidden=!active;
        slide.classList.toggle('is-active',active);
        slide.setAttribute('aria-hidden',String(!active));
      });
      dots.forEach((dot,index)=>{
        dot.setAttribute('aria-current',index===activeIndex?'true':'false');
        dot.setAttribute('aria-pressed',String(index===activeIndex));
      });
    };
    const dots=slides.map((_,index)=>{
      const dot=document.createElement('button');
      dot.type='button';
      dot.className='hero-carousel-dot';
      dot.setAttribute('aria-label',`Ver destacado ${index+1} de ${slides.length}`);
      dot.addEventListener('click',()=>showSlide(index));
      dotsContainer.appendChild(dot);
      return dot;
    });
    controls.querySelector('.hero-carousel-prev').addEventListener('click',()=>showSlide(activeIndex-1));
    controls.querySelector('.hero-carousel-next').addEventListener('click',()=>showSlide(activeIndex+1));
    controls.hidden=false;
    showSlide(0);
  }
}
