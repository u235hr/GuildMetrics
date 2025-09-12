// ========== 模拟hover触发效果方案 - 纯3D wiggle版 ==========
// 这个方案用3D变换替代hover，但保留所有CSS效果
// 核心原理：用wiggle角度反推虚拟鼠标位置，触发所有CSS hover效果
// 完全去掉hover交互，只保留3D wiggle自动触发

// ========== 1. 动画管理 ==========
// 定义wiggleAnimationRef是个管道类型，用来存储动画ID
const wiggleAnimationRef = useRef<number | null>(null);

// ========== 2. 启动wiggle动画 ==========
const startWiggleAnimation = useCallback(() => {
  const card = cardRef.current;
  const wrap = wrapRef.current;

  if (!card || !wrap) return;

  // 停止之前的动画，避免重复启动
  if (wiggleAnimationRef.current) {
    cancelAnimationFrame(wiggleAnimationRef.current);
  }

  const animate = () => {
    // ========== 3D wiggle效果 ==========
    // 自动摆动的3D效果，不需要鼠标移动
    const time = Date.now() * 0.001; // Date.now()得到的是当前时间戳，单位是毫秒，除以1000得到秒
    const wiggleX = Math.sin(time) * 5; // 设置一个X轴摆动幅度，0到60秒的正弦波，单位是度，幅度5
    const wiggleY = Math.cos(time * 0.8) * 3; // Y轴摆动方向跟X轴反着来，幅度也比X轴幅度更小，让效果更自然
    
    // 应用3D wiggle变换
    // transform是CSS自带方法，传入的参数是字符串，有三个参数，分别是：
    // perspective，表示透视距离，单位是px，数字越小，3D效果越明显
    // rotateX，表示绕X轴旋转的角度，单位是deg，数字越大，旋转角度越大，X轴摆动幅度越大
    // rotateY，表示绕Y轴旋转的角度，单位是deg，数字越大，旋转角度越大，Y轴摆动幅度越大
    card.style.transform = `perspective(1000px) rotateX(${wiggleX}deg) rotateY(${wiggleY}deg)`;
    
    // ========== 用wiggle角度反推虚拟鼠标位置 ==========
    // 原理：以卡片范围为坐标系，wiggle都发生在卡片中心点
    // wiggle的角度和鼠标的位置关系是：wiggle的X轴转动角度*10px+卡片中心点的X坐标值=鼠标当前的X坐标，Y轴同理
    // 所以，先获取卡片的原始尺寸
    const rect = card.getBoundingClientRect();
    // 计算卡片中心点，整个浏览器的设定就是左上角是原点，X轴Y轴都没有负数
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 反推虚拟鼠标位置
    const offsetX = centerX - wiggleY * 10; // 水平位置反推
    const offsetY = centerY + wiggleX * 10; // 垂直位置反推
    
    // 转换为百分比
    const percentX = (offsetX / rect.width) * 100;
    const percentY = (offsetY / rect.height) * 100;
    
    // 更新CSS变量，触发背景光效、彩虹效果等
    // setProperty是CSS自带方法：element.style.setProperty(property, value, priority)，属性名，属性值，优先级
    // priority：auto，important；不传默认auto，代表自动计算；important，会覆盖其他样式
    wrap.style.setProperty('--pointer-x', `${percentX}%`);
    wrap.style.setProperty('--pointer-y', `${percentY}%`);
    wrap.style.setProperty('--background-x', `${adjust(percentX, 0, 100, 35, 65)}%`);
    wrap.style.setProperty('--background-y', `${adjust(percentY, 0, 100, 35, 65)}%`);
    
    // 继续下一帧动画
    wiggleAnimationRef.current = requestAnimationFrame(animate);
  };

  // 开始动画
  wiggleAnimationRef.current = requestAnimationFrame(animate);
}, []);

// ========== 3. 停止wiggle动画 ==========
const stopWiggleAnimation = useCallback(() => {
  if (wiggleAnimationRef.current) {
    cancelAnimationFrame(wiggleAnimationRef.current);
    wiggleAnimationRef.current = null;
  }
}, []);

// ========== 4. 在useEffect中启动动画 ==========
useEffect(() => {
  // 组件挂载后启动wiggle动画
  startWiggleAnimation();
  
  // 组件卸载时停止动画
  return () => {
    stopWiggleAnimation();
  };
}, [startWiggleAnimation, stopWiggleAnimation]);

// ========== 总结 ==========
// 1. wiggleAnimationRef：管理动画ID，避免重复启动
// 2. startWiggleAnimation：启动持续运行的wiggle动画
// 3. stopWiggleAnimation：停止动画，清理资源
// 4. useEffect：组件挂载时启动，卸载时停止
// 5. 完全去掉hover交互，只保留3D wiggle自动触发
// 核心：用wiggle角度反推虚拟鼠标位置，触发所有CSS hover效果