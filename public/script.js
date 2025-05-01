// 加载菜单
fetch('menu.json')
  .then(res => res.json())
  .then(data => buildMenu(data));

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
      if(item.default)openTab(item.name, item.url, currentPath, item.keepAlive);
    }

    parentElement.appendChild(li);
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
  tab.textContent = title;

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeTab(id);
  });

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




