const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const sent=new URLSearchParams(window.location.search).get('enviado');if(sent==='1'){alert('Tu solicitud fue enviada correctamente. Nos pondremos en contacto contigo.');window.history.replaceState({},document.title,window.location.pathname+'#contacto')}


// La cotización usa un mensaje editable. Los CTA de cada producto
// pueden completar el tipo de pallet sin borrar las demás respuestas.
const quoteMessage=document.querySelector('#quote-form textarea[name="mensaje"]');
document.querySelectorAll('[data-quote-product]').forEach(link=>{
  link.addEventListener('click',()=>{
    if(!quoteMessage) return;
    const defaultType='Tipo de pallet: nuevo / indicar otro: ____';
    if(quoteMessage.value.includes(defaultType)){
      quoteMessage.value=quoteMessage.value.replace(defaultType,'Tipo de pallet: '+link.dataset.quoteProduct);
    }
  });
});

// Carrusel del Hero: avanza cada 6 segundos y se detiene definitivamente
// ante el primer clic, toque o interacción de teclado. Las flechas siguen disponibles.
const heroCarousel=document.querySelector('[data-hero-carousel]');
if(heroCarousel){
  const slides=Array.from(heroCarousel.querySelectorAll('[data-hero-slide]'));
  const controls=heroCarousel.querySelector('.hero-carousel-controls');
  if(slides.length>1&&controls){
    const dotsContainer=controls.querySelector('.hero-carousel-dots');
    let activeIndex=0;
    let rotationTimer=null;
    let interacted=false;
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
    const stopRotation=()=>{
      interacted=true;
      if(rotationTimer!==null){
        window.clearInterval(rotationTimer);
        rotationTimer=null;
      }
    };
    const dots=slides.map((_,index)=>{
      const dot=document.createElement('button');
      dot.type='button';
      dot.className='hero-carousel-dot';
      dot.setAttribute('aria-label',`Ver destacado ${index+1} de ${slides.length}`);
      dot.addEventListener('click',()=>{stopRotation();showSlide(index)});
      dotsContainer.appendChild(dot);
      return dot;
    });
    controls.querySelector('.hero-carousel-prev').addEventListener('click',()=>{stopRotation();showSlide(activeIndex-1)});
    controls.querySelector('.hero-carousel-next').addEventListener('click',()=>{stopRotation();showSlide(activeIndex+1)});
    heroCarousel.addEventListener('pointerdown',stopRotation,{passive:true});
    heroCarousel.addEventListener('focusin',stopRotation);
    heroCarousel.addEventListener('keydown',stopRotation);
    controls.hidden=false;
    showSlide(0);
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reducedMotion&&!interacted){
      rotationTimer=window.setInterval(()=>{
        if(!document.hidden&&!interacted)showSlide(activeIndex+1);
      },6000);
    }
  }
}

// Formulario de información TRIMAX, accesible desde un único CTA.
const trimaxForm=document.querySelector('#trimax-form');
document.querySelectorAll('[data-trimax-more]').forEach(link=>{
  link.addEventListener('click',()=>{
    if(typeof window.gtag==='function') window.gtag('event','trimax_interes_click',{tipo_interes:'informacion'});
  });
});
if(new URLSearchParams(window.location.search).get('registro')==='1'){
  const message=document.querySelector('#trimax-form-success');
  if(message) message.hidden=false;
  window.history.replaceState({},document.title,window.location.pathname+'#trimax-registro');
}
if(trimaxForm){
  trimaxForm.addEventListener('submit',()=>{
    if(typeof window.gtag==='function')window.gtag('event','trimax_registro_enviado',{tipo_interes:'informacion'});
  });
}
