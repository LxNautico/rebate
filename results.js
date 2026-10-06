let matchStats;
function resetMatchStats(){matchStats={currentSequence:0,longestSequence:0,opponentErrors:0,position:0,timing:0,outside:0,sets:[]};}
let rankingEntries=[];
try{const saved=JSON.parse(localStorage.getItem('ping-pong-ranking-v1')||'[]');if(Array.isArray(saved))rankingEntries=saved.filter(e=>e&&['sets','quick'].includes(e.mode)&&['easy','medium','hard'].includes(e.difficulty)&&Number.isFinite(e.returns)&&Number.isFinite(e.sequence)&&typeof e.won==='boolean').slice(0,120);}catch{}
function rankOrder(a,b){return Number(b.won)-Number(a.won)||b.returns-a.returns||b.sequence-a.sequence;}
function renderRanking(){
 const style=selectedPlayStyle(),mode=document.getElementById('match-mode').value,level=document.getElementById('difficulty').value;
 document.getElementById('ranking-filter').textContent=(style==='arena'?'Arena':'Clássico')+' · '+(mode==='sets'?'Melhor de 3 sets':'Partida rápida')+' · '+({easy:'Fácil',medium:'Médio',hard:'Difícil'}[level]||'Fácil');
 const list=document.getElementById('ranking-list');list.replaceChildren();
 const entries=rankingEntries.filter(e=>e.mode===mode&&e.difficulty===level&&(e.playStyle||'classic')===style).sort(rankOrder).slice(0,10);
 for(const entry of entries){const item=document.createElement('li'),name=document.createElement('strong'),details=document.createElement('span');name.textContent=(characters.find(c=>c.id===entry.character)?.name||'Jogador')+' · '+(entry.won?'Vitória':'Derrota');details.textContent=entry.returns+' devoluções · sequência '+entry.sequence;item.append(name,details);list.append(item);}
 document.getElementById('ranking-empty').hidden=entries.length>0;
}
function showMatchResults(){
 const won=matchMode==='sets'?playerSets>opponentSets:playerPoints>opponentPoints;
 const entry={playStyle,mode:matchMode,difficulty,character:playerCharacter,won,returns:score,sequence:matchStats.longestSequence};
 rankingEntries.push(entry);
 // Keep the ten best completed matches for each of the six independent categories.
 rankingEntries=['classic','arena'].flatMap(style=>['sets','quick'].flatMap(mode=>['easy','medium','hard'].flatMap(level=>rankingEntries.filter(e=>e.mode===mode&&e.difficulty===level&&(e.playStyle||'classic')===style).sort(rankOrder).slice(0,10))));
 try{localStorage.setItem('ping-pong-ranking-v1',JSON.stringify(rankingEntries));}catch{}
 renderRanking();const result=document.getElementById('match-results');result.replaceChildren();
 const lines=[['Sets / rodada',matchStats.sets.map((p,i)=>(matchMode==='sets'?'Set '+(i+1):'Rodada')+': '+p[0]+' × '+p[1]).join(' · ')],['Devoluções',score],['Maior sequência',matchStats.longestSequence],['Erros do adversário',matchStats.opponentErrors],['Seus erros de posição',matchStats.position],['Seus erros de tempo',matchStats.timing],['Suas bolas fora',matchStats.outside]];
 for(const [label,value] of lines){const row=document.createElement('p'),strong=document.createElement('strong');row.textContent=label+': ';strong.textContent=String(value);row.append(strong);result.append(row);}
 result.hidden=false;document.getElementById('change-character').hidden=false;
}
document.getElementById('change-character').addEventListener('click',()=>openCharacterSetup());
