const tourSteps=[
 {target:'.character-slots',setup:true,title:'Seu personagem e seu rival',text:'Escolha personagem e uniforme. Leia o estilo do rival; você controla livremente seus próprios golpes. Você pode experimentar as opções durante este tutorial.'},
 {target:'#competition',setup:true,title:'Partida, torneio ou Copa',text:'Partida avulsa permite escolher o rival. No torneio, enfrente três rivais sorteados. Na Copa Mundial, represente um país. Escolha Clássico ou Arena para qualquer competição. Na Arena, cinco devoluções carregam o especial: ative com Espaço ou pelo botão e rebata.'},
 {target:'#court-theme',setup:true,title:'Sua quadra',text:'Verde está disponível desde o início. As outras cores são recompensas por desafios; as cores não mudam as regras.'},
 {target:'.setup-options',setup:true,title:'Regras e dificuldade',text:'Escolha partida rápida ou três sets. Fácil, médio e difícil controlam a reação e precisão do adversário. Entrar na mesa inicia a partida depois da escolha do personagem.'},
 {target:'#gameCanvas',title:'Fique na frente da bola',text:'Use ← → ou A/D. No celular, toque na sua metade da quadra para posicionar o personagem; não é necessário arrastar. Os controles só atuam durante uma partida.'},
 {target:'.touch-controls nav',title:'Escolha onde a bola chega',text:'Os números 1–9 determinam o destino no lado adversário. Mira reta limpa essa escolha, mas não rebate a bola.'},
 {target:'.shot-controls',title:'Rebata e dê efeito',text:'Pressione ↑ quando aparecer ↑ REBATA. Segure uma seta lateral junto de ↑ para dar curva. No celular, use Golpear, Efeito ou deslize para cima na área de gesto.'},
 {target:'.ranking-panel',title:'Seu progresso',text:'Ranking, desafios e troféus ficam neste navegador. Torneios podem ser retomados, reiniciando a rodada com placar zerado. Agora você pode abrir as escolhas e jogar!'}
];
let tourIndex=0,tourSetupWasOpen=false,tourFocus=null;
const tourBox=document.getElementById('guided-tour');
function showTourStep(){
 document.querySelectorAll('.tour-highlight').forEach(el=>el.classList.remove('tour-highlight'));
 const step=tourSteps[tourIndex];
 document.getElementById('character-setup').hidden=!step.setup;
 if(!step.setup)ui.overlay.hidden=true;
 const target=document.querySelector(step.target);
 if(target){target.classList.add('tour-highlight');target.scrollIntoView({block:'center',behavior:'auto'});}
 document.getElementById('tour-progress').textContent=(tourIndex+1)+' / '+tourSteps.length;
 document.getElementById('tour-title').textContent=step.title;
 document.getElementById('tour-text').textContent=isTopSide()?step.text.replaceAll('↑','↓').replaceAll('para cima','para baixo').replaceAll('inferior','superior'):step.text;
 document.getElementById('tour-back').disabled=tourIndex===0;
 document.getElementById('tour-next').textContent=tourIndex===tourSteps.length-1?'Concluir':'Próximo';
}
function closeTour(){
 tourBox.hidden=true;document.body.classList.remove('tour-active');document.querySelectorAll('.tour-highlight').forEach(el=>el.classList.remove('tour-highlight'));
 document.getElementById('character-setup').hidden=!tourSetupWasOpen;
 ui.overlay.hidden=state==='playing'||state==='ready';
 if(tourFocus&&tourFocus.isConnected)tourFocus.focus();
}
document.querySelectorAll('[data-open-tour]').forEach(button=>button.addEventListener('click',()=>{
 if(state==='playing')pause();
 tourFocus=button;tourSetupWasOpen=!document.getElementById('character-setup').hidden;
 tourIndex=0;tourBox.hidden=false;document.body.classList.add('tour-active');openCharacterSetup();showTourStep();document.getElementById('tour-next').focus();
}));
document.getElementById('tour-next').addEventListener('click',()=>{if(tourIndex===tourSteps.length-1)closeTour();else{tourIndex++;showTourStep();}});
document.getElementById('tour-back').addEventListener('click',()=>{if(tourIndex>0){tourIndex--;showTourStep();}});
document.getElementById('tour-close').addEventListener('click',closeTour);
document.getElementById('setup-close').addEventListener('click',()=>{if(!tourBox.hidden)closeTour();document.getElementById('character-setup').hidden=true;ui.overlay.hidden=true;document.getElementById('browse-play').focus();});
document.getElementById('browse-play').addEventListener('click',()=>{if(state==='playing')pause();openCharacterSetup();});
document.getElementById('explore-play').addEventListener('click',()=>{if(state==='playing')pause();openCharacterSetup();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!tourBox.hidden)closeTour();else if(!document.getElementById('character-setup').hidden)document.getElementById('setup-close').click();}});
