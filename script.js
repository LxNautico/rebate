const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = Object.fromEntries(['overlay','title','message','start','pause','score','best','status','target','feedback'].map(id => [id, document.getElementById(id)]));

let state='ready', player=4, opponent=4, score=0, best=0, ball, wait=0, aiDelay=0, lastTime, target=null, swing=0, effect=0, gesture=null;
const held=new Set();
let pointReaction=null;
let gestureAim=null, bounceFlash=0, bounceSpot=null;
const characters=[{id:'alex',name:'Alex',file:'atletas-sprites.png'},{id:'rafa',name:'Rafa',file:'rafa-sprites.png'},{id:'lia',name:'Lia',file:'lia-sprites.png'},{id:'maya',name:'Maya',file:'maya-sprites.png'},{id:'leo',name:'Léo',rows:5},{id:'nina',name:'Nina',rows:5},{id:'caio',name:'Caio',rows:5},{id:'iris',name:'Íris',rows:5}];
const uniformColors=['blue','red','green','purple','white'];
let playerUniform='blue',opponentUniform='red';
function selectedUniform(value,fallback='blue'){return uniformColors.includes(value)?value:fallback;}
const uniformImages={};
for(const character of characters){const img=new Image();uniformImages[character.id]=img;img.onload=updateCharacterPreviews;img.src='img/'+character.id+'-uniforms.png';}
const whiteImages={};
for(const character of characters.filter(c=>!c.rows)){const img=new Image();whiteImages[character.id]=img;img.onload=updateCharacterPreviews;img.src='img/'+character.id+'-white.png';}
function spriteSource(id,color,near,pose){
 const character=characters.find(c=>c.id===id);if(!character)return null;
 const column=pose+(near?0:3);
 if(color==='white'&&!character.rows){const img=whiteImages[id];if(img&&img.complete&&img.naturalWidth){const layout=WHITE_LAYOUT[id];return {mask:WHITE_MASKS[id][column],img,x:column*img.naturalWidth/6,y:layout.y,w:img.naturalWidth/6,h:layout.h,fit:true};}return null;}
 const img=uniformImages[id],rows=character.rows||4,row=uniformColors.indexOf(color);
 if(img&&img.complete&&img.naturalWidth&&row>=0&&row<rows&&SPRITE_FRAMES[id])return {...SPRITE_FRAMES[id][row*6+column],mask:UNIFORM_MASKS[id][row*6+column],img};
 if(img&&img.complete&&img.naturalWidth&&row>=0&&row<rows)return {mask:UNIFORM_MASKS[id][row*6+column],img,x:column*img.naturalWidth/6,y:row*img.naturalHeight/rows,w:img.naturalWidth/6,h:img.naturalHeight/rows};
 const original=characterImages[id];if(original&&original.complete&&original.naturalWidth)return {img:original,x:pose*original.naturalWidth/3,y:near?0:original.naturalHeight/2,w:original.naturalWidth/3,h:original.naturalHeight/2};return null;
}
const characterImages={};let playerCharacter='',opponentCharacter='alex';
for(const character of characters.filter(c=>c.file)){const img=new Image();characterImages[character.id]=img;img.onload=updateCharacterPreviews;img.src='img/'+character.file;}
function selectedCharacter(id){return characters.some(c=>c.id===id)?id:'alex';}
function drawSprite(context,source,x,y,width,height){if(source.fit){const scale=Math.min(width/source.w,height/source.h);const fittedWidth=source.w*scale,fittedHeight=source.h*scale;x+=(width-fittedWidth)/2;y+=height-fittedHeight;width=fittedWidth;height=fittedHeight;}context.save();if(source.mask){context.beginPath();source.mask.forEach((p,i)=>{const px=x+p[0]*width,py=y+p[1]*height;i?context.lineTo(px,py):context.moveTo(px,py);});context.closePath();context.clip();}context.drawImage(source.img,source.x,source.y,source.w,source.h,x,y,width,height);context.restore();}
function updateCharacterPreviews(){for(const side of ['player','opponent']){const value=document.getElementById(side+'-character').value;const info=document.getElementById(side+'-style');const style=characterStyles[value];info.textContent=style?style.label+' · '+style.description+(side==='player'?' Você controla seus golpes livremente.':''):(value==='random'?'O estilo será revelado ao começar.':'Escolha para conhecer o estilo.');if(athleteBase[value]){const attributes=athleteValues(value,side==='player');info.textContent+=' Força '+attributes.force+' · Agilidade '+attributes.agility+' · Técnica '+attributes.technique+'.';}const preview=document.getElementById(side+'-preview');const c=preview.getContext('2d');c.clearRect(0,0,160,160);if(!value||value==='random'){c.fillStyle='#ffdb84';c.font=value==='random'?'bold 45px system-ui':'bold 22px system-ui';c.textAlign='center';c.fillText(value==='random'?'?':'Escolha',80,100);continue;}const color=selectedUniform(document.getElementById(side+'-uniform').value,side==='player'?'blue':'red');const source=spriteSource(selectedCharacter(value),color,side==='player',0);if(source)drawSprite(c,source,0,0,160,160);}document.getElementById('uniform-warning').hidden=document.getElementById('player-uniform').value!==document.getElementById('opponent-uniform').value;const valid=characters.some(c=>c.id===document.getElementById('player-character').value);document.getElementById('setup-play').disabled=!valid;document.getElementById('setup-play').textContent=valid?'Entrar na mesa':'Escolha seu personagem para jogar';}
function setupCharacters(){try{const saved=JSON.parse(localStorage.getItem('ping-pong-characters')||'null');if(saved){document.getElementById('player-character').value=characters.some(c=>c.id===saved.player)?saved.player:'';document.getElementById('opponent-character').value=saved.opponent==='random'?'random':selectedCharacter(saved.opponent);document.getElementById('player-uniform').value=selectedUniform(saved.playerUniform);document.getElementById('opponent-uniform').value=selectedUniform(saved.opponentUniform,'red');}}catch{}for(const side of ['player','opponent'])for(const type of ['character','uniform'])document.getElementById(side+'-'+type).addEventListener('change',()=>{try{localStorage.setItem('ping-pong-characters',JSON.stringify({player:document.getElementById('player-character').value,opponent:document.getElementById('opponent-character').value,playerUniform:document.getElementById('player-uniform').value,opponentUniform:document.getElementById('opponent-uniform').value}));}catch{}updateCharacterPreviews();});updateCharacterPreviews();}
function lockCharacters(locked){document.getElementById('camera-view').disabled=locked;document.getElementById('arena-musical').disabled=locked;document.getElementById('play-style').disabled=locked;document.getElementById('cup-country').disabled=locked;document.getElementById('table-side').disabled=locked;document.getElementById('court-theme').disabled=locked;document.getElementById('competition').disabled=locked;for(const side of ['player','opponent'])for(const type of ['character','uniform'])document.getElementById(side+'-'+type).disabled=locked;}
setupCharacters();
let playerPose=0, opponentPose=0, playerAnimation=0, opponentAnimation=0;

