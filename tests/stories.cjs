const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const elements={},storage={};
const defaults={competition:'worldcup','player-character':'maya','opponent-character':'alex','player-uniform':'white','opponent-uniform':'red','match-mode':'quick',difficulty:'easy','table-side':'top','cup-country':'BR'};
const canvas=new Proxy({}, {get:(o,k)=>o[k]||(o[k]=()=>{})});
function element(id){return elements[id]||(elements[id]={value:defaults[id]||'',textContent:'',hidden:true,dataset:{},style:{},children:[],classList:{add(){},remove(){},toggle(){}},addEventListener(k,fn){this[k]=fn},getContext:()=>canvas,replaceChildren(){this.children=[]},append(...v){this.children.push(...v)},setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect:()=>({left:0,top:0,width:360,height:405})});}
let generated=0;
const sandbox={console,document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],createElement:()=>element('generated-'+generated++),addEventListener(){}},window:{addEventListener(){},matchMedia:()=>({matches:false})},Image:class{},HTMLButtonElement:class{},localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v,removeItem:k=>delete storage[k]},requestAnimationFrame(){},gameAudio:{unlock(){},play(){},stop(){}}};
vm.createContext(sandbox);
for(const file of ['sprite-masks.js','results.js','challenges.js','personalities.js','tournament.js','rewards.js','celebration-frames.js','character-motion.js','world-cup.js','table-side.js','arena.js','presentation.js','endings.js','stories.js','attributes.js','script.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),sandbox,{filename:file});
vm.runInContext(`
function check(ok,label){if(!ok)throw Error(label);}
document.getElementById('competition').value='single';document.getElementById('match-mode').value='sets';start();
playerPoints=10;opponentPoints=0;point(1,'Teste');advance(3.1);
check(state==='story'&&storyActive.index===0&&setNumber===2,'winning set story');
const depth=ball.depth;check(!document.getElementById('story-dialog').hidden,'dialog');
closeStory();check(state==='playing'&&serving&&storySeen.maya===1,'resume serve');
check(JSON.parse(localStorage.getItem('rebate-stories-v1')).maya===1,'save progress');
playerPoints=10;opponentPoints=0;point(1,'Teste');advance(3.1);check(state==='story'&&storyActive.index===1,'next chapter on match win');closeStory();check(state==='gameover','result retained');
start();playerPoints=10;opponentPoints=0;point(1,'Teste');advance(3.1);check(storyActive.index===2,'third chapter');document.getElementById('story-skip').click();check(state==='playing'&&storySeen.maya===3,'skip resumes and prevents repeats');
check(!nextCharacterStory(),'all chapters seen');
showStory('alex',3);check(state==='story'&&document.getElementById('story-text').textContent===characterStories.alex.ending,'gallery ending');closeStory();check(state==='playing'&&!storySeen.alex,'gallery does not consume progression');
for(const id of Object.keys(characterStories)){playerCharacter=id;showChampionCharacter();check(document.getElementById('champion-ending').textContent===characterStories[id].ending,'individual champion ending');}
check(document.getElementById('story-gallery-list').children.length===8,'eight gallery characters');
console.log('PASS: winning set/match cards, ordered chapters, progress persistence, skip, resume serve, no repeats, gallery and eight endings.');
`,sandbox);
