/**
 * ===================================================================================
 * 金卡展开动画组件 (TiltedGoldCard)
 * ===================================================================================
 * 
 * 这是一个复杂的3D金卡组件，具有完整的展开动画序列。组件包含以下主要功能：
 * 
 * 🎯 核心功能：
 * - 3D倾斜卡片效果（已禁用交互，改为纯展示）
 * - 电光边框效果
 * - 自动展开动画序列
 * - GSAP数字递增动画
 * - 礼花庆祝效果
 * 
 * 🎬 动画执行顺序（共8个步骤）：
 * 
 * 【第0步】触发条件检查 (第241-248行)
 * - 监听 goldCanExpand 属性变化
 * - 当值为 true 时，启动展开动画序列
 * 
 * 【第1步】资源预加载检查 (第211-219行)
 * - 检查图片是否加载完成
 * - 检查字体是否就绪
 * - 等待DOM稳定（100ms延迟）
 * 
 * 【第2步】金卡位移动画 (第222-226行)
 * - 金卡向上移动6vh，为展开卡片让出空间
 * - 使用CSS transition，持续0.5秒
 * - 通过 setIsExpanded(true) 触发
 * 
 * 【第3步】outline-page展开动画 (第228-229行)
 * - 300ms延迟后，outline-page开始展开
 * - 显示奖杯图标和排名数字
 * - CSS动画持续0.5秒
 * 
 * 【第4步】detail-page显示 (第230-238行)
 * - 与第3步同时开始（300ms延迟）
 * - 通过 setShowDetailPage(true) 显示详情页面
 * - 准备开始滑入动画
 * 
 * 【第5步】detail-page滑入动画 (第232-238行)
 * - detail-page执行slide-in-bottom动画
 * - 显示奖牌图标和分数框
 * - CSS动画持续1秒
 * 
 * 【第6步】检测动画完成 (第105-178行)
 * - 监听CSS动画结束事件 onAnimationEnd
 * - 检测到 'slide-in-bottom' 动画完成后继续
 * 
 * 【第7步】GSAP数字递增动画 (第114-173行)
 * - 80ms延迟后开始数字动画
 * - 从0递增到目标分数
 * - 持续2秒，使用千分位格式显示
 * - 缓动函数：power2.out（先快后慢）
 * 
 * 【第8步】礼花庆祝效果 (第132-172行)
 * - 数字动画完成后立即触发
 * - 连续发射3波礼花：
 *   - 第1波：中心位置，100个粒子
 *   - 第2波：200ms后，左侧偏移，50个粒子
 *   - 第3波：400ms后，右侧偏移，50个粒子
 * 
 * 📐 尺寸计算系统：
 * - 使用CSS变量 --card-width 作为基准
 * - 所有子元素尺寸都相对于卡片宽度计算
 * - 支持响应式缩放，保持比例一致
 * 
 * 🎨 视觉效果：
 * - 金色电光边框 (#FFD700)
 * - 3D透视效果 (perspective: 800px)
 * - 硬件加速优化 (transform: translateZ(0))
 * - 阿里巴巴普惠体字体
 * 
 * ===================================================================================
 */

