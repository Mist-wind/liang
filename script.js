// 获取所有导航按钮和所有页面区块
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');
const scrollContainer = document.querySelector('.scroll-container');

// 背景图片数组 - 五个图片对应五个页面
const backgroundImages = [
    '首页.png',
    '黑果短剧.png',
    '桌面宠物.png',
    '更多.png',
    '更多.png'
];

// 创建背景图层 - 实现连续滚动效果
function createBackgroundLayer() {
    const backgroundLayer = document.createElement('div');
    backgroundLayer.className = 'background-layer';
    backgroundLayer.style.zIndex = '-1';
    
    // 创建一个容器来容纳所有背景图片
    const backgroundContainer = document.createElement('div');
    backgroundContainer.style.position = 'absolute';
    backgroundContainer.style.top = '0';
    backgroundContainer.style.left = '0';
    backgroundContainer.style.width = '100%';
    backgroundContainer.style.height = `${backgroundImages.length * 100}vh`;
    backgroundContainer.style.transition = 'transform 0.1s ease-out';
    backgroundContainer.style.zIndex = '-2';
    
    // 创建每个背景图片
    backgroundImages.forEach((image, index) => {
        const bgImage = document.createElement('div');
        bgImage.style.position = 'absolute';
        bgImage.style.top = `${index * 100}vh`;
        bgImage.style.left = '0';
        bgImage.style.width = '100%';
        bgImage.style.height = '100vh';
        bgImage.style.backgroundImage = `url(${image})`;
        bgImage.style.backgroundSize = 'cover';
        bgImage.style.backgroundPosition = 'center';
        backgroundContainer.appendChild(bgImage);
    });
    
    const overlay = document.createElement('div');
    overlay.className = 'background-overlay';
    
    backgroundLayer.appendChild(backgroundContainer);
    backgroundLayer.appendChild(overlay);
    document.body.insertBefore(backgroundLayer, document.body.firstChild);
    
    return backgroundContainer;
}

const backgroundContainer = createBackgroundLayer();
let currentImageIndex = 0;

// 添加装饰元素
function addDecorativeElements() {
    sections.forEach(section => {
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('div');
            element.className = 'decorative-element';
            section.appendChild(element);
        }
    });
}

addDecorativeElements();

// 监听容器的滚动事件
scrollContainer.addEventListener('scroll', () => {
    let currentSection = '';
    let scrollPosition = scrollContainer.scrollTop;
    let windowHeight = window.innerHeight;

    // 实时更新背景容器的位置，实现连续滚动效果
    backgroundContainer.style.transform = `translateY(-${scrollPosition}px)`;

    // 判断当前滚动到了哪个区域
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        
        // 如果页面滚动到了新的区块
        if (scrollContainer.scrollTop >= sectionTop - 50 && scrollContainer.scrollTop < sectionTop + section.offsetHeight - 50) {
            if (currentSection !== section.getAttribute('id')) {
                currentSection = section.getAttribute('id');
                currentImageIndex = index;
            }
            
            // 激活当前区域的元素动画
            const contentBox = section.querySelector('.content-box');
            const appCard = section.querySelector('.app-card');
            const progressContainer = section.querySelector('.progress-container');
            
            if (contentBox) {
                contentBox.classList.add('visible');
            }
            if (appCard) {
                appCard.classList.add('visible');
            }
            if (progressContainer) {
                progressContainer.classList.add('visible');
            }
        }
    });

    // 移除所有按钮的高亮，给当前区域对应的按钮加上高亮
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === currentSection) {
            btn.classList.add('active');
        }
    });
});

