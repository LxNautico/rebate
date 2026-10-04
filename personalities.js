const characterStyles = {
 alex: {label:'Equilibrado', description:'Alterna segurança e ataque.'},
 rafa: {label:'Atacante', description:'Busca velocidade e extremidades.'},
 lia: {label:'Estratégica', description:'Explora os espaços que você deixa abertos.'},
 maya: {label:'Defensiva', description:'Prefere golpes seguros e trocas longas.'},
 leo: {label:'Imprevisível', description:'Varia destinos, ritmo e efeitos.'},
 nina: {label:'Sagaz', description:'Observa seu movimento para mudar a direção do ataque.'},
 caio: {label:'Provocativo', description:'Arrisca jogadas ousadas e provoca entre pontos.'},
 iris: {label:'Técnica', description:'Combina curvas e colocações precisas.'}
};
let opponentLastTarget=null, opponentPreviousPosition=4, opponentPlayerMotion=0;
function resetOpponentStyle(){opponentLastTarget=null;opponentPreviousPosition=4;opponentPlayerMotion=0;}
function observePlayerPosition(position,dt=1/60){
 if(dt<=0)return;
 const smoothing=1-Math.exp(-dt/.075);
 const velocity=(position-opponentPreviousPosition)/dt;
 opponentPlayerMotion+=(velocity-opponentPlayerMotion)*smoothing;
 opponentPreviousPosition=position;
}
function rallyBallSpeed(returns){return Math.min(.48+Math.max(0,returns)*.018,.9);}
// Difficulty limits how often tactical decisions succeed; character sets preferences.
function chooseOpponentShot(id,position,level,isServe=false,rng=Math.random){
 const insight={easy:.35,medium:.6,hard:.8}[level]||.35;
 const far=position<4?8:0;
 let lane=Math.floor(rng()*9),curve=0,speed=1;
 switch(id){
  case 'alex': if(rng()<.3)lane=2+Math.floor(rng()*5);break;
  case 'rafa': lane=rng()<insight?far:(rng()<.5?0:8);speed=1.12;curve=rng()<.4?(lane<4?-1:1)*.45:0;break;
  case 'lia': if(rng()<insight)lane=position<4?6+Math.floor(rng()*3):Math.floor(rng()*3);curve=lane<4?.5:-.5;break;
  case 'maya': lane=2+Math.floor(rng()*5);speed=.9;curve=rng()<.25?.25:0;break;
  case 'leo': if(lane===opponentLastTarget)lane=(lane+1+Math.floor(rng()*8))%9;curve=(rng()*2-1)*.95;speed=.92+rng()*.18;break;
  case 'nina': if(rng()<insight){const expected=Math.max(0,Math.min(8,position+opponentPlayerMotion*.2));lane=Math.abs(opponentPlayerMotion)>.9?(opponentPlayerMotion>0?1:7):(expected<4?7:1);}curve=lane<4?-.35:.35;break;
  case 'caio': lane=rng()<insight?far:(rng()<.5?0:8);curve=lane<4?-.9:.9;speed=1.08;if(!isServe&&rng()<.045)lane=lane===0?-.8:8.8;break;
  case 'iris': lane=rng()<insight?(position<4?7:1):1+Math.floor(rng()*7);curve=lane<4?.85:-.85;break;
 }
 if(isServe){curve*=.5;speed=1;}
 opponentLastTarget=lane;
 return {lane,curve,speed};
}
function applyOpponentShot(isServe=false){
 const shot=chooseOpponentShot(opponentCharacter,player,difficulty,isServe);
 ball.lane=shot.lane;ball.to=laneX(shot.lane);ball.curve=shot.curve;ball.speed=shot.speed;
 opponentPose=shot.curve<0?1:shot.curve>0?2:shot.lane<opponent?1:2;
 opponentAnimation=.38;
}
function opponentPointReaction(winner){
 if(opponentCharacter!=='caio')return '';
 return winner===1?' Caio: “Boa! Quero ver a próxima!”':' Caio: “Vamos, tente alcançar essa!”';
}
