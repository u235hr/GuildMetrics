import { useRef, useEffect, useState } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface LightRaysProps {
  raysOrigin?: RaysOrigin;        // 光线来源方向：'top-center' | 'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left'
  raysColor?: string;             // 光线颜色：十六进制颜色值，如 '#ffd700'
  raysSpeed?: number;             // 光线移动速度：数值越大移动越快，默认1.0
  lightSpread?: number;           // 光线扩散范围：数值越大扩散越广，默认1.0
  rayLength?: number;             // 光线长度：数值越大光线越长，默认2.0
  pulsating?: boolean;            // 是否脉动：true=光线有脉动效果，false=静态光线
  fadeDistance?: number;          // 淡出距离：光线淡出的距离，数值越大淡出越远，默认1.0
  saturation?: number;            // 饱和度：0.0=黑白，1.0=原色，数值越大越鲜艳，默认1.0
  followMouse?: boolean;          // 是否跟随鼠标：true=光线跟随鼠标移动，false=固定位置
  mouseInfluence?: number;        // 鼠标影响程度：0.0=不受鼠标影响，1.0=完全跟随鼠标，默认0.1
  noiseAmount?: number;           // 噪点数量：0.0=无噪点，1.0=最大噪点，默认0.0
  distortion?: number;            // 扭曲程度：0.0=无扭曲，1.0=最大扭曲，默认0.0
  className?: string;             // 自定义CSS类名
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,    // 光线来源方向
  w: number,             // 容器宽度
  h: number              // 容器高度
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;   // 光线起始位置在容器外的距离比例
  switch (origin) {
    case 'top-left':     // 左上角：从左上角外部开始，向下照射
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':    // 右上角：从右上角外部开始，向下照射
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':         // 左侧：从左侧外部开始，向右照射
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':        // 右侧：从右侧外部开始，向左照射
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':  // 左下角：从左下角外部开始，向上照射
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center': // 底部中心：从底部中心外部开始，向上照射
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right': // 右下角：从右下角外部开始，向上照射
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center" - 顶部中心：从顶部中心外部开始，向下照射
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = 'top-center',      // 光线来源方向，默认从顶部中心
  raysColor = DEFAULT_COLOR,      // 光线颜色，默认白色
  raysSpeed = 1,                  // 光线移动速度，默认1.0
  lightSpread = 2,                // 光线扩散范围，默认1.0
  rayLength = 2,                  // 光线长度，默认2.0
  pulsating = false,              // 是否脉动，默认false
  fadeDistance = 2,             // 淡出距离，默认1.0
  saturation = 2,               // 饱和度，默认1.0
  followMouse = false,             // 是否跟随鼠标，默认true
  mouseInfluence = 0,           // 鼠标影响程度，默认0.1
  noiseAmount = 0.0,              // 噪点数量，默认0.0
  distortion = 0,               // 失真，默认0.0
  className = ''                  // 自定义CSS类名，默认空
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<any>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      await new Promise(resolve => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

      const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

      const uniforms = {
        iTime: { value: 0 },                    // 时间变量，用于动画
        iResolution: { value: [1, 1] },         // 分辨率，用于计算坐标

        rayPos: { value: [0, 0] },              // 光线位置，根据raysOrigin计算
        rayDir: { value: [0, 1] },              // 光线方向，根据raysOrigin计算

        raysColor: { value: hexToRgb(raysColor) }, // 光线颜色，转换为RGB
        raysSpeed: { value: raysSpeed },         // 光线移动速度
        lightSpread: { value: lightSpread },     // 光线扩散范围
        rayLength: { value: rayLength },         // 光线长度
        pulsating: { value: pulsating ? 1.0 : 0.0 }, // 是否脉动，转换为0或1
        fadeDistance: { value: fadeDistance },   // 淡出距离
        saturation: { value: saturation },       // 饱和度
        mousePos: { value: [0.5, 0.5] },        // 鼠标位置，用于跟随鼠标
        mouseInfluence: { value: mouseInfluence }, // 鼠标影响程度
        noiseAmount: { value: noiseAmount },     // 噪点数量
        distortion: { value: distortion }        // 扭曲程度
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;

        renderer.dpr = Math.min(window.devicePixelRatio, 2);

        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
        renderer.setSize(wCSS, hCSS);

        const dpr = renderer.dpr;
        const w = wCSS * dpr;
        const h = hCSS * dpr;

        uniforms.iResolution.value = [w, h];

        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
      };

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }

        uniforms.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0.0) {
          const smoothing = 0.92;

          smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);

          uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
        }

        try {
          renderer.render({ scene: mesh });
          animationIdRef.current = requestAnimationFrame(loop);
        } catch (error) {
          console.warn('WebGL rendering error:', error);
          return;
        }
      };

      window.addEventListener('resize', updatePlacement);
      updatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }

        window.removeEventListener('resize', updatePlacement);

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas;
            const loseContextExt = renderer.gl.getExtension('WEBGL_lose_context');
            if (loseContextExt) {
              loseContextExt.loseContext();
            }

            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          } catch (error) {
            console.warn('Error during WebGL cleanup:', error);
          }
        }

        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return;

    const u = uniformsRef.current;
    const renderer = rendererRef.current;

    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;

    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    const dpr = renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none z-[3] overflow-hidden relative ${className}`.trim()}
    />
  );
};

export default LightRays;
