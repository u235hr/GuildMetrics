// 示例：为金卡添加新的装饰效果，不破坏现有代码
if (item.rank === 1) {
  return (
    <div className="relative inline-block">
      {/* 新增：金卡特殊装饰层 */}
      <div className="absolute inset-0 z-0 gold-card-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 to-orange-300/10 rounded-lg"></div>
      </div>
      
      {/* 新增：金卡边框装饰 */}
      <div className="absolute inset-0 z-10 gold-card-border">
        <div className="absolute inset-0 border-2 border-yellow-400/50 rounded-lg"></div>
        <div className="absolute inset-0 border border-yellow-300/30 rounded-lg"></div>
      </div>
      
      {/* 原有的金卡结构完全不变 */}
      <div
        ref={wrapRef}
        className={pc-card-wrapper  transform-gpu animate-flipIn}
        style={{
          animationDelay: getAnimationDelay(index),
          animationFillMode: 'both',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          ...cardStyle
        }}
      >
        <section ref={cardRef} className="pc-card">
          {/* 现有的所有内容保持不变 */}
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            {/* ... 其他现有内容 */}
          </div>
        </section>
      </div>
    </div>
  );
}
