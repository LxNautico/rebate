// Run from any directory: node Ping-Pong/tests/balance.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={document:{getElementById:()=>({addEventListener(){}})}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../personalities.js'),'utf8'),sandbox);
const report=vm.runInContext(`
(() => {
 let seed=20261004;
 const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const results=[];
 for(const id of Object.keys(characterStyles))for(const level of ['easy','medium','hard']){
  resetOpponentStyle();let edges=0,out=0,curves=0,totalSpeed=0;
  for(let i=0;i<3000;i++){
   const shot=chooseOpponentShot(id,i%2?2:6,level,false,rng);
   if(!Number.isFinite(shot.lane)||Math.abs(shot.curve)>1||shot.speed<.9||shot.speed>1.12)throw Error('Invalid shot: '+id);
   if(shot.lane<0||shot.lane>8){out++;if(id!=='caio')throw Error('Unexpected risk');}
   if(shot.lane<=1||shot.lane>=7)edges++;
   if(shot.curve)curves++;
   totalSpeed+=shot.speed;
   const serve=chooseOpponentShot(id,4,level,true,rng);
   if(serve.lane<0||serve.lane>8||serve.speed!==1)throw Error('Illegal serve');
  }
  results.push({id,level,edges:Math.round(edges/30),out:Math.round(out/30),curves:Math.round(curves/30),speed:+(totalSpeed/3000).toFixed(2)});
 }
 const movement=[];
 for(const fps of [30,60,120]){resetOpponentStyle();for(let i=1;i<=fps;i++)observePlayerPosition(4+i/fps,1/fps);movement.push(opponentPlayerMotion);}
 return {results,movement,initial:rallyBallSpeed(0),long:rallyBallSpeed(100),medium:rallyBallSpeed(5)};
})()`,sandbox);
assert(report.movement.every(v=>Math.abs(v-1)<.001),'Motion estimate should agree across frame rates');
assert.equal(report.initial,.48);assert.equal(report.long,.9);assert(report.medium>report.initial);
for(const r of report.results){if(r.id==='maya'){assert.equal(r.edges,0);assert.equal(r.speed,.9);}if(r.id==='rafa'){assert.equal(r.edges,100);assert.equal(r.speed,1.12);}if(r.id==='caio')assert(r.out>=3&&r.out<=6);}
console.table(report.results);
console.log('PASS: 72,000 returns + 72,000 serves; 30/60/120 FPS motion; bounded rally pace. Percentages describe decisions, not win rates.');
