// One slider for the whole site.
//
// It stays a native <input type="range">, so every keyboard behaviour, the
// screen-reader value announcement and touch handling come free. What the bare
// control does not give us is a sense of where the value sits: three of the
// four sliders on this site drew an unfilled grey track, so the only signal was
// the thumb's position against an unmarked line. This paints the track
// underneath the input instead: a fill to the current value, and optional step
// notches so the scale is readable at a glance.
//
// Track, fill and notches are all inset by half a thumb width, so 0% and 100%
// line up with the thumb's centre rather than its edge.
//
// Styling hooks (set on the wrapper, see .rng in global.css): --rng-thumb,
// --rng-track, --rng-fill.

export default function Range({
  min = 0,
  max = 100,
  step = 1,
  value,
  ticks = 0,
  className = '',
  style,
  ...input
}) {
  const span = Number(max) - Number(min);
  const raw = span > 0 ? ((Number(value) - Number(min)) / span) * 100 : 0;
  const pct = Math.max(0, Math.min(100, isNaN(raw) ? 0 : raw));

  const vars = { '--rng-pct': pct + '%' };
  // Notches are decoration, so they are cheap: one repeating gradient rather
  // than an element per tick. Past a couple of dozen they stop reading as steps
  // and start reading as hatching, so a fine-grained range simply gets a plain
  // track. Callers can pass a raw step count without checking.
  const n = Math.round(ticks);
  const showTicks = n > 1 && n <= 24;
  if (showTicks) vars['--rng-gap'] = `calc(100% / ${n})`;

  return (
    <span
      className={'rng' + (className ? ' ' + className : '') + (input.disabled ? ' is-disabled' : '')}
      style={{ ...vars, ...style }}
    >
      <span className="rng-track" aria-hidden="true">
        <span className="rng-fill" />
        {showTicks && <span className="rng-ticks" />}
      </span>
      <input
        type="range"
        className="rng-input"
        min={min}
        max={max}
        step={step}
        value={value}
        {...input}
      />
    </span>
  );
}
