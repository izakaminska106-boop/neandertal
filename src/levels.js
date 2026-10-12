export const SETTINGS={speed:260,acceleration:1900,gravity:1500,jump:600,coyote:.1,buffer:.12,attackDuration:.3,attackCooldown:.45,invulnerability:1.2};
export const LEVELS=[
 {name:'Dolina Witka',subtitle:'Tam, gdzie wszystko się zaczyna',sky:'#dce5be',far:'#b6c39c',near:'#829770',ground:'#7e8953',speed:25},
 {name:'Rzeka Kajaków',subtitle:'Nie zgub maczugi w wodzie',sky:'#d2e3d7',far:'#a4c5b3',near:'#649584',ground:'#728951',speed:30},
 {name:'Skały Sokołów',subtitle:'Patrz pod nogi. I w niebo.',sky:'#dce0d6',far:'#bbc2b3',near:'#858f7d',ground:'#83866c',speed:36},
 {name:'Mamutowa Przełęcz',subtitle:'Zimno, ale garaż sam się nie zapełni',sky:'#e2e9e6',far:'#c2d0cf',near:'#91aaa4',ground:'#9aada4',speed:48},
 {name:'Wielki Garaż',subtitle:'Ostatnia prosta do marzenia',sky:'#e8dbb8',far:'#cbbb90',near:'#a0996c',ground:'#8b8852',speed:42}
];
// Fixed repeatable layouts; 20 encounters, each on a safe, reversible segment.
export function createLevel(index){
 const ground=590,width=11500,platforms=[],mammoths=[],gaps=[];
 for(let i=0;i<20;i++){
  const start=i*550;const raised=index===2?(i%3)*36:0;
  platforms.push({x:start,y:ground-raised,w:410,h:160,kind:'ground'});
  // Small gaps, with fixed kayaks in river levels. Every jump is < 140px / 72px high.
  if(index===0)platforms.push({x:start+410,y:ground,w:140,h:160,kind:'ground'});
  else{gaps.push({x:start+410,w:140});platforms.push({x:start+439,y:ground-12,w:84,h:20,kind:index===1||index===4?'kayak':'rock'});}
  if(i%4===1)platforms.push({x:start+95,y:ground-raised-50,w:58,h:50,kind:'rock'});
  mammoths.push({id:`${index}-${i}`,x:start+255,y:ground-raised-94,w:112,h:94,min:start+190,max:start+292,dir:i%2?1:-1,alive:true,surface:ground-raised});
 }
 platforms.push({x:11000,y:ground,w:500,h:160,kind:'ground'});
 return {index,width,ground,platforms,mammoths,gaps,bikes:[],effects:[],checkpoint:{x:5570,y:ground,active:false},gate:{x:11250,y:ground-160},local:0};
}
