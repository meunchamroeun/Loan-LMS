"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const hexToRgb = (hex: string): [number, number, number] => {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
};

const THEMES = {
  light: {
    top: hexToRgb("#f7f2e7"),
    bottom: hexToRgb("#e3d9c6"),
    glow: hexToRgb("#fffbf2"),
    line: hexToRgb("#b9a57c"),
    lineAlpha: 0.42,
    auraA: hexToRgb("#f3e3c0"),
    auraB: hexToRgb("#e9dcc4"),
    auraStrength: 0,
    dots: 0,
  },
  dark: {
    top: hexToRgb("#1b1c1f"),
    bottom: hexToRgb("#151618"),
    glow: hexToRgb("#1e1f22"),
    line: hexToRgb("#3a3d44"),
    lineAlpha: 0.55,
    auraA: hexToRgb("#000000"),
    auraB: hexToRgb("#000000"),
    auraStrength: 0,
    dots: 0.05,
  },
};

const VERTEX_SHADER = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uTop, uBottom, uGlow, uLine, uAuraA, uAuraB;
uniform float uLineAlpha, uAuraStrength, uDots;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);

  // Height field: two octaves of slowly evolving noise, plus gentle rise under pointer
  float t = uTime;
  float h = snoise(vec3(p * 0.9, t * 0.035)) * 0.65
          + snoise(vec3(p * 2.1 + 11.0, t * 0.06)) * 0.22;
  h += 0.35 * exp(-dot(p - uPointer, p - uPointer) * 6.0);

  // Contours: distance to nearest iso-level, anti-aliased with screen-space derivatives
  float v = h * 9.0;
  float d = abs(fract(v + 0.5) - 0.5);
  float w = fwidth(v);
  // Every fifth contour is an index line: a touch wider and brighter
  float major = 1.0 - step(0.5, mod(floor(v + 0.5), 5.0));
  float line = 1.0 - smoothstep(0.0, w * mix(1.15, 1.9, major), d);
  float lineStrength = uLineAlpha * mix(1.0, 1.7, major);

  vec3 col = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y));
  col = mix(col, uGlow, 0.55 * exp(-dot(p - vec2(0.0, 0.35), p - vec2(0.0, 0.35)) * 2.2));

  // Slowly breathing colour pools
  vec2 a = vec2(-0.75 + 0.08 * sin(t * 0.13), -0.45 + 0.06 * cos(t * 0.11));
  vec2 b = vec2(0.8 + 0.07 * cos(t * 0.09), 0.5 + 0.08 * sin(t * 0.12));
  float ga = exp(-dot(p - a, p - a) * 1.6);
  float gb = exp(-dot(p - b, p - b) * 1.9);
  col += (uAuraA * ga + uAuraB * gb) * uAuraStrength * 0.6;

  float vignette = smoothstep(1.25, 0.25, length(p));
  vec3 lineCol = uLine + (uAuraA * ga + uAuraB * gb) * uAuraStrength * 0.5;
  col = mix(col, lineCol, line * lineStrength * (0.45 + 0.55 * vignette));

  // Faint dot grid
  vec2 cell = mod(gl_FragCoord.xy, 48.0) - 24.0;
  float grid = 1.0 - smoothstep(0.8, 1.6, length(cell));
  col += vec3(grid * uDots);
  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function TopoCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const ext = gl.getExtension("OES_standard_derivatives");
    if (!ext) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
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

    // Fullscreen triangle buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uTop = gl.getUniformLocation(program, "uTop");
    const uBottom = gl.getUniformLocation(program, "uBottom");
    const uGlow = gl.getUniformLocation(program, "uGlow");
    const uLine = gl.getUniformLocation(program, "uLine");
    const uLineAlpha = gl.getUniformLocation(program, "uLineAlpha");
    const uAuraA = gl.getUniformLocation(program, "uAuraA");
    const uAuraB = gl.getUniformLocation(program, "uAuraB");
    const uAuraStrength = gl.getUniformLocation(program, "uAuraStrength");
    const uDots = gl.getUniformLocation(program, "uDots");

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const startTime = performance.now();
    let animId: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now: number = performance.now()) => {
      const isDark = document.documentElement.classList.contains("dark");
      const currentTheme = isDark ? THEMES.dark : THEMES.light;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - startTime) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);

      gl.uniform3fv(uTop, currentTheme.top);
      gl.uniform3fv(uBottom, currentTheme.bottom);
      gl.uniform3fv(uGlow, currentTheme.glow);
      gl.uniform3fv(uLine, currentTheme.line);
      gl.uniform1f(uLineAlpha, currentTheme.lineAlpha);
      gl.uniform3fv(uAuraA, currentTheme.auraA);
      gl.uniform3fv(uAuraB, currentTheme.auraB);
      gl.uniform1f(uAuraStrength, currentTheme.auraStrength);
      gl.uniform1f(uDots, currentTheme.dots);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      render(now);
      animId = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const minDim = Math.min(window.innerWidth, window.innerHeight);
      pointer.tx = (e.clientX - window.innerWidth / 2) / minDim;
      pointer.ty = -(e.clientY - window.innerHeight / 2) / minDim;
    };

    const ro = new ResizeObserver(() => {
      resize();
      render();
    });
    ro.observe(canvas);

    resize();
    render();
    animId = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none block size-full bg-[#ece4d4] dark:bg-[#18191b] absolute inset-0 -z-10",
        className
      )}
    />
  );
}
