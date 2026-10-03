// The numbers behind the reveal's decisions moment, the worked example's
// committed-versus-open line and the next-year reminder. Each is checked
// against the engine and the factor tables, not against a screenshot.

import test from 'node:test';
import assert from 'node:assert/strict';

import { aggregate, maccData, rolloverProfile } from '../src/footprint/lib/engine';
import { tripShare, sequencedCut, commitmentSplit, isTripLine } from '../src/footprint/lib/decisions';
import { buildReminderIcs, reminderDate } from '../src/footprint/lib/reminder';
import { buildSeedProfile } from '../src/footprint/data/seedProfile';
import { TRIPS_ST, countWord } from '../src/footprint/data/storyCopy';
import { settings, profileOf, close } from './support/profiles';

test('the trip share adds flights, their hotel nights and spending abroad, and nothing else', () => {
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  const tr = tripShare(profile, agg);
  const expected = profile.entries.filter(isTripLine).reduce((s, e) => s + e.tco2e, 0);
  close(tr.tripT, expected, 1e-9);
  close(tr.tripT + tr.restT, agg.total, 1e-9);
  assert.equal(tr.count, 5);
  assert.equal(tr.pct, Math.round((expected / agg.total) * 100));
});

test('the biggest trip is re-counted in the visitor\'s own lines, not outside averages', () => {
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  const tr = tripShare(profile, agg);
  const diet = profile.entries.find((e) => e.category === 'diet');
  const food = tr.exchange.find((r) => r.id === 'food');
  close(food.value, (tr.biggest.t / (diet.tco2e / diet.meta.days)) / (365 / 12), 1e-9);

  const home = tr.exchange.find((r) => r.id === 'home');
  const homeT = (agg.byCategory.electricity || 0) + (agg.byCategory.gas || 0);
  close(home.value, tr.biggest.t / homeT, 1e-9);

  // Taxis abroad count with the trip, so they stay out of "getting around at home".
  const ground = tr.exchange.find((r) => r.id === 'ground');
  const groundT = profile.entries
    .filter((e) => e.category === 'road' && !(e.meta && e.meta.abroad))
    .reduce((s, e) => s + e.tco2e, 0);
  close(ground.value, tr.biggest.t / groundT, 1e-9);
});

test('a year with no flights has no trips moment', () => {
  const profile = profileOf([{ category: 'diet', meta: { dietType: 'medMeat', days: 365 } }], settings());
  assert.equal(tripShare(profile, aggregate(profile)), null);
});

test('one lever alone sequences to its own standalone figure', () => {
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  for (const r of maccData(profile, agg).filter((x) => x.applicable)) {
    close(sequencedCut(profile, agg, [r.id]), r.reduction, 1e-3, r.id);
  }
  assert.equal(sequencedCut(profile, agg, []), 0);
});

test('the worked example sets what it committed to against the flights it left off', () => {
  const profile = buildSeedProfile();
  const agg = aggregate(profile);
  const split = commitmentSplit(profile, agg);
  close(split.committed, sequencedCut(profile, agg, profile.plan.enabled), 1e-12);
  const flightIds = maccData(profile, agg)
    .filter((r) => r.category === 'flight' && r.applicable && !profile.plan.enabled.includes(r.id))
    .map((r) => r.id);
  close(split.open, sequencedCut(profile, agg, flightIds), 1e-12);
  assert.ok(split.open > split.committed, 'the flights are the bigger half of the decision');
});

test('the headline count reads as a word, and the copy carries both voices', () => {
  assert.equal(countWord(5, true), 'Five');
  assert.equal(countWord(13), '13');
  for (const v of ['example', 'own']) {
    assert.ok(TRIPS_ST.headline[v].includes('{n}') && TRIPS_ST.headline[v].includes('{pct}'));
  }
});

test('a locked guess closes with its year and does not carry into the next', () => {
  const profile = { ...buildSeedProfile(), kind: 'own', pastYears: [], guess: 9.5 };
  const next = rolloverProfile(profile, '2026-07-15');
  assert.equal(next.pastYears[0].guess, 9.5);
  assert.equal(next.guess, undefined);
});

test('the reminder lands the day after next year\'s window closes', () => {
  assert.equal(reminderDate('2026-06-30'), '2027-07-01');
  assert.equal(reminderDate('2026-12-31'), '2028-01-01');
  // A leap-day end has no twin; the next day is already 1 March.
  assert.equal(reminderDate('2024-02-29'), '2025-03-01');
});

test('the reminder is a valid all-day event with escaped, folded text', () => {
  const ics = buildReminderIcs({
    date: '2027-07-01',
    title: 'Life Footprint: run the year again',
    description: 'Changes switched on: a, b; and c. ' + 'x'.repeat(120),
    url: 'https://itschriswang.com/footprint/',
    uid: 'test@itschriswang.com',
    stamp: '20261003T000000Z',
  });
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20270701\r\n'));
  assert.ok(ics.includes('DTEND;VALUE=DATE:20270702\r\n'));
  assert.ok(ics.includes('a\\, b\\; and c.'));
  for (const line of ics.split('\r\n')) {
    assert.ok(new TextEncoder().encode(line).length <= 75, 'every physical line fits 75 octets');
  }
  // Unfolding restores the description in one piece.
  const unfolded = ics.replace(/\r\n /g, '');
  assert.ok(unfolded.includes('x'.repeat(120)));
});
