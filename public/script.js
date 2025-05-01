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
let tabs = {};
function openTab(title, url, path = [title]) {
  if (tabs[title]) {
    switchTab(title);
    return;
  }

  const tab = document.createElement('div');
  tab.className = 'tab active';
  tab.textContent = title;

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeTab(title, tab);
  });

  tab.appendChild(closeBtn);
  tab.addEventListener('click', () => switchTab(title));

  tabsContainer.appendChild(tab);
  tabs[title] = { tab, url, path };
  switchTab(title);
}

function switchTab(title) {
  Object.keys(tabs).forEach(key => {
    tabs[key].tab.classList.remove('active');
  });

  const target = tabs[title];
  if (target) {
    target.tab.classList.add('active');
    iframe.src = target.url;
    updateBreadcrumb(target.path);
  }
}

function removeTab(title, tabElement) {
  const wasActive = tabElement.classList.contains('active');
  tabElement.remove();
  delete tabs[title];

  if (wasActive) {
    const keys = Object.keys(tabs);
    if (keys.length > 0) {
      switchTab(keys[keys.length - 1]);
    } else {
      iframe.src = '';
      updateBreadcrumb('首页');
    }
  }
}

// 面包屑
function updateBreadcrumb(title) {
  document.getElementById('breadcrumb').textContent = title;
}
