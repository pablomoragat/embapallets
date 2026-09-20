import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';

const wood = new THREE.MeshStandardMaterial({color:0xc89452,roughness:.72,metalness:0});
const woodSide = new THREE.MeshStandardMaterial({color:0xa66f37,roughness:.82,metalness:0});
const darkWood = new THREE.MeshStandardMaterial({color:0x8b5b2c,roughness:.88,metalness:0});

function board(group,w,h,d,x,y,z,material=wood){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh); return mesh;
}
function buildPallet(widthMM,lengthMM){
  const g=new THREE.Group(), W=widthMM/100, L=lengthMM/100;
  const deckH=.22, deckW=Math.min(1.25,W/8), topY=1.55;
  for(let i=0;i<7;i++){const z=-L/2+deckW/2+i*(L-deckW)/6; board(g,W,deckH,deckW,0,topY,z);}
  const runnerW=.65, runnerH=.26, runnerY=1.15;
  [-W/2+runnerW/2,0,W/2-runnerW/2].forEach(x=>board(g,runnerW,runnerH,L,x,runnerY,0,woodSide));
  const block=.7, blockH=.72, blockY=.66;
  [-W/2+block/2,0,W/2-block/2].forEach(x=>[-L/2+block/2,0,L/2-block/2].forEach(z=>board(g,block,blockH,block,x,blockY,z,darkWood)));
  const baseH=.2, baseY=.2;
  [-W/2+deckW/2,W/2-deckW/2].forEach(x=>board(g,deckW,baseH,L,x,baseY,0,woodSide));
  board(g,W,baseH,deckW,0,baseY,0,woodSide);
  return g;
}
function init(el){
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xfff3df,0x163b2b,2.2));
  const key=new THREE.DirectionalLight(0xffffff,3.4); key.position.set(6,10,8); key.castShadow=true; scene.add(key);
  const fill=new THREE.DirectionalLight(0xffc66d,1.2); fill.position.set(-7,5,-5); scene.add(fill);
  const pallet=buildPallet(Number(el.dataset.palletWidth),Number(el.dataset.palletLength)); pallet.rotation.y=-.25; scene.add(pallet);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(8,64),new THREE.ShadowMaterial({color:0x000000,opacity:.18})); floor.rotation.x=-Math.PI/2; floor.position.y=.08; floor.receiveShadow=true; scene.add(floor);
  camera.position.set(10,8,11);
  const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.dampingFactor=.06; controls.target.set(0,.8,0); controls.minDistance=7; controls.maxDistance=18; controls.maxPolarAngle=Math.PI/2.05; controls.autoRotate=true; controls.autoRotateSpeed=.7;
  let interacted=false; controls.addEventListener('start',()=>{interacted=true;controls.autoRotate=false});
  const resize=()=>{const r=el.getBoundingClientRect(); renderer.setSize(r.width,r.height,false); camera.aspect=r.width/r.height; camera.updateProjectionMatrix()}; resize(); new ResizeObserver(resize).observe(el);
  renderer.setAnimationLoop(()=>{controls.update();renderer.render(scene,camera)});
}
document.querySelectorAll('.pallet-canvas').forEach(init);