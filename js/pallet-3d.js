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
 const l=label(text,.48,'#f6d36b','#173b2b');l.position.copy(A.clone().add(B).multiplyScalar(.5));l.position.y+=.35;g.add(l)
}
function buildPallet(widthMM,lengthMM,numbered=false){
 const g=new THREE.Group(),W=widthMM/100,L=lengthMM/100,deckH=.22,deckW=Math.min(1.25,W/8),topY=1.55;
 const deckCount=widthMM===800?6:7;
 for(let i=0;i<deckCount;i++){const z=-L/2+deckW/2+i*(L-deckW)/(deckCount-1);board(g,W,deckH,deckW,0,topY,z);if(numbered){const n=label(String(i+1),.72);n.position.set(-W*.27,topY+.42,z);g.add(n)}}
 const runnerW=.65,runnerH=.26,runnerY=1.15;[-W/2+runnerW/2,0,W/2-runnerW/2].forEach(x=>board(g,runnerW,runnerH,L,x,runnerY,0,woodSide));
 const block=.7,blockH=.72,blockY=.66;[-W/2+block/2,0,W/2-block/2].forEach(x=>[-L/2+block/2,0,L/2-block/2].forEach(z=>board(g,block,blockH,block,x,blockY,z,darkWood)));
 const baseH=.2,baseY=.2;[-W/2+deckW/2,W/2-deckW/2].forEach(x=>board(g,deckW,baseH,L,x,baseY,0,woodSide));board(g,W,baseH,deckW,0,baseY,0,woodSide);
 dimension(g,new THREE.Vector3(-W/2,topY+.25,-L/2),new THREE.Vector3(W/2,topY+.25,-L/2),widthMM+' mm',new THREE.Vector3(0,.55,-.55));
 dimension(g,new THREE.Vector3(W/2,topY+.25,-L/2),new THREE.Vector3(W/2,topY+.25,L/2),lengthMM+' mm',new THREE.Vector3(.65,.55,0));
 dimension(g,new THREE.Vector3(-W/2,topY+.25,-L/2),new THREE.Vector3(-W/2,topY+.25,-L/2+deckW),Math.round(deckW*100)+' mm tabla',new THREE.Vector3(-.7,1.15,0));
 return g
}
function init(el,index){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100),renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xfff3df,0x163b2b,2.2));const key=new THREE.DirectionalLight(0xffffff,3.4);key.position.set(6,10,8);key.castShadow=true;scene.add(key);
 const W=Number(el.dataset.palletWidth),L=Number(el.dataset.palletLength);const pallet=buildPallet(W,L,index===1);pallet.rotation.y=-.25;scene.add(pallet);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(9,64),new THREE.ShadowMaterial({color:0x000000,opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=.08;floor.receiveShadow=true;scene.add(floor);
 camera.position.set(12,9,14);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,.9,0);controls.minDistance=9;controls.maxDistance=22;controls.maxPolarAngle=Math.PI/2.05;controls.autoRotate=true;controls.autoRotateSpeed=.55;controls.addEventListener('start',()=>controls.autoRotate=false);
 const resize=()=>{const r=el.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};resize();new ResizeObserver(resize).observe(el);renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)})
}
document.querySelectorAll('.pallet-canvas').forEach(init);