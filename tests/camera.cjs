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
 check(Math.abs(firstPersonOpponentFoot()-project(laneX(opponent),0).y)===10,'opponent stands at table edge');drawFirstPersonCrowd();
 const far=project(.5,0),near=project(.5,1);check(project(.5,.5).y>450,'net closer to visual midpoint');check(far.x===400&&near.x===400&&near.y>far.y&&near.scale>far.scale,'projection');
 const rect={left:0,top:0,width:800,height:900};for(const lane of [2,4,6]){const p=project(laneX(lane),.8);check(Math.abs(firstPersonTap(p.x,p.y,rect)-lane)<1e-8,'touch inverse');}
 frame(0);frame(16);strike();for(let i=0;i<5;i++)frame(66+i*50);check(!serving&&!frameErrorReported,'draw and serve');ball.direction=-1;ball.depth=.1;firstPersonBallPoint(project(ballX(),ball.depth,ballHeight()));ball.direction=1;opponentAnimation=.38;firstPersonBallPoint(project(ballX(),ball.depth,ballHeight()));
}
ball.direction=-1;ball.depth=0;ball.from=laneX(opponent);const contact=opponentRacketPoint(),visual=firstPersonBallPoint(project(ball.from,0,41));check(visual.x===contact.x&&visual.y===contact.y,'ball meets sprite racket at return');
for(const position of [0,4,8]){player=position;for(const depth of [0,.5,1]){const left=project(0,depth),right=project(1,depth);check(left.x>=0&&right.x<=800,'entire table visible');check(project(.5,depth).x===400,'table fixed during movement');}}
document.getElementById('competition').value='tournament';start();check(!firstPerson(),'experimental single only');
document.getElementById('competition').value='single';document.getElementById('camera-view').value='classic';start();check(!firstPerson()&&hitKey()==='arrowup','classic controls');
console.log('PASS: first-person perspective, both sides, touch inverse, render/serve and competition restriction.');
`,sandbox);
