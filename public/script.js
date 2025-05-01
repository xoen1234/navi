async function loadMenu() {
  const response = await fetch('/menu');
  const menu = await response.json();

  const sidebar = document.getElementById('sidebar');
  const breadcrumb = document.getElementById('breadcrumb');
  const iframe = document.getElementById('content-frame');

  menu.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.textContent = group.name;
    groupDiv.className = 'menu-group';

    const subList = document.createElement('div');
    subList.className = 'submenu hidden';

    group.children.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.textContent = item.name;
      itemDiv.className = 'submenu-item';
      itemDiv.addEventListener('click', () => {
        iframe.src = item.url;
        breadcrumb.textContent = `${group.name} > ${item.name}`;
      });
      subList.appendChild(itemDiv);
    });

    groupDiv.addEventListener('click', () => {
      subList.classList.toggle('hidden');
      groupDiv.classList.toggle('expanded');
    });

    sidebar.appendChild(groupDiv);
    sidebar.appendChild(subList);
  });
}

// 主题切换
document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.getElementById('sidebar').classList.toggle('dark');
  document.getElementById('breadcrumb').classList.toggle('dark');
});

// 鼠标移到最左边自动展开侧边栏
const sidebar = document.getElementById('sidebar');
const hoverZone = document.getElementById('edge-hover-zone');

hoverZone.addEventListener('mouseenter', () => {
  sidebar.classList.remove('collapsed');
});

sidebar.addEventListener('mouseleave', () => {
  sidebar.classList.add('collapsed');
});

loadMenu();
