// 主播姓名隐私保护映射表
// 将真实姓名替换为虚拟示例名称

const nameMapping = {
  // 原始真实姓名 -> 虚拟示例名称
  '宝儿': 'StreamerA',
  '雪儿': 'StreamerB', 
  '安妮': 'StreamerC',
  '鱼儿': 'StreamerD',
  '丽娜': 'StreamerE',
  '六六': 'StreamerF',
  '菟菟': 'StreamerG',
  '小妮子': 'StreamerH',
  '紫琳': 'StreamerI',
  '英英': 'StreamerJ',
  '闻雨': 'StreamerK',
  '小蛮': 'StreamerL',
  '梦妮': 'StreamerM',
  '可儿': 'StreamerN',
  '心缘': 'StreamerO',
  '若兮': 'StreamerP',
  '小太阳': 'StreamerQ',
  '小燕子': 'StreamerR',
  '妙涵': 'StreamerS',
  '幸福': 'StreamerT',
  '瑶玥': 'StreamerU',
  '糖小糖': 'StreamerV',
  '雪菲': 'StreamerW',
  '依依': 'StreamerX',
  '卿卿': 'StreamerY',
  '心彤': 'StreamerZ',
  '思思': 'StreamerAA',
  '辣包子': 'StreamerBB',
  '丽丽': 'StreamerCC',
  '豆奶': 'StreamerDD',
  '欣欣': 'StreamerEE',
  '宛儿': 'StreamerFF',
  '拾柒': 'StreamerGG',
  '天天': 'StreamerHH'
};

// 批量替换函数
function replaceNamesInText(text) {
  let result = text;
  for (const [realName, fakeName] of Object.entries(nameMapping)) {
    const regex = new RegExp(realName, 'g');
    result = result.replace(regex, fakeName);
  }
  return result;
}

// 批量替换JSON对象中的姓名
function replaceNamesInObject(obj) {
  const jsonStr = JSON.stringify(obj, null, 2);
  const replacedStr = replaceNamesInText(jsonStr);
  return JSON.parse(replacedStr);
}

module.exports = {
  nameMapping,
  replaceNamesInText,
  replaceNamesInObject
};