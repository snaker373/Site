import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function comparisonHarness(){
 const handlers={},attributes={},properties={},captures=new Set();
 const range={value:'50',addEventListener(type,fn){handlers['range:'+type]=fn;},setAttribute(key,value){attributes[key]=value;},focus(){}};
 const images={style:{setProperty(key,value){properties[key]=value;}},classList:{add(){},remove(){}},getBoundingClientRect(){return {left:100,width:400};},addEventListener(type,fn){handlers[type]=fn;},setPointerCapture(id){captures.add(id);},hasPointerCapture(id){return captures.has(id);},releasePointerCapture(id){captures.delete(id);}};
 const tags={before:{style:{}},after:{style:{}}};
 const comparison={querySelector(selector){return selector==='input[type="range"]'?range:selector==='.comparison-images'?images:selector.includes('.before')?tags.before:tags.after;}};
 const document={querySelector(){return null;},querySelectorAll(selector){return selector==='.comparison'?[comparison]:[];}};
 const window={matchMedia(){return {matches:false,addEventListener(){}};}};
 vm.runInNewContext(fs.readFileSync('js/home.js','utf8'),{document,window});
 function pointer(type,x,id=1){handlers[type]({type,clientX:x,clientY:20,pointerId:id,pointerType:'mouse',isPrimary:true,button:0,cancelable:true,preventDefault(){}});}
 return {range,handlers,attributes,properties,captures,pointer};
}
test('comparison follows dragging outside its frame, clamps endpoints and releases capture',()=>{
 const h=comparisonHarness();
 h.pointer('pointerdown',200);assert.equal(h.range.value,'25');assert.ok(h.captures.has(1));
 h.pointer('pointermove',800);assert.equal(h.range.value,'100');
 h.pointer('pointermove',0);assert.equal(h.range.value,'0');
 h.pointer('pointerup',400);assert.equal(h.range.value,'75');assert.equal(h.captures.size,0);
 h.pointer('pointermove',200);assert.equal(h.range.value,'75');
 assert.equal(h.properties['--reveal'],'75%');
 assert.equal(h.attributes['aria-valuetext'],'75 Prozent Vorher, 25 Prozent Nachher');
});
test('comparison preserves native keyboard input and cancels interrupted pointer drags',()=>{
 const h=comparisonHarness();
 h.range.value='32';h.handlers['range:input']();assert.equal(h.properties['--reveal'],'32%');
 h.pointer('pointerdown',300);h.pointer('pointercancel',300);h.pointer('pointermove',500);
 assert.equal(h.range.value,'50');assert.equal(h.captures.size,0);
});
