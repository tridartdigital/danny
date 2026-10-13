import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
let html=await readFile(new URL('index.html',root),'utf8');
let css=await readFile(new URL('src/style.css',root),'utf8');
for(const match of [...css.matchAll(/url\('\/(assets\/fonts\/[^']+)'\)/g)]){
 const data=await readFile(new URL(match[1],root));
 css=css.replace(match[0],`url('data:font/woff2;base64,${data.toString('base64')}')`);
}
const world=(await readFile(new URL('src/world.js',root),'utf8')).replaceAll('export ','');
let renderer=(await readFile(new URL('src/renderer.js',root),'utf8')).replaceAll('export ','');
for(const name of ['scenes','danny']){
 const image=await readFile(new URL(`assets/art/${name}.png`,root));
 renderer=renderer.replace(`/assets/art/${name}.png`,`data:image/png;base64,${image.toString('base64')}`);
}
const game=(await readFile(new URL('src/game.js',root),'utf8')).replace(/^import .*;\n/gm,'');
html=html.replace('<link rel="stylesheet" href="/src/style.css">',`<style>${css}</style>`)
 .replace('<script type="module" src="/src/game.js"></script>',()=>`<script>\n(()=>{\n${world}\n${renderer}\n${game}\n})();\n</script>`)
 .replace('href="/" aria-label="Danny, início"','href="#" aria-label="Danny, início"');
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/danny.html',root),html);
console.log('Jogo independente criado: dist/danny.html');
