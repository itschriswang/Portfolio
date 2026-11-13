import test from 'node:test';
import assert from 'node:assert/strict';
import { runModel, dotField, DOT_T, SECTOR_OPTIONS } from '../src/data/scenario';

// The ambient dot field behind the decarbonisation model lets go of the abated
// share of its dots, so its counts have to agree with the model's KPI tiles.
const base = { grid: 'base', lv: 'base', hv: 'base', plant: 'base', rev: 'moderate' };

test('filled and hollow dots match the net and abatement tiles', () => {
  const d = dotField(43400, 105800); // abatement 62.4 kt
  assert.equal(d.net, 43);
  assert.equal(d.avoided, 62, 'rounds the abatement itself, as its tile does');
  assert.equal(d.net + d.avoided, d.total);
  assert.ok(Math.abs(d.total - Math.round(105800 / 1000)) <= 1, 'within one dot of business as usual');
});

test('no abatement draws no hollow dots', () => {
  const d = dotField(120000, 100000);
  assert.equal(d.avoided, 0);
  assert.equal(d.total, d.net);
});

test('the legend agrees with the KPI tiles in every profile', () => {
  for (const o of SECTOR_OPTIONS) {
    const r = runModel({ ...base, sector: o.value });
    const tile = (k) => r.kpis.find((x) => x.key === k).value;
    assert.equal(tile('net'), `${r.dots.net}k\u00a0t`, o.value);
    assert.equal(tile('abated'), `${r.dots.avoided}k\u00a0t`, o.value);
  }
});

test('every operating profile draws at the one stated scale, at a readable count', () => {
  for (const o of SECTOR_OPTIONS) {
    const r = runModel({ ...base, sector: o.value });
    assert.equal(r.dots.perDot, DOT_T);
    assert.ok(r.dots.total > 0 && r.dots.total <= 250, `${o.value}: ${r.dots.total} dots`);
    assert.equal(r.dots.net + r.dots.avoided, r.dots.total);
  }
});
