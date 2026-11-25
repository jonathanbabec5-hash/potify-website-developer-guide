import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const entries=JSON.parse(readFileSync(new URL('../src/directory.json',import.meta.url)));
const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
test('each distinct approved destination is present in the portable page',()=>{
  assert.ok(entries.length > 1);
  assert.equal(new Set(entries.map(entry=>entry.url)).size,entries.length);
  for(const entry of entries){
    assert.equal(new URL(entry.url).protocol,'https:');
    assert.ok(html.includes(entry.url));
  }
});
