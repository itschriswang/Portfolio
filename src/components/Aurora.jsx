import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/media';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[4];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uOpacity;

out vec4 fragColor;

// Smooth gaussian-ish falloff in [0, 1], no hard edges, never overshoots.
float glowFalloff(float d, float width) {
  float x = d / width;
  return exp(-x * x);
}

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // Green carries the field. The other three stops only ever show up as
  // faint, patchy wisps (independent noise fields, low max weight) so
  // they read as a hint of colour, not a band, and never average down
  // into a muddy blend with the green base.
  vec3 rampColor = uColorStops[1];
  float blueWisp = pow(max(snoise(vec2(uv.x * 1.1 - uTime * 0.05, uv.y * 1.4 + 4.1)), 0.0), 1.4) * 0.55;
  float amberWisp = pow(max(snoise(vec2(uv.x * 1.1 + uTime * 0.06 + 9.2, uv.y * 1.4 - 1.7)), 0.0), 1.4) * 0.5;
  float berryWisp = pow(max(snoise(vec2(uv.x * 1.1 + uTime * 0.04 - 5.3, uv.y * 1.4 + 2.6)), 0.0), 1.5) * 0.42;
  rampColor = mix(rampColor, uColorStops[0], blueWisp);
  rampColor = mix(rampColor, uColorStops[2], amberWisp);
  rampColor = mix(rampColor, uColorStops[3], berryWisp);

  // A gently drifting horizon line, not a hard band, the noise only
  // nudges where the glow centres, it never multiplies into the alpha.
  float drift = snoise(vec2(uv.x * 1.6 + uTime * 0.12, uTime * 0.18)) * 0.07 * uAmplitude;
  float center = 0.93 + drift;

  float glow = glowFalloff(uv.y - center, 0.07 + 0.09 * uBlend);
  glow += 0.4 * glowFalloff(uv.y - (center - 0.14), 0.06 + 0.07 * uBlend);

  float auroraAlpha = clamp(glow, 0.0, 1.0) * uOpacity;

  fragColor = vec4(rampColor * auroraAlpha, auroraAlpha);
}
`;

export default function Aurora(props) {
  const { colorStops = ['#635BFF', '#B5C42B', '#FF9500', '#FF3B60'], amplitude = 1.0, blend = 0.5, opacity = 1.0 } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // WebGL is not a given. A browser with it disabled by policy or by an
    // extension, or one falling back to software rendering it refuses to
    // expose, hands back a null context and ogl's Renderer throws on it.
    // That throw happens inside an effect, so React tears down the whole tree
    // above it and the page renders blank rather than merely un-decorated.
    // The aurora is an aria-hidden backdrop over a CSS gradient that already
    // stands on its own, so the right failure is to draw nothing.
    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true
      });
      if (!renderer.gl) throw new Error('no webgl context');
    } catch (e) {
      return undefined;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    let program;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
        uOpacity: { value: opacity }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    // Convert colour stops only when the array changes, doing this per frame
    // allocated four Color objects and a new array on every RAF tick.
    let lastStops = colorStops;
    let lastStopsArray = colorStopsArray;
    const stopsToVec3 = (stops) => {
      if (stops !== lastStops) {
        lastStops = stops;
        lastStopsArray = stops.map(hex => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
      }
      return lastStopsArray;
    };

    const reduceMotion = prefersReducedMotion();
    let animateId = 0;
    let inView = true;
    const update = t => {
      animateId = inView && !reduceMotion ? requestAnimationFrame(update) : 0;
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      program.uniforms.uTime.value = time * speed * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      program.uniforms.uOpacity.value = propsRef.current.opacity ?? opacity;
      program.uniforms.uColorStops.value = stopsToVec3(propsRef.current.colorStops ?? colorStops);
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    // The hero scrolls out of view early in the page; keeping the WebGL loop
    // running underneath the rest of the site wastes GPU and battery.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        inView = e.isIntersecting;
        if (inView && !animateId && !reduceMotion) animateId = requestAnimationFrame(update);
      });
    });
    io.observe(ctn);

    resize();

    return () => {
      if (animateId) cancelAnimationFrame(animateId);
      io.disconnect();
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude]);

  return <div id="aurora-field" ref={ctnDom} aria-hidden="true" />;
}
