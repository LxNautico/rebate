const tournamentRounds=['Quartas de final','Semifinal','Final'];
let tournament=null,tournamentTrophies=[];
let savedTournament=null;
const tournamentSaveKey='ping-pong-tournament-v1';
function validTournament(value){
 const ids=characters.map(c=>c.id);
 return value&&Number.isInteger(value.round)&&value.round>=0&&value.round<3&&ids.includes(value.character)&&Array.isArray(value.rivals)&&value.rivals.length===3&&new Set(value.rivals).size===3&&value.rivals.every(id=>ids.includes(id)&&id!==value.character)&&uniformColors.includes(value.uniform)&&['quick','sets'].includes(value.mode)&&['easy','medium','hard'].includes(value.difficulty);
}
function saveTournament(){
 savedTournament=tournament?JSON.parse(JSON.stringify(tournament)):null;
 try{if(savedTournament)localStorage.setItem(tournamentSaveKey,JSON.stringify(savedTournament));else localStorage.removeItem(tournamentSaveKey);}catch{}
 renderSavedTournament();
}
function renderSavedTournament(){
 const box=document.getElementById('saved-tournament');box.hidden=!savedTournament;
 if(savedTournament){const rival=characters.find(c=>c.id===savedTournament.rivals[savedTournament.round]);document.getElementById('saved-tournament-info').textContent=tournamentRounds[savedTournament.round]+' contra '+rival.name+'. A rodada começa com o placar zerado.';}
}
function loadTournamentProgress(){
 try{const value=JSON.parse(localStorage.getItem(tournamentSaveKey)||'null');if(validTournament(value))savedTournament=value;}catch{}
 renderSavedTournament();
}
function renderTrophyGallery(){
 const list=document.getElementById('trophy-gallery');list.replaceChildren();
 for(const trophy of [...tournamentTrophies].reverse()){
  const item=document.createElement('li');const name=characters.find(c=>c.id===trophy.character)?.name||'Jogador';
  const date=new Date(trophy.date);const when=Number.isNaN(date.getTime())?'Data não registrada':date.toLocaleDateString('pt-BR');
  item.textContent=(trophy.type==='worldcup'?'🌍 Copa Mundial · '+cupLabel(trophy.country)+' · ':'🏆 Torneio · ')+name+' · '+({easy:'Fácil',medium:'Médio',hard:'Difícil'}[trophy.difficulty])+' · '+(trophy.mode==='sets'?'3 sets':'Rápida')+' · '+(trophy.playStyle==='arena'?'Arena':'Clássico')+' · '+when;list.append(item);
 }
 document.getElementById('trophy-empty').hidden=tournamentTrophies.length>0;
}
try{const saved=JSON.parse(localStorage.getItem('ping-pong-trophies-v1')||'[]');if(Array.isArray(saved))tournamentTrophies=saved.filter(t=>t&&typeof t.character==='string'&&['easy','medium','hard'].includes(t.difficulty)).slice(-50);}catch{}
function renderTournament(){
 const panel=document.getElementById('tournament-status');
 if(tournament){const rival=characters.find(c=>c.id===tournament.rivals[tournament.round]);panel.textContent=tournamentRounds[tournament.round]+' · '+rival.name+' — '+characterStyles[rival.id].label;}
 else panel.textContent='Vença três adversários diferentes para conquistar o troféu.';
 document.getElementById('tournament-trophies').textContent='🏆 '+tournamentTrophies.length+' '+(tournamentTrophies.length===1?'torneio conquistado':'torneios conquistados')+' neste navegador';
 renderTrophyGallery();
}
function prepareTournament(){
 if(document.getElementById('competition').value!=='tournament'){tournament=null;renderTournament();return;}
 if(!tournament){
  const selected=document.getElementById('player-character').value;
  const rivals=characters.filter(c=>c.id!==selected).map(c=>c.id);
  for(let i=rivals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rivals[i],rivals[j]]=[rivals[j],rivals[i]];}
  tournament={musical:document.getElementById('arena-musical').checked,playStyle:selectedPlayStyle(),rivals:rivals.slice(0,3),round:0,character:selected,uniform:document.getElementById('player-uniform').value,mode:document.getElementById('match-mode').value,difficulty:document.getElementById('difficulty').value,side:document.getElementById('table-side').value};
 }
 document.getElementById('arena-musical').checked=tournament.musical===true;document.getElementById('play-style').value=tournament.playStyle||'classic';document.getElementById('table-side').value=tournament.side==='top'?'top':'bottom';document.getElementById('player-character').value=tournament.character;
 document.getElementById('player-uniform').value=tournament.uniform;
 document.getElementById('match-mode').value=tournament.mode;
 document.getElementById('difficulty').value=tournament.difficulty;
 document.getElementById('opponent-character').value=tournament.rivals[tournament.round];
 saveTournament();
 renderTournament();
}
function finishTournamentRound(){
 if(!tournament)return;
 const won=matchMode==='sets'?playerSets>opponentSets:playerPoints>opponentPoints;
 document.getElementById('change-character').hidden=true;
 if(!won){ui.title.textContent='Torneio encerrado';ui.message.textContent+=' Você foi eliminado nas '+tournamentRounds[tournament.round].toLowerCase()+'. Tente conquistar o troféu novamente!';ui.start.textContent='Novo torneio';tournament=null;}
 else if(tournament.round===2){
  const trophy={playStyle:tournament.playStyle||'classic',character:tournament.character,difficulty:tournament.difficulty,mode:tournament.mode,date:new Date().toISOString()};
  tournamentTrophies.push(trophy);tournamentTrophies=tournamentTrophies.slice(-50);
  try{localStorage.setItem('ping-pong-trophies-v1',JSON.stringify(tournamentTrophies));}catch{}
  showChampionCharacter();ui.overlay.dataset.result='champion';ui.title.textContent='🏆 Campeão do torneio!';ui.message.textContent+=' Você venceu as três rodadas e conquistou um troféu!';ui.start.textContent='Novo torneio';tournament=null;
 }else{
  tournament.round++;
  const rival=characters.find(c=>c.id===tournament.rivals[tournament.round]);
  ui.title.textContent='Você avançou!';ui.message.textContent+=' Próxima rodada: '+tournamentRounds[tournament.round]+'. Rival: '+rival.name+' — '+characterStyles[rival.id].label+'. '+characterStyles[rival.id].description;ui.start.textContent='Jogar '+tournamentRounds[tournament.round].toLowerCase();
 }
 document.getElementById('leave-tournament').hidden=false;
 saveTournament();
 renderTournament();
}
function updateCompetitionChoice(){
 const choice=document.getElementById('competition').value;const selected=choice!=='single';document.getElementById('cup-country-choice').hidden=choice!=='worldcup';
 document.getElementById('opponent-character').disabled=selected;
 document.getElementById('competition-note').textContent=choice==='worldcup'?'16 países: três partidas de grupos, quartas, semifinal e final. Outras partidas são simuladas.':selected?'Três rodadas com rivais sorteados. Seu personagem, regras e dificuldade permanecem até o fim.':'Escolha seu adversário para treinar ou jogar uma partida.';
}
document.getElementById('competition').addEventListener('change',updateCompetitionChoice);
document.getElementById('leave-tournament').addEventListener('click',()=>{tournament=null;document.getElementById('leave-tournament').hidden=true;renderTournament();openCharacterSetup();});
document.getElementById('resume-tournament').addEventListener('click',()=>{
 if(!validTournament(savedTournament))return;
 worldCup=null;renderWorldCup();tournament=JSON.parse(JSON.stringify(savedTournament));document.getElementById('competition').value='tournament';
 document.getElementById('arena-musical').checked=tournament.musical===true;document.getElementById('play-style').value=tournament.playStyle||'classic';document.getElementById('table-side').value=tournament.side==='top'?'top':'bottom';document.getElementById('player-character').value=tournament.character;prepareTournament();updateCharacterPreviews();start();
});
document.getElementById('new-tournament').addEventListener('click',()=>{tournament=null;saveTournament();document.getElementById('competition').value='tournament';updateCompetitionChoice();renderTournament();});
