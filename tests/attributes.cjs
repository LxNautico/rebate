const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','table-side.js','arena.js','presentation.js','endings.js','stories.js','attributes.js','musical.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
document.getElementById('competition').value='single';document.getElementById('player-character').value='rafa';start();
check(matchAttributes.player.force===80&&matchAttributes.opponent.force===60,'individual attributes');
const force=athleteFactor('player','force');send();check(!ball.speed,'serve unchanged');serving=false;send();check(Math.abs(ball.speed-force)<1e-8,'force affects shot');
player=0;touchMoveTarget=8;advancePlayerMovement(.1);check(player>0&&player<8,'touch runs without teleport');
const agi=player;player=0;matchAttributes.player.agility=100;touchMoveTarget=8;advancePlayerMovement(.1);check(player>agi,'agility effect');
matchAttributes.player.technique=20;const tolerance=athleteTolerance('player');matchAttributes.player.technique=80;check(athleteTolerance('player')>tolerance,'technique effect');
start();const before=matchAttributes.player.force;athleteProgress.rafa.force={gain:0,xp:39};trainReturn(1,{from:0,to:1});finishAthleteTraining();
check(athleteValues('rafa').force===81&&matchAttributes.player.force===before,'gain after match only');const saved=localStorage.getItem('rebate-athlete-progress-v1');finishAthleteTraining();check(localStorage.getItem('rebate-athlete-progress-v1')===saved,'single payment');
start();check(matchAttributes.player.force===81,'next match applies');for(let i=0;i<100;i++)trainReturn(1,{from:0,to:1});check(training.force===10&&training.agility===10&&training.technique===10,'match cap');
const previous=JSON.stringify(athleteProgress);pause();quitMatch();check(JSON.stringify(athleteProgress)===previous,'quit gives no XP');
start();athleteProgress.rafa.force={gain:15,xp:0};training.force=10;finishAthleteTraining();check(athleteProgress.rafa.force.gain===15,'training cap');
check(!document.getElementById('athlete-upper').hidden&&!document.getElementById('athlete-lower').hidden,'both bars');
console.log('PASS: character stats, shot/movement/contact effects, touch running, next-match gains, payment once, caps and quit.');
`,sandbox);
