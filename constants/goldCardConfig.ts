/* ===== 金卡外部尺寸 ===== */
export const CARD_HEIGHT = 30; // cqh
export const CARD_WIDTH  = 13; // cqw
export const CARD_BOTTOM_OFFSET = 2; // 底边距容器底边（cqh，上下留白）

/* ===== 金卡内部格局 ===== */
export const AVATAR_SIZE = 25;   // 头像直径（cqw）
export const NAME_FONT   = 2;  // 名字字号（cqw）
export const VALUE_FONT  = 2.2;  // 数字字号（cqw）
export const INNER_GAP   = 2;  // 楼间距（cqw）

/* ===== 垂直偏移 ===== */
export const AVATAR_TOP_GAP = 0; // 头像到卡片顶边（cqh）
export const NAME_TOP_GAP   = 19; // 名字到卡片顶边（cqh）
export const VALUE_TOP_GAP  = 25; // 数字到卡片顶边（cqh）

/* ===== 银/铜比例 ===== */
export const SCALE_SILVER = 0.85;
export const SCALE_BRONZE = 0.75;

/* ===== 银/铜左右位置 ===== */
export const SILVER_POSITION = 'left';  // 银卡在左
export const BRONZE_POSITION = 'right'; // 铜卡在右

/* ===== 银/铜与金卡水平间隔 ===== */
export const CARD_HORIZONTAL_GAP = 15; // cqw

// 新增 cqmin 的计算逻辑
export function getCQMin(size: number): string {
  return `min(${size}cqw, ${size}cqh)`;
}