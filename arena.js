let playStyle='classic',arenaEnergy=0,rivalEnergy=0,arenaArmed=false;
let arenaRain=null;
const arenaRecovery={player:0,opponent:0};
const characterPowers={
 alex:{name:'Linha perfeita',description:'Golpe reto 18% mais rápido, sem curva.',color:'#fff3c9'},
 rafa:{name:'Bola de fogo',description:'Ataque 45% mais rápido, com rastro de fogo.',color:'#ff6536'},
 lia:{name:'Contra-curva',description:'Inverte a curva escolhida, mantendo o destino.',color:'#cf9eff'},
 maya:{name:'Balão de resistência',description:'Bola lenta e alta; recupera 20 de energia.',color:'#9bffc8'},
 leo:{name:'Zigue-zague',description:'Duas curvas durante o voo, mantendo o destino.',color:'#ffdf79'},
 nina:{name:'Corte tardio',description:'Curva concentrada perto do quique, 12% mais veloz.',color:'#ff9cda'},
 caio:{name:'Impacto',description:'Desequilibra ao ser defendido: a devolução perde 15% de velocidade.',color:'#ffb65c'},
 iris:{name:'Arco técnico',description:'Bola alta com curva controlada e 5% mais velocidade.',color:'#a1edff'}
};
function applyCharacterPower(id,own){
 const power=characterPowers[id];ball.specialName=power.name;ball.specialColor=power.color;ball.power=id;const direction=ball.curve||((own?ball.from:ball.to)<.5?-1:1);
 switch(id){
 case 'alex':ball.speed*=1.18;ball.curve=0;break;
 case 'rafa':ball.speed*=1.45;break;
 case 'lia':ball.curve=-Math.sign(direction)*.95;break;
 case 'maya':ball.speed*=.78;ball.heightFactor=1.55;if(own)arenaEnergy=20;else rivalEnergy=20;break;
 case 'leo':ball.curve=Math.sign(direction)*.9;ball.curveShape='double';break;
 case 'nina':ball.speed*=1.12;ball.curve=Math.sign(direction)*.95;ball.curveShape='late';break;
 case 'caio':ball.speed*=1.12;ball.impact=true;break;
 case 'iris':ball.speed*=1.05;ball.heightFactor=1.25;ball.curve=Math.sign(direction)*.65;break;
 }
}
function arenaImpactReceived(own){if(playStyle!=='arena'||!ball.impact)return false;arenaRecovery[own?'player':'opponent']=.5;ball.impact=false;return true;}
function advanceArenaRecovery(dt){for(const side of ['player','opponent'])arenaRecovery[side]=Math.max(0,arenaRecovery[side]-dt);}
const selectedPlayStyle=()=>document.getElementById('play-style').value==='arena'?'arena':'classic';
function renderArena(){
 const active=playStyle==='arena';document.getElementById('arena-controls').hidden=!active;
 document.getElementById('arena-energy').value=arenaEnergy;document.getElementById('rival-energy').value=rivalEnergy;
 document.getElementById('arena-energy-text').textContent=arenaEnergy+'/100';
 const mode=document.getElementById('arena-power').value;
 document.getElementById('arena-power-info').textContent=mode==='signature'?(characterPowers[playerCharacter]?.description||'Especial próprio do personagem escolhido.')+' O rival também usa seu próprio poder.':'';
 const button=document.getElementById('arena-special');document.getElementById('arena-power').disabled=!!arenaRain||arenaArmed;
 button.disabled=!!musicalDance||!!arenaRain||arenaEnergy<100||state!=='playing'||serving||pointDelay>0;
 button.textContent=arenaRain?'Bolas azuis voltam para você. Defenda! Uma disputa vale um ponto.':arenaArmed?'Especial preparado · cancelar':(document.getElementById('arena-power').value==='rain'?'Chuva de bolas · Espaço':mode==='signature'?(characterPowers[playerCharacter]?.name||'Especial do personagem')+' · Espaço':'Golpe especial · Espaço');button.setAttribute('aria-pressed',String(arenaArmed));
 document.getElementById('arena-hint').textContent=arenaRain?'Bolas azuis voltam para você. Defenda! Uma disputa vale um ponto.':arenaArmed?'Rebata no momento certo para usar o especial.':arenaEnergy===100?'Energia cheia! Ative o especial durante a troca de bola.':(document.getElementById('arena-power').value==='rain'?'Cinco devoluções carregam a Chuva: disputa de 5s, com dois auxiliares. Melhor proporção de defesas ganha um ponto; empate favorece você.':mode==='signature'?'Cinco devoluções carregam o poder do seu personagem. Ative e rebata para usá-lo.':'Cada devolução carrega 20 de energia. O especial acelera a bola em 35%.');
}
function resetArena(){arenaRecovery.player=arenaRecovery.opponent=0;arenaRain=null;playStyle=selectedPlayStyle();arenaEnergy=rivalEnergy=0;arenaArmed=false;renderArena();}
function armArena(){if(musicalDance||arenaRain||playStyle!=='arena'||state!=='playing'||pointDelay>0||serving||arenaEnergy<100)return;arenaArmed=!arenaArmed;renderArena();}
function arenaReturn(own){if(playStyle!=='arena')return;if(own)arenaEnergy=Math.min(100,arenaEnergy+20);else rivalEnergy=Math.min(100,rivalEnergy+20);renderArena();}
function arenaShot(own,isServe=false){
 ball.special=false;ball.impact=false;ball.power=null;ball.heightFactor=1;ball.curveShape=null;ball.specialName='';
 if(playStyle!=='arena'||isServe)return;
 if(own?arenaArmed&&arenaEnergy===100:rivalEnergy===100){
  if(own&&document.getElementById('arena-power').value==='rain'){arenaEnergy=0;arenaArmed=false;startArenaRain();renderArena();return;}
  ball.special=true;ball.speed=own?1:(ball.speed||1);
  const signature=document.getElementById('arena-power').value==='signature';
  if(own){arenaEnergy=0;arenaArmed=false;}else rivalEnergy=0;
  if(signature)applyCharacterPower(own?playerCharacter:opponentCharacter,own);else{ball.speed*=1.35;ball.specialName='Golpe de velocidade';ball.specialColor='#ff8d42';}
  ui.feedback.textContent=(own?'Seu especial: ':'Especial do adversário: ')+ball.specialName+'!';
 }renderArena();
}
function drawArenaTrail(p){if(!ball.special)return;ctx.save();ctx.strokeStyle=ball.specialColor||'#ff8d42';ctx.lineWidth=6*p.scale;ctx.beginPath();ctx.moveTo(p.x,p.y);const previous=Math.max(0,shotProgress()-.08),depth=ball.direction===1?previous:1-previous;const q=firstPersonBallPoint(project(shotX(previous),depth,ballHeight(previous)),depth);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();}
document.getElementById('arena-special').addEventListener('click',armArena);
document.getElementById('play-style').addEventListener('change',()=>{playStyle=selectedPlayStyle();loadBest();updatePoints();renderRanking();});

