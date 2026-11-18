"use strict";
(function(){
  const cfg=window.GAME_AUDIO||{};
  let player=null, started=false, fired=new Set(), lastElapsed=0;
  function stop(){if(player){player.pause();player.currentTime=0;player=null;}}
  function play(file){
    if(!cfg.enabled||typeof file!=="string"||!file.trim())return;
    stop();
    const a=new Audio(file);
    a.volume=Math.max(0,Math.min(1,Number(cfg.volume) || 0));
    player=a;
    a.play().catch(e=>console.warn("音声を再生できません:",file,e));
  }
  window.GAME_AUDIO_PLAYER={
    start(){if(!started){started=true;play(cfg.onStart);}},
    event(){play(cfg.onEvent);},
    finish(){play(cfg.onFinish);},
    pause(){if(player)player.pause();},
    resume(){if(player&&player.paused&&!player.ended)player.play().catch(()=>{});},
    reset(){stop();started=false;fired.clear();lastElapsed=0;},
    tick(elapsed){
      if(!cfg.enabled)return;
      const cues=Array.isArray(cfg.cues)?cfg.cues:[];
      for(let i=0;i<cues.length;i++){
        const c=cues[i],at=Number(c.at);
        if(!c||c.enabled===false||!Number.isFinite(at)||at<0||fired.has(i))continue;
        if(lastElapsed<=at&&elapsed>=at){fired.add(i);play(c.file);}
      }
      lastElapsed=elapsed;
    }
  };
})();
