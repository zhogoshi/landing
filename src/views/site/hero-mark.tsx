"use client";

import { Logo, LOGO_PATH } from "@hogoshi/ui";
import { useEffect, useRef, useState } from "react";

const vert = `
attribute vec3 aPos;
attribute vec3 aNrm;
uniform mat4 uMvp;
uniform mat4 uModel;
varying vec3 vN;
void main() {
  vN = (uModel * vec4(aNrm, 0.0)).xyz;
  gl_Position = uMvp * vec4(aPos, 1.0);
}
`;

const frag = `
precision mediump float;
uniform vec3 uColor;
varying vec3 vN;
void main() {
  vec3 n = normalize(vN);
  vec3 light = normalize(vec3(0.35, 0.55, 1.0));
  float ndl = max(dot(n, light), 0.0);
  float wrap = ndl * 0.65 + 0.35;
  float spec = pow(max(dot(reflect(-light, n), vec3(0.0, 0.0, 1.0)), 0.0), 28.0);
  float luma = dot(uColor, vec3(0.299, 0.587, 0.114));
  float darkSurface = 1.0 - smoothstep(0.25, 0.75, luma);
  vec3 color = uColor * wrap + vec3(1.0) * darkSurface * (0.08 + ndl * 0.5 + spec * 0.85);
  gl_FragColor = vec4(color, 1.0);
}
`;

const neighbors = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

function raster() {
  const size = 480;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const bits = new Uint8Array(size * size);
  if (!ctx) return { bits, size };
  ctx.translate(size / 2, size / 2);
  ctx.scale((size * 0.82) / 24, (size * 0.82) / 24);
  ctx.translate(-16, -16);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(LOGO_PATH));
  const data = ctx.getImageData(0, 0, size, size).data;
  for (let i = 0; i < bits.length; i += 1) bits[i] = data[i * 4 + 3] > 80 ? 1 : 0;
  return { bits, size };
}

function contour(bits: Uint8Array, size: number) {
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < size && y < size && bits[y * size + x] === 1;
  let sx = -1;
  let sy = -1;
  for (let y = 0; y < size && sx < 0; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!on(x, y)) continue;
      sx = x;
      sy = y;
      break;
    }
  }
  if (sx < 0) return [];
  const pts: number[][] = [];
  let x = sx;
  let y = sy;
  let px = sx - 1;
  let py = sy;
  for (let step = 0; step < size * size; step += 1) {
    pts.push([(x / (size - 1) - 0.5) * 1.7, (0.5 - y / (size - 1)) * 1.7]);
    const back = neighbors.findIndex(([dx, dy]) => dx === px - x && dy === py - y);
    let next: number[] | null = null;
    for (let turn = 1; turn <= 8; turn += 1) {
      const dir = neighbors[(back + turn + 8) % 8];
      if (!dir) continue;
      const nx = x + dir[0];
      const ny = y + dir[1];
      if (!on(nx, ny)) continue;
      next = [nx, ny];
      px = x;
      py = y;
      break;
    }
    if (!next) break;
    x = next[0];
    y = next[1];
    if (x === sx && y === sy) break;
  }
  return pts;
}

function smooth(pts: number[][]) {
  let ring = pts;
  for (let pass = 0; pass < 2; pass += 1) {
    const next: number[][] = [];
    for (let i = 0; i < ring.length; i += 1) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    ring = next;
  }
  const stride = Math.max(1, Math.floor(ring.length / 420));
  const sparse = ring.filter((_, index) => index % stride === 0);
  let area = 0;
  for (let i = 0; i < sparse.length; i += 1) {
    const next = sparse[(i + 1) % sparse.length];
    area += sparse[i][0] * next[1] - next[0] * sparse[i][1];
  }
  if (area < 0) sparse.reverse();
  return sparse;
}

function mesh() {
  const { bits, size } = raster();
  const pts = smooth(contour(bits, size));
  if (pts.length < 12) return new Float32Array();
  const edges = [];
  for (let i = 0; i < pts.length; i += 1) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    if (Math.abs(a[1] - b[1]) < 1e-6) continue;
    const top = a[1] > b[1] ? a : b;
    const bot = a[1] > b[1] ? b : a;
    edges.push({ y0: top[1], x0: top[0], y1: bot[1], x1: bot[0] });
  }
  const ys = [...new Set(pts.map((point) => point[1]))].sort((a, b) => b - a);
  const data: number[] = [];
  const half = 0.3;
  const push = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
    data.push(x, y, z, nx, ny, nz);
  };
  const tri = (a: number[], b: number[], c: number[], n: number[]) => {
    push(a[0], a[1], a[2], n[0], n[1], n[2]);
    push(b[0], b[1], b[2], n[0], n[1], n[2]);
    push(c[0], c[1], c[2], n[0], n[1], n[2]);
  };
  const xAt = (edge: { y0: number; x0: number; y1: number; x1: number }, y: number) =>
    edge.x0 + (edge.x1 - edge.x0) * ((y - edge.y0) / (edge.y1 - edge.y0));
  for (let i = 0; i < ys.length - 1; i += 1) {
    const yTop = ys[i];
    const yBot = ys[i + 1];
    const yMid = (yTop + yBot) / 2;
    const active = edges
      .filter((edge) => edge.y1 < yMid && yMid < edge.y0)
      .sort((p, q) => xAt(p, yMid) - xAt(q, yMid));
    if (active.length % 2) continue;
    for (let k = 0; k < active.length; k += 2) {
      const left = active[k];
      const right = active[k + 1];
      const a = [xAt(left, yTop), yTop, half];
      const b = [xAt(right, yTop), yTop, half];
      const c = [xAt(right, yBot), yBot, half];
      const d = [xAt(left, yBot), yBot, half];
      tri(a, d, c, [0, 0, 1]);
      tri(a, c, b, [0, 0, 1]);
      tri([a[0], a[1], -half], [b[0], b[1], -half], [c[0], c[1], -half], [0, 0, -1]);
      tri([a[0], a[1], -half], [c[0], c[1], -half], [d[0], d[1], -half], [0, 0, -1]);
    }
  }
  const rim = pts.map((point, index) => {
    const next = pts[(index + 1) % pts.length];
    const dx = next[0] - point[0];
    const dy = next[1] - point[1];
    const len = Math.hypot(dx, dy) || 1;
    return [dy / len, -dx / len];
  });
  const at = (index: number) => {
    const prev = rim[(index - 1 + pts.length) % pts.length];
    const next = rim[index % pts.length];
    const len = Math.hypot(prev[0] + next[0], prev[1] + next[1]) || 1;
    return [(prev[0] + next[0]) / len, (prev[1] + next[1]) / len];
  };
  for (let i = 0; i < pts.length; i += 1) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const na = at(i);
    const nb = at(i + 1);
    const pf = [p[0], p[1], half];
    const pb = [p[0], p[1], -half];
    const qf = [q[0], q[1], half];
    const qb = [q[0], q[1], -half];
    push(pf[0], pf[1], pf[2], na[0], na[1], 0);
    push(qb[0], qb[1], qb[2], nb[0], nb[1], 0);
    push(qf[0], qf[1], qf[2], nb[0], nb[1], 0);
    push(pf[0], pf[1], pf[2], na[0], na[1], 0);
    push(pb[0], pb[1], pb[2], na[0], na[1], 0);
    push(qb[0], qb[1], qb[2], nb[0], nb[1], 0);
  }
  return new Float32Array(data);
}

function multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function perspective(aspect: number) {
  const f = 1 / Math.tan(0.45);
  const near = 0.1;
  const far = 20;
  const nf = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) * nf;
  m[11] = -1;
  m[14] = 2 * far * near * nf;
  return m;
}

function readFg(mode?: string | null) {
  const probe = document.createElement("span");
  if (mode) probe.setAttribute("data-mode", mode);
  probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none";
  document.body.append(probe);
  const raw = getComputedStyle(probe).getPropertyValue("--fg").trim();
  probe.remove();
  const hex = raw.startsWith("#") ? raw : "";
  if (hex.length === 7) {
    return [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255];
  }
  const parts = raw.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return [0.95, 0.95, 0.95];
  return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
}

function model(angle: number, bob: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const cx = Math.cos(0.35);
  const sx = Math.sin(0.35);
  const yaw = new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  const pitch = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
  const place = new Float32Array([1.15, 0, 0, 0, 0, 1.15, 0, 0, 0, 0, 1.15, 0, 0, bob, -2.7, 1]);
  return multiply(place, multiply(pitch, yaw));
}

const frameClass = "mx-auto h-[min(92vw,34rem)] w-[min(92vw,34rem)] md:h-[min(46vw,40rem)] md:w-full";

function MarkFallback() {
  return (
    <div className={`${frameClass} flex items-center justify-center`} aria-label="hogoshi mark">
      <Logo variant="ghost" className="h-[68%] w-[68%] rounded-none p-0" />
    </div>
  );
}

export function HeroMark() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [flat, setFlat] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const fail = () => setFlat(true);
    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    if (!gl) {
      fail();
      return;
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, vert);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!program || !vs || !fs) {
      fail();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      fail();
      return;
    }
    gl.useProgram(program);
    const packed = mesh();
    if (!packed.length) {
      fail();
      return;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, packed, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "aPos");
    const nrm = gl.getAttribLocation(program, "aNrm");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(nrm);
    gl.vertexAttribPointer(nrm, 3, gl.FLOAT, false, 24, 12);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    const mvpLoc = gl.getUniformLocation(program, "uMvp");
    const modelLoc = gl.getUniformLocation(program, "uModel");
    const colorLoc = gl.getUniformLocation(program, "uColor");
    const color = { current: readFg() };
    const fit = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.floor(box.width * dpr));
      canvas.height = Math.max(1, Math.floor(box.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    fit();
    const count = packed.length / 6;
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    const draw = (tint = color.current) => {
      const angle = elapsed / 2800;
      const bob = Math.sin(elapsed / 900) * 0.08;
      const placed = model(angle, bob);
      gl.uniform3fv(colorLoc, tint);
      gl.uniformMatrix4fv(modelLoc, false, placed);
      gl.uniformMatrix4fv(mvpLoc, false, multiply(perspective(canvas.width / canvas.height), placed));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    };
    const onTheme = (event: Event) => {
      const mode = (event as CustomEvent<string | null>).detail;
      draw(readFg(mode));
    };
    const loop = (now: number) => {
      if (!last) last = now;
      if (!document.documentElement.hasAttribute("data-theme-switching")) {
        elapsed += now - last;
        draw();
      }
      last = now;
      frame = requestAnimationFrame(loop);
    };
    draw();
    setReady(true);
    frame = requestAnimationFrame(loop);
    const mode = new MutationObserver(() => {
      color.current = readFg();
    });
    mode.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
    canvas.addEventListener("hogoshi-theme-paint", onTheme);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(frame);
      mode.disconnect();
      canvas.removeEventListener("hogoshi-theme-paint", onTheme);
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, []);

  if (flat) return <MarkFallback />;

  return (
    <canvas
      ref={ref}
      className={`${frameClass} bg-transparent ${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-[var(--motion-duration)] ease-[var(--motion-ease)]`}
      aria-label="hogoshi mark"
    />
  );
}
