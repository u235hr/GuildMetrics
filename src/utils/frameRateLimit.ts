export class FrameRateLimit {
  private targetFPS: number = 60;
  private lastFrameTime: number = 0;
  private frameInterval: number;

  constructor(targetFPS: number = 60) {
    const clamped = Math.max(30, Math.min(60, targetFPS));
    this.targetFPS = clamped;
    this.frameInterval = 1000 / this.targetFPS;
  }

  public limitedRAF(callback: (timestamp: number) => void): number {
    return requestAnimationFrame((timestamp: number) => {
      const deltaTime = timestamp - this.lastFrameTime;
      if (deltaTime >= this.frameInterval) {
        this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);
        callback(timestamp);
      } else {
        requestAnimationFrame(() => {
          this.limitedRAF(callback);
        });
      }
    });
  }

  public createLimitedLoop(callback: (timestamp: number) => void): () => void {
    let animationId = 0;
    let isRunning = true;

    const loop = (timestamp: number) => {
      if (!isRunning) return;
      const deltaTime = timestamp - this.lastFrameTime;
      if (deltaTime >= this.frameInterval) {
        this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);
        callback(timestamp);
      }
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
    };
  }

  public getTargetFPS(): number {
    return this.targetFPS;
  }

  public setTargetFPS(fps: number): void {
    const clamped = Math.max(30, Math.min(60, fps));
    this.targetFPS = clamped;
    this.frameInterval = 1000 / this.targetFPS;
  }
}

export const frameRateLimit = new FrameRateLimit(60);
export const limitedRequestAnimationFrame = (callback: (timestamp: number) => void): number => {
  return frameRateLimit.limitedRAF(callback);
};
