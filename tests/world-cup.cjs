const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const ids=['alex','rafa','lia','maya','leo','nina','caio','iris'];
const context={characters:ids.map(id=>({id})),uniformColors:['blue','red','green','purple','white'],document:{getElementById:()=>({addEventListener(){}})}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../world-cup.js'),'utf8'),context);
const result=vm.runInContext(`(() => {
 let seed=17;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const options={country:'BR',character:'alex',uniform:'white',opponentUniform:'red',mode:'quick',difficulty:'medium',side:'top'};
 let count=0;
 for(const mode of ['quick','sets'])for(let simulation=0;simulation<100;simulation++){
  const cup=createWorldCup({...options,mode},characters.map(c=>c.id),rng);
  if(!validWorldCup(cup)||new Set(cup.groups.flat()).size!==16)throw Error('creation');
  const rivals=[];
  for(let round=0;round<3;round++){
   rivals.push(cupOpponent(cup));const outcome=advanceWorldCup(cup,mode==='sets'?2:5,mode==='sets'?1:2,rng);
   if(!validWorldCup(cup))throw Error('saved progress');
   if(round===2&&outcome!=='qualified')throw Error('three wins qualify');
   const copy=JSON.parse(JSON.stringify(cup));if(cupOpponent(copy)!==cupOpponent(cup)||copy.side!=='top')throw Error('reload');
  }
  if(new Set(rivals).size!==3||cup.results.length!==24)throw Error('group schedule');
  for(const group of cup.groups)if(cupStandings(cup,group).some(row=>row.played!==3))throw Error('played');
  const allMatches=new Set(cup.results.map(m=>[m.a,m.b].sort().join('-')));if(allMatches.size!==24)throw Error('duplicate fixture');
  for(let round=0;round<3;round++){
   const outcome=advanceWorldCup(cup,mode==='sets'?2:5,0,rng);
   if(round<2&&!validWorldCup(cup))throw Error('knockout save');
   if(round===2&&(outcome!=='champion'||cup.status!=='champion'))throw Error('title');
  }
  if(cup.history.length!==3||cup.history.map(h=>h.matches.length).join()!=='4,2,1')throw Error('bracket');
  count++;
 }
 const lost=createWorldCup(options,characters.map(c=>c.id),rng);
 advanceWorldCup(lost,0,5,rng);if(lost.status!=='active')throw Error('early elimination');
 advanceWorldCup(lost,0,5,rng);if(advanceWorldCup(lost,0,5,rng)!=='eliminated')throw Error('group elimination');
 const knockout=createWorldCup(options,characters.map(c=>c.id),rng);
 for(let i=0;i<3;i++)advanceWorldCup(knockout,5,0,rng);
 if(advanceWorldCup(knockout,0,5,rng)!=='eliminated')throw Error('quarter elimination');
 const corrupt=createWorldCup(options,characters.map(c=>c.id),rng);corrupt.groups[0][0]=corrupt.groups[0][1];if(validWorldCup(corrupt))throw Error('invalid save accepted');
 return count;
})()`,context);
assert.equal(result,200);
console.log('PASS: 200 complete Cups, unique groups and fixtures, standings, 4/2/1 bracket, reload, both scoring modes, elimination and invalid-save validation.');
