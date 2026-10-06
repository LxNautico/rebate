const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){sandbox.scheduled=(sandbox.scheduled||0)+1;},gameAudio:{unlock(){},play(){},stop(){}}};
sandbox.renderScheduledCount=()=>sandbox.scheduled||0;
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','character-motion.js','world-cup.js','table-side.js','arena.js','presentation.js','endings.js','stories.js','attributes.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
document.getElementById('competition').value='single';
for(const side of ['top','bottom'])for(const style of ['classic','arena']){
 document.getElementById('table-side').value=side;document.getElementById('play-style').value=style;start();
 frame(0);frame(16);check(state==='playing'&&serving,'start renders');strike();frame(200);frame(250);frame(300);frame(350);frame(400);check(!serving&&ball,'serve rendered');
}
check(!frameErrorReported,'normal rendering without errors');
playerPoints=4;opponentPoints=0;matchMode='quick';point(1,'Teste');frame(405);check(!frameErrorReported,'celebration fallback renders');
const original=draw;draw=()=>{throw Error('simulated temporary canvas failure');};const scheduledBefore=renderScheduledCount();frame(416);check(renderScheduledCount()>scheduledBefore,'frame rescheduled after failure');draw=original;frame(432);
check(state==='playing','render resumes');
console.log('PASS: full render loop starts Classic/Arena on both sides, serves and reschedules after a temporary drawing error.');
`,sandbox);
