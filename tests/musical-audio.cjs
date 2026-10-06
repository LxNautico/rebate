const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const frequencies=[],starts=[],stops=[];
const button={addEventListener(){},setAttribute(){}};
class Clip{play(){return Promise.resolve()}pause(){}}
class Context{constructor(){this.state='running';this.currentTime=10;this.destination={}}createOscillator(){return {frequency:{setValueAtTime(f){frequencies.push(f)},exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(t){starts.push(t)},stop(t){stops.push(t)}}}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}}
const sandbox={Audio:Clip,window:{AudioContext:Context},localStorage:{getItem(){return null}},document:{getElementById:()=>button,addEventListener(){},querySelectorAll:()=>[]}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../audio.js'),'utf8'),sandbox);vm.runInContext('gameAudio.unlock();for(let i=0;i<9;i++)gameAudio.note(i);gameAudio.music([0,2,4,2],2);',sandbox);
assert.deepEqual(frequencies.slice(0,9),[261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33]);assert(starts.slice(9).every(t=>t>=10&&t<13));assert(stops.every(t=>Number.isFinite(t)));console.log('PASS: nine stable note frequencies and remaining melody scheduled within five-second celebration.');
