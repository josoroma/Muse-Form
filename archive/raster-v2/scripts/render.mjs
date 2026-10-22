import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {ROOT,startServer} from './serve.mjs';
import {openBrowser,renderFilm} from './film.mjs';
const manifest=JSON.parse(await readFile(resolve(ROOT,'corpus/manifest.json')));
const selection=process.argv.slice(2);const studies=manifest.studies.filter(s=>!selection.length||selection.includes(s.id));
if(!studies.length||selection.some(id=>!manifest.studies.some(s=>s.id===id)))throw new Error('Use known corpus IDs');
const {server,url}=await startServer();const browser=await openBrowser();
try{const queue=[...studies];async function worker(){while(queue.length){const s=queue.shift();console.log(`Rendering ${s.id} — ${s.title}`);await renderFilm({browser,url:`${url}/${s.animated}`,output:resolve(ROOT,s.video)});console.log(`Finished ${s.id}: 7.000s / 210 frames / 1200×900`);}}await Promise.all([worker(),worker()]);}
finally{await browser.close();server.close();}
