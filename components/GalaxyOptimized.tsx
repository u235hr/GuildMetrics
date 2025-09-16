import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePerformanceLimiter, useWebGLOptimizer } from '@/hooks/usePerformanceLimiter';
import { useSingleFPSSource } from '@/hooks/useSingleFPSSource';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

interface GalaxyOptimizedProps {
  focal?: [number, number];
  rotation?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  disableAnimation?: boolean;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  // 新增性能控制参数
  maxFPS?: number;
  enableLOD?: boolean;
  pauseWhenHidden?: boolean;
  reducedMotion?: boolean;
}

// 性能管理器
class GalaxyPerformanceManager {
  private lastFrameTime = 0;
  private frameInterval = 16.67; // 60 FPS
  private isVisible = true;
  private isActive = true;
  private performanceLevel = 1; // 0: 低性能, 1: 中性能, 2: 高性能

  constructor(maxFPS = 60) {
    this.setMaxFPS(maxFPS);
  }

  setMaxFPS(fps: number) {
    this.frameInterval = 1000 / Math.max(1, Math.min(fps, 120));
  }

  setVisibility(visible: boolean) {
    this.isVisible = visible;
  }

  setActive(active: boolean) {
    this.isActive = active;
  }

  shouldRender(currentTime: number): boolean {
    if (!this.isVisible || !this.isActive) return false;
    
    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      this.lastFrameTime = currentTime;
      return true;
    }
    return false;
  }

  getPerformanceLevel(): number {
    return this.performanceLevel;
  }

  updatePerformanceLevel(fps: number) {
    if (fps < 30) {
      this.performanceLevel = 0; // 低性能
    } else if (fps < 50) {
      this.performanceLevel = 1; // 中性能
    } else {
      this.performanceLevel = 2; // 高性能
    }
  }
}

export default function GalaxyOptimized({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 150,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = false,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  maxFPS = 60,
  enableLOD = true,
  pauseWhenHidden = true,
  reducedMotion = false,
  ...rest
}: GalaxyOptimizedProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);
  const performanceManager = useRef<GalaxyPerformanceManager>(new GalaxyPerformanceManager());
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const { currentFPS } = useSingleFPSSource();

  // Visibility detection
  useEffect(() => {
    if (!pauseWhenHidden || !ctnDom.current) return;

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        setIsVisible(isIntersecting);
        performanceManager.current?.setVisibility(isIntersecting);
      },
      { threshold: 0.1 }
    );

    intersectionObserver.current.observe(ctnDom.current);

    return () => {
      intersectionObserver.current?.disconnect();
    };
  }, [pauseWhenHidden]);

  // Detect user preference settings
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      performanceManager.current?.setActive(!mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    handleChange();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 内存清理机制
  useEffect(() => {
    const cleanup = () => {
      if (typeof window !== 'undefined' && 'gc' in window) {
        (window as any).gc();
      }
    };

    // 每30秒清理一次内存
    const interval = setInterval(cleanup, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    
    // Prevent duplicate WebGL context creation
    if (ctn.querySelector('canvas')) return;
    
    // Initialize performance manager
    performanceManager.current = new GalaxyPerformanceManager(maxFPS);
    
    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
      antialias: !enableLOD, // LOD模式下禁用抗锯齿以提升性能
      powerPreference: 'high-performance'
    });
    const gl = renderer.gl;

    if (transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    let program: Program;

    function resize() {
      const scale = enableLOD ? 0.8 : 1; // Lower render resolution in LOD mode
      renderer.setSize(ctn.offsetWidth * scale, ctn.offsetHeight * scale);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(ctn);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: {
          value: new Float32Array([smoothMousePos.current.x, smoothMousePos.current.y])
        },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uTransparent: { value: transparent }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;
    
    // FPS计算变量
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let lastFrameTime = performance.now();

    function update(t: number) {
      // 性能控制
      if (!performanceManager.current?.shouldRender(t)) {
        // 初始化时间变量
    const startTime = performance.now();
    lastFpsTime = startTime;
    lastFrameTime = startTime;
    
    animateId = requestAnimationFrame(update);
        return;
      }

      // 计算FPS
      frameCount++;
      if (t - lastFpsTime >= 1000) {
        const realFPS = Math.round((frameCount * 1000) / (t - lastFpsTime));
        // FPS is now managed by useSingleFPSSource hook
        frameCount = 0;
        lastFpsTime = t;
      }

      if (!disableAnimation && !reducedMotion) {
        // 检查FPS限制，如果FPS过低则跳过动画更新
        if (currentFPS < 30) {
          animateId = requestAnimationFrame(update);
          return;
        }
        
        // 根据性能等级调整动画参数
        const performanceLevel = performanceManager.current?.getPerformanceLevel() ?? 1;
        const speedMultiplier = performanceLevel === 0 ? 0.5 : performanceLevel === 2 ? 1.2 : 1.0;
        
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed * speedMultiplier) / 10.0;
        
        // 根据性能调整密度
        const adaptiveDensity = enableLOD ? density * (0.5 + performanceLevel * 0.25) : density;
        program.uniforms.uDensity.value = adaptiveDensity;
      }

      const lerpFactor = 0.05;
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor;
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor;

      smoothMouseActive.current += (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
      animateId = requestAnimationFrame(update);
    }

    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMousePos.current = { x, y };
      targetMouseActive.current = 1.0;
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0;
    }

    if (mouseInteraction) {
      ctn.addEventListener('mousemove', handleMouseMove);
      ctn.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animateId);
      resizeObserver.disconnect();
      if (mouseInteraction) {
        ctn.removeEventListener('mousemove', handleMouseMove);
        ctn.removeEventListener('mouseleave', handleMouseLeave);
      }
      // Safely remove canvas
      const canvas = ctn.querySelector('canvas');
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      // Delayed WebGL context cleanup to avoid flicker during animation
      setTimeout(() => {
        try {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        } catch (error) {
          console.warn('WebGL context cleanup failed:', error);
        }
      }, 100);
    };
  }, [
    // Only keep dependencies that truly need WebGL context recreation
    transparent,
    mouseInteraction,
    maxFPS,
    enableLOD,
    reducedMotion
  ]);

  return (
    <div ref={ctnDom} className="w-full h-full relative" {...rest}>

    </div>
  );
}