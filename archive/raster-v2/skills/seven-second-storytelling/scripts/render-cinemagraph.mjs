import {mkdir,access,readFile} from 'node:fs/promises';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,relative,extname} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
export async function openBrowser() {
  let playwright;
  try { playwright = await import('playwright-core'); }
  catch {
    try { playwright = createRequire(resolve(process.cwd(), 'package.json'))('playwright-core'); }
    catch { throw new Error('Install the pinned playwright-core version in the current project before rendering. See the skill motion reference.'); }
  }
  const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`].filter(Boolean);
  let executablePath;
  for (const path of candidates) { try { await access(path); executablePath = path; break; } catch {} }
  if (!executablePath) throw new Error('Chrome/Chromium not found. Set CHROME_PATH to an installed browser executable.');
  return playwright.chromium.launch({ executablePath, headless: true });
}


export async function mountFilm(browser,url){
 const page=await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
 const diagnostics=[];page.on('pageerror',e=>diagnostics.push(e.message));page.filmDiagnostics=diagnostics;
 await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(url).origin?route.continue():route.abort());
 await page.goto(url+'?render=1');await page.waitForFunction(()=>window.sceneReady||window.sceneError);
 const error=await page.evaluate(()=>window.sceneError);if(error){await page.close();throw new Error(error);}
 return page;
}
export async function frame(page,time){
 const data=await page.evaluate(t=>{window.seek(t);return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},time);
 if(page.filmDiagnostics.length)throw new Error(page.filmDiagnostics.join('; '));
 return Buffer.from(data,'base64');
}
export async function renderFilm({browser,url,output}){
 const page=await mountFilm(browser,url);await mkdir(dirname(output),{recursive:true});
 const encoder=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','30','-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-frames:v','210','-movflags','+faststart',output],{stdio:['pipe','ignore','pipe']});
 let errorText='',pipeError;encoder.stderr.on('data',v=>errorText+=v);encoder.stdin.on('error',e=>pipeError=e);
 const done=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('close',code=>code===0?resolve():reject(new Error(errorText)));});done.catch(()=>{});
 try{for(let n=0;n<210;n++){if(pipeError)throw pipeError;const png=await frame(page,n/30);if(!encoder.stdin.write(png))await once(encoder.stdin,'drain');}encoder.stdin.end();await done;}
 catch(e){encoder.kill();throw e;}finally{await page.close();}
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const [input,output,...rest]=process.argv.slice(2);
 if(!input||!output)throw new Error('Usage: node render-cinemagraph.mjs scene.html film.mp4 [asset-root]');
 const file=resolve(input),root=rest[0]?resolve(rest[0]):resolve(dirname(file),'../..');
 const mime={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png'};
 const server=http.createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(relative(root,path).startsWith('..')){res.writeHead(403).end();return;}const bytes=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404).end();}});
 await new Promise(done=>server.listen(0,'127.0.0.1',done));const browser=await openBrowser();
 try{await renderFilm({browser,url:`http://127.0.0.1:${server.address().port}/${relative(root,file).split('/').map(encodeURIComponent).join('/')}`,output:resolve(output)});console.log('Rendered 7.000 seconds / 210 frames / 1200 × 900');}
 finally{await browser.close();server.close();}
}
