import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,records,answerRecord,safeSave} from '../src/world.js';
test('all three puzzles unlock distinct seals and preserve learned documents',()=>{const s=freshState();for(const r of records)assert.equal(answerRecord(s,r.id,r.answer),true);assert.deepEqual(s.seals,['cbs','ibs','is']);assert.equal(s.notes.length,3);assert.equal(s.health,100);});
test('wrong answer costs lucidity but permits retry without duplicate rewards',()=>{const s=freshState();assert.equal(answerRecord(s,'cbs',0),false);assert.equal(s.health,84);assert.equal(s.seals.length,0);answerRecord(s,'cbs',1);answerRecord(s,'cbs',1);assert.deepEqual(s.seals,['cbs']);assert.deepEqual(s.notes,['cbs']);});
test('corrupt saves are rejected and saved fields are constrained',()=>{assert.equal(safeSave(null),null);assert.equal(safeSave({zone:9}),null);const s=safeSave({...freshState(),x:9999,health:-20,seals:['cbs','cbs','fake']});assert.equal(s.x,1190);assert.equal(s.health,30);assert.deepEqual(s.seals,['cbs']);});
