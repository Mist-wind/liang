// 获取所有导航按钮和所有页面区块
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');
const scrollContainer = document.querySelector('.scroll-container');

// 背景图片数组 - 五个图片对应五个页面
const backgroundImages = [
    '首页.png',
    '更多.png',
    '黑果短剧.png',
    '桌面宠物.png',
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

// 默认项目数据
const defaultProjects = [
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
        ]
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
        ]
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
        ]
    }
];

let projectsData = [];
let currentProjectId = 1;
let editingProjectId = null;

// 从本地存储加载数据或使用默认数据
function loadProjects() {
    const saved = localStorage.getItem('projectsData');
    if (saved) {
        try {
            projectsData = JSON.parse(saved);
        } catch(e) {
            projectsData = JSON.parse(JSON.stringify(defaultProjects));
        }
    } else {
        projectsData = JSON.parse(JSON.stringify(defaultProjects));
    }
}

// 保存数据到本地存储
function saveProjects() {
    localStorage.setItem('projectsData', JSON.stringify(projectsData));
}

// 标签页切换功能
function setupProjectTabs() {
    renderTabs();
    
    document.getElementById('projectTabs').addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn')) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentProjectId = parseInt(e.target.dataset.project);
            updateProjectDetails(currentProjectId);
        }
    });
}

// 渲染标签页
function renderTabs() {
    const tabsContainer = document.getElementById('projectTabs');
    tabsContainer.innerHTML = '';
    
    projectsData.forEach(project => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `tab-btn ${project.id === currentProjectId ? 'active' : ''}`;
        tabBtn.dataset.project = project.id;
        tabBtn.textContent = project.name;
        
        if (progressContainer.classList.contains('edit-mode')) {
            const deleteIcon = document.createElement('span');
            deleteIcon.innerHTML = ' ×';
            deleteIcon.style.marginLeft = '5px';
            deleteIcon.style.color = '#ef4444';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`确定要删除项目"${project.name}"吗？`)) {
                    deleteProject(project.id);
                }
            };
            tabBtn.appendChild(deleteIcon);
        }
        
        tabsContainer.appendChild(tabBtn);
    });
}

// 更新项目详情
function updateProjectDetails(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    const nameEl = document.getElementById('detailProjectName');
    const descEl = document.getElementById('detailProjectDesc');
    const progressEl = document.getElementById('detailProjectProgress');
    const ownerEl = document.getElementById('detailProjectOwner');
    
    nameEl.textContent = project.name;
    descEl.textContent = project.desc;
    progressEl.textContent = project.progress + '%';
    ownerEl.textContent = project.owner;
    
    // 设置可编辑字段
    setupEditableField(nameEl, 'name', projectId);
    setupEditableField(descEl, 'desc', projectId);
    setupEditableField(progressEl, 'progress', projectId, true);
    setupEditableField(ownerEl, 'owner', projectId);
    
    updateTimeline(project.timeline);
}

// 设置可编辑字段
function setupEditableField(element, field, projectId, isNumber = false) {
    element.onclick = function() {
        if (!progressContainer.classList.contains('edit-mode')) return;
        
        const currentValue = element.textContent.replace('%', '');
        const input = document.createElement(isNumber ? 'input' : 'textarea');
        
        if (isNumber) {
            input.type = 'number';
            input.min = 0;
            input.max = 100;
        } else if (field === 'desc') {
            input.rows = 2;
        }
        
        input.className = 'inline-edit-input';
        input.value = currentValue;
        
        element.innerHTML = '';
        element.appendChild(input);
        input.focus();
        input.select();
        
        function saveEdit() {
            let newValue = isNumber ? parseInt(input.value) : input.value.trim();
            
            if (isNumber && (isNaN(newValue) || newValue < 0 || newValue > 100)) {
                newValue = projectsData.find(p => p.id === projectId)[field];
                alert('进度必须在0-100之间');
            } else if (!isNumber && !newValue) {
                newValue = projectsData.find(p => p.id === projectId)[field];
            }
            
            const project = projectsData.find(p => p.id === projectId);
            if (project) {
                project[field] = newValue;
                saveProjects();
                
                // 更新标签页名称
                if (field === 'name') {
                    renderTabs();
                    currentProjectId = projectId;
                }
            }
            
            updateProjectDetails(projectId);
        }
        
        input.onblur = saveEdit;
        input.onkeydown = function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
            }
            if (e.key === 'Escape') {
                updateProjectDetails(projectId);
            }
        };
    };
}

