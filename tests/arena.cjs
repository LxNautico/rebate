const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','table-side.js','arena.js','presentation.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
document.getElementById('competition').value='single';document.getElementById('play-style').value='arena';start();
check(playStyle==='arena'&&!document.getElementById('arena-controls').hidden,'Arena start');
for(let i=0;i<5;i++)arenaReturn(true);check(arenaEnergy===100,'five returns');
armArena();check(!arenaArmed,'no special during serve');send();check(!ball.special&&arenaEnergy===100,'normal serve');
armArena();check(arenaArmed,'armed');arenaReturn(true);send(1);
check(ball.special&&ball.speed===1.35&&arenaEnergy===0&&ball.curve===1,'special consumption and curve');
const before=ball.depth;advance(.01);check(Math.abs((before-ball.depth)-rallyBallSpeed(matchStats.currentSequence)*1.35*.01)<1e-8,'outgoing special speed');
for(let i=0;i<5;i++)arenaReturn(false);applyOpponentShot();arenaShot(false);
check(ball.special&&rivalEnergy===0&&ball.speed>1.2,'rival special');
arenaEnergy=100;arenaArmed=true;prepareServe();check(arenaEnergy===100&&!arenaArmed,'energy between points');
start();check(arenaEnergy===0&&rivalEnergy===0,'restart reset');
playerPoints=5;opponentPoints=0;matchStats.sets=[[5,0]];end('Arena');
check(rankingEntries.some(e=>e.playStyle==='arena'),'Arena ranking');
document.getElementById('play-style').value='classic';start();arenaReturn(true);send();
check(arenaEnergy===0&&!ball.special&&document.getElementById('arena-controls').hidden,'classic unchanged');
playerPoints=5;opponentPoints=0;matchStats.sets=[[5,0]];end('Classic');
check(rankingEntries.some(e=>e.playStyle==='classic')&&rankingEntries.some(e=>e.playStyle==='arena'),'separate ranking retention');
check(document.getElementById('ranking-list').children.length===1,'ranking filter');
document.getElementById('play-style').value='arena';document.getElementById('competition').value='tournament';start();
check(savedTournament.playStyle==='arena','saved tournament style');document.getElementById('play-style').value='classic';start();check(playStyle==='arena','tournament style retained');
tournament=null;document.getElementById('competition').value='worldcup';start();
check(savedWorldCup.playStyle==='arena','saved cup style');document.getElementById('play-style').value='classic';start();check(playStyle==='arena','cup style retained');
worldCup.playStyle=undefined;start();check(playStyle==='classic','old cup defaults classic');
console.log('PASS: energy, serve guard, special speed, rival powers, point/match resets, Classic, rankings and competition persistence.');
`,sandbox);
