const courtThemes={
 classic:{name:'Verde clássica',colors:['#276a63','#348979']},
 blue:{name:'Azul arena',colors:['#245b86','#367fad']},
 purple:{name:'Roxa noturna',colors:['#563d79','#8060a0']},
 clay:{name:'Terracota',colors:['#884a34','#b56b48']}
};
let rewardProgress={sequence:0,mediumWin:false},selectedCourt='classic';
try{const value=JSON.parse(localStorage.getItem('ping-pong-rewards-v1')||'null');if(value){rewardProgress.sequence=Number.isFinite(value.sequence)?Math.max(0,value.sequence):0;rewardProgress.mediumWin=value.mediumWin===true;}const court=localStorage.getItem('ping-pong-court-v1');if(courtThemes[court])selectedCourt=court;}catch{}
function unlockedCourts(){return {classic:true,blue:new Set(tournamentTrophies.map(t=>t.character)).size>=2,purple:rewardProgress.sequence>=10,clay:rewardProgress.mediumWin};}
function renderRewards(){
 const unlocked=unlockedCourts(),select=document.getElementById('court-theme');
 if(!unlocked[selectedCourt])selectedCourt='classic';
 select.replaceChildren();
 for(const [id,theme] of Object.entries(courtThemes)){const option=document.createElement('option');option.value=id;option.textContent=theme.name+(unlocked[id]?'':' · Bloqueada');option.disabled=!unlocked[id];select.append(option);}
 select.value=selectedCourt;
 const list=document.getElementById('reward-list');list.replaceChildren();
 const rows=[['blue','Campeão versátil',Math.min(2,new Set(tournamentTrophies.map(t=>t.character)).size)+'/2 personagens campeões'],['purple','Troca de mestre',Math.min(10,rewardProgress.sequence)+'/10 devoluções na mesma troca'],['clay','Novo nível',rewardProgress.mediumWin?'Vitória no médio conquistada':'Vença uma partida no médio']];
 for(const [id,title,progress] of rows){const li=document.createElement('li');li.textContent=(unlocked[id]?'✓ ':'')+title+' · '+progress+' · '+courtThemes[id].name;list.append(li);}
}
function updateRewards(won=false){
 const before=unlockedCourts();
 rewardProgress.sequence=Math.max(rewardProgress.sequence,matchStats?.longestSequence||0);
 if(won&&difficulty==='medium')rewardProgress.mediumWin=true;
 try{localStorage.setItem('ping-pong-rewards-v1',JSON.stringify(rewardProgress));}catch{}
 const after=unlockedCourts(),fresh=Object.keys(after).filter(id=>after[id]&&!before[id]);
 renderRewards();
 if(fresh.length)document.getElementById('reward-notice').textContent='Nova quadra: '+fresh.map(id=>courtThemes[id].name).join(', ')+'! Escolha antes da próxima partida.';
}
function initializeRewards(){
 rewardProgress.sequence=Math.max(rewardProgress.sequence,...rankingEntries.map(e=>e.sequence),0);
 if(rankingEntries.some(e=>e.won&&e.difficulty==='medium'))rewardProgress.mediumWin=true;
 updateRewards();
}
document.getElementById('court-theme').addEventListener('change',e=>{
 if(state==='playing'||state==='paused')return;
 selectedCourt=unlockedCourts()[e.target.value]?e.target.value:'classic';
 try{localStorage.setItem('ping-pong-court-v1',selectedCourt);}catch{}
});
