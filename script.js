// 获取所有导航按钮和所有页面区块
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');
const scrollContainer = document.querySelector('.scroll-container');

// 背景图片数组 - 四个图片对应四个页面
const backgroundImages = [
    '首页.png',
    '黑果短剧.png',
    '桌面宠物.png',
    '更多.png'
];

// ======== 粒子文字效果 ========
class ParticleText {
    constructor(canvas, text) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.text = text;
        this.particles = [];
        this.isAnimating = false;
        this.isVisible = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 初始隐藏
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        if (this.isVisible) {
            this.createParticles();
            this.draw();
        }
    }
    
    createParticles() {
        this.particles = [];
        
        // 创建临时canvas获取文字像素
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        const fontSize = Math.min(this.canvas.width * 0.35, 180);
        
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        
        tempCtx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        tempCtx.fillStyle = '#fff';
        tempCtx.textAlign = 'left';
        tempCtx.textBaseline = 'top';
        tempCtx.fillText(this.text, 30, this.canvas.height * 0.3);
        
        // 获取像素数据
        const imageData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // 采样间隔（根据屏幕大小调整）
        const gap = Math.max(3, Math.floor(fontSize / 20));
        
        for (let y = 0; y < this.canvas.height; y += gap) {
            for (let x = 0; x < this.canvas.width; x += gap) {
                const index = (y * this.canvas.width + x) * 4;
                if (data[index + 3] > 128) {
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        targetX: x,
                        targetY: y,
                        size: Math.max(1.5, gap * 0.5),
                        vx: 0,
                        vy: 0,
                        opacity: 0
                    });
                }
            }
        }
    }
    
    show() {
        if (this.isVisible) return;
        this.isVisible = true;
        this.createParticles();
        this.animate();
    }
    
    hide() {
        if (!this.isVisible) return;
        this.isVisible = false;
        
        // 粒子散开动画
        const animateOut = () => {
            let allHidden = true;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(p => {
                if (p.opacity > 0.01) {
                    allHidden = false;
                    
                    // 向随机方向散开
                    p.vx += (Math.random() - 0.5) * 2;
                    p.vy += (Math.random() - 0.5) * 2 - 1;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.opacity *= 0.95;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                    this.ctx.fill();
                }
            });
            
            if (!allHidden) {
                requestAnimationFrame(animateOut);
            } else {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };
        
        animateOut();
    }
    
    animate() {
        if (!this.isVisible) return;
        
        let allArrived = true;
        const ease = 0.08; // 缓动系数，先快后慢
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            
            // 使用缓动公式实现先快后慢
            p.vx += dx * ease;
            p.vy += dy * ease;
            p.vx *= 0.85; // 阻尼
            p.vy *= 0.85;
            p.x += p.vx;
            p.y += p.vy;
            
            // 检查是否到达目标位置
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                allArrived = false;
            }
            
            // 渐显
            if (p.opacity < 1) {
                p.opacity = Math.min(1, p.opacity + 0.05);
            }
            
            // 绘制粒子（金色）
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
            this.ctx.fill();
        });
        
        if (!allArrived || this.particles.some(p => p.opacity < 1)) {
            requestAnimationFrame(() => this.animate());
        } else {
            // 动画完成后持续绘制静态粒子
            this.drawStatic();
        }
    }
    
    drawStatic() {
        if (!this.isVisible) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.targetX, p.targetY, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#d4af37';
            this.ctx.fill();
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.targetX, p.targetY, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#d4af37';
            this.ctx.fill();
        });
    }
}

// 初始化粒子文字
const particleCanvas = document.getElementById('particleCanvas');
const particleTitle = document.getElementById('particleTitle');
const particleText = new ParticleText(particleCanvas, particleTitle.textContent);

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
let lastSectionIndex = 0;

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

    // 实时更新背景容器的位置，实现连续滚动效果（带缓动）
    backgroundContainer.style.transform = `translateY(-${scrollPosition}px)`;

    // 判断当前滚动到了哪个区域
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        
        // 如果页面滚动到了新的区块
        if (scrollContainer.scrollTop >= sectionTop - 50 && scrollContainer.scrollTop < sectionTop + section.offsetHeight - 50) {
            if (currentSection !== section.getAttribute('id')) {
                currentSection = section.getAttribute('id');
                currentImageIndex = index;
                
                // 处理粒子动画：离开首页时隐藏，进入首页时显示
                if (lastSectionIndex === 0 && index !== 0) {
                    // 离开首页
                    particleText.hide();
                } else if (lastSectionIndex !== 0 && index === 0) {
                    // 进入首页
                    particleText.show();
                }
                
                lastSectionIndex = index;
            }
            
            // 激活当前区域的元素动画
            const contentBox = section.querySelector('.content-box');
            const appCard = section.querySelector('.app-card');
            const progressContainer = section.querySelector('.progress-container');
            
            if (contentBox && index !== 0) {
                contentBox.classList.add('visible');
            }
            if (appCard) {
                appCard.classList.add('visible');
            }
            if (progressContainer) {
                progressContainer.classList.add('visible');
            }
            
            // 首页特殊处理：显示粒子文字
            if (index === 0 && contentBox) {
                contentBox.classList.add('visible');
            }
        } else if (scrollContainer.scrollTop < sectionTop - 50 || scrollContainer.scrollTop >= sectionTop + section.offsetHeight - 50) {
            // 离开该区域时移除可见状态（除了首页的粒子）
            if (index === 0) {
                const contentBox = section.querySelector('.content-box');
                if (contentBox) {
                    contentBox.classList.remove('visible');
                }
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

// ======== 平滑滚动系统（先快后慢）=====
class SmoothScroll {
    constructor(container) {
        this.container = container;
        this.targetScroll = 0;
        this.currentScroll = 0;
        this.isScrolling = false;
        this.ease = 0.075; // 缓动系数
        
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        // 监听滚轮事件
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // 计算目标位置
            const delta = e.deltaY;
            this.targetScroll += delta;
            
            // 限制范围
            const maxScroll = this.container.scrollHeight - this.container.clientHeight;
            this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
            
            this.isScrolling = true;
        }, { passive: false });
        
        // 触摸支持
        let touchStartY = 0;
        this.container.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;
            
            this.targetScroll += deltaY * 1.5;
            
            const maxScroll = this.container.scrollHeight - this.container.clientHeight;
            this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
            
            this.isScrolling = true;
        }, { passive: false });
    }
    
    animate() {
        // 使用缓动公式实现先快后慢
        const diff = this.targetScroll - this.currentScroll;
        
        if (Math.abs(diff) > 0.5) {
            this.currentScroll += diff * this.ease;
            this.container.scrollTop = this.currentScroll;
        } else {
            this.currentScroll = this.targetScroll;
            this.container.scrollTop = this.currentScroll;
            this.isScrolling = false;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    scrollTo(position) {
        this.targetScroll = position;
        this.isScrolling = true;
    }
}

// 初始化平滑滚动
const smoothScroll = new SmoothScroll(scrollContainer);

// 点击导航按钮时，平滑滚动到对应区域
navBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault(); // 阻止默认跳转
        const targetId = this.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        // 使用自定义平滑滚动
        smoothScroll.scrollTo(targetSection.offsetTop);
    });
});

// 初始化页面
function init() {
    // 延迟显示首页粒子动画
    setTimeout(() => {
        particleText.show();
        const contentBox = document.querySelector('#section1 .content-box');
        if (contentBox) {
            contentBox.classList.add('visible');
        }
    }, 500);
    
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
