import fs from 'node:fs/promises';
const root='output/pitch';
const cssUrl='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@600;700&display=swap';
let css=await(await fetch(cssUrl)).text();
const urls=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
const sources=[];
for(let i=0;i<urls.length;i++){
 const res=await fetch(urls[i]);if(!res.ok) throw new Error('Font download failed '+res.status);
 const bytes=Buffer.from(await res.arrayBuffer());
 await fs.writeFile(`${root}/font-${i}.ttf`,bytes);
 css=css.replaceAll(urls[i],`data:font/ttf;base64,${bytes.toString('base64')}`);
 sources.push({url:urls[i],file:`font-${i}.ttf`,bytes:bytes.length});
}
await fs.writeFile(`${root}/fonts.css`,css);
await fs.writeFile(`${root}/font-sources.json`,JSON.stringify({cssUrl,downloadedAt:new Date().toISOString(),externalRuntimeDependency:false,sources},null,2));
console.log('Embedded '+sources.length+' font faces.');
