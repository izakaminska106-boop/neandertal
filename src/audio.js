export class Sound{
 constructor(){this.enabled=false;this.context=null;}
 activate(){try{this.context??=new(window.AudioContext||window.webkitAudioContext)();this.context.resume().catch(()=>{});}catch{}}
 play(kind){if(!this.enabled||!this.context)return;const map={jump:[330,620,.12],swing:[150,70,.1],hit:[100,40,.16],hurt:[180,65,.22],collect:[650,1000,.16],checkpoint:[440,880,.3],complete:[523,1046,.5],won:[523,1568,.9]};const notes=map[kind];if(!notes)return;const [start,end,duration]=notes,ctx=this.context,o=ctx.createOscillator(),g=ctx.createGain();o.type=kind==='hit'||kind==='swing'?'triangle':'sine';o.frequency.setValueAtTime(start,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(end,ctx.currentTime+duration);g.gain.setValueAtTime(.065,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration);}
}
