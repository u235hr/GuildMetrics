const fs = require('fs');
const path = require('path');

const avatars = [
  {
    name: 'champion',
    url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    filename: 'champion.png'
  },
  {
    name: 'runner',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    filename: 'runner.png'
  },
  {
    name: 'third',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    filename: 'third.png'
  }
];

async function downloadAvatar(url, filename) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const filePath = path.join(__dirname, '../public/avatars', filename);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    console.log( 下载完成: );
  } catch (error) {
    console.error( 下载失败: , error.message);
  }
}

async function downloadAll() {
  console.log(' 开始下载美女头像...');
  
  for (const avatar of avatars) {
    await downloadAvatar(avatar.url, avatar.filename);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(' 所有头像下载完成！');
}

downloadAll();
