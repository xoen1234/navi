const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

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

// 这个函数为一个端口创建一个小 Express 服务器
function startProxyServer(listenPort, target) {
  const app = express();
  // 1. 静态文件服务：先挂 public 目录
  app.use(express.static(path.join(__dirname, 'webShell')));
  // 所有路径都代理到 target
  app.use('/', createProxyMiddleware({
    target,
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
      // 这里可以改请求头，让 Jenkins 误认为来自“同源”
      proxyReq.setHeader('Host',       new URL(target).host);
      proxyReq.setHeader('Origin',     target);
      proxyReq.setHeader('Referer',    target + req.url);
    },
    // onProxyRes(proxyRes, req, res) {
    //   // 去掉 Jenkins 默认的防嵌入头
    //   delete proxyRes.headers['x-frame-options'];
    //   delete proxyRes.headers['content-security-policy'];

    //   // （可选）如果你仍有跨域 AJAX 请求，也可以加上 CORS 头
    //   proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    //   proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS';
    //   proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
    // },
    onError(err, req, res) {
      console.error(`Proxy 错误 ${listenPort} → ${target}:`, err);
      res.status(502).send('Bad Gateway');
    }
  }));
  app.listen(listenPort, () => {
    console.log(`Proxy 启动：端口 ${listenPort} → ${target}`);
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`导航页面运行在 http://localhost:${PORT}`);
});
startProxyServer(3001, 'null');
  // 所有路径都代理到 target

// 配置数组，按需增加
startProxyServer(80, 'http://192.168.31.3:80');
startProxyServer(40214, 'http://192.168.31.6:40214');
startProxyServer(3002, 'http://192.168.31.2:3002');
startProxyServer(8089, 'http://192.168.31.125:8089');
