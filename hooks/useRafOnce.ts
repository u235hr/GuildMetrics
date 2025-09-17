import { useRef, useCallback, useEffect } from 'react';

// 这个Hook用于将多个在同一事件循环中发生的调用合并到下一个动画帧中执行一次。
export function useRafOnce() {
  const rafId = useRef<number | null>(null);
  const callbackRef = useRef<(() => void) | null>(null);

  const schedule = useCallback((callback: () => void) => {
    callbackRef.current = callback;
    if (rafId.current !== null) {
      return; // 已经安排了，无需重复
    }
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      callbackRef.current?.();
    });
  }, []);

  // 组件卸载时取消任何待处理的动画帧
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  return schedule;
}
