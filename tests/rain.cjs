const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','table-side.js','arena.js','presentation.js','stories.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
for(const fps of [30,60,120]){
 document.getElementById('competition').value='single';document.getElementById('play-style').value='arena';document.getElementById('arena-power').value='rain';start();
 arenaEnergy=100;send();armArena();send();
 check(arenaRain&&arenaEnergy===0&&!arenaArmed,'rain activated on hit');check(arenaRain.helpers.length===2,'two helpers');
 const original=ball.depth;
 for(let i=0;i<fps*2;i++)advance(1/fps);
 check(ball.depth===original&&playerPoints===0&&opponentPoints===0,'normal rally suspended');
 check(arenaRain.rivalTotal>0&&arenaRain.rivalSaved>0,'rivals return balls');
 const before=arenaRain.time;pause();check(state==='paused'&&arenaRain.time===before,'pause retained');pause();
 for(let i=0;i<fps*3.7&&arenaRain;i++){
  const incoming=arenaRain.balls.filter(b=>b.direction===1).sort((a,b)=>b.depth-a.depth)[0];
  if(incoming){chooseLane(Math.max(0,Math.min(8,rainBallX(incoming)*9-.5)));strike();}
  advance(1/fps);
 }
 check(!arenaRain&&playerPoints+opponentPoints===1,'one point at end');check(score>0,'player returns');
 const total=playerPoints+opponentPoints;advance(.01);check(playerPoints+opponentPoints===total,'no repeated award');
 check(pointDelay>0,'normal point interval');
 start();check(!arenaRain,'restart clears');
}
for(const side of ['top','bottom']){
 document.getElementById('table-side').value=side;start();arenaEnergy=100;send();armArena();send();advance(.7);drawArenaRain();
 pause();quitMatch();check(!arenaRain&&state==='ready','quit clears');
}
start();startArenaRain();arenaRain.ownSaved=1;arenaRain.ownTotal=2;arenaRain.rivalSaved=2;arenaRain.rivalTotal=2;finishArenaRain();check(opponentPoints===1,'defence ratio opponent wins');
start();startArenaRain();arenaRain.ownSaved=1;arenaRain.ownTotal=2;arenaRain.rivalSaved=2;arenaRain.rivalTotal=4;finishArenaRain();check(playerPoints===1,'tie favours activator');
for(const level of ['easy','medium','hard']){
 document.getElementById('difficulty').value=level;start();startArenaRain();check(arenaRain.settings===rainDifficulty[level],'difficulty settings');
 for(let i=0;i<60;i++){advanceArenaRain(1/60);check(arenaRain.balls.length<=rainDifficulty[level].limit,'density bound');}
}
start();startArenaRain();arenaRain.balls=[{depth:.23,direction:-1,origin:.5,landing:1.2,curve:0,bounced:false,serial:0}];matchStats.currentSequence=8;advanceArenaRain(.05);check(arenaRain.ownTotal===1&&arenaRain.rivalTotal===0&&matchStats.currentSequence===0,'own outside penalty');
start();startArenaRain();arenaRain.balls=[{depth:1.11,direction:1,origin:.5,landing:.1,curve:0,bounced:true,serial:0}];matchStats.currentSequence=8;swing=0;advanceArenaRain(.05);check(arenaRain.ownTotal===1&&matchStats.currentSequence===0,'miss resets sequence');
console.log('PASS: rain activation, helpers, defence, one-point resolution, 30/60/120 FPS, pause, restart, quit and both sides.');
`,sandbox);
