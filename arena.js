let playStyle='classic',arenaEnergy=0,rivalEnergy=0,arenaArmed=false;
const selectedPlayStyle=()=>document.getElementById('play-style').value==='arena'?'arena':'classic';
function renderArena(){
 const active=playStyle==='arena';document.getElementById('arena-controls').hidden=!active;
 document.getElementById('arena-energy').value=arenaEnergy;document.getElementById('rival-energy').value=rivalEnergy;
 document.getElementById('arena-energy-text').textContent=arenaEnergy+'/100';
 const button=document.getElementById('arena-special');button.disabled=arenaEnergy<100||state!=='playing'||serving||pointDelay>0;
 button.textContent=arenaArmed?'Especial preparado · cancelar':'Golpe especial · Espaço';button.setAttribute('aria-pressed',String(arenaArmed));
 document.getElementById('arena-hint').textContent=arenaArmed?'Rebata no momento certo para usar o especial.':arenaEnergy===100?'Energia cheia! Ative o especial durante a troca de bola.':'Cada devolução carrega 20 de energia. O especial acelera a bola em 35%.';
}
function resetArena(){playStyle=selectedPlayStyle();arenaEnergy=rivalEnergy=0;arenaArmed=false;renderArena();}
function armArena(){if(playStyle!=='arena'||state!=='playing'||pointDelay>0||serving||arenaEnergy<100)return;arenaArmed=!arenaArmed;renderArena();}
function arenaReturn(own){if(playStyle!=='arena')return;if(own)arenaEnergy=Math.min(100,arenaEnergy+20);else rivalEnergy=Math.min(100,rivalEnergy+20);renderArena();}
function arenaShot(own,isServe=false){
 ball.special=false;
 if(playStyle!=='arena'||isServe)return;
 if(own?arenaArmed&&arenaEnergy===100:rivalEnergy===100){
  ball.special=true;ball.speed=(own?1:(ball.speed||1))*1.35;
  if(own){arenaEnergy=0;arenaArmed=false;}else rivalEnergy=0;
  ui.feedback.textContent=own?'Seu golpe especial de velocidade!':'Especial do adversário! Prepare a defesa.';
 }renderArena();
}
function drawArenaTrail(p){if(!ball.special)return;ctx.save();ctx.strokeStyle='#ff8d42';ctx.lineWidth=6*p.scale;ctx.beginPath();ctx.moveTo(p.x,p.y);const previous=Math.max(0,shotProgress()-.08),depth=ball.direction===1?previous:1-previous;const q=project(shotX(previous),depth,ballHeight());ctx.lineTo(q.x,q.y);ctx.stroke();ctx.restore();}
document.getElementById('arena-special').addEventListener('click',armArena);
document.getElementById('play-style').addEventListener('change',()=>{playStyle=selectedPlayStyle();loadBest();updatePoints();renderRanking();});
