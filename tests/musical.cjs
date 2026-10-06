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
let sounded=[];gameAudio.note=n=>sounded.push(n);let songs=0;gameAudio.music=()=>songs++;
document.getElementById('competition').value='single';document.getElementById('play-style').value='arena';document.getElementById('arena-musical').checked=true;
start();musicalBounce(.5,false);check(musicalHistory.length===0,'opponent and serves excluded');
for(const melody of arenaMelodies){start();for(const n of melody.notes){musicalBounce((n+.5)/9,true);musicalBounce(.8,false);}check(musicalPending===melody,'recognition');musicalBounce(.8,false);check(musicalPending===melody,'opponent cannot spoil melody');const before=playerPoints;point(1,'Teste');check(!musicalDance&&playerPoints===before+1,'point awarded first');advance(2);check(musicalDance&&songs>0,'dance after individual interval');const depth=ball.depth;advance(1);check(ball.depth===depth,'ball frozen');pause();const elapsed=musicalDance.elapsed;finishMusicalDance();check(musicalDance.elapsed===elapsed,'paused skip guarded');pause();document.getElementById('musical-skip').click();check(!musicalDance&&serving,'skip resumes next serve');for(const n of melody.notes){musicalBounce((n+.5)/9,true);musicalBounce(.8,false);}check(!musicalPending&&musicalUsed,'once per match');}
start();musicalBounce(-.1);musicalBounce(1.1);check(musicalHistory.length===0,'outside silent');for(let n=0;n<9;n++)musicalBounce((n+.5)/9,true);check(sounded.slice(-9).join(',')==='0,1,2,3,4,5,6,7,8','nine notes');resetMusicalRally();check(musicalHistory.length===0&&!musicalPending,'rally reset');
start();playerPoints=4;opponentPoints=0;for(const n of arenaMelodies[0].notes)musicalBounce((n+.5)/9,true);point(1,'Teste');advance(2);check(musicalDance,'last-point dance');advance(5);if(storyActive)closeStory();check(state==='gameover'&&playerPoints===5,'result after dance');
start();for(const n of arenaMelodies[0].notes)musicalBounce((n+.5)/9,true);point(1,'Teste');advance(2);pause();quitMatch();check(!musicalDance&&!musicalEnabled,'quit cleanup');
document.getElementById('play-style').value='classic';start();musicalBounce(.5);check(!musicalEnabled&&musicalHistory.length===0,'classic unaffected');
document.getElementById('play-style').value='arena';document.getElementById('competition').value='tournament';document.getElementById('arena-musical').checked=true;start();check(savedTournament.musical===true,'saved tournament option');document.getElementById('arena-musical').checked=false;start();check(musicalEnabled,'retained tournament option');
tournament=null;document.getElementById('competition').value='worldcup';start();check(savedWorldCup.musical===true,'saved cup option');
console.log('PASS: three melodies, nine notes, valid bounces, post-point dance, freeze/pause/skip, once per match, result, cleanup and saved option.');
`,sandbox);
