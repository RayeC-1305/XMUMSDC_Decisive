// Package the reviewed web presentation as one directly openable HTML file.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
const assetPath=src=>path.join(dist,src.replace(/^\//,''));
let html=await fs.readFile(path.join(dist,'index.html'),'utf8');
for(const match of [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)]){
 const js=await fs.readFile(assetPath(match[1]),'utf8');
 html=html.replace(match[0],()=>'<script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script>');
}
for(const match of [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)]){
 const src=match[0].match(/href="([^"]+)"/)?.[1];
 let css=await fs.readFile(assetPath(src),'utf8');
 for(const font of [...css.matchAll(/url\(["']?(\/fonts\/[^)"']+)["']?\)/g)]){
  const bytes=await fs.readFile(assetPath(font[1]));
  css=css.replace(font[0],`url("data:font/ttf;base64,${bytes.toString('base64')}")`);
 }
 html=html.replace(match[0],()=>'<style>'+css+'</style>');
}
const icon=await fs.readFile(path.join(root,'public/nexus-mark.svg'));
html=html.replace('href="/nexus-mark.svg"','href="data:image/svg+xml;base64,'+icon.toString('base64')+'"');
html=html.replace(/<title>.*?<\/title>/,'<title>Nexus — Seven-minute demo video presentation</title>');
if(/<(?:script|link)\b[^>]*(?:src|href)="\/(?:assets|fonts)\//.test(html))throw Error('Unbundled presentation dependency');
if(/https?:\/\/(?:localhost|127\.0\.0\.1)/i.test(html))throw Error('Localhost URL in standalone artifact');
const output=path.resolve(root,'../../submission/SDC2026_Decisive_DemoVideo.html');
await fs.writeFile(output,html);
await fs.writeFile(path.join(dist,'index.html'),html);
console.log(`Standalone video HTML: ${path.relative(process.cwd(),output)} (${Buffer.byteLength(html)} bytes)`);
