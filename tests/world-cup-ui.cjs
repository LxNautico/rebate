const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','table-side.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
document.getElementById('cup-country').value='BR';document.getElementById('table-side').value='top';start();
if(!worldCup||opponentCharacter!==worldCup.roster[cupOpponent(worldCup)]||playerSide!=='top')throw Error('start');
if(document.getElementById('court-upper-country').hidden||!document.getElementById('court-upper-country').children[1].textContent.includes('Brasil · Você · Maya'))throw Error('top flag');
worldCup.side='bottom';renderCourtCountries();
if(!document.getElementById('court-lower-country').children[1].textContent.includes('Brasil · Você · Maya'))throw Error('bottom flag');
worldCup.side='top';renderCourtCountries();
for(let i=0;i<6;i++){
 playerPoints=5;opponentPoints=0;matchStats.sets=[[5,0]];end('Teste');
 if(i<5){if(!savedWorldCup||state!=='gameover')throw Error('save');start();}
}
if(worldCup.status!=='champion'||tournamentTrophies.filter(t=>t.type==='worldcup').length!==1)throw Error('trophy');
document.getElementById('competition').value='single';start();
if(worldCup!==null||tournament!==null||state!=='playing')throw Error('single');
if(!document.getElementById('court-upper-country').hidden||!document.getElementById('court-lower-country').hidden)throw Error('hide flags');
document.getElementById('competition').value='tournament';start();
if(!tournament||worldCup!==null)throw Error('short tournament');
pause();quitMatch();if(tournament!==null||state!=='ready')throw Error('quit');
console.log('PASS: full Cup UI lifecycle, six matches, save, top side, world trophy, single match and short tournament.');
`,sandbox);
