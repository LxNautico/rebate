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
state='ready';ui.overlay.hidden=true;document.getElementById('character-setup').hidden=true;document.getElementById('guided-tour').hidden=true;
for(const img of Object.values(uniformImages)){img.complete=true;img.naturalWidth=1536;img.naturalHeight=1024;}
const before=JSON.stringify([state,player,opponent,playerCharacter,opponentCharacter,score,playerPoints,opponentPoints,arenaEnergy,rankingEntries,tournamentTrophies,worldCup,tournament,matchStats]);
const pairs=new Set();
for(let i=0;i<4*8*60;i++){drawPresentation(1/60);pairs.add(presentationPair);}
check(pairs.size===4,'four pairs');
check(JSON.stringify([state,player,opponent,playerCharacter,opponentCharacter,score,playerPoints,opponentPoints,arenaEnergy,rankingEntries,tournamentTrophies,worldCup,tournament,matchStats])===before,'no game mutations');
let time=presentationTime;document.getElementById('character-setup').hidden=false;drawPresentation(1);check(presentationTime===time&&document.getElementById('presentation-caption').hidden,'setup stops demo');
document.getElementById('character-setup').hidden=true;document.getElementById('guided-tour').hidden=false;drawPresentation(1);check(presentationTime===time,'tour stops demo');document.getElementById('guided-tour').hidden=true;
window.matchMedia=()=>({matches:true});drawPresentation(1);check(presentationTime===time,'reduced motion static');window.matchMedia=()=>({matches:false});
for(const side of ['top','bottom']){playerSide=side;drawPresentation(.1);}
start();time=presentationTime;drawPresentation(1);check(presentationTime===time&&document.getElementById('presentation-caption').hidden,'match stops demo');
pause();drawPresentation(1);check(presentationTime===time,'pause preserved');
state='gameover';drawPresentation(1);check(presentationTime===time,'result preserved');
console.log('PASS: four pairs, sprite rendering, both sides, reduced motion, selection/tutorial/match guards and no changes to game progress.');
`,sandbox);
