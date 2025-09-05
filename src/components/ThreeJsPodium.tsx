'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PodiumData {
  rank: number;
  name: string;
  amount: number;
  avatar: string;
}

interface ThreeJsPodiumProps {
  data: PodiumData[];
}

export default function ThreeJsPodium({ data }: ThreeJsPodiumProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 场景设置
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // 相机设置
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    // 渲染器设置
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 简化光照 - 专注于展示金属材质
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // 主光源 - 清晰展示金属质感
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    // 单一补光 - 增强金属反射效果
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // 创建真实金属材质
    const createMetalMaterial = (rank: number) => {
      let color: number;
      let metalness = 1.0;
      let roughness = 0.1;
      let emissive: number = 0x000000;
      let emissiveIntensity = 0;

      switch (rank) {
        case 1: // 金色 - 奥运金牌质感
          color = 0xffd700;
          roughness = 0.02; // 非常光滑
          emissive = 0x221100; // 轻微的金色发光
          emissiveIntensity = 0.1;
          break;
        case 2: // 银色 - 奥运银牌质感
          color = 0xe8e8e8;
          roughness = 0.05; // 光滑
          emissive = 0x111111; // 轻微的白色发光
          emissiveIntensity = 0.05;
          break;
        case 3: // 铜色 - 奥运铜牌质感
          color = 0xcd7f32;
          roughness = 0.08; // 稍微粗糙
          emissive = 0x110800; // 轻微的铜色发光
          emissiveIntensity = 0.08;
          break;
        default:
          color = 0x888888;
      }

      return new THREE.MeshStandardMaterial({
        color: color,
        metalness: metalness,
        roughness: roughness,
        emissive: emissive,
        emissiveIntensity: emissiveIntensity,
        envMapIntensity: 3.0, // 增强环境反射
        clearcoat: 1.0, // 添加清漆效果
        clearcoatRoughness: 0.1,
      });
    };

    // 创建环境贴图用于反射
    const createEnvironmentMap = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d')!;
      
      // 创建渐变
      const gradient = context.createLinearGradient(0, 0, 0, size);
      gradient.addColorStop(0, '#87CEEB'); // 天空蓝
      gradient.addColorStop(0.5, '#ffffff'); // 白色
      gradient.addColorStop(1, '#1a1a3a'); // 深蓝

      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      scene.environment = texture;
      return texture;
    };

    // 创建奥运风格颁奖台
    const createPodium = (rank: number, height: number, position: THREE.Vector3) => {
      const material = createMetalMaterial(rank);
      
      // 主体 - 使用圆角矩形
      const geometry = new THREE.BoxGeometry(2.2, height, 2.2);
      const podium = new THREE.Mesh(geometry, material);
      podium.position.copy(position);
      podium.position.y = height / 2;
      podium.castShadow = true;
      podium.receiveShadow = true;

      // 顶部装饰圆盘
      const topGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 64);
      const top = new THREE.Mesh(topGeometry, material);
      top.position.copy(position);
      top.position.y = height + 0.075;
      top.castShadow = true;

      // 底部装饰边缘
      const baseGeometry = new THREE.CylinderGeometry(1.3, 1.3, 0.1, 64);
      const base = new THREE.Mesh(baseGeometry, material);
      base.position.copy(position);
      base.position.y = 0.05;
      base.castShadow = true;

      // 简洁设计 - 移除装饰条纹，专注于材质本身

      scene.add(podium);
      scene.add(top);
      scene.add(base);

      return { podium, top, base };
    };

    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a3a,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 排列数据：银(左) 金(中) 铜(右)
    const orderedData = [
      data.find(item => item.rank === 2), // 银在左边
      data.find(item => item.rank === 1), // 金在中间
      data.find(item => item.rank === 3)  // 铜在右边
    ].filter(Boolean) as PodiumData[];

    // 设置环境贴图
    createEnvironmentMap();

    // 创建颁奖台
    const podiums: Array<{ podium: THREE.Mesh; top: THREE.Mesh; base: THREE.Mesh }> = [];
    orderedData.forEach((item, index) => {
      const height = item.rank === 1 ? 4 : item.rank === 2 ? 3 : 2;
      const position = new THREE.Vector3((index - 1) * 3.5, 0, 0); // 增加间距
      const podiumGroup = createPodium(item.rank, height, position);
      podiums.push(podiumGroup);
    });

    // 添加文字标签（使用CSS3D或简单的sprite）
    const createTextSprite = (text: string, position: THREE.Vector3, size: number = 0.5) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 512;
      canvas.height = 256;

      // 设置字体
      context.font = 'Bold 48px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      // 添加背景
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制文字
      context.fillStyle = 'white';
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      
      sprite.position.copy(position);
      sprite.scale.set(size * 4, size * 2, 1);
      
      return sprite;
    };

    // 添加名字和数值标签
    orderedData.forEach((item, index) => {
      const height = item.rank === 1 ? 4 : item.rank === 2 ? 3 : 2;
      const xPosition = (index - 1) * 3.5; // 与颁奖台间距一致
      
      // 名字标签 - 更高位置
      const namePosition = new THREE.Vector3(xPosition, height + 2, 0);
      const nameSprite = createTextSprite(item.name, namePosition, 0.6);
      scene.add(nameSprite);

      // 数值标签 - 中等位置
      const valuePosition = new THREE.Vector3(xPosition, height + 1.2, 0);
      const valueSprite = createTextSprite(`¥${item.amount.toLocaleString()}`, valuePosition, 0.4);
      scene.add(valueSprite);

      // 排名标签 - 颁奖台顶部
      const rankPosition = new THREE.Vector3(xPosition, height + 0.3, 0);
      const rankText = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉';
      const rankSprite = createTextSprite(rankText, rankPosition, 0.5);
      scene.add(rankSprite);
    });

    // 简化的环境粒子 - 仅作为背景氛围
    const createParticles = () => {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 200; // 大幅减少粒子数量
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.003,
        color: 0xffffff,
        transparent: true,
        opacity: 0.3, // 更加透明，不抢夺注意力
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      return particlesMesh;
    };

    const particles = createParticles();

    // 简化的动画循环 - 专注于金属材质展示
    let time = 0;
    const animate = () => {
      time += 0.005;

      // 静态相机位置，轻微左右摆动展示金属反射
      camera.position.x = Math.sin(time * 0.2) * 1.5;
      camera.position.y = 5;
      camera.position.z = 8;
      camera.lookAt(0, 2, 0);

      // 移除粒子旋转 - 保持静态
      // particles.rotation.y += 0.002;

      // 移除颁奖台动画 - 保持静态，专注材质

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // 清理Three.js资源
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [data]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
