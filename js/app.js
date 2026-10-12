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
