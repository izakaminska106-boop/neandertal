import {createLevel,LEVELS,SETTINGS as S} from './levels.js';
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export class Game{
 constructor(event=()=>{}){this.event=event;this.state='menu';this.completed=0;this.total=0;this.time=0;this.camera=0;this.load(0);}
 load(index){this.level=createLevel(index);this.player={x:60,y:490,w:42,h:82,vx:0,vy:0,dir:1,hp:3,grounded:false,coyote:0,jumpBuffer:0,attack:0,cooldown:0,immune:0};this.total=this.completed*20;this.camera=0;this.time=0;}
 newGame(){this.completed=0;this.load(0);this.state='playing';this.event('new');}
 resumeCampaign(completed){this.completed=Math.max(0,Math.min(4,completed));this.load(this.completed);this.state='playing';}
 restart(){this.load(this.level.index);this.state='playing';this.event('restart');}
 jump(){if(this.state==='playing')this.player.jumpBuffer=S.buffer;}
 attack(){if(this.state!=='playing'||this.player.cooldown>0)return;this.player.attack=S.attackDuration;this.player.cooldown=S.attackCooldown;this.event('swing');}
 pause(){if(this.state==='playing'){this.state='paused';this.event('pause');}else if(this.state==='paused'){this.state='playing';this.event('resume');}}
 damage(fall=false){const p=this.player;if(p.immune>0&&!fall)return;p.hp--;p.immune=S.invulnerability;this.event('hurt');if(p.hp<=0){this.state='dead';this.event('dead');return;}if(fall){p.x=this.level.checkpoint.active?this.level.checkpoint.x:60;p.y=430;p.vx=0;p.vy=0;this.camera=Math.max(0,p.x-420);}else{p.vx=-p.dir*230;p.vy=-220;}}
 collect(b){if(b.collected)return;b.collected=true;this.level.local++;this.total=Math.min(100,this.completed*20+this.level.local);this.level.effects.push({x:b.x,y:b.y,text:'+1 BMW',ttl:1});this.event('collect');if(this.total===100){this.completed=5;this.state='won';this.event('won');}}
 tick(dt,input={}){
  if(this.state!=='playing')return;
  this.time+=dt;const p=this.player,l=this.level;
  for(const key of ['cooldown','immune','jumpBuffer','coyote'])p[key]=Math.max(0,p[key]-dt);
  if(p.grounded)p.coyote=S.coyote;
  const direction=(input.right?1:0)-(input.left?1:0);if(direction)p.dir=direction;
  const target=direction*S.speed;p.vx+=Math.max(-S.acceleration*dt,Math.min(S.acceleration*dt,target-p.vx));
  if(p.jumpBuffer>0&&p.coyote>0){p.vy=-S.jump;p.grounded=false;p.coyote=0;p.jumpBuffer=0;this.event('jump');}
  p.vy+=S.gravity*dt;
  p.x+=p.vx*dt;p.x=Math.max(0,Math.min(l.width-p.w,p.x));
  for(const plat of l.platforms){if(plat.kind==='kayak')continue;if(overlap(p,plat)){if(p.vx>0)p.x=plat.x-p.w;else if(p.vx<0)p.x=plat.x+plat.w;p.vx=0;}}
  const previousBottom=p.y+p.h;p.y+=p.vy*dt;p.grounded=false;
  for(const plat of l.platforms){if(overlap(p,plat)){if(p.vy>=0&&previousBottom<=plat.y+3){p.y=plat.y-p.h;p.vy=0;p.grounded=true;}else if(plat.kind!=='kayak'&&p.vy<0){p.y=plat.y+plat.h;p.vy=0;}}}
  if(p.y>760){this.damage(true);if(this.state!=='playing')return;}
  const oldAttack=p.attack;p.attack=Math.max(0,p.attack-dt);
  if(oldAttack>.07&&p.attack<.23){const hit={x:p.dir>0?p.x+p.w:p.x-85,y:p.y+8,w:85,h:73};
   for(const m of l.mammoths){if(!m.alive||!overlap(hit,m))continue;const blocked=l.platforms.some(r=>r.kind==='rock'&&overlap(hit,r)&&r.x<Math.max(p.x,m.x)&&r.x+r.w>Math.min(p.x+p.w,m.x+m.w));if(blocked)continue;m.alive=false;l.bikes.push({id:m.id,x:Math.max(m.min,Math.min(m.max,m.x))+32,y:m.surface-43,w:58,h:43,collected:false});l.effects.push({x:m.x+50,y:m.y+30,text:'POF!',ttl:.5});this.event('hit');}
  }
  for(const m of l.mammoths){if(!m.alive)continue;m.x+=m.dir*LEVELS[l.index].speed*dt;if(m.x<m.min){m.x=m.min;m.dir=1;}if(m.x>m.max){m.x=m.max;m.dir=-1;}if(overlap(p,m))this.damage();}
  for(const b of l.bikes){if(!b.collected&&overlap(p,b))this.collect(b);}
  if(this.state!=='playing')return;
  if(!l.checkpoint.active&&p.x>=l.checkpoint.x){l.checkpoint.active=true;p.hp=3;this.event('checkpoint');}
  if(p.x>l.gate.x-20&&l.local===20){this.completed=l.index+1;this.state='transition';this.event('complete');}
  for(const e of l.effects)e.ttl-=dt;l.effects=l.effects.filter(e=>e.ttl>0);
  const desired=Math.max(0,Math.min(l.width-1280,p.x-420));this.camera+=(desired-this.camera)*Math.min(1,dt*7);
 }
 next(){if(this.state==='transition'&&this.completed<5){this.load(this.completed);this.state='playing';}}
}
export function readSave(storage){try{const s=JSON.parse(storage.getItem('witek-save'));if(!s||!Number.isInteger(s.completed)||s.completed<0||s.completed>5)return {completed:0,sound:false};return {completed:s.completed,sound:s.sound===true};}catch{return {completed:0,sound:false};}}
export function writeSave(storage,completed,sound){try{storage.setItem('witek-save',JSON.stringify({completed,sound}));}catch{/* Storage may be disabled; gameplay remains available. */}}
