import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, relative, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { startServer, ROOT } from './serve.mjs';
import { openBrowser } from './browser.mjs';

const report={scope:'Post-cleanup project links, imports, all study routes, evaluated pose continuity, selection, local dependencies and home responsiveness.',links:0,imports:0,missing:[],scenes:[],errors:[],failedRequests:[],retiredRequests:[],linkScopeNote:'Verbatim upstream license snapshots keep their original relative links; they are not local product documentation.'};
async function walk(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(['vendor','assets'].includes(entry.name)&&dir.endsWith('/three'))continue;const p=resolve(dir,entry.name);if(entry.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const files=[resolve(ROOT,'README.md'),resolve(ROOT,'README-STUDY.md'),resolve(ROOT,'README-STUDY-MUSE.md'),resolve(ROOT,'README-STUDY-FORM.md'),resolve(ROOT,'index.html'),...(await walk(resolve(ROOT,'docs'))),...(await walk(resolve(ROOT,'expressions'))),...(await walk(resolve(ROOT,'three'))),...(await walk(resolve(ROOT,'scripts')))];
async function checkLink(file,raw,kind){
 let href=raw.replaceAll('&amp;','&').trim().replace(/^<|>$/g,'');if(!href||/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)||href.includes('${'))return;
 href=decodeURIComponent(href.split(/[?#]/)[0]);if(!href)return;
 report[kind]++;const target=href.startsWith('/')?resolve(ROOT,'.'+href):resolve(dirname(file),href);
 try{await stat(target);}catch{report.missing.push({file:relative(ROOT,file),target:raw,kind});}
}
for(const file of files){const type=extname(file);if(!['.md','.html','.mjs'].includes(type)||file.includes('/assets/licenses/'))continue;const source=await readFile(file,'utf8');
 if(type==='.md')for(const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g))await checkLink(file,match[1],'links');
 if(type==='.md'||type==='.html')for(const match of source.matchAll(/(?:href|src)=["']([^"']+)["']/g))await checkLink(file,match[1],'links');
 if(type==='.mjs')for(const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g))await checkLink(file,match[1],'imports');
}
const {server,url}=await startServer(),browser=await openBrowser();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion:'reduce'});
 page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.failedRequests.push({url:r.url(),status:r.status()});});
 page.on('request',r=>{const p=new URL(r.url()).pathname;if(/^\/(archive|corpus|skills|runtime)\//.test(p))report.retiredRequests.push(p);});
 await page.goto(url);await page.locator('a.card').first().waitFor();
 report.home={viewers:await page.locator('a.card').count(),imagesLoaded:await page.locator('.card img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0))};
 for(const [view,ids]of [['three',['body','arm','hand','leg','foot']],['expressions',['joy','sadness','anger','fear','surprise','disgust','wink','laughter']]]){
  await page.goto(`${url}/${view}/`);await page.waitForFunction(()=>window.atlas);
  for(const id of ids){const result=await page.evaluate(id=>{
   atlas.setStudy(id,false);
   const snapshot=t=>{atlas.seek(t);const mesh=atlas.model.pickingMeshes.find(m=>m.userData.isCollisionSurface);const a=mesh.geometry.attributes.position.array;const normals=atlas.model.character.body.geometry.attributes.normal.array;return{positions:Array.from(a),normals:Array.from(normals),finite:Array.from(a).every(Number.isFinite)&&Array.from(normals).every(Number.isFinite)};};
   const rest=snapshot(0),peak=snapshot(2.5),end=snapshot(5);
   const same=(a,b)=>a.length===b.length&&a.every((n,i)=>n===b[i]);
   atlas.selectPart(atlas.model.parts[0].id);const selected=atlas.state.selected===atlas.model.parts[0].id;atlas.selectPart('');
   return{id,finite:rest.finite&&peak.finite&&end.finite,visibleChange:!same(rest.positions,peak.positions),exactReturn:same(rest.positions,end.positions)&&same(rest.normals,end.normals),selected,cameraFinite:atlas.state.camera.position.every(Number.isFinite)};
  },id);report.scenes.push({view,...result});}
  await page.locator('a[href="../"]').click();await page.locator('a.card').first().waitFor();
 }
 await page.setViewportSize({width:390,height:844});await page.goto(url);report.home.mobileNoOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 report.home.mobileImagesLoaded=await page.locator('.card img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0));
 report.sources={};for(const file of ['index.html','three/index.html','expressions/index.html','three/geometry.mjs','scripts/browser.mjs','scripts/check-project.mjs'])report.sources[file]=createHash('sha256').update(await readFile(resolve(ROOT,file))).digest('hex');
 report.pass=!report.missing.length&&!report.errors.length&&!report.failedRequests.length&&!report.retiredRequests.length&&report.home.viewers===2&&report.home.imagesLoaded&&report.home.mobileNoOverflow&&report.home.mobileImagesLoaded&&report.scenes.length===13&&report.scenes.every(s=>s.finite&&s.visibleChange&&s.exactReturn&&s.selected&&s.cameraFinite);
 await mkdir(resolve(ROOT,'docs/quality'),{recursive:true});await writeFile(resolve(ROOT,'docs/quality/cleanup-checks.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
}finally{await browser.close();await new Promise(r=>server.close(r));}
