// 示例：为铜卡添加 Profile Card 效果，不破坏现有结构
if (item.rank === 3) { // 铜卡
  return (
    <div className="relative inline-block">
      {/* 新增：铜卡 Profile Card 效果层 */}
      <div className="absolute inset-0 z-0 bronze-profile-effects">
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-lg blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/10 to-amber-300/10 rounded-lg"></div>
        
        {/* 边框装饰 */}
        <div className="absolute inset-0 border-2 border-orange-400/50 rounded-lg"></div>
        <div className="absolute inset-0 border border-orange-300/30 rounded-lg"></div>
        
        {/* 动态光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10 rounded-lg animate-pulse"></div>
      </div>
      
      {/* 原有的铜卡结构完全不变 */}
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
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            
            {/* 现有的奖牌、头像、用户信息完全不变 */}
            <div className="absolute top-[0.5rem] right-[0.5rem] z-20">
              <div className={	ext-[min(4vw,2rem)] drop-shadow-lg}>
                {colors.medal}
              </div>
            </div>

            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={item.avatar}
                alt={${item.name} avatar}
                loading="lazy"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>

            <div className="pc-content">
              <div className="pc-details">
                <h3>{item.name}</h3>
                <p>{item.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
