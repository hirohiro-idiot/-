'use strict';
const $ = id => document.getElementById(id);
const T = window.GAME_TEXTS || {};
const tr = (key, fallback) => typeof T[key] === 'string' ? T[key] : fallback;
function applyTexts(){
 const mapping={heading:'h1',subtitle:'header p',eyebrow:'header .eyebrow',settingsHeading:'.panel:nth-of-type(2) h2',editorHeading:'.panel:nth-of-type(3) h2',footer:'footer'};
 for(const [key,selector] of Object.entries(mapping)){const el=document.querySelector(selector);if(el && key in T)el.textContent=T[key];}
 const ids={startButton:'start',resetButton:'reset',nextButton:'next',saveEventsButton:'saveEvents',restoreEventsButton:'restoreEvents'};
 for(const [key,id] of Object.entries(ids))if(key in T)$(id).textContent=T[key];
 const labelMap={difficultyLabel:'label[for="difficulty"]',durationLabel:'label[for="minutes"]',speechLabel:'label.check:has(#speech)',soundLabel:'label.check:has(#sound)'};
 for(const [key,selector] of Object.entries(labelMap)){
  const el=document.querySelector(selector);if(!el || !(key in T))continue;
  if(key==='difficultyLabel')el.textContent=T[key];
  else if(key==='durationLabel')el.firstChild.textContent=T[key]+' ';
  else {const input=el.querySelector('input');el.replaceChildren(input,document.createTextNode(' '+T[key]));}
 }
 const options={easyLabel:'easy',normalLabel:'normal',hardLabel:'hard'};
 for(const [key,value] of Object.entries(options))if(key in T)document.querySelector('#difficulty option[value="'+value+'"]').textContent=T[key];
 const notes=document.querySelectorAll('.panel .note');if(notes[0]&&'settingsNote'in T)notes[0].textContent=T.settingsNote;
 if(notes[1]&&'editorNote'in T)notes[1].textContent=T.editorNote;
 if('pageTitle'in T)document.title=T.pageTitle;
}

const DEFAULTS = {durationMinutes:10,difficulty:'normal',intervalSeconds:{easy:45,normal:25,hard:12},speech:false,sound:true};
const DEFAULT_EVENTS = ['深呼吸してリラックス','姿勢を整える','軽くストレッチ','水分補給を確認','少し休憩','次のチャレンジに備える'];
const key='my-timer-game-v01';
let config={...DEFAULTS}, events=[...DEFAULT_EVENTS];
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){config={...DEFAULTS,...saved.config,intervalSeconds:DEFAULTS.intervalSeconds};if(Array.isArray(saved.events))events=saved.events.filter(x=>typeof x==='string'&&x.trim()).slice(0,200);}}catch{}
let remaining=config.durationMinutes*60, deadline=0, running=false, tickId=null, nextEventAt=0, lastEvent=-1, audioCtx=null;
function persist(){try{localStorage.setItem(key,JSON.stringify({config,events}));}catch{}}
function fmt(s){s=Math.max(0,Math.ceil(s));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function paint(){ $('timer').textContent=fmt(remaining);$('start').textContent=running?tr('pauseButton','一時停止'):remaining<=0?tr('restartButton','もう一度'):tr('startButton','スタート');$('phase').textContent=remaining<=0?tr('phaseFinished','FINISHED'):running?tr('phaseRunning','RUNNING'):tr('phasePaused','PAUSED / READY');$('minutesLabel').textContent=$('minutes').value+tr('minuteUnit','分');$('next').disabled=!running||events.length===0;}
function sound(){if(!config.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.frequency.value=660;gain.gain.setValueAtTime(.06,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.16);osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.16);}catch{}}
function emitEvent(){if(!events.length){$('event').textContent=tr('noEvents','イベントが未登録です');return;}let i=Math.floor(Math.random()*events.length);if(events.length>1&&i===lastEvent)i=(i+1)%events.length;lastEvent=i;const value=events[i];$('event').textContent=value;$('hint').textContent=tr('nextEventPrefix','次のイベントまで ')+config.intervalSeconds[config.difficulty]+tr('secondsUnit',' 秒');sound();if(config.speech&&'speechSynthesis'in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.lang='ja-JP';u.rate=1;speechSynthesis.speak(u);}}
function interval(){return config.intervalSeconds[config.difficulty]||25;}
function tick(){if(!running)return;const now=performance.now();remaining=Math.max(0,(deadline-now)/1000);if(remaining<=0){finish();return;}if(now>=nextEventAt){emitEvent();nextEventAt=now+interval()*1000;}paint();}
function finish(){running=false;clearInterval(tickId);tickId=null;remaining=0;$('event').textContent=tr('finishedMessage','セッション完了！');$('hint').textContent=tr('finishedHint','お疲れさまでした');paint();sound();}
function pause(){if(!running)return;tick();running=false;clearInterval(tickId);tickId=null;if('speechSynthesis'in window)speechSynthesis.cancel();$('hint').textContent=tr('pausedHint','一時停止中');paint();}
function start(){if(running){pause();return;}if(remaining<=0)remaining=config.durationMinutes*60;running=true;deadline=performance.now()+remaining*1000;nextEventAt=performance.now();tick();tickId=setInterval(tick,200);paint();}
function reset(){running=false;clearInterval(tickId);tickId=null;if('speechSynthesis'in window)speechSynthesis.cancel();remaining=config.durationMinutes*60;$('event').textContent=tr('readyMessage','準備完了');$('hint').textContent=tr('readyHint','設定を選んでスタート');lastEvent=-1;paint();}
function saveEditor(){const list=$('events').value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,200);events=list;lastEvent=-1;persist();$('message').textContent=`${events.length}${tr('savedPrefix','件のイベントを保存しました。')}`;}
function init(){ applyTexts();$('phase').textContent=tr('phaseReady','PAUSED / READY');$('event').textContent=tr('readyMessage','準備完了');$('hint').textContent=tr('readyHint','設定を選んでスタート'); $('difficulty').value=config.difficulty;$('minutes').value=config.durationMinutes;$('speech').checked=config.speech;$('sound').checked=config.sound;$('events').value=events.join('\n');$('start').addEventListener('click',start);$('reset').addEventListener('click',reset);$('next').addEventListener('click',()=>{if(running){emitEvent();nextEventAt=performance.now()+interval()*1000;}});$('difficulty').addEventListener('change',e=>{config.difficulty=e.target.value;persist();if(running)nextEventAt=performance.now()+interval()*1000;});$('minutes').addEventListener('input',e=>{config.durationMinutes=Number(e.target.value);persist();if(!running)reset();paint();});$('speech').addEventListener('change',e=>{config.speech=e.target.checked;persist();});$('sound').addEventListener('change',e=>{config.sound=e.target.checked;persist();});$('saveEvents').addEventListener('click',saveEditor);$('restoreEvents').addEventListener('click',()=>{$('events').value=DEFAULT_EVENTS.join('\n');saveEditor();});document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});paint();}
init();
