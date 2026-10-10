let cameraMode='classic';
function firstPerson(){return cameraMode==='first'&&state!=='ready';}
function viewTop(){return !firstPerson()&&isTopSide();}
function applyCamera(){cameraMode=document.getElementById('competition').value==='single'&&document.getElementById('camera-view').value==='first'?'first':'classic';}
function firstPersonProjection(x,depth,height=0){const distance=1.9-.9*depth,scale=1/distance;return {x:400+(x-.5)*700*scale,y:320+380*depth/distance-height*scale,scale};}
function firstPersonTap(clientX,clientY,rect){const x=(clientX-rect.left)/rect.width*800,y=(clientY-rect.top)/rect.height*900,offset=Math.max(0,y-320),depth=Math.max(0,Math.min(1,offset*1.9/(380+offset*.9))),width=700/(1.9-.9*depth);return Math.max(0,Math.min(8,(.5+(x-400)/width)*9-.5));}
function drawFirstPersonRacket(){const lift=Math.sin(Math.PI*Math.min(1,playerAnimation/.38))*35;ctx.save();ctx.translate(Math.max(70,Math.min(730,project(laneX(player),1).x)),840-lift);ctx.rotate(-.3+Math.sin(playerAnimation*8)*.15);ctx.fillStyle='#be926b';ctx.fillRect(-9,12,18,85);ctx.beginPath();ctx.ellipse(0,-25,55,65,0,0,Math.PI*2);ctx.fillStyle='#c66749';ctx.fill();ctx.strokeStyle='#ffe0ab';ctx.lineWidth=5;ctx.stroke();ctx.restore();}
document.getElementById('camera-view').addEventListener('change',()=>{if(state==='ready'||state==='gameover')applyCamera();});

function firstPersonOpponentFoot(){return project(laneX(opponent),0).y+10;}
function drawFirstPersonCrowd(){
 if(!firstPerson())return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clock=reduced||state!=='playing'?0:(lastTime||0)/1000;
 ctx.save();ctx.fillStyle='#081d2966';ctx.strokeStyle='#081d2966';ctx.lineCap='round';
 for(let i=0;i<17;i++){
  const bounce=reduced?0:Math.abs(Math.sin(clock*2.5+i*.75))*8;
  const angle=Math.PI+i*Math.PI/16;
  const x=400+370*Math.cos(angle),y=330+245*Math.sin(angle)+(i%2)*7-bounce,wave=Math.sin(clock*1.8+i*1.3)*(reduced?0:3);
  ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-11,y+13);ctx.quadraticCurveTo(x,y+5,x+11,y+13);ctx.lineTo(x+14,y+42);ctx.lineTo(x-14,y+42);ctx.closePath();ctx.fill();
  ctx.lineWidth=7;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+side*9,y+17);ctx.lineTo(x+side*19,y+5);ctx.lineTo(x+side*23,y-17-wave);ctx.stroke();ctx.beginPath();ctx.arc(x+side*23,y-20-wave,5,0,Math.PI*2);ctx.fill();}
 }
 ctx.restore();
}

// Use the racket already present in the sprite; never draw a detached second racket.
function opponentContactPose(){
 if(firstPerson()&&state==='playing'&&!serving&&pointDelay===0&&ball&&ball.direction<0&&ball.depth<.16)return ball.from<.5?1:2;
 return opponentAnimation>0?opponentPose:0;
}
function opponentRacketPoint(){
 const pose=opponentContactPose(),body=project(laneX(opponent),0);
 return {x:body.x+(pose===1?-52:pose===2?52:0),y:firstPersonOpponentFoot()-(pose?94:72)};
}
function firstPersonBallPoint(p){
 if(!firstPerson()||serving||pointDelay>0||arenaRain||musicalDance||ball.depth>.06)return p;
 if(ball.direction<0&&Math.abs(laneX(opponent)-ball.from)>athleteTolerance('opponent'))return p;
 if(ball.direction>0&&opponentAnimation<=0)return p;
 const contact=opponentRacketPoint(),t=Math.max(0,1-ball.depth/.06),blend=t;
 return {...p,x:p.x+(contact.x-p.x)*blend,y:p.y+(contact.y-p.y)*blend};
}
