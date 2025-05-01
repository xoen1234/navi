const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.json'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`导航页面运行在 http://localhost:${PORT}`);
});
