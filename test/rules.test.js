import test from 'node:test';import {buildRoleDeck} from '../lib/rules.js';import assert from 'node:assert/strict';import {isWolf,winner,countVotes,inspect,barber,guardAllowed,witch,mowgli,roleCountValid,kill,transferChief} from '../lib/rules.js';
test('Loup blanc et vert sont loups',()=>{assert.equal(isWolf('Loup blanc'),true);assert.equal(isWolf('Loup vert'),true)});
test('Voyante voit le loup blanc villageois puis loup',()=>{assert.equal(inspect('Loup blanc',0),'Villageois');assert.equal(inspect('Loup blanc',1),'Loup')});
test('Chef vote double et départage',()=>{assert.deepEqual(countVotes({a:'x',b:'y',c:'y'},'a').targets.sort(),['x','y']);assert.deepEqual(countVotes({a:'x',b:'y'},'a').targets,['x'])});
test('Barbier tue un loup et devient chef',()=>assert.deepEqual(barber('Loup vert'),{targetDies:true,barberDies:false,becomesChief:true}));
test('Barbier et innocent meurent',()=>assert.deepEqual(barber('Voyante'),{targetDies:true,barberDies:true,becomesChief:false}));
test('Salvateur ne protège pas deux fois la même cible',()=>{assert.equal(guardAllowed('a','a'),false);assert.equal(guardAllowed('a','b'),true)});
test('Sorcière peut sauver et tuer la même nuit',()=>assert.deepEqual(witch({victim:'a',heal:true,poison:'b',usedHeal:false,usedPoison:false}),{victim:null,poison:'b',usedHeal:true,usedPoison:true}));
test('Potions utilisées ne se réactivent pas',()=>assert.deepEqual(witch({victim:'a',heal:true,poison:'b',usedHeal:true,usedPoison:true}),{victim:'a',poison:null,usedHeal:true,usedPoison:true}));
test('Mowgli rejoint les loups à la mort du modèle',()=>assert.equal(mowgli('Mowgli',false),'Loup'));
test('Le total des rôles correspond au nombre de joueurs',()=>{assert.equal(roleCountValid({Villageois:3,Loup:2},5),true);assert.equal(roleCountValid({Villageois:3,Loup:2},6),false)});
test('Mort du chasseur déclenche un tir',()=>{const p=[{id:'a',role:'Chasseur',alive:true}];assert.equal(kill(p,'a').hunter,true);assert.equal(p[0].alive,false)});
test('Chef peut transmettre sa couronne',()=>{const p=[{id:'a',alive:false,chief:true},{id:'b',alive:true,chief:false}];assert.equal(transferChief(p,'a','b'),true);assert.equal(p[1].chief,true)});
test('Victoire des loups et village',()=>{assert.equal(winner([{role:'Loup',alive:true},{role:'Villageois',alive:true}]),'Loups');assert.equal(winner([{role:'Loup',alive:false},{role:'Villageois',alive:true}]),'Villageois')});

test('Les places restantes deviennent automatiquement Villageois',()=>{const deck=buildRoleDeck({Loup:2,Voyante:1,Sorcière:1,Chasseur:1},10);assert.equal(deck.filter(r=>r==='Villageois').length,5);assert.equal(deck.length,10)});
test('Impossible de sélectionner plus de rôles que de joueurs',()=>assert.throws(()=>buildRoleDeck({Loup:4,Voyante:1,Sorcière:1},5),RangeError));

import {openingPhases,openingSpeechOrder} from '../lib/rules.js';
test('Discours des candidats et présentations précèdent la première nuit',()=>{assert.deepEqual(openingPhases,['model','candidates','chiefSpeech','election','introduction','guard']);const order=openingSpeechOrder(['b'],[{id:'a'},{id:'b'},{id:'c'}]);assert.deepEqual(order.chiefSpeeches,['b']);assert.deepEqual(order.introductions,['a','b','c'])});
