export const WOLVES=['Loup','Loup blanc','Loup vert'];
export const isWolf=r=>WOLVES.includes(r);
export function winner(players){const living=players.filter(p=>p.alive),wolves=living.filter(p=>isWolf(p.role)).length;return wolves===0?'Villageois':wolves>=living.length-wolves?'Loups':null}
export function countVotes(votes,chief){const totals=new Map();for(const [voter,target] of Object.entries(votes)){if(!target)continue;totals.set(target,(totals.get(target)||0)+(voter===chief?2:1))}const highest=Math.max(0,...totals.values());return highest?{targets:[...totals].filter(([,n])=>n===highest).map(([id])=>id),count:highest}:{targets:[],count:0}}
export function inspect(role,previous){return role==='Loup blanc'&&previous===0?'Villageois':isWolf(role)?'Loup':'Villageois'}
export function barber(targetRole){return isWolf(targetRole)?{targetDies:true,barberDies:false,becomesChief:true}:{targetDies:true,barberDies:true,becomesChief:false}}
export function guardAllowed(previous,next){return !!next&&previous!==next}
export function witch({victim,heal,poison,usedHeal,usedPoison}){return {victim:heal&&!usedHeal?null:victim,poison:poison&&!usedPoison?poison:null,usedHeal:usedHeal||!!(heal&&!usedHeal),usedPoison:usedPoison||!!(poison&&!usedPoison)}}
export function mowgli(role,modelAlive){return role==='Mowgli'&&!modelAlive?'Loup':role}
export function roleCountValid(roles,players){return Object.values(roles).every(n=>Number.isInteger(n)&&n>=0)&&Object.values(roles).reduce((a,b)=>a+b,0)===players}
export function eligible(players){return players.filter(p=>p.alive)}
export function kill(players,id){const p=players.find(p=>p.id===id);if(!p||!p.alive)return null;p.alive=false;return {hunter:p.role==='Chasseur',chief:!!p.chief}}
export function transferChief(players,from,to){const old=players.find(p=>p.id===from),next=players.find(p=>p.id===to&&p.alive);if(!next)return false;if(old)old.chief=false;next.chief=true;return true}

export function buildRoleDeck(roles,players){const selected=Object.entries(roles).filter(([role])=>role!=='Villageois').flatMap(([role,n])=>Array(n).fill(role));if(selected.length>players)throw new RangeError('Trop de rôles');return [...selected,...Array(players-selected.length).fill('Villageois')]}

export const openingPhases=['model','candidates','chiefSpeech','election','introduction','guard'];
export function openingSpeechOrder(candidates,players){return {chiefSpeeches:[...candidates],introductions:players.map(p=>p.id)}}
