const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','camera.js','table-side.js','arena.js','presentation.js','endings.js','stories.js','attributes.js','musical.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
document.getElementById('competition').value='single';document.getElementById('play-style').value='arena';document.getElementById('arena-power').value='signature';
for(const side of ['top','bottom'])for(const id of Object.keys(characterPowers)){
 document.getElementById('table-side').value=side;document.getElementById('player-character').value=id;document.getElementById('opponent-character').value=id==='alex'?'rafa':'alex';start();
 arenaEnergy=100;send();check(!ball.special&&arenaEnergy===100,'serve protected');armArena();selectTarget(7);send(1);
 check(ball.special&&ball.power===id&&ball.from===laneX(7),'power and aim');check(arenaEnergy===(id==='maya'?20:0),'energy');
 const landing=ball.from;for(let i=0;i<=100;i++){ball.depth=1-i/100;check(Number.isFinite(ballX())&&Number.isFinite(ballHeight()),'finite trajectory');}
 ball.depth=.22;check(Math.abs(ballX()-landing)<1e-8,'landing unchanged');
 check(ball.speed/athleteFactor('player','force')>=.78-1e-8&&ball.speed/athleteFactor('player','force')<=1.45+1e-8,'bounded player speed');
 opponentCharacter=id;rivalEnergy=100;ball.direction=1;ball.from=laneX(4);ball.to=laneX(2);ball.speed=1;arenaShot(false);
 check(ball.power===id&&rivalEnergy===(id==='maya'?20:0),'rival has same power');
}
start();ball={depth:.9,direction:1,from:laneX(4),to:laneX(4),lane:4,impact:true,bounced:true};serving=false;player=4;swing=.65;advance(.01);check(ball.direction===-1&&Math.abs(ball.speed-.85*athleteFactor('player','force'))<1e-8&&arenaRecovery.player>0,'player impact defended');
start();ball={depth:.01,direction:-1,from:laneX(4),to:laneX(4),lane:4,impact:true,bounced:true};serving=false;opponent=4;advance(.05);check(ball.direction===1&&ball.speed<1&&arenaRecovery.opponent>0,'rival impact defended');
prepareServe();check(arenaRecovery.player===0&&arenaRecovery.opponent===0,'recovery reset');
document.getElementById('play-style').value='classic';start();arenaEnergy=100;send();armArena();send();check(!ball.special&&!ball.power,'classic protected');
console.log('PASS: eight player/rival powers, both sides, energy, legal landing, finite trajectories, defended impact and Classic.');
`,sandbox);
