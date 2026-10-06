// Recorded crowd reactions plus short synthesized table effects.
const gameAudio = (() => {
  let context = null, enabled = true;
  const active = new Set();
  const recordings = {point: new Audio('songs/aplausos.m4a?v=26ecd6bec3d5'), out: new Audio('songs/uuuuuuuuuuuu.m4a')};
  let recordingGeneration = 0;
  for (const clip of Object.values(recordings)) { clip.preload = 'auto'; clip.volume = .75; clip.loop = false; }
  function stopRecordings() { recordingGeneration++; for (const clip of Object.values(recordings)) { clip.pause(); try { clip.currentTime = 0; } catch {} } }
  function playRecording(event) {
    stopRecordings();
    const clip = recordings[event];
    clip.muted = false;
    const request = clip.play();
    if (request && request.then) request.then(() => { if (!enabled) clip.pause(); }).catch(() => {});
  }
  let recordingsPrimed = false;
  function primeRecordings() {
    if (recordingsPrimed) return;
    recordingsPrimed = true;
    const generation = recordingGeneration;
    for (const clip of Object.values(recordings)) {
      clip.muted = true;
      try { const request = clip.play(); if (request && request.then) request.then(() => { if (generation === recordingGeneration) { clip.pause(); clip.currentTime = 0; clip.muted = false; } }).catch(() => { clip.muted = false; }); } catch { clip.muted = false; }
    }
  }
  try { enabled = localStorage.getItem('ping-pong-sound') !== 'off'; } catch {}
  const button = document.getElementById('sound');
  function refresh() {
    button.textContent = enabled ? 'Som: ligado' : 'Som: desligado';
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Silenciar sons' : 'Ativar sons');
  }
  function unlock() {
    if (!enabled) return;
    primeRecordings();
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      if (!context) context = new Audio();
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch { context = null; }
  }
  function stop() {
    stopRecordings();
    for (const oscillator of active) { try { oscillator.stop(); } catch {} }
    active.clear();
  }
  function tone(frequency, delay, duration, type = 'sine', volume = .07) {
    const oscillator = context.createOscillator(), gain = context.createGain();
    const time = context.currentTime + delay;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .72, time + duration);
    gain.gain.setValueAtTime(.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + .005);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    active.add(oscillator);
    oscillator.onended = () => { active.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(time); oscillator.stop(time + duration + .01);
  }
  function play(event) {
    if (!enabled) return;
    if (event === 'point' || event === 'out') { try { playRecording(event); } catch {} return; }
    if (!context || context.state !== 'running') return;
    try {
      if (event === 'serve') tone(680, 0, .09, 'triangle');
      if (event === 'hit') tone(980, 0, .065, 'triangle');
      if (event === 'bounce') tone(420, 0, .045, 'sine', .045);
      if (event === 'miss') { tone(330, 0, .12); tone(220, .1, .16); }
    } catch { /* Audio failure must not interrupt the match. */ }
  }
  button.addEventListener('click', () => {
    enabled = !enabled;
    if (enabled) { unlock(); if(typeof resumeMusicalAudio==='function')resumeMusicalAudio(); } else stop();
    try { localStorage.setItem('ping-pong-sound', enabled ? 'on' : 'off'); } catch {}
    refresh();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  document.querySelectorAll('[data-sound-test]').forEach(button => button.addEventListener('click', () => { unlock(); if (!enabled) return; if (context && context.state === 'suspended') context.resume().then(() => play(button.dataset.soundTest)).catch(() => {}); else play(button.dataset.soundTest); }));
  refresh();
  function note(index,delay=0,duration=.22){
    if(!enabled||!context||context.state!=='running')return;
    const frequencies=[261.63,293.66,329.63,349.23,392,440,493.88,523.25,587.33];
    if(!frequencies[index])return;
    try{const oscillator=context.createOscillator(),gain=context.createGain(),time=context.currentTime+delay;oscillator.type='triangle';oscillator.frequency.setValueAtTime(frequencies[index],time);gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.055,time+.01);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);oscillator.connect(gain);gain.connect(context.destination);active.add(oscillator);oscillator.onended=()=>{active.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(time);oscillator.stop(time+duration+.01);}catch{}
  }
  function music(notes,elapsed=0){for(let beat=Math.ceil(elapsed/.32);beat*.32<5;beat++)note(notes[beat%notes.length],beat*.32-elapsed,.26);}
  return { unlock, play, stop, note, music };
})();
