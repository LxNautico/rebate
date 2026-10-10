let cameraMode='classic';
function firstPerson(){return cameraMode==='first'&&state!=='ready';}
function viewTop(){return !firstPerson()&&isTopSide();}
function applyCamera(){cameraMode=document.getElementById('competition').value==='single'&&document.getElementById('camera-view').value==='first'?'first':'classic';}
function firstPersonProjection(x,depth,height=0){const distance=3.8-2.8*depth,scale=1/distance;return {x:400+(x-.5)*700*scale,y:250+510*depth/distance-height*scale,scale};}
function firstPersonTap(clientX,clientY,rect){const x=(clientX-rect.left)/rect.width*800,y=(clientY-rect.top)/rect.height*900,offset=Math.max(0,y-250),depth=Math.max(0,Math.min(1,offset*3.8/(510+offset*2.8))),width=700/(3.8-2.8*depth);return Math.max(0,Math.min(8,(.5+(x-400)/width)*9-.5));}
function drawFirstPersonRacket(){const lift=Math.sin(Math.PI*Math.min(1,playerAnimation/.38))*35;ctx.save();ctx.translate(Math.max(70,Math.min(730,project(laneX(player),1).x)),840-lift);ctx.rotate(-.3+Math.sin(playerAnimation*8)*.15);ctx.fillStyle='#be926b';ctx.fillRect(-9,12,18,85);ctx.beginPath();ctx.ellipse(0,-25,55,65,0,0,Math.PI*2);ctx.fillStyle='#c66749';ctx.fill();ctx.strokeStyle='#ffe0ab';ctx.lineWidth=5;ctx.stroke();ctx.restore();}
document.getElementById('camera-view').addEventListener('change',()=>{if(state==='ready'||state==='gameover')applyCamera();});

function firstPersonOpponentFoot(){return project(laneX(opponent),0).y-4;}
function drawFirstPersonCrowd(){
 if(!firstPerson())return;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clock=reduced||state!=='playing'?0:(lastTime||0)/1000;
 ctx.save();ctx.fillStyle='#081d2966';ctx.strokeStyle='#081d2966';ctx.lineCap='round';
 for(let i=0;i<17;i++){
  const x=65+i*42,y=174+(i%3)*8,wave=Math.sin(clock*1.8+i*1.3)*(reduced?0:3);
  ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-11,y+13);ctx.quadraticCurveTo(x,y+5,x+11,y+13);ctx.lineTo(x+14,y+42);ctx.lineTo(x-14,y+42);ctx.closePath();ctx.fill();
  ctx.lineWidth=7;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+side*9,y+17);ctx.lineTo(x+side*19,y+5);ctx.lineTo(x+side*23,y-17-wave);ctx.stroke();ctx.beginPath();ctx.arc(x+side*23,y-20-wave,5,0,Math.PI*2);ctx.fill();}
 }
 ctx.restore();
}
