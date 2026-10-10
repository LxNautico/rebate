let cameraMode='classic';
function firstPerson(){return cameraMode==='first'&&state!=='ready';}
function viewTop(){return !firstPerson()&&isTopSide();}
function applyCamera(){cameraMode=document.getElementById('competition').value==='single'&&document.getElementById('camera-view').value==='first'?'first':'classic';}
function firstPersonProjection(x,depth,height=0){const distance=3.8-2.8*depth,scale=1/distance;return {x:400+(x-laneX(player))*760*scale,y:250+510*depth/distance-height*scale,scale};}
function firstPersonTap(clientX,clientY,rect){const x=(clientX-rect.left)/rect.width*800,y=(clientY-rect.top)/rect.height*900,offset=Math.max(0,y-250),depth=Math.max(0,Math.min(1,offset*3.8/(510+offset*2.8))),width=760/(3.8-2.8*depth);return Math.max(0,Math.min(8,(laneX(player)+(x-400)/width)*9-.5));}
function drawFirstPersonRacket(){const lift=Math.sin(Math.PI*Math.min(1,playerAnimation/.38))*35;ctx.save();ctx.translate(460,840-lift);ctx.rotate(-.3+Math.sin(playerAnimation*8)*.15);ctx.fillStyle='#be926b';ctx.fillRect(-9,12,18,85);ctx.beginPath();ctx.ellipse(0,-25,55,65,0,0,Math.PI*2);ctx.fillStyle='#c66749';ctx.fill();ctx.strokeStyle='#ffe0ab';ctx.lineWidth=5;ctx.stroke();ctx.restore();}
document.getElementById('camera-view').addEventListener('change',()=>{if(state==='ready'||state==='gameover')applyCamera();});

function firstPersonOpponentFoot(){return project(laneX(opponent),0).y-4;}
function drawFirstPersonDestinations(){if(!firstPerson())return;ctx.save();ctx.textAlign='center';ctx.font='12px system-ui';for(let i=0;i<9;i++){const p=project(laneX(i),0);ctx.fillStyle=target===i?'#ffdb84':'#abc4bf88';ctx.fillText(String(i+1),p.x,p.y-112);}ctx.restore();}