// 第1-6行：导入必要的依赖库
import { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap'; // 第4行：导入GSAP动画库，用于数字递增动画
import confetti from 'canvas-confetti'; // 第5行：导入礼花效果库
import ElectricBorder from '../../ElectricBorder'; // 第6行：导入电光边框组件

// 第9-31行：定义金卡组件的属性接口
interface TiltedGoldCardProps {
  imageSrc: React.ComponentProps<'img'>['src']; // 第10行：图片源地址
  altText?: string; // 第11行：图片替代文本（可选）
  containerHeight?: string | number; // 第13行：容器高度（可选）
  containerWidth?: string | number; // 第14行：容器宽度（可选）
  imageHeight?: string | number; // 第15行：图片高度（可选）
  imageWidth?: string | number; // 第16行：图片宽度（可选）
  showMobileWarning?: boolean; // 第19行：是否显示移动端警告（可选）
  overlayContent?: React.ReactNode; // 第21行：覆盖层内容（可选）
  displayOverlayContent?: boolean; // 第22行：是否显示覆盖层内容（可选）
  // 第23-30行：展开式卡片相关属性
  showExpandedCard?: boolean; // 第24行：是否显示展开的卡片（可选）
  goldCanExpand?: boolean; // 第25行：金卡是否可以展开（可选）
  expandedCardData?: { // 第26-30行：展开卡片的数据（可选）
    name: string; // 第27行：玩家姓名
    score: number; // 第28行：分数
    rank: number; // 第29行：排名
    avatar: string; // 第30行：头像地址
  };
}



// 第42-59行：金卡组件主函数，使用解构赋值接收props并设置默认值
export default function TiltedGoldCard({
  imageSrc, // 第44行：图片源地址（必需）
  altText = 'Tilted card image', // 第45行：图片替代文本，默认值为'Tilted card image'
  containerHeight = '300px', // 第47行：容器高度，默认300px
  containerWidth = '100%', // 第48行：容器宽度，默认100%
  imageHeight = '300px', // 第49行：图片高度，默认300px
  imageWidth = '300px', // 第50行：图片宽度，默认300px
  showMobileWarning = true, // 第53行：是否显示移动端警告，默认显示
  overlayContent = null, // 第55行：覆盖层内容，默认为null
  displayOverlayContent = false, // 第56行：是否显示覆盖层内容，默认不显示
  showExpandedCard = false, // 第57行：是否显示展开卡片，默认不显示
  goldCanExpand = false, // 第58行：金卡是否可展开，默认不可展开
  expandedCardData // 第59行：展开卡片数据，可选
}: TiltedGoldCardProps) {
  
  const [isExpanded, setIsExpanded] = useState(false); // 第75行：卡片是否处于展开状态
  const [showDetailPage, setShowDetailPage] = useState(false); // 第76行：是否显示详情页面

  // 添加定时器清理管理
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const scoreElementRef = useRef<HTMLParagraphElement>(null);
  
  // 安全的 setTimeout 封装
  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    
    timersRef.current.add(timer);
    return timer;
  }, []);
  
  // 清理所有定时器
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // 优化的Confetti效果 - 保持视觉效果，减少资源消耗
  const triggerOptimizedConfetti = useCallback(() => {
    const goldCard = document.querySelector('.expanded-card');
    if (!goldCard) return;
    
    const rect = goldCard.getBoundingClientRect();
    const centerX = (rect.left + rect.width / 2) / window.innerWidth;
    const centerY = (rect.top + rect.height / 2) / window.innerHeight;
    
    // 保持三波礼花效果，但减少粒子数量
    confetti({
      particleCount: 80,  // 从100减少到80
      spread: 70,
      origin: { x: centerX, y: centerY },
      ticks: 120          // 减少生命周期
    });
    
    safeSetTimeout(() => {
      confetti({
        particleCount: 40, // 从50减少到40
        spread: 60,
        origin: { x: centerX - 0.1, y: centerY },
        ticks: 100
      });
    }, 200);
    
    safeSetTimeout(() => {
      confetti({
        particleCount: 40, // 从50减少到40
        spread: 60,
        origin: { x: centerX + 0.1, y: centerY },
        ticks: 100
      });
    }, 400);
  }, [safeSetTimeout]);

  

  // 第103行：注释说明：移除3D wiggle效果

  // ========== 第105-106行：动画顺序第6步：检测detail-page动画完成 ==========
  // 第106行：检测detail-page动画完成 + 轻量保底（基于显示状态）
  const handleDetailPageAnimationEnd = (e: React.AnimationEvent) => {
    // 第108行：打印动画事件信息，用于调试
    console.log('Animation event triggered:', e.animationName, 'showDetailPage:', showDetailPage);
    // 第109-110行：检查是否是slide-in-bottom动画完成且详情页面正在显示
    if (e.animationName === 'slide-in-bottom' && showDetailPage) {
      console.log('Detail page animation completed, starting number increment animation');
      
      // ========== 第112行：动画顺序第7步：GSAP数字递增动画 ==========
      safeSetTimeout(() => { // 使用安全的定时器
        // 第114-115行：获取分数显示元素并执行数字递增动画
        const scoreElement = scoreElementRef.current || document.querySelector('.grades-box-num');
        if (scoreElement && expandedCardData) { // 第116行：确保元素存在且有数据
          const targetScore = expandedCardData.score || 0; // 第117行：获取目标分数，默认为0
          
          // 第119行：创建一个临时对象来存储当前数字
          const scoreObj = { value: 0 };
          
          // 第121-135行：GSAP数字递增动画配置
          gsap.to(scoreObj, {
            value: targetScore, // 第123行：动画目标值
            duration: 2, // 第124行：动画持续时间2秒
            ease: "power2.out", // 第125行：缓动函数，先快后慢
            onUpdate: () => { // 第126-128行：动画更新回调
              // 第127行：实时更新显示的数字，使用千分位分隔符格式化
              scoreElement.textContent = Math.floor(scoreObj.value).toLocaleString();
            },
            onComplete: () => { // 第129行：动画完成回调
              console.log('Number increment animation completed, starting confetti effect');
              
              // ========== 第132行：动画顺序第8步：礼花效果 ==========
              const goldCard = document.querySelector('.expanded-card'); // 第133行：获取展开的卡片元素
              if (goldCard) { // 第134行：确保卡片元素存在
                // 第135-137行：计算礼花发射的中心位置
                const rect = goldCard.getBoundingClientRect();
                const centerX = (rect.left + rect.width / 2) / window.innerWidth;
                const centerY = (rect.top + rect.height / 2) / window.innerHeight;
                
                // 第144-149行：发射第一波礼花
                confetti({
                  particleCount: 100, // 第146行：粒子数量100个
                  spread: 70, // 第147行：扩散角度70度
                  origin: { x: centerX, y: centerY } // 第148行：从卡片中心发射
                });
                
                // 第151-156行：延迟200ms发射第二波礼花（左侧偏移）
                setTimeout(() => {
                  confetti({
                    particleCount: 50, // 第153行：粒子数量50个
                    spread: 60, // 第154行：扩散角度60度
                    origin: { x: centerX - 0.1, y: centerY } // 第155行：从中心左侧0.1偏移发射
                  });
                }, 200);
                
                // 第158-165行：延迟400ms发射第三波礼花（右侧偏移）
                setTimeout(() => {
                  confetti({
                    particleCount: 50, // 第160行：粒子数量50个
                    spread: 60, // 第161行：扩散角度60度
                    origin: { x: centerX + 0.1, y: centerY } // 第162行：从中心右侧0.1偏移发射
                  });
                  
                  // 第164行：礼花效果完成
                }, 400);
              } else {
                // 第166行：如果找不到卡片元素，礼花效果完成
              }
            }
          });
        }
      }, 80); // 第171行：延迟80ms开始数字动画
    }
  }; // 第173行：handleDetailPageAnimationEnd函数结束



  // 第182-201行：资源预加载检查函数
  const checkResourcesReady = async (): Promise<boolean> => {
    try { // 第184行：尝试检查资源加载状态
      // 第185-191行：检查图片是否加载完成
      const imagePromise = new Promise<boolean>((resolve) => {
        const img = new Image(); // 第187行：创建新的Image对象
        img.onload = () => resolve(true); // 第188行：图片加载成功回调
        img.onerror = () => resolve(false); // 第189行：图片加载失败回调
        img.src = imageSrc as string; // 第190行：设置图片源地址开始加载
      });

      // 第193行：检查字体是否加载完成
      const fontPromise = document.fonts.ready;

      // 第195-196行：等待所有资源就绪
      const [imageReady] = await Promise.all([imagePromise, fontPromise]);
      
      return imageReady; // 第198行：返回图片是否加载成功
    } catch (error) { // 第199行：捕获异常
      console.warn('Resource preload check failed:', error); // 第200行：打印警告信息
      return true; // 第201行：出错时继续执行，避免阻塞动画
    }
  };

  // ========== 第206-235行：动画顺序第1-5步：自动展开动画启动函数 ==========
  // 第207行：自动触发展开动画的主函数
  const startAutoExpansion = useCallback(async () => {
    // 添加额外的状态检查
    if (!goldCanExpand) {
      console.log('Gold expansion not enabled yet, waiting...');
      return;
    }
    
    console.log('Starting resource preload check...'); // 第209行：打印开始资源检查日志
    
    // ========== 第211行：动画顺序第1步：等待资源加载完成 ==========
    // 第212行：等待资源就绪（图片和字体）
    const resourcesReady = await checkResourcesReady();
    
    // 第214-216行：如果资源加载失败，打印警告但继续动画
    if (!resourcesReady) {
      console.warn('Some resources failed to load, but continuing animation');
    }

    // 第218-219行：等待DOM稳定，延迟100ms确保渲染完成
    await new Promise(resolve => safeSetTimeout(() => resolve(undefined), 100));

    console.log('Resources ready, starting auto expansion animation'); // 第221行：打印开始展开动画日志
    // ========== 第222-224行：动画顺序第2步：金卡位移动画 ==========
    // 第223行：金卡向上移动6vh，为展开卡片让出空间（CSS transition: 0.5s）
    setIsExpanded(true);
    
    // ========== 第226-227行：动画顺序第3步：outline-page展开动画 ==========
    // 第227行：300ms延迟后开始outline-page展开动画（CSS animation: 0.5s）
    // ========== 第228-229行：动画顺序第4步：detail-page显示 ==========
    // 第229行：延迟显示detail-page，等待outline-page动画进行到一半时开始
    safeSetTimeout(() => { // 使用安全的定时器
      setShowDetailPage(true); // 第231行：显示详情页面
      // ========== 第232-235行：动画顺序第5步：detail-page滑入动画 ==========
      // 第233行：detail-page开始slide-in-bottom动画（CSS animation: 1s）
      // 第234行：detail-page显示后，等待其动画完成再开始数字递增
      // 第235行：动画完成事件会在CSS动画结束时触发handleDetailPageAnimationEnd
    }, 300); // 第236行：300ms延迟，让outline-page动画进行到一半时开始detail-page动画
  }, [goldCanExpand, checkResourcesReady, safeSetTimeout]);

  // ========== 第241-249行：动画顺序第0步：触发条件检查 ==========
  // 第242行：当goldCanExpand为true时触发展开动画
  useEffect(() => { // 第243行：使用useEffect监听goldCanExpand变化
    console.log('🏆 Gold card goldCanExpand changed:', goldCanExpand);
    if (goldCanExpand) { // 第244行：检查是否应该展开金卡
      console.log('   - Starting gold card expansion sequence');
      console.log('Received expansion signal, starting gold card expansion animation'); // 第245行：打印展开信号日志
      startAutoExpansion(); // 第246行：调用自动展开函数
    }
  }, [goldCanExpand, startAutoExpansion]); // 第248行：依赖项为goldCanExpand和startAutoExpansion

  // 第250行：组件渲染函数开始
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* 第252行：外层容器，垂直居中布局 */}
      <figure
        style={{
          position: 'relative', // 第256行：相对定位
          width: containerWidth, // 第257行：使用传入的容器宽度
          height: containerHeight, // 第258行：使用传入的容器高度
          display: 'flex', // 第260行：弹性布局
          flexDirection: 'column', // 第261行：垂直方向排列
          alignItems: 'center', // 第262行：水平居中
          justifyContent: 'center', // 第263行：垂直居中
          transition: 'transform 0.5s ease-out', // 第265行：变换过渡动画0.5秒
          transform: isExpanded ? 'translateY(-6vh)' : 'translateY(0)' // 第266行：展开时向上移动6vh
        }}
      >
      {/* 第272-282行：移动端警告提示（条件渲染） */}
      {showMobileWarning && (
        <div style={{
          position: 'absolute', // 第274行：绝对定位
          top: '1rem', // 第275行：距离顶部1rem
          textAlign: 'center', // 第276行：文字居中
          fontSize: '0.875rem', // 第277行：字体大小0.875rem
          display: 'none' // 第278行：默认隐藏
        }} className="block sm:hidden"> {/* 第279行：在小屏幕上显示 */}
          This effect is not optimized for mobile. Check on desktop. {/* 第280行：警告文字 */}
        </div>
      )}

      {/* 第284-294行：3D动画容器 */}
      <div
        style={{
          position: 'relative',
          width: imageWidth,
          height: imageHeight,
        }}
      >
        {/* 第297-327行：电光边框组件，包裹金卡图片 */}
        <ElectricBorder
          color="#FFD700" // 第299行：电光颜色为金色
          speed={0.5} // 第300行：电光流动速度0.5
          chaos={0.1} // 第301行：电光混乱程度0.1
          thickness={3} // 第302行：电光厚度3px
          style={{ 
            position: 'absolute', // 第304行：绝对定位
            top: 0, // 第305行：顶部对齐
            left: 0, // 第306行：左侧对齐
            width: imageWidth, // 第307行：宽度与图片一致
            height: imageHeight, // 第308行：高度与图片一致
            borderRadius: 15, // 第309行：圆角15px
            pointerEvents: 'none', // 第310行：不响应鼠标事件
            zIndex: 10 // 第311行：层级为10，位于图片之上
          }}
        >
          {/* 第313-327行：金卡头像图片 */}
          <img
            src={imageSrc} // 第315行：图片源地址
            alt={altText} // 第316行：图片替代文本
            style={{
              position: 'absolute', // 第318行：绝对定位
              top: 0, // 第319行：顶部对齐
              left: 0, // 第320行：左侧对齐
              objectFit: 'cover', // 第321行：图片裁剪方式为覆盖
              borderRadius: '15px', // 第322行：圆角15px
              width: imageWidth, // 第325行：图片宽度
              height: imageHeight // 第326行：图片高度
            }}
          />
        </ElectricBorder>

        {/* 第332-345行：覆盖层内容（条件渲染） */}
        {displayOverlayContent && overlayContent && (
          <div 
            style={{
              position: 'absolute', // 第335行：绝对定位
              top: 0, // 第336行：顶部对齐
              left: 0, // 第337行：左侧对齐
              zIndex: 2, // 第338行：层级为2
              transform: 'translateZ(30px)' // 第340行：3D位移30px
            }}
          >
            {overlayContent} {/* 第343行：渲染传入的覆盖层内容 */}
          </div>
        )}
      </div> {/* 第346行：3D动画容器结束 */}

      

          {/* 第372-373行：展开式金卡 - 放在figure内部，相对于头像定位 */}
          {showExpandedCard && expandedCardData && isExpanded && (
            <div 
              className="expanded-card"  // 第377行：展开卡片的CSS类名
              style={{ 
                position: 'absolute', // 第379行：绝对定位
                top: 'calc(100% + 3px)', // 第380行：位于金卡下方，间隙3px
                left: '50%', // 第381行：左侧位置50%
                transform: 'translateX(-50%)', // 第382行：水平居中
                zIndex: 10, // 第383行：层级为10
                width: imageWidth, // 第384行：宽度与头像一致
                margin: '0 auto', // 第385行：外边距自动居中
                ['--card-width' as any]: imageWidth // 第386行：CSS变量，供内部元素使用
              }}
            >
              {/* 第389-403行：outline-page外框页面 */}
              <div 
                className={`outline-page ${isExpanded ? 'expanded' : 'collapsed'}`} // 第390行：根据展开状态动态添加CSS类
              >
                {/* 第392-403行：奖杯图标SVG */}
                <svg
                  className="trophy" // 第394行：奖杯图标CSS类
                  viewBox="0 0 1024 1024" // 第395行：SVG视图框
                  version="1.1" // 第396行：SVG版本
                  xmlns="http://www.w3.org/2000/svg" // 第397行：SVG命名空间
                  style={{
                    position: 'absolute',
                    right: '25px',
                    top: '2px',
                    zIndex: 999,
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <path
                    d="M469.333333 682.666667h85.333334v128h-85.333334zM435.2 810.666667h153.6c4.693333 0 8.533333 3.84 8.533333 8.533333v34.133333h-170.666666v-34.133333c0-4.693333 3.84-8.533333 8.533333-8.533333z"
                    fill="#ea9518"
                  ></path>
                  <path
                    d="M384 853.333333h256a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667H341.333333v-42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z"
                    fill="#6e4a32"
                  ></path>
                  <path
                    d="M213.333333 256v85.333333a42.666667 42.666667 0 0 0 85.333334 0V256H213.333333zM170.666667 213.333333h170.666666v128a85.333333 85.333333 0 1 1-170.666666 0V213.333333zM725.333333 256v85.333333a42.666667 42.666667 0 0 0 85.333334 0V256h-85.333334z m-42.666666-42.666667h170.666666v128a85.333333 85.333333 0 1 1-170.666666 0V213.333333z"
                    fill="#f4ea2a"
                  ></path>
                  <path
                    d="M298.666667 85.333333h426.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v341.333333a256 256 0 1 1-512 0V128a42.666667 42.666667 0 0 1 42.666667-42.666667z"
                    fill="#f2be45"
                  ></path>
                  <path
                    d="M512 469.333333l-100.309333 52.736 19.157333-111.701333-81.152-79.104 112.128-16.298667L512 213.333333l50.176 101.632 112.128 16.298667-81.152 79.104 19.157333 111.701333z"
                    fill="#FFF2A0"
                  ></path>
                </svg> {/* 第427行：奖杯SVG结束 */}
                {/* 第428-451行：排名数字显示 */}
                <p 
                  className="ranking-number" // 第429行：排名数字CSS类
                  style={{
                    position: 'absolute', // 第431行：绝对定位
                    width: 'calc(var(--card-width, 20vh) * 0.2)',     // 第432行：宽度 = 卡片宽度的20%
                    height: 'calc(var(--card-width, 20vh) * 0.2)',    // 第433行：高度 = 卡片宽度的20%
                    fontSize: 'calc(var(--card-width, 20vh) * 0.2)', // 第434行：字体大小 = 卡片宽度的20%
                    left: 'calc(var(--card-width, 20vh) * 0.2)',    // 第435行：左边距 = 卡片宽度的20%
                    top: 'calc(var(--card-width, 20vh) * -0.03)',     // 第436行：上边距 = 卡片宽度的-3%
                    margin: 0, // 第437行：外边距为0
                    padding: 0, // 第438行：内边距为0
                    zIndex: 10, // 第439行：层级为10
                  }}
                >
                  {expandedCardData.rank} {/* 第442行：显示排名数字 */}
                  <span 
                    className="ranking-word" // 第444行：排名文字CSS类
                    style={{
                      fontSize: 'calc(var(--card-width, 20vh) * 0.133)', // 第446行：文字大小 = 卡片宽度的13.3%
                      position: 'relative', // 相对定位，方便调整
                      left: '20px', // 向右偏移2px
                      top: '-55px' // 向上偏移2px
                    }}
                  >
                    st {/* 第449行：序数词后缀 */}
                  </span>
                </p>
              </div> {/* 第452行：outline-page结束 */}
              {/* 第454-459行：detail-page详情页面 */}
              <div 
                className={`detail-page ${showDetailPage ? 'show' : 'hide'}`} // 第455行：根据显示状态动态添加CSS类
                style={{ 
                  display: showDetailPage ? 'flex' : 'none' // 第457行：根据状态控制显示/隐藏
                }}
                onAnimationEnd={handleDetailPageAnimationEnd} // 第459行：绑定动画结束事件
              >
                <svg
                  className="icon medals slide-in-top"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: 'calc(var(--card-width, 20vh) * 0.2)', // 奖牌宽度 = 卡片宽度的26.7%
                    height: 'calc(var(--card-width, 20vh) * 0.2)', // 奖牌高度 = 卡片宽度的26.7%
                    top: 'calc(var(--card-width, 20vh) * 0.04)',    // 上边距 = 卡片宽度的5%
                    right: 'calc(var(--card-width, 20vh) * 0.02)'  // 右边距 = 卡片宽度的1.7%
                  }}
                >
                  <path
                    d="M896 42.666667h-128l-170.666667 213.333333h128z"
                    fill="#FF4C4C"
                  ></path>
                  <path
                    d="M768 42.666667h-128l-170.666667 213.333333h128z"
                    fill="#3B8CFF"
                  ></path>
                  <path d="M640 42.666667h-128L341.333333 256h128z" fill="#F1F1F1"></path>
                  <path
                    d="M128 42.666667h128l170.666667 213.333333H298.666667z"
                    fill="#FF4C4C"
                  ></path>
                  <path
                    d="M256 42.666667h128l170.666667 213.333333h-128z"
                    fill="#3B8CFF"
                  ></path>
                  <path
                    d="M384 42.666667h128l170.666667 213.333333h-128z"
                    fill="#FBFBFB"
                  ></path>
                  <path
                    d="M298.666667 256h426.666666v213.333333H298.666667z"
                    fill="#E3A815"
                  ></path>
                  <path
                    d="M512 661.333333m-320 0a320 320 0 1 0 640 0 320 320 0 1 0-640 0Z"
                    fill="#FDDC3A"
                  ></path>
                  <path
                    d="M512 661.333333m-256 0a256 256 0 1 0 512 0 256 256 0 1 0-512 0Z"
                    fill="#E3A815"
                  ></path>
                  <path
                    d="M512 661.333333m-213.333333 0a213.333333 213.333333 0 1 0 426.666666 0 213.333333 213.333333 0 1 0-426.666666 0Z"
                    fill="#F5CF41"
                  ></path>
                  <path
                    d="M277.333333 256h469.333334a21.333333 21.333333 0 0 1 0 42.666667h-469.333334a21.333333 21.333333 0 0 1 0-42.666667z"
                    fill="#D19A0E"
                  ></path>
                  <path
                    d="M277.333333 264.533333a12.8 12.8 0 1 0 0 25.6h469.333334a12.8 12.8 0 1 0 0-25.6h-469.333334z m0-17.066666h469.333334a29.866667 29.866667 0 1 1 0 59.733333h-469.333334a29.866667 29.866667 0 1 1 0-59.733333z"
                    fill="#F9D525"
                  ></path>
                  <path
                    d="M512 746.666667l-100.309333 52.736 19.157333-111.701334-81.152-79.104 112.128-16.298666L512 490.666667l50.176 101.632 112.128 16.298666-81.152 79.104 19.157333 111.701334z"
                    fill="#FFF2A0"
                  ></path>
                </svg> {/* 第523行：奖牌SVG结束 */}
                {/* 第524-531行：分数框容器 */}
                <div 
                  className="grades-box" // 第525行：分数框CSS类
                  style={{
                    height: 'calc(var(--card-width, 20vh) * 0.2)',  // 第527行：分数框高度 = 卡片宽度的20%
                    top: 'calc(var(--card-width, 20vh) * 0.0)',   // 第528行：上边距 = 卡片宽度的0%
                    marginRight: 'calc(var(--card-width, 20vh) * 0.033)', // 第529行：右边距 = 卡片宽度的3.3%
                    marginLeft: 'calc(var(--card-width, 20vh) * 0.05)'    // 第530行：左边距 = 卡片宽度的5%
                  }}
                >
                  <svg
                    className="icon grades-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: 'calc(var(--card-width, 20vh) * 0.2)',  // 分数图标宽度 = 卡片宽度的20%
                      height: 'calc(var(--card-width, 20vh) * 0.2)', // 分数图标高度 = 卡片宽度的20%
                      top: 'calc(var(--card-width, 20vh) * 0.03)'   // 上边距 = 卡片宽度的3.3%
                    }}
                  >
                    <path
                      d="M382.6 805H242.2c-6.7 0-12.2-5.5-12.2-12.2V434.3c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v358.6c0 6.6-5.4 12.1-12.1 12.1z"
                      fill="#ea9518"
                    ></path>
                    <path
                      d="M591.1 805H450.7c-6.7 0-12.2-5.5-12.2-12.2V254.9c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v537.9c0 6.7-5.5 12.2-12.2 12.2z"
                      fill="#f2be45"
                    ></path>
                    <path
                      d="M804.4 805H663.9c-6.7 0-12.2-5.5-12.2-12.2v-281c0-6.7 5.5-12.2 12.2-12.2h140.4c6.7 0 12.2 5.5 12.2 12.2v281c0.1 6.7-5.4 12.2-12.1 12.2z"
                      fill="#ea9518"
                    ></path>
                  </svg>
                  {/* 第557-574行：分数数字显示区域 */}
                  <p 
                    ref={scoreElementRef}
                    className="grades-box-num" // 第558行：分数数字CSS类
                    style={{
                      fontSize: 'calc(var(--card-width, 20vh) * 0.12)', // 第560行：字体大小 = 卡片宽度的12%
                      fontFamily: 'AlibabaPuHuiTi-3-55-Regular', // 第561行：使用阿里巴巴普惠体字体
                      marginLeft: 'calc(var(--card-width, 20vh) * 0.17)', // 第562行：左边距 = 卡片宽度的17%
                      marginTop: 'calc(var(--card-width, 20vh) * 0.06)', // 第563行：上边距 = 卡片宽度的6%
                      textAlign: 'center', // 第564行：文字居中对齐
                      width: 'calc(var(--card-width, 20vh) * 0.6)', // 第565行：宽度 = 卡片宽度的60%
                      height: 'calc(var(--card-width, 20vh) * 0.16)', // 第566行：高度 = 卡片宽度的16%
                      display: 'flex', // 第567行：弹性布局
                      alignItems: 'center', // 第568行：垂直居中
                      justifyContent: 'center' // 第569行：水平居中
                    }}
                  >
                    {/* 第573行：初始为空，通过GSAP动画填充数字 */}
                  </p>
                </div> {/* 第575行：分数框结束 */}
              </div> {/* 第576行：detail-page结束 */}
            </div>
          )}
      </figure>
    </div>
  );
}

// 组件导出完成 - TiltedGoldCard金卡展开动画组件