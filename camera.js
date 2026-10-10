let cameraMode='classic';
function firstPerson(){return cameraMode==='first'&&state!=='ready';}
function viewTop(){return !firstPerson()&&isTopSide();}
function applyCamera(){cameraMode=document.getElementById('competition').value==='single'&&document.getElementById('camera-view').value==='first'?'first':'classic';}
function firstPersonProjection(x,depth,height=0){const distance=1.8-.8*depth,scale=1/distance;return {x:400+(x-.5)*700*scale,y:400+260*depth/distance-height*scale,scale};}
function firstPersonTap(clientX,clientY,rect){const x=(clientX-rect.left)/rect.width*800,y=(clientY-rect.top)/rect.height*900,offset=Math.max(0,y-400),depth=Math.max(0,Math.min(1,offset*1.8/(260+offset*.8))),width=700/(1.8-.8*depth);return Math.max(0,Math.min(8,(.5+(x-400)/width)*9-.5));}
function drawFirstPersonRacket(){const lift=Math.sin(Math.PI*Math.min(1,playerAnimation/.38))*35;ctx.save();ctx.translate(Math.max(70,Math.min(730,project(laneX(player),1).x)),project(.5,1).y+45-lift);ctx.rotate(-.3+Math.sin(playerAnimation*8)*.15);ctx.fillStyle='#be926b';ctx.fillRect(-9,12,18,85);ctx.beginPath();ctx.ellipse(0,-25,55,65,0,0,Math.PI*2);ctx.fillStyle='#c66749';ctx.fill();ctx.strokeStyle='#ffe0ab';ctx.lineWidth=5;ctx.stroke();ctx.restore();}
document.getElementById('camera-view').addEventListener('change',()=>{if(state==='ready'||state==='gameover')applyCamera();});

function firstPersonOpponentFoot(){return project(laneX(opponent),0).y+10;}
function drawFirstPersonCrowd(){
 if(!firstPerson())return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clock=reduced||state!=='playing'?0:(lastTime||0)/1000;
 ctx.save();ctx.lineCap='round';
 for(let i=0;i<41;i++){
  const phase=i*2.399,speed=1.2+(i%7)*.21,kind=i%5;
  const bounce=reduced?0:Math.max(0,Math.sin(clock*speed+phase))*(kind===0?7:3);
  const angle=Math.PI+i*Math.PI/40;
  const x=400+374*Math.cos(angle),y=390+245*Math.sin(angle)+(i%3)*4-bounce;
  const size=.72+(i%4)*.09,wave=reduced?0:Math.sin(clock*speed+phase);
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
function firstPersonBallPoint(p){
 if(!firstPerson()||serving||pointDelay>0||arenaRain||musicalDance)return p;
 const incoming=ball.direction<0;
 if(incoming&&Math.abs(laneX(opponent)-ball.from)>athleteTolerance('opponent'))return p;
 if(!incoming&&!ball.cameraContact)return p;
 // The whole post-bounce rise meets the racket; the return departs along a continuous arc.
 const span=incoming?.22:.5;
 if(ball.depth>=span)return p;
 const contact=incoming?opponentRacketPoint():ball.cameraContact;
 const endpoint=project(ball.from,0,incoming?41:31);
 const weight=Math.pow(1-Math.max(0,ball.depth)/span,2);
 return {...p,x:p.x+(contact.x-endpoint.x)*weight,y:p.y+(contact.y-endpoint.y)*weight};
}
