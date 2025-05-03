// 加载菜单
fetch('menu.json')
  .then(res => res.json())
  .then(data => buildMenu(data));
let defaulted = false
function buildMenu(menuData, parentElement = document.getElementById('menu'), path = []) {
  menuData.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;

    const currentPath = [...path, item.name];

    if (item.children && item.children.length > 0) {
      const subUl = document.createElement('ul');
      buildMenu(item.children, subUl, currentPath);
      li.appendChild(subUl);

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.toggle('open');
      });
    } else if (item.url) {
      
      li.addEventListener('click', () => {
        openTab(item.name, item.url, currentPath, item.keepAlive);
      });
      if(item.default&&!defaulted)openTab(item.name, item.url, currentPath, item.keepAlive);
    }

    parentElement.appendChild(li);
  });
  defaulted = true
}
  // 刷新侧边栏
function refreshSidebar() {
  // 清空当前菜单内容
  const menuContainer = document.getElementById('menu');
  menuContainer.innerHTML = '';

  // 重新加载并构建菜单
  fetch('menu.json')
    .then(res => res.json())
    .then(data => buildMenu(data))
    .catch(err => {
      console.error('加载菜单失败:', err);
      alert('菜单加载失败，请稍后再试。');
    });
}

// 主题切换
document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// 标签页功能
const tabsContainer = document.getElementById('tabs');
const iframe = document.getElementById('content-frame');
let tabIdCounter = 0;
function generateTabId() {
  return `tab-${++tabIdCounter}`;
}
let tabs = {};

function openTab(title, url, path = [title]) {
  const id = generateTabId();

  // 创建 tab 标签
  const tab = document.createElement('div');
  tab.className = 'tab active';
  tab.dataset.id = id; // 设置唯一 ID
  // 创建标签标题
  const tabTitle = document.createElement('span');
  tabTitle.textContent = title;

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeTab(id);
  });

  const backBtn = document.createElement('span');
  backBtn.className = 'back-btn';
  backBtn.textContent = '⟳';
  backBtn.style.marginRight = '8px';
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // refreshIframe(id);
    iframe.src = url  + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
  });

  tab.appendChild(backBtn);
  tab.appendChild(tabTitle);
  tab.appendChild(closeBtn);

  tab.addEventListener('click', () => switchTab(id));

  tabsContainer.appendChild(tab);

  // 创建对应 iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.className = 'iframe-tab';
  iframe.dataset.id = id;
  iframe.style.display = 'none';
  document.getElementById('main').appendChild(iframe);

  // 注册
  tabs[id] = { id, title, path, tab, iframe };
  switchTab(id);
}


function switchTab(id) {
  Object.values(tabs).forEach(({ tab, iframe }) => {
    tab.classList.remove('active');
    iframe.style.display = 'none';
  });

  const target = tabs[id];
  if (!target) return;

  target.tab.classList.add('active');
  target.iframe.style.display = 'block';
  updateBreadcrumb(target.path);
}


function removeTab(id) {
  const tabData = tabs[id];
  if (!tabData) return;

  tabData.iframe.remove();
  tabData.tab.remove();
  delete tabs[id];

  const keys = Object.keys(tabs);
  if (keys.length > 0) {
    switchTab(keys[keys.length - 1]);
  } else {
    updateBreadcrumb('');
  }
}


// 面包屑
function updateBreadcrumb(title) {
  document.getElementById('breadcrumb').textContent = title;
}


let hoverExpandEnabled = false;

// 悬停开关按钮
document.getElementById("hover-toggle").addEventListener("click", () => {
  hoverExpandEnabled = !hoverExpandEnabled;
  document.getElementById("hover-toggle").textContent = hoverExpandEnabled ? "🖱️ 悬停开" : "🖱️ 悬停关";
});

// 鼠标悬停控制展开
const sidebar = document.getElementById("sidebar");

sidebar.addEventListener("mouseenter", () => {
  if (hoverExpandEnabled) sidebar.classList.remove("collapsed");
});

sidebar.addEventListener("mouseleave", () => {
  if (hoverExpandEnabled) sidebar.classList.add("collapsed");
});

// 手动展开按钮
document.getElementById("manual-toggle").addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  const isCollapsed = sidebar.classList.contains("collapsed");
  document.getElementById("manual-toggle").textContent = isCollapsed ? "📌 展开" : "📌 收起";
});


// 设置按钮行为
const settingsBtn = document.getElementById('settings-btn');
const editMenuBtn = document.getElementById('edit-menu-btn');
const menuEditorModal = document.getElementById('menu-editor-modal');
const saveMenuBtn = document.getElementById('save-menu');
const closeMenuBtn = document.getElementById('close-menu');

const menuEditor = document.getElementById("menuEditor");

settingsBtn.addEventListener("click", () => {
  fetch("menu.json")
    .then(res => res.json())
    .then(data => {
      const formatted = JSON.stringify(data, null, 2);
      menuEditor.textContent = formatted;
      menuEditorModal.classList.remove("hidden");
    });
});

saveMenuBtn.addEventListener('click', async () => {
  try {
    const content = menuEditor.textContent;
    const newMenu = JSON.parse(content);

    const res = await fetch('/api/save-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMenu)
    });

    if (res.ok) {
      alert('菜单已保存到服务器');
      menuEditorModal.classList.add('hidden');
            // 保存后刷新菜单
            refreshSidebar();
    } else {
      alert('保存失败，请检查服务器日志');
    }
  } catch (err) {
    alert('JSON 格式错误，请检查后重试。');
  }
});

// 点击关闭按钮
closeMenuBtn.addEventListener('click', () => {
  menuEditorModal.classList.add('hidden');
});