// Separate five-second contest: ordinary rally physics is suspended.
const rainDifficulty={easy:{interval:.55,limit:5,speed:.85},medium:{interval:.45,limit:6,speed:1},hard:{interval:.4,limit:7,speed:1.1}};
function startArenaRain(){
 const helpers=characters.filter(c=>c.id!==opponentCharacter&&c.id!==playerCharacter).slice(0,2);
 arenaRain={settings:rainDifficulty[difficulty]||rainDifficulty.easy,time:0,spawn:0,balls:[],serial:0,ownSaved:0,ownTotal:0,rivalSaved:0,rivalTotal:0,helpers:helpers.map((c,i)=>({id:c.id,lane:i?7:1,side:i?1:-1,phase:0,hit:0})),leaving:false};
 spawnRainBall(target===null?player:target,laneX(player));swing=0;
 ui.feedback.textContent='Chuva de bolas! Defenda durante cinco segundos.';
}
function spawnRainBall(lane,origin){
 const rain=arenaRain;rain.balls.push({depth:1,origin,landing:laneX(lane),direction:-1,curve:effect*.07*athleteFactor('player','technique'),serial:rain.serial++,bounced:false});
}
function rainBallX(b){const t=Math.min(1,(b.direction===1?b.depth:1-b.depth)/.78);return b.origin+(b.landing-b.origin)*t+b.curve*Math.sin(Math.PI*t);}
function finishArenaRain(){
 const rain=arenaRain;const ownRate=rain.ownTotal?rain.ownSaved/rain.ownTotal:0,rivalRate=rain.rivalTotal?rain.rivalSaved/rain.rivalTotal:0;
 arenaRain=null;swing=0;
 point(ownRate>=rivalRate?1:-1,'Chuva de bolas: você defendeu '+rain.ownSaved+'/'+rain.ownTotal+'; adversários '+rain.rivalSaved+'/'+rain.rivalTotal+'.'+(ownRate===rivalRate?' Empate: vantagem de quem ativou.':''));
}
function advanceArenaRain(dt){
 const rain=arenaRain;if(!rain)return;
 rain.time+=dt;
 const move=(held.has('arrowright')||held.has('d')?1:0)-(held.has('arrowleft')||held.has('a')?1:0);
 advancePlayerMovement(dt);
 playerAnimation=Math.max(0,playerAnimation-dt);opponentAnimation=Math.max(0,opponentAnimation-dt);swing=Math.max(0,swing-dt);
 for(const helper of rain.helpers){helper.phase+=dt*15;helper.hit=Math.max(0,helper.hit-dt);}
 if(rain.time>=5){rain.leaving=true;rain.balls=[];swing=0;if(rain.time>=5.6)finishArenaRain();return;}
 rain.spawn+=dt;
 while(rain.spawn>=rain.settings.interval&&rain.time<3.8){rain.spawn-=rain.settings.interval;if(rain.balls.length<rain.settings.limit){const lane=[1,4,7,2,6,3,5][rain.serial%7];spawnRainBall(lane,laneX(player));}}
 const defenders=[{lane:opponent,main:true},...rain.helpers];
 for(const defender of defenders){
  const incoming=rain.balls.filter(b=>b.direction===-1).sort((a,b)=>Math.abs(a.landing-laneX(defender.lane))-Math.abs(b.landing-laneX(defender.lane)))[0];
  if(incoming){const desired=Math.max(0,Math.min(8,incoming.landing*9-.5)),delta=desired-defender.lane;defender.lane+=Math.sign(delta)*Math.min(Math.abs(delta),difficulties[difficulty].tracking*athleteFactor('opponent','agility')*dt);}
 }
 opponent=defenders[0].lane;
 const remove=new Set();
 for(const b of rain.balls){
  b.depth+=b.direction*rain.settings.speed*athleteFactor(b.direction===-1?'player':'opponent','force')*dt;
  if(!b.bounced&&(b.direction===1?b.depth:1-b.depth)>=.78){b.bounced=true;gameAudio.play('bounce');if(b.landing<0||b.landing>1){if(b.direction===-1){rain.ownTotal++;matchStats.currentSequence=0;}else rain.rivalTotal++;remove.add(b);continue;}musicalBounce(b.landing,b.direction===-1);}
  if(b.direction===-1&&b.depth<=0){
   rain.rivalTotal++;const defender=defenders.reduce((best,d)=>Math.abs(laneX(d.lane)-b.landing)<Math.abs(laneX(best.lane)-b.landing)?d:best);
   if(Math.abs(laneX(defender.lane)-b.landing)<=.085){rain.rivalSaved++;const pose=b.landing<.5?1:2;if(firstPerson())b.cameraContact={...rainDefenderPoint(defender,pose),pose};if(defender.main)opponentPose=pose;else defender.pose=pose;b.playerContact=null;b.direction=1;b.depth=0;b.origin=laneX(defender.lane);b.landing=laneX(Math.max(0,Math.min(8,player+(b.serial%3-1)*1.1)));b.curve=0;b.bounced=false;gameAudio.play('hit');if(defender.main)opponentAnimation=.38;else defender.hit=.38;}else remove.add(b);
  }
 }
 const hittable=rain.balls.filter(b=>!remove.has(b)&&b.direction===1&&b.depth>=.8&&b.depth<=1.12&&Math.abs(laneX(player)-rainBallX(b))<=athleteTolerance('player')).sort((a,b)=>b.depth-a.depth);
 if(swing>0&&hittable.length){const b=hittable[0];if(firstPerson()){playerCameraHit=rainBallPoint(b);b.playerContact={...playerCameraHit};}b.cameraContact=null;rain.ownTotal++;rain.ownSaved++;score++;matchStats.currentSequence++;matchStats.longestSequence=Math.max(matchStats.longestSequence,matchStats.currentSequence);ui.score.textContent=score;updateChallenges();trainReturn(effect,{from:b.origin,to:b.landing});gameAudio.play('hit');playerAnimation=.38;playerPose=effect<0?1:2;swing=0;b.depth=1;b.direction=-1;b.origin=laneX(player);b.landing=gestureAim===null?laneX(target===null?player:target):laneX(gestureAim);gestureAim=null;b.curve=effect*.07*athleteFactor('player','technique');b.bounced=false;}
 for(const b of rain.balls)if(!remove.has(b)&&b.direction===1&&b.depth>1.12){rain.ownTotal++;matchStats.currentSequence=0;remove.add(b);}
 rain.balls=rain.balls.filter(b=>!remove.has(b));
 ui.feedback.textContent='Chuva · '+Math.max(0,5-rain.time).toFixed(1)+'s · Você '+rain.ownSaved+'/'+rain.ownTotal+' · Rivais '+rain.rivalSaved+'/'+rain.rivalTotal;
}
function drawArenaRain(){
 const rain=arenaRain;if(!rain)return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 for(const helper of rain.helpers){
  const p=project(laneX(helper.lane),0),near=viewTop(),size=firstPerson()?288*p.scale:near?155:96;
  const travel=rain.leaving?Math.min(1,(rain.time-5)/.6):1-Math.min(1,rain.time/.6);
  const x=p.x+(helper.side<0?-p.x-size:800-p.x+size)*travel;
  const source=spriteSource(helper.id,opponentUniform,near,rainDefenderPose(helper));
  if(source){ctx.save();ctx.translate(x,p.y+(near?45:-8));drawWalkingSprite(ctx,source,size,{phase:helper.phase,amount:travel>0?.95:.4},reduced);ctx.restore();}
 }
 for(const b of rain.balls)if(b.direction===1&&!rain.leaving){const lane=b.landing*9-.5;polygon([project(lane/9,.55),project((lane+1)/9,.55),project((lane+1)/9,1),project(lane/9,1)],'#a9f2ff18');}
 for(const b of rain.balls){const height=rainBallHeight(b),p=rainBallPoint(b);drawBallShadow(project(rainBallX(b),Math.max(0,Math.min(1,b.depth))),height);ctx.beginPath();ctx.arc(p.x,p.y,12*p.scale,0,Math.PI*2);ctx.fillStyle=b.direction===1?'#a9f2ff':'#ffdb84';ctx.fill();}
 if(rain.balls.some(b=>b.direction===1&&b.depth>=.8&&b.depth<=1.12)){ctx.fillStyle='#a9f2ff';ctx.font='bold 24px system-ui';ctx.textAlign='center';ctx.fillText(hitArrow()+' REBATA',400,firstPerson()?825:viewTop()?115:870);}
 ctx.fillStyle='#ffdb84';ctx.font='bold 22px system-ui';ctx.textAlign='center';ctx.fillText(rain.leaving?'Auxiliares saindo…':'CHUVA · '+Math.max(0,5-rain.time).toFixed(1)+'s · Você '+rain.ownSaved+'/'+rain.ownTotal+' | Rivais '+rain.rivalSaved+'/'+rain.rivalTotal,400,nearRainLabelY());
}
function nearRainLabelY(){return viewTop()?815:115;}
document.getElementById('arena-power').addEventListener('change',renderArena);

