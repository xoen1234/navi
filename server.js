const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// 支持 JSON 请求体
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.json'));
});
// 保存菜单 JSON 文件
app.post('/api/save-menu', (req, res) => {
  const menuData = req.body;
  const filePath = path.join(__dirname, 'public', 'menu.json');
  let jsonStr
  try {
    jsonStr = JSON.stringify(menuData, null, 2);
  } catch (err) {
    console.error('JSON 格式校验失败:', err.message);
    return res.status(400).send('JSON 格式错误');
  }
  fs.writeFile(filePath, jsonStr, 'utf8', (err) => {
    if (err) {
      console.error('保存 menu.json 失败:', err);
      return res.status(500).send('保存失败');
    }
    console.log('时间:'+new Date().toISOString()+'______IP:'+req.ip+',_____menu.json 保存成功');
    res.sendStatus(200);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`导航页面运行在 http://localhost:${PORT}`);
});
