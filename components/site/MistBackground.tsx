"use client";

import { useEffect, useRef } from "react";

/**
 * Névoa animada em WebGL (variação "mist"), na cor vermelha do site.
 * Desenhada pela placa de vídeo, pausa quando sai da tela e respeita
 * quem prefere menos movimento (mostra um quadro parado).
 */

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const MIST_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  #define TWO_PI 6.28318530718
  #define PI 3.14159265358979323846

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.975 - 1.175;
    float noise_scale = 0.00338;

    uv -= 0.5;
    uv *= (noise_scale * u_resolution);
    uv /= 1.5;
    uv += 0.5;

    float n1 = noise(uv * 1.0 + t);
    float n2 = noise(uv * 2.0 - t);
    float angle = n1 * TWO_PI;
    uv.x += 0.32 * n2 * cos(angle);
    uv.y += 0.32 * n2 * sin(angle);

    for (int i = 1; i <= 5; i++) {
      float fi = float(i);
      uv.x += 0.65 / fi * cos(t + fi * 1.5 * uv.y);
      uv.y += 0.65 / fi * cos(t + fi * 1.0 * uv.x);
    }

    float sh = 1.0 - uv.y;
    sh -= 0.5;
    sh /= (noise_scale * u_resolution.y);
    sh += 0.5;

    float shape_scaling = 0.104;
    float shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (0.33 - 0.5));
    float mixer = shape;

    vec3 bg = vec3(0.0196, 0.0196, 0.0196);   // #050505
    vec3 red = vec3(0.882, 0.024, 0.0);       // vermelho do site (#E10600)

    float mistFocus = pow(sin(mixer * PI), 4.2);
    float fineMist = noise(uv * 3.5 - t * 1.3) * 0.4 + noise(uv * 1.5 + t * 0.85) * 0.6;
    float combinedDensity = mix(mixer, fineMist, 0.28) * mistFocus;

    vec3 col = mix(bg, red, smoothstep(0.0, 0.85, combinedDensity));

    float highlight = smoothstep(0.42, 0.88, fineMist) * smoothstep(0.12, 0.9, mixer) * mistFocus;
    col = mix(col, red * 1.15, highlight * 0.35);

    vec2 raySource = vec2(0.2, 1.25);
    vec2 rayDir = normalize(v_uv - raySource);
    float rayAngle = atan(rayDir.y, rayDir.x);
    float rays = sin(rayAngle * 6.5 + t * 0.35) * 0.35 +
                 sin(rayAngle * 12.0 - t * 0.22) * 0.25 +
                 sin(rayAngle * 24.0 + t * 0.15) * 0.15;
    rays = smoothstep(0.15, 0.82, rays * 0.5 + 0.5);
    float rayGlow = rays * smoothstep(0.15, 0.9, combinedDensity) * (1.1 - v_uv.y) * mistFocus * 0.7;
    col += red * rayGlow * 0.38;

    float grain = random(gl_FragCoord.xy * 0.15 + t * 0.05);
    float particles = step(0.988, grain) * smoothstep(0.2, 0.9, combinedDensity);
    col += red * particles * 0.32;

    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = { speed?: number; opacity?: number; className?: string };

export function MistBackground({ speed = 0.6, opacity = 0.8, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, MIST_SHADER);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let raf = 0;
    let visible = true;

    const draw = () => {
      const elapsed = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, reduceMotion ? 4 : elapsed * speed);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = () => {
      draw();
      if (visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(loop);
    };
    const restart = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) loop();
    };

    // pausa quando a tela inicial sai de vista ou a aba fica em segundo plano
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", restart);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", restart);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [speed]);

  return (
    <div className={`mist ${className}`.trim()} aria-hidden>
      <canvas ref={canvasRef} style={{ opacity }} />
    </div>
  );
}
