let playerSide='bottom';
const isTopSide=()=>playerSide==='top';
const hitKey=()=>(!firstPerson()&&isTopSide())?'arrowdown':'arrowup';
const hitArrow=()=>(!firstPerson()&&isTopSide())?'↓':'↑';
function applyTableSide(){
 playerSide=document.getElementById('table-side').value==='top'?'top':'bottom';
 document.getElementById('hit').textContent=hitArrow()+' Golpear';
 document.getElementById('gesture').innerHTML=viewTop()?'↙ ↓ ↘<br><small>DESLIZE PARA BAIXO PARA REBATER</small>':'↖ ↑ ↗<br><small>DESLIZE PARA CIMA PARA REBATER</small>';
 document.querySelectorAll('[data-effect]').forEach(button=>button.textContent=Number(button.dataset.effect)<0?(viewTop()?'↙ Efeito':'↖ Efeito'):(viewTop()?'Efeito ↘':'Efeito ↗'));
 document.querySelectorAll('[data-side-copy]').forEach(el=>{if(!el.dataset.originalCopy)el.dataset.originalCopy=el.innerHTML;el.innerHTML=viewTop()?el.dataset.originalCopy.replaceAll('↑','↓').replaceAll('↖','↙').replaceAll('↗','↘').replaceAll('para cima','para baixo').replaceAll('inferior','superior'):el.dataset.originalCopy;});
 try{localStorage.setItem('ping-pong-table-side',playerSide);}catch{}
}
try{document.getElementById('table-side').value=localStorage.getItem('ping-pong-table-side')==='top'?'top':'bottom';}catch{}
document.getElementById('table-side').addEventListener('change',()=>{if(state!=='playing'&&state!=='paused')applyTableSide();});
