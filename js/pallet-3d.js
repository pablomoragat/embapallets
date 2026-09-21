import * as THREE from 'https://esm.sh/three@0.180.0';
import { OrbitControls } from 'https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js';

const wood=new THREE.MeshStandardMaterial({color:0xc89452,roughness:.72});
const woodSide=new THREE.MeshStandardMaterial({color:0xa66f37,roughness:.82});
const darkWood=new THREE.MeshStandardMaterial({color:0x8b5b2c,roughness:.88});
const lineMat=new THREE.LineBasicMaterial({color:0xf6d36b});

function board(group,w,h,d,x,y,z,material=wood){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
function label(text,size=.62,bg='#ffffff',fg='#173b2b'){
 const c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=512;c.height=180;ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(8,8,496,164,36);ctx.fill();ctx.fillStyle=fg;ctx.font='bold 74px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,92);
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));s.scale.set(size*2.84,size,1);return s
}
function line(g,a,b){const geo=new THREE.BufferGeometry().setFromPoints([a,b]);g.add(new THREE.Line(geo,lineMat))}
function dimension(g,a,b,text,offset=new THREE.Vector3()){
 const A=a.clone().add(offset),B=b.clone().add(offset);line(g,A,B);
 const dir=new THREE.Vector3().subVectors(B,A).normalize(),perp=new THREE.Vector3(-dir.z,0,dir.x).multiplyScalar(.22);
 line(g,A.clone().add(perp),A.clone().sub(perp));line(g,B.clone().add(perp),B.clone().sub(perp));
 const l=label(text,.92,'#f6d36b','#173b2b');l.position.copy(A.clone().add(B).multiplyScalar(.5));l.position.y+=.52;g.add(l)
}
function buildPallet(widthMM,lengthMM,numbered=false){
 const g=new THREE.Group(),W=widthMM/100,L=lengthMM/100,deckH=.22,deckW=1,topY=1.39;
 const deckCount=widthMM===800?6:7;
 // Tablas de cubierta: recorren el largo del pallet y se distribuyen sobre su ancho.
 for(let i=0;i<deckCount;i++){const x=-W/2+deckW/2+i*(W-deckW)/(deckCount-1);board(g,deckW,deckH,L,x,topY,0);if(numbered){const n=label(String(i+1),1.02);n.position.set(x,topY+.52,-L*.27);g.add(n)}}

 // Tres yugos completos e identicos. Cada uno incluye una tabla superior,
 // tres tacos y una tabla inferior, todos alineados en el ancho del pallet.
 const yokeW=1,runnerH=.26,runnerY=1.15;
 const block=yokeW,blockH=.72,blockY=.66;
 const baseH=.2,baseY=.2;
 const yokeZ=[-L/2+yokeW/2,0,L/2-yokeW/2];
 const blockX=[-W/2+block/2,0,W/2-block/2];
 yokeZ.forEach(z=>{
  board(g,W,runnerH,yokeW,0,runnerY,z,woodSide);
  blockX.forEach(x=>board(g,block,blockH,block,x,blockY,z,darkWood));
  board(g,W,baseH,yokeW,0,baseY,z,woodSide);
 });
 dimension(g,new THREE.Vector3(-W/2,topY+.25,-L/2),new THREE.Vector3(W/2,topY+.25,-L/2),widthMM+' mm',new THREE.Vector3(0,.65,-.55));
 dimension(g,new THREE.Vector3(W/2,topY+.25,-L/2),new THREE.Vector3(W/2,topY+.25,L/2),lengthMM+' mm',new THREE.Vector3(.65,.55,0));
 dimension(g,new THREE.Vector3(-W/2,topY+.25,-L/2),new THREE.Vector3(-W/2+deckW,topY+.25,-L/2),Math.round(deckW*100)+' mm tabla',new THREE.Vector3(0,1.15,-.7));
 return g
}
function init(el,index){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xfff3df,0x163b2b,2.2));const key=new THREE.DirectionalLight(0xffffff,3.4);key.position.set(6,10,8);key.castShadow=true;scene.add(key);
 const W=Number(el.dataset.palletWidth),L=Number(el.dataset.palletLength);const pallet=buildPallet(W,L,true);pallet.rotation.y=-.25;scene.add(pallet);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(9,64),new THREE.ShadowMaterial({color:0x000000,opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=.08;floor.receiveShadow=true;scene.add(floor);
 camera.position.set(10.2,7.6,12.2);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,.9,0);controls.minDistance=7.5;controls.maxDistance=20;controls.maxPolarAngle=Math.PI/2.05;controls.autoRotate=true;controls.autoRotateSpeed=.55;controls.addEventListener('start',()=>controls.autoRotate=false);
 const resize=()=>{const r=el.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};resize();new ResizeObserver(resize).observe(el);renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)})
}
document.querySelectorAll('.pallet-canvas').forEach(init);
