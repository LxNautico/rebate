// Attract screen has its own clock and never touches match state or results.
let presentationTime=0,presentationPair=-1;
function presentationVisible(){return state==='ready'&&!document.hidden&&document.getElementById('character-setup').hidden&&document.getElementById('guided-tour').hidden&&ui.overlay.hidden;}
function drawPresentation(dt){
 const caption=document.getElementById('presentation-caption');caption.hidden=!presentationVisible();if(caption.hidden)return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced)presentationTime+=dt;
 const pair=Math.floor(presentationTime/8)%4,local=presentationTime%8,ids=[[ 'alex','rafa'],['lia','maya'],['leo','nina'],['caio','iris']][pair];
 if(pair!==presentationPair){caption.textContent='Apresentação · '+characters.find(c=>c.id===ids[0]).name+' × '+characters.find(c=>c.id===ids[1]).name+' · Clique em Jogar';presentationPair=pair;}
 const interval=.95,shot=Math.floor(local/interval),progress=(local%interval)/interval,direction=shot%2?1:-1;
 const lane=n=>1+((n*5+pair*2)%7),from=lane(shot),to=lane(shot+1),curve=shot%3-1;
 const t=Math.min(1,progress/.78),x=laneX(from)+(laneX(to)-laneX(from))*t+curve*.08*Math.sin(Math.PI*t),depth=direction===1?progress:1-progress;
 const landing=laneX(to),height=progress<=.78?13+120*4*(progress/.78)*(1-progress/.78):13+28*Math.sin((progress-.78)/.22*Math.PI/2);
 const farLane=direction===1?from:from+(to-from)*Math.min(1,progress*1.8),nearLane=direction===-1?from:from+(to-from)*Math.min(1,progress*1.8);
 function actor(id,lane,own){
  const near=isTopSide()?!own:own,position=project(laneX(lane),own?1:0),size=near?155:96;
  const source=spriteSource(id,own?'blue':'red',near,progress<.2?(curve<0?1:2):0);if(!source)return;
  ctx.save();ctx.translate(Math.max(size/2+8,Math.min(800-size/2-8,position.x)),near?884:176);
  drawWalkingSprite(ctx,source,size,{phase:presentationTime*15,amount:Math.abs(to-from)>0?.65:0},reduced);ctx.restore();
 }
 function demoBall(){const p=project(x,depth,height);ctx.beginPath();ctx.arc(p.x,p.y,13*p.scale,0,Math.PI*2);ctx.fillStyle=shot%4===3?'#ff984b':'#fff2bc';ctx.fill();}
 if(isTopSide()){actor(ids[0],nearLane,true);if(depth>=.5)demoBall();net();actor(ids[1],farLane,false);if(depth<.5)demoBall();}else{actor(ids[1],farLane,false);if(depth<.5)demoBall();net();actor(ids[0],nearLane,true);if(depth>=.5)demoBall();}
 const q=project(landing,direction===1?1:0);ctx.beginPath();ctx.ellipse(q.x,q.y,16,6,0,0,Math.PI*2);ctx.strokeStyle='#ffdb84';ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='#ffdb84';ctx.font='bold 20px system-ui';ctx.textAlign='center';ctx.fillText('REBATE! · APRESENTAÇÃO',400,115);
}
