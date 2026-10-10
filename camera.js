let cameraMode='classic';
function firstPerson(){return cameraMode==='first'&&state!=='ready';}
function viewTop(){return !firstPerson()&&isTopSide();}
function applyCamera(){cameraMode=document.getElementById('competition').value==='single'&&document.getElementById('camera-view').value==='first'?'first':'classic';}
function firstPersonProjection(x,depth,height=0){const distance=1.8-.8*depth,scale=1/distance;return {x:400+(x-.5)*700*scale,y:400+260*depth/distance-height*scale,scale};}
function firstPersonTap(clientX,clientY,rect){const x=(clientX-rect.left)/rect.width*800,y=(clientY-rect.top)/rect.height*900,offset=Math.max(0,y-400),depth=Math.max(0,Math.min(1,offset*1.8/(260+offset*.8))),width=700/(1.8-.8*depth);return Math.max(0,Math.min(8,(.5+(x-400)/width)*9-.5));}
let playerCameraHit=null;
function capturePlayerCameraHit(){
 if(!firstPerson()||!ball||arenaRain)return null;
 return firstPersonBallPoint(project(ballX(),Math.max(0,Math.min(1,ball.depth)),ballHeight()));
}
function playerRacketCenter(){
 const rest={x:Math.max(70,Math.min(730,project(laneX(player),1).x)),y:project(.5,1).y-13};
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(playerAnimation>0&&playerCameraHit){
  const t=Math.max(0,Math.min(1,1-playerAnimation/.38)),ease=t*t*(3-2*t);
  return {x:playerCameraHit.x+(rest.x-playerCameraHit.x)*ease,y:playerCameraHit.y+(rest.y-playerCameraHit.y)*ease-(reduced?0:Math.sin(Math.PI*t)*18)};
 }
 const preparing=state==='playing'&&pointDelay===0&&(swing>0||serving&&server===1&&serveWindup>0);
 return {x:rest.x+(preparing&&!reduced?effect*10:0),y:rest.y+(preparing&&!reduced?12:0)};
}
function drawFirstPersonRacket(){
 const center=playerRacketCenter(),active=playerAnimation>0&&playerCameraHit;
 ctx.save();ctx.translate(center.x,center.y);ctx.rotate(active?-.3*(1-playerAnimation/.38):-.3);
 ctx.fillStyle='#be926b';ctx.fillRect(-9,37,18,85);ctx.beginPath();ctx.ellipse(0,0,55,65,0,0,Math.PI*2);ctx.fillStyle='#c66749';ctx.fill();ctx.strokeStyle='#ffe0ab';ctx.lineWidth=5;ctx.stroke();ctx.restore();
 if(active&&playerAnimation>.26){
  const t=(.38-playerAnimation)/.12;
  ctx.save();ctx.beginPath();ctx.arc(playerCameraHit.x,playerCameraHit.y,14+t*17,0,Math.PI*2);ctx.strokeStyle='#fff3bc';ctx.globalAlpha=1-t;ctx.lineWidth=2;ctx.stroke();ctx.restore();
 }
}

document.getElementById('camera-view').addEventListener('change',()=>{if(state==='ready'||state==='gameover')applyCamera();});

