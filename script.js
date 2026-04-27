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

// 项目数据
const projectsData = [
    {
        id: 1,
        name: '黑果短剧',
        desc: '私有化短剧平台',
        progress: 85,
        owner: 'Liang',
        timeline: [
            { name: '规划阶段', desc: '项目需求分析、技术选型', date: '2026-03-01', status: 'completed' },
            { name: '设计阶段', desc: 'UI设计、交互设计', date: '2026-03-15', status: 'completed' },
            { name: '开发阶段', desc: '核心功能开发、API集成', date: '2026-04-01', status: 'active' },
            { name: '测试阶段', desc: '功能测试、性能测试', date: '2026-04-30', status: 'pending' },
            { name: '上线阶段', desc: '部署、发布、监控', date: '2026-05-15', status: 'pending' }
        ],
        tasks: [
            { name: '完成用户登录功能', status: 'completed' },
            { name: '实现视频播放器', status: 'completed' },
            { name: '开发推荐算法', status: 'active' },
            { name: '优化加载速度', status: 'pending' }
        ],
        stats: { total: 12, completed: 8, active: 4, pending: 2 }
    },
    {
        id: 2,
        name: 'AI桌面宠物',
        desc: '智能陪伴应用',
        progress: 45,
        owner: 'Liang',
        timeline: [
            { name: '规划阶段', desc: '项目需求分析、技术选型', date: '2026-03-10', status: 'completed' },
            { name: '设计阶段', desc: 'UI设计、交互设计', date: '2026-03-25', status: 'completed' },
            { name: '开发阶段', desc: '核心功能开发、API集成', date: '2026-04-05', status: 'active' },
            { name: '测试阶段', desc: '功能测试、性能测试', date: '2026-05-10', status: 'pending' },
            { name: '上线阶段', desc: '部署、发布、监控', date: '2026-05-25', status: 'pending' }
        ],
        tasks: [
            { name: '完成宠物形象设计', status: 'completed' },
            { name: '实现基础交互功能', status: 'completed' },
            { name: '开发语音识别', status: 'active' },
            { name: '优化AI对话能力', status: 'pending' }
        ],
        stats: { total: 8, completed: 3, active: 2, pending: 3 }
    },
    {
        id: 3,
        name: '新项目',
        desc: '待定项目',
        progress: 20,
        owner: 'Liang',
        timeline: [
            { name: '规划阶段', desc: '项目需求分析、技术选型', date: '2026-04-01', status: 'completed' },
            { name: '设计阶段', desc: 'UI设计、交互设计', date: '2026-04-15', status: 'active' },
            { name: '开发阶段', desc: '核心功能开发、API集成', date: '2026-05-01', status: 'pending' },
            { name: '测试阶段', desc: '功能测试、性能测试', date: '2026-05-15', status: 'pending' },
            { name: '上线阶段', desc: '部署、发布、监控', date: '2026-05-30', status: 'pending' }
        ],
        tasks: [
            { name: '完成需求文档', status: 'completed' },
            { name: '技术选型', status: 'completed' },
            { name: '原型设计', status: 'active' },
            { name: '架构设计', status: 'pending' }
        ],
        stats: { total: 6, completed: 2, active: 1, pending: 3 }
    }
];

// 标签页切换功能
function setupProjectTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签页的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            // 添加当前标签页的active类
            this.classList.add('active');
            
            const projectId = parseInt(this.dataset.project);
            updateProjectDetails(projectId);
        });
    });
}

// 更新项目详情
function updateProjectDetails(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    // 更新项目基本信息
    document.getElementById('detailProjectName').textContent = project.name;
    document.getElementById('detailProjectDesc').textContent = project.desc;
    document.getElementById('detailProjectProgress').textContent = project.progress + '%';
    document.getElementById('detailProjectOwner').textContent = project.owner;
    
    // 更新时间线
    updateTimeline(project.timeline);
    
    // 更新任务列表
    updateTasks(project.tasks);
    
    // 更新进度摘要
    updateProgressSummary(project.stats);
}

// 更新时间线
function updateTimeline(timeline) {
    const timelineContainer = document.querySelector('.timeline-items');
    timelineContainer.innerHTML = '';
    
    timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${item.status}`;
        
        timelineItem.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="timeline-date">${item.date}</span>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// 更新任务列表
function updateTasks(tasks) {
    const tasksContainer = document.querySelector('.tasks-list');
    tasksContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.status}`;
        
        taskItem.innerHTML = `
            <input type="checkbox" ${task.status === 'completed' ? 'checked' : ''}>
            <span>${task.name}</span>
        `;
        
        tasksContainer.appendChild(taskItem);
    });
}

// 更新进度摘要
function updateProgressSummary(stats) {
    const summaryItems = document.querySelectorAll('.summary-item');
    const labels = ['总任务', '已完成', '进行中', '未开始'];
    const values = [stats.total, stats.completed, stats.active, stats.pending];
    
    summaryItems.forEach((item, index) => {
        item.querySelector('.summary-number').textContent = values[index];
        item.querySelector('.summary-label').textContent = labels[index];
    });
}

// 编辑模式切换
const editToggle = document.getElementById('editToggle');
const progressContainer = document.querySelector('.progress-container');

editToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    progressContainer.classList.toggle('edit-mode');
    this.textContent = this.classList.contains('active') ? '完成编辑' : '编辑模式';
});

// 模态框操作
const progressModal = document.getElementById('progressModal');
const closeModalBtn = document.getElementById('closeModal');
const saveProgressBtn = document.getElementById('saveProgress');
const projectNameInput = document.getElementById('projectName');
const projectDescInput = document.getElementById('projectDesc');
const projectProgressInput = document.getElementById('projectProgress');

function openModal() {
    progressModal.classList.add('active');
}

function closeModal() {
    progressModal.classList.remove('active');
    projectNameInput.value = '';
    projectDescInput.value = '';
    projectProgressInput.value = '0';
}

closeModalBtn.addEventListener('click', closeModal);
document.getElementById('addProgressBtn').addEventListener('click', openModal);

// 点击模态框外部关闭
progressModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// 初始化项目进度页面
function initProjectProgress() {
    setupProjectTabs();
    // 默认显示第一个项目
    updateProjectDetails(1);
}

// 在页面加载时初始化项目进度
window.addEventListener('load', initProjectProgress);