// 点击顶部导航按钮时，平滑滚动到对应区域
navBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止默认跳转
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 初始化页面
function init() {
    // 触发一次滚动事件，激活初始状态
    const event = new Event('scroll');
    scrollContainer.dispatchEvent(event);
    
    // 为导航按钮添加悬停效果
    navBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // 为按钮添加点击波纹效果
    const buttons = document.querySelectorAll('.download-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 添加波纹效果样式
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 0;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
window.addEventListener('load', init);

// ======== 项目进度管理功能 ========

// 获取进度相关元素
const progressContainer = document.querySelector('.progress-container');
const editToggleBtn = document.getElementById('editToggle');
const progressList = document.getElementById('progressList');
const addProgressBtn = document.getElementById('addProgressBtn');
const progressModal = document.getElementById('progressModal');
const modalTitle = document.getElementById('modalTitle');
const projectNameInput = document.getElementById('projectName');
const projectDescInput = document.getElementById('projectDesc');
const projectProgressInput = document.getElementById('projectProgress');

let isEditMode = false;
let currentEditId = null;
let projects = [];

// 从本地存储加载项目数据
function loadProjects() {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        renderProjects();
    }
}

// 保存项目数据到本地存储
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// 渲染项目列表
function renderProjects() {
    progressList.innerHTML = '';
    
    projects.forEach(project => {
        const projectItem = createProjectItem(project);
        progressList.appendChild(projectItem);
    });
}

// 创建项目元素
function createProjectItem(project) {
    const item = document.createElement('div');
    item.className = 'progress-item';
    item.setAttribute('data-id', project.id);
    
    item.innerHTML = `
        <div class="progress-info">
            <h3 class="project-name">${project.name}</h3>
            <p class="project-desc">${project.desc}</p>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${project.progress}%">
                <span class="progress-text">${project.progress}%</span>
            </div>
        </div>
        <div class="progress-actions">
            <button class="progress-edit-btn" onclick="editProgress(${project.id})">编辑</button>
            <button class="progress-delete-btn" onclick="deleteProgress(${project.id})">删除</button>
        </div>
    `;
    
    return item;
}

// 切换编辑模式
editToggleBtn.addEventListener('click', function() {
    isEditMode = !isEditMode;
    this.classList.toggle('active');
    progressContainer.classList.toggle('edit-mode');
    this.textContent = isEditMode ? '完成编辑' : '编辑模式';
});

// 添加新项目
addProgressBtn.addEventListener('click', function() {
    currentEditId = null;
    modalTitle.textContent = '添加新项目';
    projectNameInput.value = '';
    projectDescInput.value = '';
    projectProgressInput.value = '';
    progressModal.classList.add('active');
});

// 编辑项目
function editProgress(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        currentEditId = id;
        modalTitle.textContent = '编辑项目';
        projectNameInput.value = project.name;
        projectDescInput.value = project.desc;
        projectProgressInput.value = project.progress;
        progressModal.classList.add('active');
    }
}

// 删除项目
function deleteProgress(id) {
    if (confirm('确定要删除这个项目吗？')) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        renderProjects();
    }
}

// 关闭模态框
function closeModal() {
    progressModal.classList.remove('active');
    currentEditId = null;
}

// 保存项目
function saveProgress() {
    const name = projectNameInput.value.trim();
    const desc = projectDescInput.value.trim();
    const progress = parseInt(projectProgressInput.value);
    
    if (!name || isNaN(progress) || progress < 0 || progress > 100) {
        alert('请填写完整的项目信息，进度必须在0-100之间');
        return;
    }
    
    if (currentEditId) {
        // 编辑现有项目
        const projectIndex = projects.findIndex(p => p.id === currentEditId);
        if (projectIndex !== -1) {
            projects[projectIndex].name = name;
            projects[projectIndex].desc = desc;
            projects[projectIndex].progress = progress;
        }
    } else {
        // 添加新项目
        const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
        projects.push({
            id: newId,
            name: name,
            desc: desc,
            progress: progress
        });
    }
    
    saveProjects();
    renderProjects();
    closeModal();
}

// 点击模态框外部关闭
progressModal.addEventListener('click', function(e) {
    if (e.target === progressModal) {
        closeModal();
    }
});

// 初始化项目数据
function initProjects() {
    loadProjects();
    
    // 如果没有保存的项目，使用默认数据
    if (projects.length === 0) {
        projects = [
            {
                id: 1,
                name: '黑果短剧',
                desc: '私有化短剧平台',
                progress: 85
            },
            {
                id: 2,
                name: 'AI桌面宠物',
                desc: '智能陪伴应用',
                progress: 45
            },
            {
                id: 3,
                name: '新项目',
                desc: '待定项目',
                progress: 20
            }
        ];
        saveProjects();
        renderProjects();
    }
}

// 在页面加载时初始化项目
window.addEventListener('load', initProjects);