function firstPersonOpponentFoot(){return project(laneX(opponent),0).y-8;}
function drawFirstPersonCrowd(){
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clock=reduced?0:state==='ready'?presentationTime:state==='playing'?(lastTime||0)/1000:0;
 ctx.save();ctx.lineCap='round';
 for(let i=0;i<180;i++){
  const phase=i*2.399,speed=1.2+(i%7)*.21,kind=i%5;
  const bounce=reduced?0:Math.max(0,Math.sin(clock*speed+phase))*(kind===0?7:3);
  const row=Math.floor(i/30),column=i%30;
  const size=(.72+(i%4)*.09)*(.6+row*.07)*(firstPerson()?1:.5);
  const x=12+column*26+(row%2)*9,y=(firstPerson()?135+row*31:30+row*15)-bounce*(firstPerson()?1:.5);
  const wave=reduced?0:Math.sin(clock*speed+phase);
  ctx.save();ctx.translate(x,y);ctx.scale(size,size);
  ctx.fillStyle=['#081d2970','#102b357d','#16333d80','#0b233080'][i%4];ctx.strokeStyle=ctx.fillStyle;
  ctx.beginPath();ctx.arc(0,0,7+(i%3),0,Math.PI*2);ctx.fill();
  if(i%4===0){ctx.beginPath();ctx.ellipse(-6,5,4,8,.4,0,Math.PI*2);ctx.fill();}
  const shoulder=9+i%4;
  ctx.beginPath();ctx.moveTo(-shoulder,12);ctx.quadraticCurveTo(0,5,shoulder,12);ctx.lineTo(shoulder+2,36+i%4);ctx.lineTo(-shoulder-2,36+i%4);ctx.closePath();ctx.fill();
  ctx.lineWidth=5;
  for(const side of [-1,1]){
   const raised=kind===0||kind===1&&side===1;
   const handX=kind===2?side*(6+wave*2):side*(raised?19:16);
   const handY=raised?-15-wave*5:kind===2?17+wave*3:kind===3?6-wave*6:29+wave*2;
   ctx.beginPath();ctx.moveTo(side*shoulder,15);ctx.lineTo(side*(shoulder+7),raised?4:23);ctx.lineTo(handX,handY);ctx.stroke();
   ctx.beginPath();ctx.arc(handX,handY,3.5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
 }
 ctx.restore();
}

// Use the racket already present in the sprite; never draw a detached second racket.
function opponentContactPose(){
 if(firstPerson()&&state==='playing'&&!serving&&pointDelay===0&&ball&&ball.direction<0&&ball.depth<.22)return ball.from<.5?1:2;
 return opponentAnimation>0?(firstPerson()&&ball&&ball.cameraContact?ball.cameraContact.pose:opponentPose):0;
}
function opponentRacketPoint(){
 const pose=opponentContactPose(),body=project(laneX(opponent),0);
 return {x:body.x+(pose===1?-66:pose===2?66:0),y:firstPersonOpponentFoot()-(pose?120:92)};
}
function firstPersonBallPoint(p,depth=ball.depth){
 if(!firstPerson()||serving||pointDelay>0||arenaRain||musicalDance)return p;
 if(ball.direction<0&&ball.playerContact&&depth>.78){
  const endpoint=project(ball.to,1,31),weight=Math.pow((depth-.78)/.22,2);
  return {...p,x:p.x+(ball.playerContact.x-endpoint.x)*weight,y:p.y+(ball.playerContact.y-endpoint.y)*weight};
 }
 const incoming=ball.direction<0;
 if(incoming&&Math.abs(laneX(opponent)-ball.from)>athleteTolerance('opponent'))return p;
 if(!incoming&&!ball.cameraContact)return p;
 // The whole post-bounce rise meets the racket; the return departs along a continuous arc.
 const span=incoming?.22:.5;
 if(depth>=span)return p;
 const contact=incoming?opponentRacketPoint():ball.cameraContact;
 const endpoint=project(ball.from,0,incoming?41:31);
 const weight=Math.pow(1-Math.max(0,depth)/span,2);
 return {...p,x:p.x+(contact.x-endpoint.x)*weight,y:p.y+(contact.y-endpoint.y)*weight};
}

function firstPersonBallSpeed(){return firstPerson()?1.18:1;}
function drawFirstPersonBoundary(){
 const wallY=firstPerson()?375:145;
 const points=[{x:0,y:wallY},{x:800,y:wallY}];
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clock=reduced?0:state==='ready'?presentationTime:state==='playing'?(lastTime||0)/1000:0;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],height=24;
  polygon([a,b,{x:b.x,y:b.y-height},{x:a.x,y:a.y-height}],'#27454c','#52716d55');
  const length=Math.hypot(b.x-a.x,b.y-a.y);
  ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(b.x,b.y-height);ctx.lineTo(a.x,a.y-height);ctx.closePath();ctx.clip();
  ctx.translate(a.x,a.y-8);ctx.rotate(Math.atan2(b.y-a.y,b.x-a.x));ctx.font='bold 13px system-ui';ctx.fillStyle='#b7c5a650';ctx.textAlign='left';
  for(let x=-150+(clock*12)%150;x<length+150;x+=150)ctx.fillText('REBATE!',x,0);
  ctx.restore();
 }
}

function drawFirstPersonGround(theme=selectedCourt){
 const start=firstPerson()?350:120;
 const floor=ctx.createLinearGradient(0,start,0,900);
 floor.addColorStop(0,courtThemes[theme].colors[0]);floor.addColorStop(1,courtThemes[theme].colors[1]);
 // One continuous floor extends behind both baselines and out to the arena walls.
 ctx.fillStyle=floor;ctx.fillRect(0,start,800,900-start);
 ctx.fillStyle='#fff3';ctx.globalAlpha=.12;
 for(let i=0;i<360;i++){
  const x=(i*137)%800,y=start+2+(i*83)%(898-start);
  ctx.fillRect(x,y,1+(y-start)/400,1);
 }
 ctx.globalAlpha=1;
 const foot=project(laneX(opponent),0);
 ctx.beginPath();ctx.ellipse(foot.x,firstPerson()?firstPersonOpponentFoot()+1:foot.y+(viewTop()?46:-7),29,5,0,0,Math.PI*2);ctx.fillStyle='#31221d28';ctx.fill();
}