function rainDefenderPose(defender){
 const active=defender.main?opponentAnimation>0:defender.hit>0;
 if(active)return defender.main?opponentPose:defender.pose||1;
 if(firstPerson()&&arenaRain){
  const next=arenaRain.balls.filter(b=>b.direction<0&&b.depth<.22&&Math.abs(laneX(defender.lane)-b.landing)<=.085).sort((a,b)=>a.depth-b.depth)[0];
  if(next)return next.landing<.5?1:2;
 }
 return 0;
}
function rainDefenderPoint(defender,pose){
 const p=project(laneX(defender.lane),0);
 return {x:p.x+(pose===1?-66:66),y:p.y-8-120};
}
function rainBallHeight(b){
 const progress=b.direction===1?b.depth:1-b.depth,q=Math.min(1,progress/.78);
 return progress<.78?13+(firstPerson()?75:110)*4*q*(1-q):13+28*Math.sin((progress-.78)/.22*Math.PI/2);
}
function rainBallPoint(b){
 const depth=Math.max(0,Math.min(1,b.depth)),p=project(rainBallX(b),depth,rainBallHeight(b));
 if(!firstPerson())return p;
 let contact,endpoint,weight=0;
 if(b.direction<0&&b.playerContact&&depth>.78){contact=b.playerContact;endpoint=project(b.origin,1,13);weight=Math.pow((depth-.78)/.22,2);}
 else if(b.direction>0&&b.cameraContact&&depth<.5){contact=b.cameraContact;endpoint=project(b.origin,0,13);weight=Math.pow(1-depth/.5,2);}
 else if(b.direction<0&&depth<.22&&arenaRain){
  const defenders=[{lane:opponent,main:true},...arenaRain.helpers];
  const defender=defenders.reduce((best,d)=>Math.abs(laneX(d.lane)-b.landing)<Math.abs(laneX(best.lane)-b.landing)?d:best);
  if(Math.abs(laneX(defender.lane)-b.landing)<=.085){contact=rainDefenderPoint(defender,b.landing<.5?1:2);endpoint=project(b.landing,0,41);weight=Math.pow(1-depth/.22,2);}
 }
 return contact?{...p,x:p.x+(contact.x-endpoint.x)*weight,y:p.y+(contact.y-endpoint.y)*weight}:p;
}
