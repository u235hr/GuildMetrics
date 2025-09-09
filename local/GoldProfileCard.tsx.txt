// app/components/GoldProfileCard.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import './goldprofilecard.css';

// 定义这个组件接收的数据类型
interface GoldProfileCardProps {
  item: {
    name: string;    // 名字
    value: string;   // 金额
    avatar: string;  // 头像图片URL
  };
}

// 一个辅助函数，确保一个值被限制在最小值和最大值之间
// 比如 clamp(150, 0, 100) 会返回 100
const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);

// GoldProfileCard 组件本体
export default function GoldProfileCard({ item }: GoldProfileCardProps) {
  // useRef 用来获取 DOM 元素的引用，就像给元素一个可以直接访问的“把手”
  // 我们需要用它来直接操作最外层容器的 style 属性
  const wrapRef = useRef<HTMLDivElement>(null);

  // useEffect 是 React 的一个核心功能，它会在组件“挂载”（即显示在屏幕上）后执行一些“副作用”代码
  // 这里的“副作用”就是指我们的动画，因为它需要直接操作 DOM
  useEffect(() => {
    // 从 ref 中获取真实的 DOM 元素
    const wrap = wrapRef.current;
    // 如果元素还没准备好，就直接退出，防止报错
    if (!wrap) return;

    let rafId: number; // 用来存放 requestAnimationFrame 的 ID，方便之后取消动画
    const duration = 6000; // 动画一个完整循环的持续时间（毫秒），这里是 6 秒
    const swingAmplitude = 6;   // 卡片摇摆的最大幅度（单位是“度”）

    // loop 函数是动画的核心，它会在每一帧被调用
    const loop = (timestamp: number) => {
      // timestamp 是 requestAnimationFrame 传过来的时间戳，代表当前时间

      // 1. 计算动画进度
      // (timestamp % duration) 得到当前在 6 秒循环中的位置
      // 再除以 duration，得到一个从 0 到 1 的进度值
      const progress = (timestamp % duration) / duration;
      const angleProgress = progress * Math.PI * 2; // 将 0-1 的进度转换成 0-2π 的弧度，用于三角函数

      // 2. 计算卡片摇摆角度
      // 使用 sin 和 cos 函数，可以根据弧度得到一个在 -1 到 1 之间平滑变化的值
      // 乘以我们设定的幅度，就得到了卡片在 X 和 Y 轴上的摇摆角度
      const swingX = Math.sin(angleProgress) * swingAmplitude;
      const swingY = Math.cos(angleProgress) * swingAmplitude * 0.6; // Y轴的摆动幅度设小一点，看起来更自然

      // 3. 模拟光标移动来驱动光影效果
      // 卡片上的光泽、高光效果是靠 CSS 变量 --pointer-x 和 --pointer-y 来定位的
      // 这里我们同样用 sin 和 cos 让这个“虚拟光标”在卡片上平滑地画一个椭圆轨迹
      const pointerX = 50 + Math.cos(angleProgress) * 35; // X 轴在 15% 到 85% 之间移动
      const pointerY = 50 + Math.sin(angleProgress) * 25; // Y 轴在 25% 到 75% 之间移动

      // 4. 计算“虚拟光标”距离中心的距离，用于控制某些效果的强度
      // Math.hypot 计算直角三角形的斜边长，这里就是点 (pointerX, pointerY) 到中心 (50, 50) 的距离
      // 再除以 50 归一化到 0-1 之间
      const pointerFromCenter = clamp(Math.hypot(pointerY - 50, pointerX - 50) / 50, 0, 1);

      // 5. 将所有计算好的值，一次性打包成一个对象
      const properties: Record<string, string | number> = {
        '--rotate-x': `${swingY}deg`, // 卡片沿 X 轴的旋转角度
        '--rotate-y': `${swingX}deg`, // 卡片沿 Y 轴的旋转角度
        '--pointer-x': `${pointerX}%`, // 虚拟光标的 X 位置
        '--pointer-y': `${pointerY}%`, // 虚拟光标的 Y 位置
        '--pointer-from-center': pointerFromCenter, // 光标距中心的距离
        '--pointer-from-top': pointerY / 100,      // 光标距顶部的百分比
        '--pointer-from-left': pointerX / 100,    // 光标距左侧的百分比
        '--background-x': `${50 + Math.cos(angleProgress) * 15}%`, // 背景定位的 X
        '--background-y': `${50 + Math.sin(angleProgress) * 15}%`, // 背景定位的 Y
      };

      // 6. 遍历这个对象，把所有 CSS 变量设置到 wrapper 元素上
      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value.toString());
      });

      // 7. 请求下一帧动画
      // 这会告诉浏览器：“嘿，下次重绘屏幕前，请再调用一次 loop 函数”
      // 这样就形成了一个平滑的、对性能友好的动画循环
      rafId = requestAnimationFrame(loop);
    };

    // 启动动画循环
    rafId = requestAnimationFrame(loop);

    // 这是 useEffect 的“清理函数”
    // 它会在组件“卸载”（即从屏幕上消失）时被调用
    return () => {
      // 如果动画还在运行，就取消它，防止组件消失后动画还在后台空跑，造成内存泄漏
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []); // 这里的空数组 [] 告诉 React：这个 useEffect 只在组件第一次挂载时执行一次，之后就不要再重复执行了

  // return 部分定义了组件的 HTML 结构 (使用 JSX 语法)
  return (
    // 👇 根容器：
    // - ref={wrapRef}：把这个 div 的“把手”交给我们的 wrapRef
    // - className: "gpc-card-wrapper..."：应用我们 CSS 文件里定义的样式
    // - "container" 是 tailwind 的一个特殊类，用来启用容器查询
    <div ref={wrapRef} className="gpc-card-wrapper container w-full h-full">
      {/* 👇 卡片本体 */}
      <section className="gpc-card">
        {/* 👇 卡片内部容器，主要是为了做一层背景和边框 */}
        <div className="gpc-inside">
          {/* ✨ 特效层：这是实现酷炫效果的关键！ */}
          {/* gpc-shine 负责实现那种五彩斑斓的全息光泽 */}
          <div className="gpc-shine" />
          {/* gpc-glare 负责实现镜面高光反射的效果 */}
          <div className="gpc-glare" />

          {/* 👇 内容层：所有文字、头像都在这里 */}
          <div className="gpc-content">
            {/* 头像 */}
            <div className="gpc-avatar">
              <img
                src={item.avatar}
                alt={`${item.name} avatar`}
                className="avatar-img"
                loading="lazy" // 图片懒加载，优化性能
              />
            </div>

            {/* 用户信息 */}
            <div className="gpc-details">
              <h3 className="gpc-name">{item.name}</h3>
              <p className="gpc-value">￥{item.value}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}