// 更新时间线
function updateTimeline(timeline) {
    const timelineContainer = document.querySelector('.timeline-items');
    timelineContainer.innerHTML = '';
    
    timeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${item.status}`;
        
        let html = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                <span class="timeline-date">${item.date}</span>
        `;
        
        // 编辑模式下显示状态切换按钮
        if (progressContainer.classList.contains('edit-mode')) {
            html += `<div style="margin-top:5px;">
                <select onchange="changeStageStatus(${projectId}, ${index}, this.value)" 
                    style="background:#333;color:#fff;border:1px solid #555;padding:3px;border-radius:4px;font-size:11px;width:100%;">
                    <option value="completed" ${item.status === 'completed' ? 'selected' : ''}>已完成</option>
                    <option value="active" ${item.status === 'active' ? 'selected' : ''}>进行中</option>
                    <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>未开始</option>
                </select>
            </div>`;
        }
        
        html += `</div></div>`;
        timelineItem.innerHTML = html;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// 切换阶段状态
window.changeStageStatus = function(projectId, stageIndex, newStatus) {
    const project = projectsData.find(p => p.id === projectId);
    if (project && project.timeline[stageIndex]) {
        project.timeline[stageIndex].status = newStatus;
        saveProjects();
        updateProjectDetails(projectId);
    }
};

// 删除项目
function deleteProject(id) {
    projectsData = projectsData.filter(p => p.id !== id);
    saveProjects();
    
    if (currentProjectId === id && projectsData.length > 0) {
        currentProjectId = projectsData[0].id;
    }
    
    renderTabs();
    updateProjectDetails(currentProjectId);
}

// 编辑模式切换
const editToggle = document.getElementById('editToggle');
const progressContainer = document.querySelector('.progress-container');

editToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    progressContainer.classList.toggle('edit-mode');
    this.textContent = this.classList.contains('active') ? '完成编辑' : '编辑模式';
    renderTabs();
    updateProjectDetails(currentProjectId);
});

// 模态框操作
const progressModal = document.getElementById('progressModal');
const closeModalBtn = document.getElementById('closeModal');
const saveProgressBtn = document.getElementById('saveProgress');
const projectNameInput = document.getElementById('projectName');
const projectDescInput = document.getElementById('projectDesc');
const projectProgressInput = document.getElementById('projectProgress');

function openModal(isEdit = false) {
    editingProjectId = isEdit ? currentProjectId : null;
    
    if (isEdit) {
        const project = projectsData.find(p => p.id === currentProjectId);
        document.getElementById('modalTitle').textContent = '编辑项目';
        projectNameInput.value = project.name;
        projectDescInput.value = project.desc;
        projectProgressInput.value = project.progress;
    } else {
        document.getElementById('modalTitle').textContent = '添加新项目';
        projectNameInput.value = '';
        projectDescInput.value = '';
        projectProgressInput.value = '0';
    }
    
    progressModal.classList.add('active');
}

function closeModal() {
    progressModal.classList.remove('active');
    editingProjectId = null;
}

// 保存项目
window.saveProgress = function() {
    const name = projectNameInput.value.trim();
    const desc = projectDescInput.value.trim();
    const progress = parseInt(projectProgressInput.value);
    
    if (!name || isNaN(progress) || progress < 0 || progress > 100) {
        alert('请填写完整的项目信息，进度必须在0-100之间');
        return;
    }
    
    if (editingProjectId) {
        // 编辑现有项目
        const project = projectsData.find(p => p.id === editingProjectId);
        if (project) {
            project.name = name;
            project.desc = desc;
            project.progress = progress;
        }
    } else {
        // 添加新项目
        const newId = projectsData.length > 0 ? Math.max(...projectsData.map(p => p.id)) + 1 : 1;
        projectsData.push({
            id: newId,
            name: name,
            desc: desc,
            progress: progress,
            owner: 'Liang',
            timeline: [
                { name: '规划阶段', desc: '项目需求分析', date: new Date().toISOString().split('T')[0], status: 'completed' },
                { name: '设计阶段', desc: 'UI/UX设计', date: '', status: 'pending' },
                { name: '开发阶段', desc: '功能开发', date: '', status: 'pending' },
                { name: '测试阶段', desc: '测试验证', date: '', status: 'pending' },
                { name: '上线阶段', desc: '部署上线', date: '', status: 'pending' }
            ]
        });
        currentProjectId = newId;
    }
    
    saveProjects();
    renderTabs();
    updateProjectDetails(currentProjectId);
    closeModal();
};

closeModalBtn.addEventListener('click', closeModal);

document.getElementById('addProgressBtn').addEventListener('click', () => openModal(false));

// 点击模态框外部关闭
progressModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// 初始化项目进度页面
function initProjectProgress() {
    loadProjects();
    setupProjectTabs();
    
    if (projectsData.length > 0) {
        currentProjectId = projectsData[0].id;
        updateProjectDetails(currentProjectId);
    }
}

// 在页面加载时初始化项目进度
window.addEventListener('load', initProjectProgress);
