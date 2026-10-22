import {createAtelier} from './atelier.mjs';
const config=JSON.parse(document.getElementById('scene-config').textContent);
const canvas=document.querySelector('canvas');
const render=new URL(location.href).searchParams.has('render');
if(render)document.body.classList.add('render');
let time=0,playing=false,last,raf;
try{
 const scene=await createAtelier({canvas,imageUrl:config.imageUrl,config});
 window.seek=t=>{time=Math.max(0,Math.min(7,t));scene.seek(time);document.querySelector('input').value=time;};
 window.scene=scene;window.sceneReady=true;
 function play(value){playing=value;cancelAnimationFrame(raf);last=undefined;document.querySelector('button').textContent=playing?'Pause':'Play';if(playing)raf=requestAnimationFrame(tick);}
 function tick(now){if(!playing)return;if(last!==undefined)window.seek((time+Math.min((now-last)/1000,.1))%7);last=now;raf=requestAnimationFrame(tick);}
 document.querySelector('button').onclick=()=>play(!playing);
 document.querySelector('input').oninput=e=>{play(false);window.seek(Number(e.target.value));};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)play(false);});
 document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===document.body){e.preventDefault();play(!playing);}});
}catch(error){document.querySelector('#error').textContent=error.message;window.sceneError=error.message;}
