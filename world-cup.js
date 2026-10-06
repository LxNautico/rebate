const cupCountries=[
 ['BR','Brasil','🇧🇷'],['PT','Portugal','🇵🇹'],['AR','Argentina','🇦🇷'],['UY','Uruguai','🇺🇾'],
 ['US','Estados Unidos','🇺🇸'],['CA','Canadá','🇨🇦'],['MX','México','🇲🇽'],['FR','França','🇫🇷'],
 ['DE','Alemanha','🇩🇪'],['ES','Espanha','🇪🇸'],['IT','Itália','🇮🇹'],['GB','Reino Unido','🇬🇧'],
 ['JP','Japão','🇯🇵'],['CN','China','🇨🇳'],['KR','Coreia do Sul','🇰🇷'],['AU','Austrália','🇦🇺']
].map(([id,name,flag])=>({id,name,flag}));
const cupCountry=id=>cupCountries.find(c=>c.id===id);
const cupLabel=id=>{const c=cupCountry(id);return c?c.flag+' '+c.name:id;};
const cupFixtures=[[[0,3],[1,2]],[[0,2],[3,1]],[[0,1],[2,3]]];
let worldCup=null,savedWorldCup=null;
const cupSaveKey='rebate-world-cup-v1';
function cupShuffle(values,rng=Math.random){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function createWorldCup(options,ids,rng=Math.random){
 const teams=cupShuffle(cupCountries.map(c=>c.id),rng);
 const roster=Object.fromEntries(teams.map((country,i)=>[country,ids[i%ids.length]]));roster[options.country]=options.character;
 return {...options,teams,roster,groups:[0,1,2,3].map(i=>teams.slice(i*4,i*4+4)),phase:'groups',round:0,results:[],bracket:[],history:[],status:'active'};
}
function cupStandings(cup,group){
 const table=group.map(country=>({country,played:0,wins:0,points:0,for:0,against:0,difference:0}));
 for(const match of cup.results){const a=table.find(t=>t.country===match.a),b=table.find(t=>t.country===match.b);if(!a||!b)continue;
  a.played++;b.played++;a.for+=match.sa;b.for+=match.sb;a.against+=match.sb;b.against+=match.sa;
  const winner=match.sa>match.sb?a:b;winner.wins++;winner.points+=3;
 }
 for(const row of table)row.difference=row.for-row.against;
 return table.sort((a,b)=>b.points-a.points||b.difference-a.difference||b.for-a.for||cup.teams.indexOf(a.country)-cup.teams.indexOf(b.country));
}
function cupCurrentPair(cup){
 if(cup.phase==='groups'){const group=cup.groups.find(g=>g.includes(cup.country));const pair=cupFixtures[cup.round].find(p=>p.some(i=>group[i]===cup.country));return pair.map(i=>group[i]);}
 return cup.bracket.find(pair=>pair.includes(cup.country));
}
function cupOpponent(cup){return cupCurrentPair(cup).find(id=>id!==cup.country);}
function cupStage(cup){return cup.phase==='groups'?'Grupos · rodada '+(cup.round+1):['Quartas de final','Semifinal','Final'][cup.round];}
function cupSimulate(a,b,mode,rng=Math.random){
 const winningScore=mode==='sets'?2:5;
 const losingScore=mode==='sets'?Math.floor(rng()*2):Math.floor(rng()*4);
 return rng()<.5?{a,b,sa:winningScore,sb:losingScore,simulated:true}:{a,b,sa:losingScore,sb:winningScore,simulated:true};
}
// Record the player's match and simulate only the other fixtures of the same round.
function advanceWorldCup(cup,playerScore,rivalScore,rng=Math.random){
 if(cup.status!=='active')throw Error('Copa já encerrada');
 const own=cupCurrentPair(cup);
 const played={a:own[0],b:own[1],sa:own[0]===cup.country?playerScore:rivalScore,sb:own[0]===cup.country?rivalScore:playerScore,simulated:false};
 const won=playerScore>rivalScore;
 if(cup.phase==='groups'){
  for(const group of cup.groups)for(const pair of cupFixtures[cup.round]){const [a,b]=pair.map(i=>group[i]);cup.results.push(a===played.a&&b===played.b?played:cupSimulate(a,b,cup.mode,rng));}
  if(cup.round<2){cup.round++;return 'next';}
  const ranked=cup.groups.map(group=>cupStandings(cup,group));
  if(!ranked.some(group=>group.slice(0,2).some(row=>row.country===cup.country))){cup.status='eliminated';return 'eliminated';}
  const [a,b,c,d]=ranked.map(group=>group.map(row=>row.country));
  cup.bracket=[[a[0],b[1]],[c[0],d[1]],[b[0],a[1]],[d[0],c[1]]];cup.phase='knockout';cup.round=0;return 'qualified';
 }
 const matches=cup.bracket.map(([a,b])=>a===played.a&&b===played.b?played:cupSimulate(a,b,cup.mode,rng));
 cup.history.push({stage:cupStage(cup),matches});
 if(!won){cup.status='eliminated';return 'eliminated';}
 if(cup.round===2){cup.status='champion';return 'champion';}
 const winners=matches.map(m=>m.sa>m.sb?m.a:m.b);cup.bracket=[];
 for(let i=0;i<winners.length;i+=2)cup.bracket.push([winners[i],winners[i+1]]);
 cup.round++;return 'next';
}
function validWorldCup(cup){
 const ids=characters.map(c=>c.id);
 if(!cup||cup.status!=='active'||!cupCountry(cup.country)||!ids.includes(cup.character)||!uniformColors.includes(cup.uniform)||!['sets','quick'].includes(cup.mode)||!['easy','medium','hard'].includes(cup.difficulty)||!['groups','knockout'].includes(cup.phase)||!Number.isInteger(cup.round)||cup.round<0||cup.round>2)return false;
 if(!Array.isArray(cup.teams)||cup.teams.length!==16||new Set(cup.teams).size!==16||!cup.teams.every(cupCountry)||!cup.roster||!cup.teams.every(id=>ids.includes(cup.roster[id])))return false;
 if(!Array.isArray(cup.groups)||cup.groups.length!==4||cup.groups.some(g=>!Array.isArray(g)||g.length!==4)||new Set(cup.groups.flat()).size!==16||!cup.groups.flat().every(cupCountry))return false;
 if(!Array.isArray(cup.results)||cup.results.some(m=>!m||!cupCountry(m.a)||!cupCountry(m.b)||m.a===m.b||!Number.isFinite(m.sa)||!Number.isFinite(m.sb)||m.sa<0||m.sb<0||m.sa===m.sb)||!Array.isArray(cup.history)||!Array.isArray(cup.bracket))return false;
 if(cup.phase==='groups'&&cup.results.length!==cup.round*8)return false;
 if(cup.phase==='knockout'&&(cup.results.length!==24||cup.bracket.length!==4/2**cup.round||cup.bracket.some(p=>!Array.isArray(p)||p.length!==2||!p.every(cupCountry))||new Set(cup.bracket.flat()).size!==cup.bracket.length*2||!cup.bracket.flat().includes(cup.country)))return false;
 return true;
}
function saveWorldCup(){savedWorldCup=worldCup&&worldCup.status==='active'?JSON.parse(JSON.stringify(worldCup)):null;try{if(savedWorldCup)localStorage.setItem(cupSaveKey,JSON.stringify(savedWorldCup));else localStorage.removeItem(cupSaveKey);}catch{}renderSavedWorldCup();}
function renderSavedWorldCup(){const box=document.getElementById('saved-world-cup');box.hidden=!savedWorldCup;if(savedWorldCup)document.getElementById('saved-cup-info').textContent=cupLabel(savedWorldCup.country)+' · '+cupStage(savedWorldCup)+'. Retomar reinicia a partida com placar zerado.';}
function prepareWorldCup(){
 if(document.getElementById('competition').value!=='worldcup'){worldCup=null;renderWorldCup();return;}
 if(worldCup&&worldCup.status!=='active')worldCup=null;
 if(!worldCup)worldCup=createWorldCup({country:document.getElementById('cup-country').value,character:document.getElementById('player-character').value,uniform:document.getElementById('player-uniform').value,opponentUniform:document.getElementById('opponent-uniform').value,mode:document.getElementById('match-mode').value,difficulty:document.getElementById('difficulty').value,side:document.getElementById('table-side').value},characters.map(c=>c.id));
 for(const [id,value] of [['player-character',worldCup.character],['player-uniform',worldCup.uniform],['opponent-uniform',worldCup.opponentUniform||'red'],['match-mode',worldCup.mode],['difficulty',worldCup.difficulty],['table-side',worldCup.side||'bottom'],['cup-country',worldCup.country],['opponent-character',worldCup.roster[cupOpponent(worldCup)] ]])document.getElementById(id).value=value;
 saveWorldCup();renderWorldCup();
}
function renderWorldCup(){
 renderCourtCountries();
 const panel=document.getElementById('world-cup-panel');panel.hidden=!worldCup;
 const match=document.getElementById('cup-match');match.hidden=!worldCup;
 if(!worldCup)return;
 match.textContent=cupLabel(worldCup.country)+' × '+cupLabel(cupOpponent(worldCup))+' · '+cupStage(worldCup);
 document.getElementById('cup-stage').textContent=cupStage(worldCup)+(worldCup.status==='champion'?' · Campeão!':worldCup.status==='eliminated'?' · Eliminado':'');
 const tables=document.getElementById('cup-tables');tables.replaceChildren();
 worldCup.groups.forEach((group,index)=>{const box=document.createElement('div'),title=document.createElement('h3');title.textContent='Grupo '+String.fromCharCode(65+index);box.append(title);
  const table=document.createElement('table');const head=document.createElement('tr');for(const label of ['País','J','V','Pts','Saldo']){const th=document.createElement('th');th.textContent=label;head.append(th);}table.append(head);
  for(const row of cupStandings(worldCup,group)){const tr=document.createElement('tr');if(row.country===worldCup.country)tr.classList.add('your-country');for(const value of [cupLabel(row.country),row.played,row.wins,row.points,row.difference]){const td=document.createElement('td');td.textContent=value;tr.append(td);}table.append(tr);}box.append(table);tables.append(box);
 });
 const bracket=document.getElementById('cup-bracket');bracket.replaceChildren();
 for(const round of worldCup.history){const title=document.createElement('h3');title.textContent=round.stage;bracket.append(title);for(const m of round.matches){const row=document.createElement('p');row.textContent=cupLabel(m.a)+' '+m.sa+' × '+m.sb+' '+cupLabel(m.b)+(m.simulated?' · simulado':'');bracket.append(row);}}
 if(worldCup.phase==='knockout'&&worldCup.status==='active')for(const [a,b] of worldCup.bracket){const row=document.createElement('p');row.textContent=cupLabel(a)+' × '+cupLabel(b);bracket.append(row);}
}
function renderCourtCountries(){
 const upper=document.getElementById('court-upper-country'),lower=document.getElementById('court-lower-country');
 upper.hidden=lower.hidden=!worldCup;
 if(!worldCup)return;
 const own={id:worldCup.country,role:'Você',character:worldCup.character};
 const rivalId=cupOpponent(worldCup),rival={id:rivalId,role:'Adversário',character:worldCup.roster[rivalId]};
 const top=worldCup.side==='top';
 for(const [box,participant] of [[upper,top?own:rival],[lower,top?rival:own]]){
  box.replaceChildren();
  const flag=document.createElement('span');flag.className='court-flag';flag.textContent=cupCountry(participant.id).flag;flag.setAttribute('aria-hidden','true');
  const text=document.createElement('span');text.textContent=cupCountry(participant.id).name+' · '+participant.role+' · '+(characters.find(c=>c.id===participant.character)?.name||'');
  box.classList.toggle('your-country',participant.role==='Você');box.append(flag,text);
 }
}
function finishWorldCupMatch(){
 if(!worldCup||worldCup.status!=='active')return;
 const stage=cupStage(worldCup),outcome=advanceWorldCup(worldCup,matchMode==='sets'?playerSets:playerPoints,matchMode==='sets'?opponentSets:opponentPoints);
 document.getElementById('change-character').hidden=true;document.getElementById('leave-cup').hidden=false;
 if(outcome==='champion'){
  tournamentTrophies.push({type:'worldcup',country:worldCup.country,character:worldCup.character,difficulty:worldCup.difficulty,mode:worldCup.mode,date:new Date().toISOString()});tournamentTrophies=tournamentTrophies.slice(-50);try{localStorage.setItem('ping-pong-trophies-v1',JSON.stringify(tournamentTrophies));}catch{}
  showChampionCharacter();ui.overlay.dataset.result='champion';ui.title.textContent='🏆 Campeão mundial!';ui.message.textContent+= ' '+cupLabel(worldCup.country)+' conquistou a Copa Mundial do Rebate!';ui.start.textContent='Nova Copa';renderTournament();
 }else if(outcome==='eliminated'){ui.title.textContent='Copa encerrada';ui.message.textContent+=' '+cupLabel(worldCup.country)+' foi eliminado em '+stage+'.';ui.start.textContent='Nova Copa';}
 else{ui.title.textContent=outcome==='qualified'?'Classificado para as quartas!':'Copa Mundial · próxima partida';ui.message.textContent+=' Próximo: '+cupStage(worldCup)+' contra '+cupLabel(cupOpponent(worldCup))+' — '+characterStyles[worldCup.roster[cupOpponent(worldCup)]].label+'.';ui.start.textContent='Jogar próxima partida';}
 saveWorldCup();renderWorldCup();
}
function initializeWorldCup(){
 const select=document.getElementById('cup-country');for(const country of cupCountries){const option=document.createElement('option');option.value=country.id;option.textContent=cupLabel(country.id);select.append(option);}select.value='BR';
 try{const saved=JSON.parse(localStorage.getItem(cupSaveKey)||'null');if(validWorldCup(saved))savedWorldCup=saved;}catch{}renderSavedWorldCup();
}
document.getElementById('resume-cup').addEventListener('click',()=>{if(!validWorldCup(savedWorldCup))return;worldCup=JSON.parse(JSON.stringify(savedWorldCup));tournament=null;document.getElementById('competition').value='worldcup';document.getElementById('player-character').value=worldCup.character;start();});
document.getElementById('new-cup').addEventListener('click',()=>{worldCup=null;saveWorldCup();document.getElementById('competition').value='worldcup';updateCompetitionChoice();renderWorldCup();});
document.getElementById('leave-cup').addEventListener('click',()=>{worldCup=null;renderWorldCup();document.getElementById('leave-cup').hidden=true;openCharacterSetup();});
