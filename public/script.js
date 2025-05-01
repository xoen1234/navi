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

  // 创建 tab 标签
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

  // 创建对应 iframe
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.className = 'iframe-tab';
  iframe.dataset.tab = title;
  iframe.style.display = 'none';
  document.getElementById('main').appendChild(iframe);

  // 注册
  tabs[title] = { tab, url, path, iframe };
  switchTab(title);
}




function switchTab(title) {
  Object.keys(tabs).forEach(key => {
    tabs[key].tab.classList.remove('active');
    tabs[key].iframe.style.display = 'none';
  });

  const target = tabs[title];
  if (!target) return;

  target.tab.classList.add('active');
  target.iframe.style.display = 'block';
  updateBreadcrumb(target.path);
}



function removeTab(title, tabEl) {
  const tabData = tabs[title];
  if (tabData.iframe) {
    tabData.iframe.remove();
  }
  tabEl.remove();
  delete tabs[title];

  // 切换到最后一个标签
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