const difficulties={easy:{reaction:.48,tracking:2.7,prediction:.2},medium:{reaction:.32,tracking:3.6,prediction:.5},hard:{reaction:.2,tracking:4.6,prediction:.75}};
let matchMode='sets',playerSets=0,opponentSets=0,setNumber=1,setEnding=false;
let difficulty='easy', pointDelay=0, pointMessage='', matchEnding=false;
function recordKey(){return 'ping-pong-sets-v3-'+matchMode+'-'+difficulty+(playStyle==='arena'?'-arena':'');}
function loadBest(){best=0;try{best=Number(localStorage.getItem(recordKey()))||0;}catch{}ui.best.textContent=best;}

let serving=false, server=1, rallies=0, playerPoints=0, opponentPoints=0, aiTarget=4, aiSpeed=3.1, serveWindup=0;
loadBest();
ui.best.textContent=best;
const randomLane=()=>Math.floor(Math.random()*9);
const laneX=lane=>(lane+.5)/9;
// Logical depth: 0 at the opponent, 1 at the player.
function project(x,depth,height=0){if(firstPerson())return firstPersonProjection(x,depth,height);if(viewTop())depth=1-depth;const scale=.48+.52*depth;return {x:400+(x-.5)*(330+370*depth),y:170+560*depth-height*scale,scale};}
function polygon(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke();}}
function line(a,b,color,width=2){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function chooseLane(position){if(state!=='playing'||musicalDance)return;player=Math.max(0,Math.min(8,position));}
function selectTarget(value){gestureAim=null;if(state!=='playing')return;target=value;ui.target.textContent=target===null?'Reto':target+1;document.querySelectorAll('[data-target]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.target)===target)));}
function start(){document.getElementById('presentation-caption').hidden=true;if(!document.getElementById('guided-tour').hidden)closeTour();pointReaction=null;resetCharacterMotion();resetOpponentStyle();ui.overlay.dataset.result='';document.getElementById('pause-actions').hidden=true;if(!characters.some(c=>c.id===document.getElementById('player-character').value)){openCharacterSetup();return;}prepareTournament();prepareWorldCup();applyCamera();resetArena();applyTableSide();document.getElementById('leave-cup').hidden=true;document.getElementById('leave-tournament').hidden=true;document.getElementById('character-setup').hidden=true;document.getElementById('return-match').hidden=true;resetMatchStats();document.getElementById('match-results').hidden=true;document.getElementById('change-character').hidden=true;gameAudio.unlock();playerUniform=selectedUniform(document.getElementById('player-uniform').value);opponentUniform=selectedUniform(document.getElementById('opponent-uniform').value,'red');playerCharacter=selectedCharacter(document.getElementById('player-character').value);const rival=document.getElementById('opponent-character').value;const candidates=characters.filter(c=>c.id!==playerCharacter);opponentCharacter=rival==='random'?candidates[Math.floor(Math.random()*candidates.length)].id:selectedCharacter(rival);lockCharacters(true);document.getElementById('character-note').textContent='Você: '+characters.find(c=>c.id===playerCharacter).name+' · Adversário: '+characters.find(c=>c.id===opponentCharacter).name+' · '+characterStyles[opponentCharacter].label;document.querySelector('.character-picker').open=true;matchMode=document.getElementById('match-mode').value;document.getElementById('match-mode').disabled=true;playerSets=opponentSets=0;setNumber=1;setEnding=false;gestureAim=null;bounceFlash=0;bounceSpot=null;playerAnimation=opponentAnimation=0;playerPose=opponentPose=0;difficulty=document.getElementById('difficulty').value;loadBest();document.getElementById('difficulty').disabled=true;pointDelay=0;matchEnding=false;document.getElementById('point-banner').hidden=true;score=0;player=4;target=null;swing=0;held.clear();state='playing';resetAthleteMatch();resetMusicalMatch();document.getElementById('athlete-training').hidden=true;ui.score.textContent=0;ui.overlay.hidden=true;ui.pause.disabled=false;ui.pause.textContent='Pausar';chooseLane(4);selectTarget(null);opponent=4;playerPoints=0;opponentPoints=0;rallies=0;updatePoints();prepareServe();resetChallenges();ui.status.textContent='Partida iniciada.';}
function updatePoints(){document.getElementById('active-mode').textContent=(playStyle==='arena'?(musicalEnabled?'ARENA MUSICAL · ':'ARENA · '):'')+(matchMode==='sets'?'3 SETS':'RÁPIDA')+' · '+({easy:'FÁCIL',medium:'MÉDIO',hard:'DIFÍCIL'}[difficulty]||'FÁCIL');document.getElementById('points').textContent=playerPoints+' × '+opponentPoints;document.getElementById('sets').textContent=matchMode==='sets'?playerSets+' × '+opponentSets:'—';document.getElementById('set-label').textContent=matchMode==='sets'?'SET '+setNumber:'RÁPIDA';}
function servingSide(){const first=setNumber%2===1?1:-1;const total=playerPoints+opponentPoints;const switches=matchMode==='sets'&&playerPoints>=10&&opponentPoints>=10?10+(total-20):Math.floor(total/2);return switches%2===0?first:-first;}
function prepareServe(){resetMusicalRally();arenaRecovery.player=arenaRecovery.opponent=0;arenaArmed=false;pointReaction=null;matchStats.currentSequence=0;serveWindup=0;held.clear();swing=0;effect=0;serving=true;server=servingSide();wait=server===1?0:1.2;const x=laneX(server===1?player:opponent);ball={depth:server===1?1:0,from:x,to:x,lane:server===1?player:opponent,direction:server,curve:0};ui.feedback.textContent=server===1?'Seu saque: escolha 1–9 e pressione ↑ ou um botão de golpe.':'Saque do oponente. Prepare sua raquete.';}
function send(curve=0){const isServe=serving;gameAudio.play(isServe?'serve':'hit');playerPose=curve<0?1:curve>0?2:(target!==null&&target<player?1:2);playerAnimation=.38;const destination=gestureAim===null?(target===null?player:target):gestureAim;gestureAim=null;ball={depth:1,from:laneX(destination),to:laneX(player),lane:destination,direction:-1,curve,bounced:false,isServe,ownBounced:false};serving=false;swing=0;aiDelay=difficulties[difficulty].reaction;aiTarget=opponent;arenaShot(true,isServe);attributeShot(true,isServe);ui.feedback.textContent=arenaRain?'Chuva de bolas! Defenda durante cinco segundos.':ball.special?ball.specialName+'!':curve>0?'Golpe com efeito para a direita.':curve<0?'Golpe com efeito para a esquerda.':'Golpe sem efeito.';}
function point(winner,reason,outside=false){if(pointDelay>0)return;arenaArmed=false;pointReaction={winner,remaining:1.2};gameAudio.play(outside?'out':winner===1?'point':'miss');if(winner===1)matchStats.opponentErrors++;else if(outside)matchStats.outside++;else if(reason.includes('longe'))matchStats.position++;else matchStats.timing++;if(winner===1)playerPoints++;else opponentPoints++;rallies++;updatePoints();held.clear();swing=0;serveWindup=0;serving=false;pointMessage=(winner===1?'Ponto para você! ':'Ponto do oponente. ')+reason+opponentPointReaction(winner);pointDelay=1.8;setEnding=Math.max(playerPoints,opponentPoints)>=(matchMode==='sets'?11:5)&&Math.abs(playerPoints-opponentPoints)>=2;matchEnding=false;if(setEnding){matchStats.sets.push([playerPoints,opponentPoints]);if(matchMode==='sets'){if(winner===1)playerSets++;else opponentSets++;matchEnding=Math.max(playerSets,opponentSets)>=2;pointMessage+=' Set encerrado: '+playerPoints+' × '+opponentPoints+'.';pointDelay=3;updatePoints();}else matchEnding=true;}if(setEnding||matchStats.currentSequence>=10){pointReaction.special=true;pointReaction.duration=1.5;pointReaction.remaining=1.5;const id=winner===1?playerCharacter:opponentCharacter;pointMessage+=' '+signatureNames[id]+'!';}updateChallenges();ui.feedback.textContent=pointMessage;const banner=document.getElementById('point-banner');banner.dataset.result=outside?'out':winner===1?'won':'lost';banner.textContent=pointMessage;banner.hidden=false;ui.status.textContent=pointMessage;}
function strike(curve=0){if(state!=='playing'||pointDelay>0||musicalDance)return;if(serving){if(server===1){effect=curve;serveWindup=.12;}return;}if(arenaRain){if(!arenaRain.leaving){swing=.65;effect=curve;}return;}if(ball.direction<0)return;swing=.65;effect=curve;ui.feedback.textContent='Golpe preparado. Mantenha a raquete na frente da bola.';}
function overlay(title,message,label){document.getElementById('champion-display').hidden=true;ui.overlay.dataset.result=state==='gameover'?((matchMode==='sets'?playerSets>opponentSets:playerPoints>opponentPoints)?'victory':'defeat'):state;ui.title.textContent=title;ui.message.textContent=message;ui.start.textContent=label;ui.overlay.hidden=false;}
function end(reason="A bola passou pela sua raquete."){if(state==='gameover')return;state='gameover';lockCharacters(false);document.querySelector('.character-picker').open=true;document.getElementById('match-mode').disabled=false;document.getElementById('difficulty').disabled=false;ui.pause.disabled=true;if(score>best){best=score;ui.best.textContent=best;try{localStorage.setItem(recordKey(),String(best));}catch{}}overlay((matchMode==='sets'?playerSets>opponentSets:playerPoints>opponentPoints)?'Você venceu!':'Fim da partida',`Resultado: ${matchMode==='sets'?playerSets+' × '+opponentSets+' sets':playerPoints+' × '+opponentPoints+' pontos'}. Você conseguiu ${score} ${score===1?'devolução':'devoluções'}. ${reason}`,'Jogar novamente');showMatchResults();finishAthleteTraining();updateRewards(matchMode==='sets'?playerSets>opponentSets:playerPoints>opponentPoints);finishTournamentRound();finishWorldCupMatch();updateRewards();ui.status.textContent=`Fim da partida. Pontuação: ${score}.`;if(ui.overlay.dataset.result!=='champion'&&(matchMode==='sets'?playerSets>opponentSets:playerPoints>opponentPoints))nextCharacterStory();}
function pause(){held.clear();swing=0;serveWindup=0;if(state==='playing'){gameAudio.stop();state='paused';renderMusical();document.getElementById('pause-actions').hidden=false;ui.pause.textContent='Continuar';overlay('Uma pausa na mesa','Sua partida está guardada. Continue quando estiver pronto.','Continuar');}else if(state==='paused'){document.getElementById('pause-actions').hidden=true;state='playing';gameAudio.unlock();ui.overlay.hidden=true;ui.pause.textContent='Pausar';renderMusical();resumeMusicalAudio();}}
ui.start.addEventListener('click',()=>state==='paused'?pause():(tournament||(worldCup&&worldCup.status==='active'))?start():openCharacterSetup());ui.pause.addEventListener('click',pause);
document.getElementById('match-mode').addEventListener('change',e=>{matchMode=e.target.value;loadBest();updatePoints();renderRanking();});
document.getElementById('difficulty').addEventListener('change',e=>{difficulty=e.target.value;loadBest();renderRanking();});
document.querySelectorAll('[data-target]').forEach(b=>b.addEventListener('click',()=>selectTarget(Number(b.dataset.target))));
document.getElementById('straight').addEventListener('click',()=>selectTarget(null));
document.getElementById('hit').addEventListener('click',()=>strike());
document.querySelectorAll('[data-effect]').forEach(b=>b.addEventListener('click',()=>strike(Number(b.dataset.effect))));
document.addEventListener('keydown',e=>{
 if(e.defaultPrevented)return;
 const k=e.key.toLowerCase();
 if(!document.getElementById('story-dialog').hidden||!document.getElementById('guided-tour').hidden||!document.getElementById('character-setup').hidden)return;
 if(['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;
 if(e.target instanceof HTMLButtonElement&&(k===' '||k==='enter'))return;
 if(['arrowleft','arrowright','arrowup','arrowdown',' ','a','d','p','escape',... '123456789'].includes(k))e.preventDefault();
 if(k===' '&&state!=='playing'){if(!e.repeat)state==='paused'?pause():(tournament||(worldCup&&worldCup.status==='active'))?start():openCharacterSetup();return;}
 if((k==='p'||k==='escape')&&!e.repeat){pause();return;}
 if(state!=='playing')return;
 if(k===' '&&!e.repeat){armArena();return;}
 held.add(k);
 if(/^[1-9]$/.test(k))selectTarget(Number(k)-1);
 if(!e.repeat&&(k===hitKey()||(held.has(hitKey())&&['arrowleft','arrowright','a','d'].includes(k))))strike((held.has('arrowright')||held.has('d')?1:0)-(held.has('arrowleft')||held.has('a')?1:0));
});
document.addEventListener('keyup',e=>held.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{held.clear();if(state==='playing')pause();});
const pad=document.getElementById('gesture');
pad.addEventListener('pointerdown',e=>{if(state!=='playing')return;gesture={id:e.pointerId,x:e.clientX,y:e.clientY};pad.setPointerCapture(e.pointerId);});
pad.addEventListener('pointerup',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 const dx=(e.clientX-gesture.x)/pad.getBoundingClientRect().width,dy=viewTop()?e.clientY-gesture.y:gesture.y-e.clientY;gesture=null;
 if(dy<15){ui.feedback.textContent=viewTop()?'Deslize para baixo para rebater.':'Deslize para cima para rebater.';return;}
 selectTarget(Math.max(0,Math.min(8,Math.round(player+dx*9))));gestureAim=player+dx*9;strike(Math.abs(dx)<.08?0:Math.sign(dx));
});
pad.addEventListener('pointercancel',()=>{gesture=null;});
// A tap in the player's half positions the paddle; dragging never moves it.
let paddlePointer=null;
function positionFromCourtTap(clientX,clientY,rect,topSide){
 const x=(clientX-rect.left)/rect.width*800;
 const screenDepth=Math.max(0,Math.min(1,((clientY-rect.top)/rect.height*900-170)/560));
 const width=330+370*screenDepth;
 return Math.max(0,Math.min(8,((x-400)/width+.5)*9-.5));
}
canvas.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'||state!=='playing'||pointDelay>0)return;
 const rect=canvas.getBoundingClientRect(),y=(e.clientY-rect.top)/rect.height;
 if(viewTop()?y>.5:y<.5)return;
 touchMoveTarget=firstPerson()?firstPersonTap(e.clientX,e.clientY,rect):positionFromCourtTap(e.clientX,e.clientY,rect,viewTop());
});

document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')pause();});
// Each shot crosses the net, bounces at 78% of its travel, then rises toward the receiver.
function shotProgress(){return Math.max(0,Math.min(1,ball.direction===1?ball.depth:1-ball.depth));}
function shotX(progress){const t=Math.min(1,progress/.78);const origin=ball.direction===1?ball.from:ball.to;const landing=ball.direction===1?ball.to:ball.from;const wave=ball.curveShape==='double'?Math.sin(Math.PI*t*2):ball.curveShape==='late'?Math.sin(Math.PI*t)*t*t*1.5:Math.sin(Math.PI*t);return origin+(landing-origin)*t+(ball.curve||0)*.13*wave;}
function ballX(){return shotX(shotProgress());}
function ballHeight(){if(serving)return 18;if(ball.isServe){const t=shotProgress();if(t<=.25){const q=t/.25;return 13+18*(1-q)+25*4*q*(1-q);}if(t<=.78){const q=(t-.25)/.53;return 13+100*4*q*(1-q);}return 13+28*Math.sin((t-.78)/.22*Math.PI/2);}const t=shotProgress();if(t<=.78){const q=t/.78;return 13+18*(1-q)+125*(ball.heightFactor||1)*4*q*(1-q);}const q=(t-.78)/.22;return 13+28*Math.sin(q*Math.PI/2);}
function advance(dt){if(musicalDance){advanceMusicalDance(dt);return;}advanceArenaRecovery(dt);renderArena();if(arenaRain){advanceArenaRain(dt);return;}if(pointReaction)pointReaction.remaining=Math.max(0,pointReaction.remaining-dt);observePlayerPosition(player,dt);bounceFlash=Math.max(0,bounceFlash-dt);playerAnimation=Math.max(0,playerAnimation-dt);opponentAnimation=Math.max(0,opponentAnimation-dt);
 if(pointDelay>0){pointDelay=Math.max(0,pointDelay-dt);if(pointDelay===0){document.getElementById('point-banner').hidden=true;if(!beginMusicalDance())finishPointTransition();}return;}
 advancePlayerMovement(dt);
 if(serving){if(server===1){ball.from=ball.to=laneX(player);if(serveWindup>0){serveWindup=Math.max(0,serveWindup-dt);if(serveWindup===0)send(effect);}return;}wait=Math.max(0,wait-dt);if(wait===0){gameAudio.play('serve');serving=false;ball.isServe=true;ball.ownBounced=false;ball.bounced=false;ball.direction=1;applyOpponentShot(true);}return;}
 const speed=rallyBallSpeed(matchStats.currentSequence);ball.depth+=ball.direction*speed*(ball.speed||1)*dt;swing=Math.max(0,swing-dt);
 if(ball.isServe&&!ball.ownBounced&&shotProgress()>=.25){ball.ownBounced=true;const x=shotX(.25);bounceSpot={x,depth:ball.direction===1?.25:.75};bounceFlash=.3;if(x>=0&&x<=1){gameAudio.play('bounce');musicalBounce(x,false);}if(x<0||x>1){point(ball.direction===1?1:-1,'O primeiro quique do saque caiu fora da mesa.',true);return;}}
 if(!ball.bounced&&shotProgress()>=.78){ball.bounced=true;const landing=ball.direction===1?ball.to:ball.from;bounceSpot={x:landing,depth:ball.direction===1?.78:.22};bounceFlash=.3;if(landing>=0&&landing<=1){gameAudio.play('bounce');musicalBounce(landing,ball.direction===-1&&!ball.isServe);}if(landing<0||landing>1){point(ball.direction===1?1:-1,ball.direction===1?'O saque ou golpe do oponente caiu fora da mesa.':'Sua bola caiu fora da mesa.',true);return;}}
 if(ball.direction<0){aiDelay-=dt;if(aiDelay<=0){const settings=difficulties[difficulty];const observed=ballX();const estimate=observed+(ball.from-observed)*settings.prediction;aiTarget=Math.max(0,Math.min(8,estimate*9-.5));const delta=aiTarget-opponent;opponent+=Math.sign(delta)*Math.min(Math.abs(delta),settings.tracking*athleteFactor('opponent','agility')*dt);}}
 if(ball.direction>0&&ball.depth>=.8&&ball.depth<=1.12&&swing>0){
  if(Math.abs(laneX(player)-ballX())<=athleteTolerance('player')){
   score++;matchStats.currentSequence++;matchStats.longestSequence=Math.max(matchStats.longestSequence,matchStats.currentSequence);ui.score.textContent=score;updateChallenges();updateRewards();trainReturn(effect,ball);const impacted=arenaImpactReceived(true);arenaReturn(true);send(effect);if(impacted&&!arenaRain)ball.speed=(ball.speed||1)*.85;
   ui.feedback.textContent=arenaRain?'Chuva de bolas! Defenda durante cinco segundos.':ball.special?'Boa! '+ball.specialName+'!':effect===0?'Boa! Golpe sem efeito.':effect>0?'Boa! Efeito para a direita.':'Boa! Efeito para a esquerda.';
  }else{ui.feedback.textContent='Aproxime a raquete da bola!';}
 }
 if(ball.direction>0&&ball.depth>1.12){point(-1,Math.abs(laneX(player)-ball.to)>athleteTolerance('player')?'A raquete estava longe da bola.':'Faltou rebater com ↑ no momento certo.');return;}
 if(ball.direction<0&&ball.depth<=0){if(Math.abs(laneX(opponent)-ball.from)>athleteTolerance('opponent')){point(1,'O oponente não alcançou sua bola!');return;}gameAudio.play('hit');opponentPose=ball.from<.5?1:2;if(firstPerson())ball.cameraContact={...opponentRacketPoint(),pose:opponentPose};opponentAnimation=.38;ball.depth=0;ball.direction=1;ball.from=laneX(opponent);const impacted=arenaImpactReceived(false);arenaReturn(false);applyOpponentShot();arenaShot(false);attributeShot(false,false);if(impacted)ball.speed*=.85;ball.bounced=false;ball.isServe=false;ball.ownBounced=false;}
}
function fallbackPaddle(lane,depth,color,selected){const p=project(laneX(lane),depth,12),s=p.scale;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(depth>.5?-.15:.15);ctx.globalAlpha=selected?1:.22;ctx.fillStyle='#d7b880';ctx.fillRect(-6*s,12*s,12*s,38*s);ctx.beginPath();ctx.ellipse(0,0,38*s,29*s,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=selected?'#fff3c9':color;ctx.lineWidth=3*s;ctx.stroke();ctx.restore();}
function paddle(lane,depth,color,selected){
 if(state==='ready')return;if(firstPerson()&&depth>.5){drawFirstPersonRacket();return;}
 const near=depth>.5;const reacting=pointReaction&&pointReaction.remaining>0;const celebrating=reacting&&(near?pointReaction.winner===1:pointReaction.winner===-1);const reactionPose=reacting?(celebrating?2:1):null;let source=spriteSource(near?playerCharacter:opponentCharacter,near?playerUniform:opponentUniform,viewTop()?!near:near,reactionPose!==null?reactionPose:firstPerson()&&!near?opponentContactPose():(near?playerAnimation:opponentAnimation)>0?(near?playerPose:opponentPose):0);
 if(!source){fallbackPaddle(lane,depth,color,selected);return;}
 const p=project(laneX(lane),depth,12);
 const anim=near?playerAnimation:opponentAnimation;
 const pose=anim>0?(near?playerPose:opponentPose):0;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const id=near?playerCharacter:opponentCharacter;
 const specialSource=celebrating&&pointReaction.special?celebrationSource(id,near?playerUniform:opponentUniform,1-pointReaction.remaining/pointReaction.duration,reduced):null;
 if(specialSource)source=specialSource;
 const preparing=state==='playing'&&serving&&(near?server===1:server===-1);
 const striking=anim>0&&!reduced?Math.sin(Math.PI*Math.min(1,anim/.38)):0;
 const readyLift=preparing&&!reduced?(near?serveWindup/.12:Math.max(0,1-wait/1.2))*3:0;
 
 const screenNear=viewTop()?!near:near;const size=screenNear?155:firstPerson()?160:96;
 // Characters stand outside each end of the table; contact marker remains at logical paddle position.
 const bodyX=Math.max(size/2+8,Math.min(800-size/2-8,p.x));
 const footY=firstPerson()&&!near?firstPersonOpponentFoot():screenNear?884:176;
 ctx.save();
 const reactionWave=reacting&&!reduced?Math.sin(((pointReaction.duration||1.2)-pointReaction.remaining)/(pointReaction.duration||1.2)*Math.PI):0;
 const expressive=!near&&opponentCharacter==='caio';
 ctx.translate(bodyX,footY-readyLift-(celebrating?reactionWave*(expressive?8:5):0));
 ctx.rotate(reacting?reactionWave*(celebrating?(expressive?.09:.035):-.025):0);
 if(musicalDance&&!reduced){ctx.translate(Math.sin(musicalDance.elapsed*5+(near?0:Math.PI))*8,-Math.abs(Math.sin(musicalDance.elapsed*7))*5);ctx.rotate(Math.sin(musicalDance.elapsed*5)*.08);}ctx.rotate(firstPerson()&&!near?0:(pose===1?-.045:.045)*striking);if(arenaRecovery[near?'player':'opponent']>0&&!reduced)ctx.rotate(Math.sin(arenaRecovery[near?'player':'opponent']*25)*.07);
 const stretch=firstPerson()&&!near?1:1+striking*.035;
 if(celebrating&&pointReaction.special&&!reduced&&!specialSource){
  const id=near?playerCharacter:opponentCharacter;
  const progress=1-pointReaction.remaining/pointReaction.duration;
  const special=signatureTransform(id,progress,size);
  ctx.translate(special.x,special.y-size/2);ctx.rotate(special.angle);ctx.translate(0,size/2);
 }
 drawWalkingSprite(ctx,source,size*stretch,musicalDance?{phase:musicalDance.elapsed*12,amount:.8}:gait[near?'player':'opponent'],reduced||reacting);
 ctx.restore();
 if(preparing){ctx.beginPath();ctx.ellipse(p.x,p.y,near?31:18,near?10:6,0,0,Math.PI*2);ctx.strokeStyle='#ffdb84';ctx.lineWidth=3;ctx.stroke();}
 ctx.beginPath();ctx.ellipse(p.x,p.y,near?25:13,near?8:4,0,0,Math.PI*2);
 ctx.fillStyle=anim>0?'#ffdb84':'#d2e7a188';ctx.fill();ctx.strokeStyle='#f4ecc7';ctx.lineWidth=2;ctx.stroke();
}
function drawBall(){if(musicalDance||arenaRain||!ball)return;if(bounceFlash>0&&bounceSpot){const q=project(bounceSpot.x,bounceSpot.depth);ctx.beginPath();ctx.ellipse(q.x,q.y,12+(1-bounceFlash/.3)*20,5+(1-bounceFlash/.3)*8,0,0,Math.PI*2);ctx.strokeStyle='#ffdb84';ctx.lineWidth=2;ctx.stroke();}const d=Math.max(0,Math.min(1,ball.depth)),x=ballX();const shadow=project(x,d),p=firstPersonBallPoint(project(x,d,ballHeight()));ctx.beginPath();ctx.ellipse(shadow.x,shadow.y,17*p.scale,6*p.scale,0,0,Math.PI*2);ctx.fillStyle='#001d2c66';ctx.fill();drawArenaTrail(p);ctx.beginPath();ctx.arc(p.x,p.y,13*p.scale,0,Math.PI*2);ctx.fillStyle=ball.special?(ball.specialColor||'#ff984b'):'#fff2bc';ctx.shadowColor='#ffdc82';ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(p.x-3*p.scale,p.y-4*p.scale,3*p.scale,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
function net(){const a=project(0,.5),b=project(1,.5),ta=project(0,.5,65),tb=project(1,.5,65);polygon([a,b,tb,ta],'#dcebd52b');for(let i=0;i<=24;i++)line(project(i/24,.5),project(i/24,.5,65),'#d0e6d77a',1);for(let h=0;h<=65;h+=13)line(project(0,.5,h),project(1,.5,h),'#d0e6d77a',1);line(ta,tb,'#edf3df',4);line(a,ta,'#e2b66c',6);line(b,tb,'#e2b66c',6);}
function draw(){const bg=ctx.createLinearGradient(0,0,0,900);bg.addColorStop(0,'#224c53');bg.addColorStop(1,'#0b222e');ctx.fillStyle=bg;ctx.fillRect(0,0,800,900);ctx.fillStyle='#9cb9ac';ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText(viewTop()?'VOCÊ':'OPONENTE',400,90);polygon([{x:70,y:770},{x:730,y:770},{x:580,y:230},{x:220,y:230}],'#0003');const a=project(0,0),b=project(1,0),c=project(1,1),d=project(0,1);polygon([d,c,{x:c.x,y:c.y+22},{x:d.x,y:d.y+22}],'#132f34','#62847b');const surface=ctx.createLinearGradient(0,170,0,730);surface.addColorStop(0,courtThemes[selectedCourt].colors[0]);surface.addColorStop(1,courtThemes[selectedCourt].colors[1]);polygon([a,b,c,d],surface,'#ecedcc');if(ball&&state==='playing'&&!musicalDance&&ball.direction>0){const left=ball.lane/9,right=(ball.lane+1)/9;polygon([project(left,.52),project(right,.52),project(right,1),project(left,1)],'#e6eeb820');}for(let i=1;i<3;i++){ctx.setLineDash([8,10]);line(project(i/3,0),project(i/3,1),'#dbe8bf60');ctx.setLineDash([]);}drawFirstPersonCrowd();if(viewTop()){paddle(player,1,'#d2e7a1',true);if(ball&&ball.depth>=.5)drawBall();net();paddle(opponent,0,'#e87968',true);if(ball&&ball.depth<.5)drawBall();}else{paddle(opponent,0,'#e87968',true);if(ball&&ball.depth<.5)drawBall();net();paddle(player,1,'#d2e7a1',true);if(ball&&ball.depth>=.5)drawBall();}if(!firstPerson())for(let i=0;i<9;i++){const p=project(laneX(i),0,0);ctx.fillStyle=target===i?'#ffdb84':'#c0d5c4';ctx.font='bold 16px system-ui';ctx.fillText(String(i+1),p.x,p.y+(viewTop()?40:-28));}if(target!==null){const p=project(laneX(target),0,10);ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.strokeStyle='#ffdb84';ctx.lineWidth=2;ctx.stroke();}if(state==='playing'&&!musicalDance&&!serving&&ball.direction>0&&ball.depth>=.78){ctx.fillStyle='#ffdb84';ctx.font='bold 24px system-ui';ctx.fillText(hitArrow()+' REBATA',400,firstPerson()?825:viewTop()?115:870);}if(state==='playing'&&serving){ctx.fillStyle='#ffdb84';ctx.font='bold 30px system-ui';ctx.fillText(server===1?'SEU SAQUE · '+hitArrow():'SAQUE DO OPONENTE',400,firstPerson()?825:viewTop()?820:115);}}
// Read-only guidance: follows the match without changing controls or physics.
function updateGuidance(){if(musicalDance&&state==='playing'){document.getElementById('guide-title').textContent='Dança conjunta · '+musicalDance.song.name;document.getElementById('guide-text').textContent='O ponto já foi contado. Os dois atletas celebram; você pode pular a dança.';return;}if(arenaRain&&state==='playing'){document.getElementById('guide-title').textContent='Chuva de bolas';document.getElementById('guide-text').textContent='Defenda com os controles normais por cinco segundos. Melhor proporção de devoluções ganha um ponto; empate favorece quem ativou.';return;}if(viewTop())ui.feedback.textContent=ui.feedback.textContent.replaceAll('↑','↓');
 let title, text;
 if(state==='ready'){title='Comece pelo saque';text='Clique em Jogar. Depois escolha 1–9 e pressione ↑.';}
 else if(state==='paused'){title='Partida pausada';text='Clique em Continuar ou pressione P. Sua jogada está guardada.';}
 else if(state==='gameover'){title='Partida encerrada';text='Clique em Jogar novamente para começar outra partida.';}
 else if(pointDelay>0){title=matchEnding?'Resultado da partida':'Ponto encerrado';text=pointMessage+(setEnding&&!matchEnding?' O próximo set começa em instantes.':'');}
 else if(serving&&server===1){title='Seu saque';text='Escolha 1–9 para mirar e pressione ↑ para sacar. Para efeito, segure ← ou → junto com ↑.';}
 else if(serving){title='Saque do oponente';text='Prepare-se para acompanhar a bola. Use ← → para mover sua raquete.';}
 else if(ball.direction<0){title='Sua bola vai ao oponente';text='Prepare sua posição para a próxima recepção. Você já pode escolher o destino da próxima devolução.';}
 else if(ball.depth>=.8){title='Sua vez: rebata agora ↑';text='Fique na frente da bola e pressione ↑. Para curva, segure ← ou → junto com ↑.';}
 else {title='Prepare a recepção';text='No celular, toque na quadra; no teclado, use ← →. Fique na faixa iluminada. Escolha 1–9 para mirar; espere a bola chegar para pressionar ↑.';}
 const heading=document.getElementById('guide-title'), body=document.getElementById('guide-text');
 if(viewTop()){title=title.replaceAll('↑','↓');text=text.replaceAll('↑','↓');}
 if(heading.textContent!==title)heading.textContent=title;
 if(body.textContent!==text)body.textContent=text;
}
let frameErrorReported=false;
function frame(time){
 const dt=lastTime===undefined?0:Math.min((time-lastTime)/1000,.05);lastTime=time;
 try{if(state==='playing'){advance(dt);advanceCharacterMotion(dt);}updateGuidance();draw();drawArenaRain();drawPresentation(dt);drawEndings(dt);}
 catch(error){if(!frameErrorReported){console.error('Falha ao desenhar o jogo; a próxima atualização será tentada.',error);frameErrorReported=true;}}
 finally{requestAnimationFrame(frame);}
}
requestAnimationFrame(frame);

renderRanking();

document.getElementById('return-match').addEventListener('click',start);

function openCharacterSetup(){updateCompetitionChoice();document.getElementById('character-setup').hidden=false;document.querySelector('.character-picker').open=true;updateCharacterPreviews();document.getElementById('player-character').focus();}
document.getElementById('setup-play').addEventListener('click',start);

renderChallenges();

function quitMatch(){
 if(state!=='paused')return;
 gameAudio.stop();if(worldCup){worldCup=null;saveWorldCup();renderWorldCup();}if(tournament){tournament=null;saveTournament();}renderTournament();held.clear();gesture=null;paddlePointer=null;
 musicalDance=null;musicalPending=null;musicalEnabled=false;renderMusical();touchMoveTarget=null;matchAttributes=null;renderAthleteBars();arenaRain=null;arenaArmed=false;state='ready';ball=null;pointDelay=0;matchEnding=false;setEnding=false;serving=false;serveWindup=0;swing=0;
 score=playerPoints=opponentPoints=playerSets=opponentSets=0;setNumber=1;
 resetMatchStats();resetChallenges();updatePoints();ui.score.textContent=0;
 lockCharacters(false);document.getElementById('match-mode').disabled=false;document.getElementById('difficulty').disabled=false;
 document.getElementById('pause-actions').hidden=true;document.getElementById('point-banner').hidden=true;document.getElementById('match-results').hidden=true;document.getElementById('change-character').hidden=true;
 ui.pause.disabled=true;ui.pause.textContent='Pausar';overlay('Entre na mesa','Escolha seus personagens e comece uma nova partida.','Jogar');
 ui.status.textContent='Partida descartada. Nenhum resultado foi adicionado ao ranking.';openCharacterSetup();
}
document.getElementById('restart-match').addEventListener('click',()=>{if(state==='paused'){gameAudio.stop();gesture=null;start();}});
document.getElementById('quit-match').addEventListener('click',quitMatch);

renderTournament();updateCompetitionChoice();

loadTournamentProgress();

function showChampionCharacter(){
 const display=document.getElementById('champion-display');const portrait=document.getElementById('champion-portrait');
 const c=portrait.getContext('2d');c.clearRect(0,0,160,160);
 const source=spriteSource(playerCharacter,playerUniform,false,2);
 if(source)drawSprite(c,source,0,0,160,160);
 document.getElementById('champion-name').textContent=characters.find(character=>character.id===playerCharacter).name;
 display.hidden=false;renderChampionEnding();
}

initializeRewards();

applyTableSide();

initializeWorldCup();

renderStoryGallery();

function finishPointTransition(){if(matchEnding)end(pointMessage);else{const wonSet=setEnding&&pointReaction?.winner===1;if(setEnding){setNumber++;playerPoints=opponentPoints=0;setEnding=false;updatePoints();player=opponent=4;touchMoveTarget=null;chooseLane(4);}if(wonSet&&nextCharacterStory(()=>prepareServe()))return;prepareServe();}}
