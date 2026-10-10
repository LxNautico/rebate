const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){sandbox.scheduled=(sandbox.scheduled||0)+1;},gameAudio:{unlock(){},play(){},stop(){}}};
sandbox.renderScheduledCount=()=>sandbox.scheduled||0;
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','camera.js','table-side.js','arena.js','presentation.js','endings.js','stories.js','attributes.js','musical.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
for(const side of ['top','bottom']){
 document.getElementById('competition').value='single';document.getElementById('camera-view').value='first';document.getElementById('table-side').value=side;start();
 check(firstPerson()&&!viewTop()&&hitKey()==='arrowup','own-side perspective');
 check(firstPersonOpponentFoot()-project(laneX(opponent),0).y===-8,'opponent stands at table edge');drawFirstPersonCrowd();drawFirstPersonBoundary();check(firstPersonBallSpeed()===1.18,'experimental ball pace');
 const far=project(.5,0),near=project(.5,1);check(project(.5,.5).y>490&&project(.5,.5).y<520,'net stays near player');check(project(1,0).x-project(0,0).x<400,'far end gently tapered');check(near.y-far.y<280,'lower eye-level view');check(far.x===400&&near.x===400&&near.y>far.y&&near.scale>far.scale,'projection');
 const rect={left:0,top:0,width:800,height:900};for(const lane of [2,4,6]){const p=project(laneX(lane),.8);check(Math.abs(firstPersonTap(p.x,p.y,rect)-lane)<1e-8,'touch inverse');}
 frame(0);frame(16);strike();for(let i=0;i<5;i++)frame(66+i*50);check(!serving&&!frameErrorReported,'draw and serve');ball.direction=-1;ball.depth=.1;firstPersonBallPoint(project(ballX(),ball.depth,ballHeight()));ball.direction=1;opponentAnimation=.38;firstPersonBallPoint(project(ballX(),ball.depth,ballHeight()));
}
ball.direction=-1;ball.depth=0;ball.from=laneX(opponent);ball.isServe=false;
const contact=opponentRacketPoint(),visual=firstPersonBallPoint(project(ball.from,0,41));check(Math.abs(visual.x-contact.x)<1e-8&&Math.abs(visual.y-contact.y)<1e-8,'ball meets sprite racket at return');
ball.cameraContact={...contact,pose:opponentContactPose()};ball.direction=1;opponentPose=ball.cameraContact.pose;opponentAnimation=.38;
const leaving=firstPersonBallPoint(project(ball.from,0,31));check(Math.hypot(leaving.x-visual.x,leaving.y-visual.y)<1e-8,'continuous contact across direction reversal');
check(opponentContactPose()===ball.cameraContact.pose,'hold contact pose during return');
ball.depth=.015;const departing=firstPersonBallPoint(project(ball.from,ball.depth,ballHeight()));check(Math.hypot(departing.x-contact.x,departing.y-contact.y)>1,'ball leaves racket immediately');
for(const direction of [-1,1]){ball.direction=direction;const span=direction<0?.22:.5;ball.depth=span-.00001;const before=firstPersonBallPoint(project(ballX(),ball.depth,ballHeight()));ball.depth=span+.00001;const after=firstPersonBallPoint(project(ballX(),ball.depth,ballHeight()));check(Math.hypot(after.x-before.x,after.y-before.y)<.1,'no jump at trajectory join');}
opponent=6;ball.from=laneX(opponent);ball.direction=-1;ball.depth=0;ball.bounced=true;aiDelay=1;const preparedPose=opponentContactPose();advance(0);check(ball.direction===1&&ball.cameraContact.pose===preparedPose&&opponentContactPose()===preparedPose,'actual return keeps prepared pose');
const savedDepth=ball.depth;check(ballHeight(.2)!==ballHeight(.78),'height evaluated at requested trail progress');firstPersonBallPoint(project(ball.from,.1,ballHeight(.1)),.1);check(ball.depth===savedDepth,'trail sampling does not mutate gameplay');
ball.direction=1;ball.depth=.85;ball.to=laneX(player);ball.isServe=false;const ownContact=capturePlayerCameraHit();send();const ownStart=firstPersonBallPoint(project(ball.to,1,ballHeight(0)));check(Math.hypot(ownStart.x-ownContact.x,ownStart.y-ownContact.y)<1e-8,'own return starts at impact');const racketContact=playerRacketCenter();check(Math.hypot(racketContact.x-ownContact.x,racketContact.y-ownContact.y)<1e-8,'racket meets ball at impact');playerAnimation=0;check(playerRacketCenter().y===project(.5,1).y-13,'racket returns to rest');
for(const position of [0,4,8]){player=position;for(const depth of [0,.5,1]){const left=project(0,depth),right=project(1,depth);check(left.x>=0&&right.x<=800,'entire table visible');check(project(.5,depth).x===400,'table fixed during movement');}}
document.getElementById('competition').value='tournament';start();check(!firstPerson(),'experimental single only');
document.getElementById('competition').value='single';document.getElementById('camera-view').value='classic';start();check(!firstPerson()&&hitKey()==='arrowup'&&firstPersonBallSpeed()===1,'classic controls and pace');
console.log('PASS: first-person perspective, both sides, touch inverse, render/serve and competition restriction.');
`,sandbox);
