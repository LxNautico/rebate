// Lightweight illustrated epilogues; no video download or match-state changes.
const endingScenes={
 alex:{title:'A medalha de Bia',place:'home',people:[{name:'Helena',x:260,color:'#bc74b7'},{name:'Bia',x:183,color:'#f9c769',child:true}],action:'medal',description:'Alex comemora em casa com Helena e Bia, que lhe entrega uma medalha de papel.'},
 rafa:{title:'O ritmo da vitória',place:'music',people:[{name:'Sônia',x:190,color:'#c4876e'},{name:'Amigos',x:278,color:'#7cbdb4'}],action:'drum',description:'Rafa entrega o troféu à mãe, Sônia, e comemora tocando percussão com os amigos.'},
 lia:{title:'A próxima ideia',place:'garden',people:[{name:'António',x:237,color:'#91a8d0',elder:true}],action:'chess',description:'Lia encontra o avô António no jardim e compartilha uma partida de xadrez ao lado do troféu.'},
 maya:{title:'Uma conquista que cresce',place:'garden',people:[{name:'Lucas',x:180,color:'#f4c569',child:true},{name:'André',x:275,color:'#789cdd'}],action:'plant',description:'Maya abraça Lucas e planta uma muda com sua família para marcar a conquista.'},
 leo:{title:'Uma foto para lembrar',place:'sunset',people:[{name:'Luiza',x:240,color:'#b691dc'}],action:'camera',description:'Léo e Luiza fotografam o troféu e comemoram no mirante ao pôr do sol.'},
 nina:{title:'Peças da nossa história',place:'home',people:[{name:'Rosa',x:247,color:'#c58ba1'}],action:'puzzle',description:'Nina entrega à tia Rosa um desenho das duas e comemora montando um quebra-cabeça.'},
 caio:{title:'A melhor parceira de dança',place:'music',people:[{name:'Celina',x:215,color:'#d69dc4',elder:true},{name:'Amigos',x:292,color:'#85bda2'}],action:'dance',description:'Caio deixa o troféu de lado para dançar com a avó Celina enquanto os amigos aplaudem.'},
 iris:{title:'De volta à primeira quadra',place:'court',people:[{name:'Joana',x:246,color:'#cc8fc0'}],action:'rally',description:'Íris reencontra Joana na primeira quadra; as duas trocam bolas e dançam ao lado do troféu.'}
};
let endingClock=0;
function paintEnding(canvas,id,color,time){
 const scene=endingScenes[id];if(!scene)return;
 const c=canvas.getContext('2d'),reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches,t=reduced?0:time,wave=Math.sin(t*2),beat=Math.sin(t*5),phase=t%8;
 canvas.setAttribute('aria-label',scene.description);
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const circle=(x,y,r,color)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill();};
 const stroke=(x,y,a,b,color,width=3)=>{c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.strokeStyle=color;c.lineWidth=width;c.stroke();};
 const text=(value,x,y,color='#edf4ef',size=12)=>{c.font=size+'px system-ui';c.textAlign='center';c.fillStyle=color;c.fillText(value,x,y);};
 rect(0,0,360,240,scene.place==='sunset'?'#915d75':scene.place==='home'?'#294750':'#204b51');
 if(scene.place==='sunset'){circle(285,65,32,'#f5b77e');c.beginPath();c.moveTo(0,180);c.lineTo(90,100);c.lineTo(190,185);c.lineTo(290,110);c.lineTo(360,180);c.fillStyle='#384b60';c.fill();}
 if(scene.place==='home'){rect(25,35,75,60,'#82bbd0');stroke(62,35,62,95,'#e7d8b9');stroke(25,65,100,65,'#e7d8b9');rect(265,50,55,40,'#d3ad7a');rect(270,55,45,30,'#9daec1');}
 if(scene.place==='garden'){for(const x of [30,325]){rect(x-4,65,8,105,'#9d7b55');circle(x,65,29,'#699c72');circle(x+8,50,21,'#77aa7c');}}
 if(scene.place==='music'){for(const x of [35,325]){circle(x,42,10,'#f6d77a');stroke(x,0,x,32,'#b8cbc0');}for(let i=0;i<4;i++)text('♪',42+i*82,65+Math.sin(t*2+i)*5,'#ffdc91',20);}
 rect(0,184,360,56,scene.place==='court'?'#3d8278':scene.place==='garden'?'#53846a':'#695d59');
 if(scene.place==='court'){stroke(12,214,345,214,'#e8eacb');stroke(180,184,180,226,'#e8eacb');}
 const dancing=scene.action==='dance'||(scene.action==='rally'&&phase>5),heroX=105+(dancing?wave*9:0),heroY=191+(dancing?-Math.abs(beat)*5:scene.action==='plant'&&phase<3?10:0);
 const source=celebrationSource(id,color,(t%3)/3,reduced)||spriteSource(id,color,false,dancing?2:0);
 if(source)drawSprite(c,source,heroX-57,heroY-115,114,115);else{circle(heroX,111,13,'#d4a17c');rect(heroX-15,125,30,39,'#91aec9');stroke(heroX-8,164,heroX-15,190,'#173b51',7);stroke(heroX+8,164,heroX+15,190,'#173b51',7);}
 for(const person of scene.people){const x=person.x+(dancing?Math.sin(t*2+1)*6:0),feet=193,scale=person.child?.7:1,headY=feet-74*scale;circle(x,headY,11*scale,person.elder?'#d7b199':'#cf9c7b');circle(x,headY-7*scale,9*scale,person.elder?'#ddd8d2':'#5a403b');circle(x,headY+1,8*scale,person.elder?'#d7b199':'#cf9c7b');rect(x-12*scale,headY+10*scale,24*scale,31*scale,person.color);stroke(x-6*scale,headY+41*scale,x-9*scale,feet,'#263f53',5*scale);stroke(x+6*scale,headY+41*scale,x+9*scale,feet,'#263f53',5*scale);const lift=dancing?beat*10:scene.action==='medal'&&person.child?-13:scene.action==='plant'?-5:0;stroke(x-12*scale,headY+16*scale,x-23*scale,headY+35*scale+lift,'#cf9c7b',4*scale);stroke(x+12*scale,headY+16*scale,x+23*scale,headY+35*scale-lift,'#cf9c7b',4*scale);text(person.name,x,211,'#f5ead8',10);}
 // The trophy remains visible beside the shared activity.
 rect(26,158,42,5,'#b38d62');rect(31,163,5,29,'#8e6b4b');rect(58,163,5,29,'#8e6b4b');rect(41,140,13,14,'#f5cd70');rect(38,130,19,12,'#f5cd70');stroke(34,130,34,141,'#f5cd70');stroke(61,130,61,141,'#f5cd70');rect(38,154,20,4,'#ffe199');
 if(scene.action==='medal'){const mx=heroX+25+wave*5;stroke(mx,132,mx-7,147,'#efdecb');stroke(mx,132,mx+7,147,'#efdecb');circle(mx,150,8,'#ffe3a1');text('★',mx,154,'#ad7c31',11);}
 if(scene.action==='drum'){rect(heroX-17,157,34,24,'#d8a26a');circle(heroX,157,17,'#f4d5a3');stroke(heroX-28,139+beat*5,heroX-5,157,'#ecd6ab');stroke(heroX+28,139-beat*5,heroX+5,157,'#ecd6ab');}
 if(scene.action==='chess'||scene.action==='puzzle'){rect(142,156,77,7,'#bd936c');rect(147,163,5,27,'#9a7756');rect(209,163,5,27,'#9a7756');for(let a=0;a<6;a++)for(let b=0;b<3;b++)rect(144+a*12,145+b*4,12,4,scene.action==='chess'?((a+b)%2?'#e9dbc0':'#4c5d65'):['#dbac86','#8fb2c5','#bb94c7'][(a+b)%3]);if(scene.action==='chess'){circle(160,142,4,'#eee2cf');circle(200,141,4,'#29383e');}else{rect(286,76,29,22,'#efdcc1');stroke(291,91,307,82,'#859bbb',2);}}
 if(scene.action==='plant'){rect(160,174,30,14,'#a37455');stroke(175,174,175,154,'#96d383');stroke(175,166,166,158,'#96d383');stroke(175,160,183,150,'#96d383');circle(184,150,5,'#a1d980');circle(165,156,5,'#a1d980');}
 if(scene.action==='camera'){rect(208,137,24,14,'#304455');circle(220,144,5,'#afc7d1');if(!reduced&&phase<.15)rect(216,125,8,5,'#fff2d2');}
 if(scene.action==='rally'&&!dancing){const x=135+(Math.sin(t*3)+1)*43;circle(x,145-Math.abs(Math.cos(t*3))*20,4,'#ffe1a3');}
 text(scene.title,180,25,'#ffe1a0',16);text(characters.find(character=>character.id===id).name,heroX,211,'#f5ead8',10);
}
function drawEndings(dt){
 endingClock+=dt;
 if(!document.getElementById('champion-display').hidden&&!ui.overlay.hidden){paintEnding(document.getElementById('champion-scene'),playerCharacter,playerUniform,endingClock);}
 if(storyActive&&storyActive.index===3&&!document.getElementById('story-dialog').hidden){paintEnding(document.getElementById('story-scene'),storyActive.id,storyActive.id===playerCharacter?playerUniform:'blue',endingClock);}
}
