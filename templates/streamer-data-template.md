# 主播数据导入模板

## 数据格式说明

### 方式一：表格格式

| 主播姓名 | 礼物值 | 等级 | 头像URL | 备注 |
|---------|--------|------|---------|------|
| 小雨 | 15000 | S | https://example.com/avatar1.jpg | 当月表现优秀 |
| 晓晓 | 12500 | A | https://example.com/avatar2.jpg | 稳定增长 |
| 梦梦 | 11800 | A | https://example.com/avatar3.jpg | 新人主播 |
| 小花 | 10200 | B | https://example.com/avatar4.jpg | |
| 阳阳 | 9800 | B | https://example.com/avatar5.jpg | |
| 星星 | 8500 | C | https://example.com/avatar6.jpg | |
| 月月 | 7200 | C | https://example.com/avatar7.jpg | |

### 方式二：JSON格式

```json
[
  {
    "name": "小雨",
    "giftValue": 15000,
    "level": "S",
    "avatar": "https://example.com/avatar1.jpg",
    "note": "当月表现优秀"
  },
  {
    "name": "晓晓",
    "giftValue": 12500,
    "level": "A",
    "avatar": "https://example.com/avatar2.jpg",
    "note": "稳定增长"
  },
  {
    "name": "梦梦",
    "giftValue": 11800,
    "level": "A",
    "avatar": "https://example.com/avatar3.jpg",
    "note": "新人主播"
  }
]
```

## 字段说明

### 必填字段
- **主播姓名** (name): 主播的显示名称
- **礼物值** (giftValue): 数字格式，表示该主播当月收到的礼物总价值
- **等级** (level): 可选值：S、A、B、C、D

### 可选字段
- **头像URL** (avatar): 主播头像图片链接，留空将使用默认头像
- **备注** (note): 对该主播的备注信息

## 使用方法

1. **CSV格式**: 复制CSV模板，填入数据后保存为 `.csv` 文件
2. **Excel格式**: 在Excel中创建表格，按照字段顺序填入数据
3. **Markdown格式**: 直接编辑此文件的表格部分
4. **JSON格式**: 复制JSON模板，按格式添加数据

## 注意事项

- 保存CSV文件时请使用UTF-8编码
- 礼物值必须为正整数
- 等级字段区分大小写
- 头像URL需要是有效的图片链接
- 导入前请确保数据格式正确

## 示例数据说明

上述示例数据展示了7位主播的信息：
- 小雨：S级主播，礼物值最高(15000)
- 晓晓、梦梦：A级主播，表现优秀
- 小花、阳阳：B级主播，表现良好
- 星星、月月：C级主播，有待提升

数据将按礼物值自动排序，前三名将在"月度之星"区域特别展示。