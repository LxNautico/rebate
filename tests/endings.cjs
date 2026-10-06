const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','table-side.js','arena.js','presentation.js','endings.js','stories.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
const before=JSON.stringify([state,score,playerPoints,opponentPoints,rankingEntries,tournamentTrophies,worldCup,tournament,storySeen]);
for(const id of Object.keys(endingScenes))for(const color of uniformColors)for(const reduced of [false,true]){
 window.matchMedia=()=>({matches:reduced});for(const t of [0,.2,2,4,6,8])paintEnding(document.getElementById('champion-scene'),id,color,t);
}
check(JSON.stringify([state,score,playerPoints,opponentPoints,rankingEntries,tournamentTrophies,worldCup,tournament,storySeen])===before,'no game-state changes');
playerCharacter='maya';showChampionCharacter();ui.overlay.hidden=false;drawEndings(.1);
showStory('caio',3);check(!document.getElementById('story-scene').hidden,'gallery final scene');drawEndings(.1);closeStory();showStory('caio',0);check(document.getElementById('story-scene').hidden,'ordinary card hides scene');closeStory();
console.log('PASS: eight scenes, five uniforms, six animation moments, reduced motion, gallery/trophy visibility and no progress changes.');
`,sandbox);
