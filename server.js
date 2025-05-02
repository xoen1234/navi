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

  fs.writeFile(filePath, JSON.stringify(menuData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('保存 menu.json 失败:', err);
      return res.status(500).send('保存失败');
    }
    console.log('menu.json 保存成功');
    res.sendStatus(200);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`导航页面运行在 http://localhost:${PORT}`);
});
