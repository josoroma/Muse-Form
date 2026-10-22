/** Absolute-time, pinned illustration motion. Source pixels remain editable as a plate;
 * joint regions are authored separately. This is a restrained cinemagraph, not 3D. */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const DURATION = 7;
export function beat(t, delay = 0) {
  t = clamp(t - delay, 0, 7);
  if (t < .8) return 0;
  if (t < 1.4) return -.13 * smooth((t - .8) / .6);
  if (t < 3.2) return -.13 + 1.13 * smooth((t - 1.4) / 1.8);
  if (t < 4.1) return 1;
  if (t < 6.1) return 1 - smooth((t - 4.1) / 2);
  return 0;
}
const VERTEX = `
attribute vec2 position;
varying vec2 vUV;
uniform vec4 regions[12];
uniform vec4 actions[12];
uniform vec2 pivots[12];
uniform vec4 pins[8];
uniform vec2 fit;
uniform vec2 planeSize;
uniform float count;
uniform float pinCount;
void main(){
  vec2 p=position;
  vec2 d=vec2(0.0);
  for(int i=0;i<12;i++){
    if(float(i)>=count)break;
    vec4 r=regions[i];
    float distance=length((p-r.xy)/r.zw);
    float weight=1.0-smoothstep(0.45,1.0,distance);
    vec4 a=actions[i];
    float c=cos(a.z),s=sin(a.z);
    vec2 local=(p-pivots[i])*planeSize;
    vec2 rotated=(vec2(c*local.x-s*local.y,s*local.x+c*local.y)-local)/planeSize;
    d+=(a.xy+rotated)*weight;
  }
  float support=1.0;
  for(int i=0;i<8;i++){
    if(float(i)>=pinCount)break;
    float distance=length((p-pins[i].xy)/pins[i].zw);
    support*=smoothstep(0.18,1.0,distance);
  }
  p+=d*support;
  vUV=position;
  gl_Position=vec4((p.x*2.0-1.0)*fit.x,(1.0-p.y*2.0)*fit.y,0.0,1.0);
}`;
const FRAGMENT = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D plate;
uniform vec4 light;
uniform vec2 lightRadius;
void main(){
  vec4 color=texture2D(plate,vUV);
  float l=1.0-smoothstep(0.0,1.0,length((vUV-light.xy)/lightRadius));
  color.rgb*=1.0+light.z*l;
  gl_FragColor=color;
}`;
function shader(gl, type, source) {
  const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
export async function createAtelier({ canvas, imageUrl, config, width = 1200, height = 900 }) {
  canvas.width = width; canvas.height = height;
  const img = new Image(); img.src = imageUrl; await img.decode();
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true, depth: false });
  if (!gl) throw new Error('This animation needs WebGL. The still image and MP4 remain available.');
  const vertex = shader(gl, gl.VERTEX_SHADER, VERTEX), fragment = shader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const points = [], nx = 120, ny = 90;
  for (let y=0;y<ny;y++) for(let x=0;x<nx;x++) {
    const a=x/nx,b=y/ny,c=(x+1)/nx,d=(y+1)/ny;
    points.push(a,b,c,b,a,d,c,b,c,d,a,d);
  }
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
  const attr=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  const loc = Object.fromEntries(['regions','actions','pivots','pins','fit','planeSize','count','pinCount','light','lightRadius'].map(name=>[name,gl.getUniformLocation(program,name)]));
  const tracks=config.regions || [], pinList=config.pins || [];
  if(tracks.length>12||pinList.length>8)throw new Error('Too many authored motion regions');
  const regions=new Float32Array(48),actions=new Float32Array(48),pivots=new Float32Array(24),pins=new Float32Array(32);
  tracks.forEach((r,i)=>{ regions.set([...r.center,...r.radius],i*4);pivots.set(r.pivot || r.center,i*2); });
  pinList.forEach((p,i)=>pins.set([...p.center,...p.radius],i*4));
  gl.uniform4fv(loc.regions,regions);gl.uniform2fv(loc.pivots,pivots);gl.uniform4fv(loc.pins,pins);
  gl.uniform1f(loc.count,tracks.length);gl.uniform1f(loc.pinCount,pinList.length);
  const sourceAspect=img.naturalWidth/img.naturalHeight, targetAspect=width/height;
  const fitX=Math.min(1,sourceAspect/targetAspect),fitY=Math.min(1,targetAspect/sourceAspect);
  gl.uniform2f(loc.fit,fitX,fitY);gl.uniform2f(loc.planeSize,width*fitX,height*fitY);
  gl.viewport(0,0,width,height); gl.clearColor(.945,.929,.89,1);
  let lost=false;
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;});
  function seek(seconds) {
    if(lost)throw new Error('Rendering context lost. Reload to restore playback.');
    const t=clamp(Number(seconds)||0,0,7);
    tracks.forEach((r,i)=>{
      const v=r.phase==='breath' ? (1-Math.cos(2*Math.PI*t/7))*.5 : beat(t,r.delay || 0);
      const translate=r.translate || [0,0];
      actions.set([translate[0]/(1200*fitX)*v,translate[1]/(900*fitY)*v,(r.rotate || 0)*Math.PI/180*v,0],i*4);
    });
    gl.uniform4fv(loc.actions,actions);
    const light=config.light || {center:[.5,.5],radius:[.3,.3],strength:0};
    gl.uniform4f(loc.light,...light.center,(light.strength || 0)*beat(t),0);gl.uniform2f(loc.lightRadius,...light.radius);
    gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,points.length/2);gl.finish();
  }
  seek(0);
  return {seek, width, height, config, destroy(){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}
