// Original painted backgrounds and illustrated walk cycle, composited in Canvas.
const SCENE_URL='/assets/art/scenes.png';
const ACTOR_URL='/assets/art/danny.png';
export function createRenderer(ctx,W,H){
 const atlas=new Image(),actor=new Image();
 let frames=[],ready=false;
 const random=(n)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
 const motes=Array.from({length:90},(_,i)=>({x:random(i)*W,y:random(i+100)*H,s:.35+random(i+200)}));
 const load=(img,url)=>new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Não foi possível carregar '+url));img.src=url;});
 async function loadAssets(){
  await Promise.all([load(atlas,SCENE_URL),load(actor,ACTOR_URL)]);
  // Trim transparent margins at runtime; keep a common scale and baseline for the animation.
  const scan=document.createElement('canvas');scan.width=actor.width;scan.height=actor.height;
  const sc=scan.getContext('2d',{willReadFrequently:true});sc.drawImage(actor,0,0);
  const pixels=sc.getImageData(0,0,scan.width,scan.height).data,cw=actor.width/4;
  frames=Array.from({length:4},(_,i)=>{let minX=actor.width,minY=actor.height,maxX=0,maxY=0;
   for(let y=0;y<actor.height;y++)for(let x=Math.ceil(i*cw);x<Math.floor((i+1)*cw);x++){
    if(pixels[(y*actor.width+x)*4+3]>35){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
   }
   if(maxX<minX)return {x:i*cw,y:0,w:cw,h:actor.height};
   return {x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
  });ready=true;
 }
 function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
 function path(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
 function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
 function drawActor(x,ground,face,moving,t,light){
  const f=frames[moving?Math.floor(t*7)%4:1],scale=195/Math.max(...frames.map(f=>f.h));
  const width=f.w*scale,height=f.h*scale,bob=moving?Math.sin(t*14)*1.3:Math.sin(t*1.3)*.5;
  ellipse(x+3,ground+3,43,6,'#00000065');
  ctx.save();ctx.translate(x,ground+bob);ctx.scale(face,1);
  ctx.drawImage(actor,f.x,f.y,f.w,f.h,-width/2,-height,width,height);ctx.restore();
  if(light){const lx=x+face*57,ly=ground-125+bob;
   ctx.save();ctx.globalCompositeOperation='screen';
   const beam=ctx.createRadialGradient(lx,ly,0,lx,ly,350);beam.addColorStop(0,'#f4e2b147');beam.addColorStop(.5,'#eadbb31c');beam.addColorStop(1,'#eadbb300');ctx.fillStyle=beam;
   ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+face*350,ly-115);ctx.quadraticCurveTo(lx+face*390,ly,lx+face*350,ly+120);ctx.closePath();ctx.fill();glow(lx,ly,26,'#fff1cf28');ctx.restore();
  }
 }
 function drawShadow(x,ground,t){
  const sway=Math.sin(t*1.7)*5;ctx.save();ctx.translate(x,ground);ctx.rotate(sway*.0015);
  ellipse(0,3,45,7,'#00000060');
  glow(0,-98,96,'#0c100ed0');
  // A long human silhouette, broken up at the edges by drifting strands.
  ctx.fillStyle='#0b0e0cdf';ctx.beginPath();ctx.moveTo(-11,-176);ctx.bezierCurveTo(-26,-172,-20,-151,-14,-143);ctx.bezierCurveTo(-37,-134,-24,-99,-40,-62);ctx.lineTo(-29,-54);ctx.lineTo(-16,-107);ctx.lineTo(-13,-59);ctx.lineTo(-24,-4);ctx.lineTo(-10,0);ctx.lineTo(2,-52);ctx.lineTo(15,-1);ctx.lineTo(31,-2);ctx.lineTo(17,-64);ctx.lineTo(20,-110);ctx.lineTo(35,-63);ctx.lineTo(44,-67);ctx.bezierCurveTo(30,-94,36,-130,12,-145);ctx.bezierCurveTo(29,-163,16,-185,-11,-176);ctx.fill();
  ctx.strokeStyle='#6c756017';ctx.lineWidth=1;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(-20+i*5,-137);ctx.quadraticCurveTo(sway*3+i*4-15,-95,-25+i*7,-20+Math.sin(t+i)*10);ctx.stroke();}
  ellipse(-3,-163,1.5,1,'#c7c2a49a');ellipse(5,-163,1.5,1,'#c7c2a49a');ctx.restore();
 }
 function paper(x,y,seal,t){
  glow(x,y,42,'#dfcf9e1c');ctx.save();ctx.translate(x,y);ctx.rotate(-.14);
  ctx.fillStyle='#17150f88';ctx.fillRect(-15,-10,32,23);ctx.fillStyle=seal?'#8e886b':'#c8bea0';ctx.fillRect(-16,-12,29,20);ctx.fillStyle='#49493688';for(let i=0;i<4;i++)ctx.fillRect(-11,-7+i*3,16-(i%2)*3,1);ctx.restore();
  ctx.globalAlpha=.5+Math.sin(t*2)*.18;ctx.strokeStyle='#e1d4b5';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y-37,5,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
 }
 function foreground(zone,x,t){
  const shift=(x-640)*-.017;ctx.save();ctx.translate(shift,0);
  const floor=ctx.createLinearGradient(0,H*.88,0,H);floor.addColorStop(0,'#05070600');floor.addColorStop(1,'#030504');ctx.fillStyle=floor;ctx.fillRect(-40,H*.86,W+80,H*.14);
  if(zone===0){
   ctx.strokeStyle='#080c0bd9';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-35,H-42);ctx.bezierCurveTo(30,H-35,90,H-15,164,H-48);ctx.stroke();
   for(const px of [-3,165,1218]){ctx.fillStyle='#070b09';ctx.fillRect(px,H-155,9,155);ellipse(px+4,H-155,8,4,'#080c0b');}
   ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(165,H-117);ctx.quadraticCurveTo(78,H-62,-10,H-117);ctx.moveTo(1218,H-115);ctx.quadraticCurveTo(1260,H-80,1320,H-104);ctx.stroke();
  }else{
   // Near-camera shelves and a chair occupy only the edges, leaving the route legible.
   ctx.fillStyle='#050706f2';ctx.fillRect(-7,0,22,H);ctx.fillRect(-7,0,75,21);ctx.fillRect(W-21,0,34,H);
   ctx.save();ctx.translate(87,H-28);ctx.rotate(-.075);ctx.fillRect(-21,-109,7,112);ctx.fillRect(21,-109,7,112);ctx.fillRect(-21,-109,49,9);ctx.fillRect(-21,-77,49,7);ctx.fillRect(-29,-27,66,9);ctx.fillRect(-24,-20,6,26);ctx.fillRect(28,-20,6,26);ctx.restore();
   path([[W-180,H],[W-158,H-25],[W-117,H-39],[W-95,H-28],[W-66,H-75],[W-18,H-68],[W+20,H]],'#040605');
  }
  ctx.restore();
 }
 function draw({state,started,t,face,moving,shadow}){
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#121512';ctx.fillRect(0,0,W,H);if(!ready)return;
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const zone=started?state.zone:0,sw=atlas.width/2,sh=atlas.height/2;
  ctx.drawImage(atlas,(zone%2)*sw,Math.floor(zone/2)*sh,sw,sh,0,0,W,H);
  // Preserve the painted scene's local light instead of applying a uniform darkness filter.
  const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#03070655');shade.addColorStop(.35,'#00000000');shade.addColorStop(.77,'#00000000');shade.addColorStop(1,'#03060570');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  const ground=H*[.87,.88,.90,.90][zone];
  if(zone===0){ctx.save();ctx.strokeStyle='#c3d0cc38';ctx.lineWidth=.65;ctx.beginPath();for(const r of motes){const xx=(r.x-t*45*r.s+W*100)%W,yy=(r.y+t*260*r.s)%H;ctx.moveTo(xx,yy);ctx.lineTo(xx-7,yy+23*r.s);}ctx.stroke();ctx.restore();}
  else {const lightX=[0,620,315,1080][zone];glow(lightX,260,240,zone===3?'#a14d2420':'#d2b97414');}
  if(started){if(zone>0)drawShadow(shadow,ground,t);paper(zone===0?470:[0,610,520,460][zone],ground-15,state.seals.includes(['','cbs','ibs','is'][zone]),t);}
  drawActor(started?state.x:970,ground,started?face:-1,started&&moving,t,state.light);
  for(let i=0;i<4;i++){ctx.save();ctx.translate(((t*12+i*360)%(W+440))-220,ground-14+i*19);ctx.scale(1,.12);glow(0,0,240,'#c2c2ac13');ctx.restore();}
  if(zone>0){ctx.fillStyle='#e2d3b566';for(let i=0;i<30;i++){const p=motes[i];const xx=(p.x+Math.sin(t*.3+i)*12)%W,yy=(p.y+t*3*p.s)%H;ctx.globalAlpha=.2+Math.sin(t+i)*.12;ctx.fillRect(xx,yy,p.s,p.s);}ctx.globalAlpha=1;}
  foreground(zone,started?state.x:640,t);
  if(started){ctx.font='9px Georgia';ctx.fillStyle='#d5c8a599';ctx.textAlign='center';if(state.zone>0)ctx.fillText('‹  VOLTAR',70,ground-53);ctx.fillText(zone===3?'SAÍDA  ›':'PASSAGEM  ›',1190,ground-53);ctx.textAlign='left';
   if(state.health<35){const red=ctx.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,W*.6);red.addColorStop(0,'transparent');red.addColorStop(1,`rgba(117,31,24,${.23+Math.sin(t*3)*.05})`);ctx.fillStyle=red;ctx.fillRect(0,0,W,H);}
  }
 }
 return {loadAssets,draw};
}
