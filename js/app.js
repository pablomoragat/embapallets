const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const sent=new URLSearchParams(window.location.search).get('enviado');if(sent==='1'){alert('Tu solicitud fue enviada correctamente. Nos pondremos en contacto contigo.');window.history.replaceState({},document.title,window.location.pathname+'#contacto')}

async function cargarPrecios(){
  const elementos=document.querySelectorAll('[data-price-id]');
  if(!elementos.length)return;
  try{
    const respuesta=await fetch('datos/precios.json',{cache:'no-store'});
    if(!respuesta.ok)throw new Error('HTTP '+respuesta.status);
    const catalogo=await respuesta.json();
    if(catalogo.moneda!=='CLP'||catalogo.precios_incluyen_iva!==false||!Array.isArray(catalogo.productos))throw new Error('Formato de precios no válido');
    const precios=new Map(catalogo.productos.map(producto=>[producto.id,producto.precio_desde]));
    const formato=new Intl.NumberFormat('es-CL');
    elementos.forEach(elemento=>{
      const precio=precios.get(elemento.dataset.priceId);
      if(!Number.isSafeInteger(precio)||precio<0)return;
      const valor='$'+formato.format(precio);
      if(elemento.dataset.priceDisplay==='card'){
        elemento.firstChild.textContent=valor+' ';
      }else if(elemento.dataset.priceDisplay==='summary'){
        elemento.textContent='Precio desde '+valor+' + IVA c/u';
      }
    });
  }catch(error){
    console.warn('No se pudieron cargar los precios; se muestran los valores publicados.',error);
  }
}
cargarPrecios();
