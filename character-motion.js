// Visual animation only: never changes paddle position or collision geometry.
const gait={player:{last:4,phase:0,amount:0},opponent:{last:4,phase:0,amount:0}};
const celebrationImages={};
for(const [id,definition] of Object.entries(CELEBRATION_FRAMES)){const image=new Image();celebrationImages[id]=image;image.src='img/'+definition.file;}
function celebrationSource(id,color,progress,reduced=false){
 const img=celebrationImages[id];if(!img||!img.complete||!img.naturalWidth)return null;
 const sequences={maya:[0,1,2,3,4,4,3,5],caio:[0,1,2,2,3,4,4,5],alex:[0,1,2,3,3,4,5,5],rafa:[0,1,2,3,3,4,5,5],lia:[0,1,2,3,3,4,5,5],leo:[0,1,2,3,4,4,5,5],nina:[0,1,2,3,4,4,5,5],iris:[0,1,0,1,0,1,2,2]};
 const sequence=sequences[id];
 const columns=CELEBRATION_FRAMES[id].columns||6;
 const frame=reduced?(id==='maya'?3:columns-1):sequence[Math.min(sequence.length-1,Math.floor(Math.max(0,progress)*sequence.length))];
 const row=uniformColors.indexOf(color);if(row<0)return null;
 return {...CELEBRATION_FRAMES[id].frames[row*columns+frame],img};
}
function resetCharacterMotion(){for(const motion of Object.values(gait)){motion.last=4;motion.phase=0;motion.amount=0;}}
function advanceCharacterMotion(dt){
 if(dt<=0)return;
 for(const [side,position] of [['player',player],['opponent',opponent]]){
  const motion=gait[side],distance=Math.abs(position-motion.last);
  const walking=pointDelay===0?Math.min(1,distance/dt/3):0;
  motion.amount+=(walking-motion.amount)*(1-Math.exp(-dt/.06));
  motion.phase+=distance*3.4;motion.last=position;
 }
}
function drawWalkingSprite(context,source,size,motion,reduced){
 if(reduced||motion.amount<.025){drawSprite(context,source,-size/2,-size,size,size);return;}
 const step=Math.sin(motion.phase)*motion.amount;
 // Keep the hips joined: taper the displacement towards the top of each leg.
 const split=.57,slices=12;
 context.save();context.beginPath();context.rect(-size/2,-size,size,size*split);context.clip();
 drawSprite(context,source,-size/2,-size-Math.abs(step)*size*.015,size,size);context.restore();
 for(let leg=0;leg<2;leg++)for(let strip=0;strip<slices;strip++){
  const top=split+(1-split)*strip/slices,bottom=split+(1-split)*(strip+1)/slices;
  const direction=leg===0?1:-1,weight=(top-split)/(1-split);
  const offset=step*direction*size*.075*weight;
  context.save();context.beginPath();context.rect(leg===0?-size/2:0,-size+top*size,size/2,(bottom-top)*size+.6);context.clip();
  drawSprite(context,source,-size/2+offset,-size,size,size);context.restore();
 }
}
const signatureNames={alex:'Salto de vitória',rafa:'Giro acrobático',lia:'Reverência',maya:'Joelhos ao chão, braços ao céu',leo:'Giro surpresa',nina:'Dois saltos',caio:'Beijos para a torcida',iris:'Passo de dança'};
function signatureTransform(id,progress,size){
 const wave=Math.sin(Math.PI*progress),result={x:0,y:0,angle:0};
 switch(id){
  case 'alex':result.y=-size*.16*wave;break;
  case 'rafa':result.y=-size*.22*wave;result.angle=-Math.PI*2*(progress*progress*(3-2*progress));break;
  case 'lia':result.angle=.16*wave;result.y=size*.035*wave;break;
  case 'maya':result.x=size*.045*Math.sin(progress*Math.PI*2);result.angle=.07*Math.sin(progress*Math.PI*2);break;
  case 'leo':result.y=-size*.1*wave;result.angle=Math.PI*2*(progress*progress*(3-2*progress));break;
  case 'nina':result.y=-size*.13*Math.abs(Math.sin(progress*Math.PI*2));break;
  case 'caio':result.x=size*.05*Math.sin(progress*Math.PI*2);result.angle=.12*Math.sin(progress*Math.PI*4);break;
  case 'iris':result.x=size*.04*Math.sin(progress*Math.PI*4);result.y=-size*.035*Math.abs(Math.sin(progress*Math.PI*4));break;
 }
 return result;
}
