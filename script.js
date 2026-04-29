// 数据结构
const projects = [
    { img: '建筑学姐-AI生图平台.png', title: '建筑学姐', subtitle: 'AI 生图平台', desc: '专为建筑设计打造的 AI 绘图平台。一键将线稿转化为逼真效果图，释放你的设计灵感，提升工作效率。' },
    { img: '桌面宠物-AI电子宠物.png', title: '桌面宠物', subtitle: 'AI 电子宠物', desc: '不仅是桌面挂件，更是懂你的 AI 伴侣。具备情感交互能力，陪伴你工作学习的每一个枯燥瞬间。' },
    { img: '黑果短剧-短剧平台.png', title: '黑果短剧', subtitle: '泛娱乐内容社区', desc: '海量热门短剧一网打尽。沉浸式的全屏观影体验，碎片化时间也能享受跌宕起伏的精彩剧情。' },
    { img: '首页个人介绍.png', title: '个人主页', subtitle: '数字名片', desc: '极简而充满科技感的个人展示空间。全方位呈现你的作品、履历与才华，打造专属的数字品牌。' },
    { img: '敬请期待.png', title: '敬请期待', subtitle: 'COMING SOON', desc: '更多充满想象力的创新产品正在实验室中孵化。保持关注，我们将持续为你带来惊喜。' }
];

let currentIndex = 0;
let isAnimating = false; // 锁回来了，保证动画稳定

// DOM 节点获取
const bgLayer = document.getElementById('bg-layer');
const mainTitle = document.getElementById('main-title');
const subTitle = document.getElementById('sub-title');
const mainDesc = document.getElementById('main-desc');
const cardsWrapper = document.getElementById('cards-wrapper');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// 初始化
function init() {
    updateMainContent(currentIndex);
    renderCards();
}

// 按钮事件绑定
nextBtn.onclick = () => {
    // 点击“下一张”等同于点击最前面的卡片
    const topCard = document.querySelector('.card.top-card');
    if (topCard) topCard.click();
};

prevBtn.onclick = () => {
    // 点击“上一张”触发倒放动画
    playReverseAnimation();
};

function updateMainContent(index) {
    const item = projects[index];
    bgLayer.style.backgroundImage = `url('${item.img}')`;
    mainTitle.innerText = item.title;
    subTitle.innerText = item.subtitle;
    mainDesc.innerText = item.desc;
}

function renderCards() {
    cardsWrapper.innerHTML = '';
    const visibleCount = Math.min(4, projects.length - 1); 

    for (let i = 1; i <= visibleCount; i++) {
        let index = (currentIndex + i) % projects.length;
        let item = projects[index];

        let card = document.createElement('div');
        card.className = 'card';
        
        // 确保从左向右堆叠
        const xOffset = (i - 1) * 70; 
        const scale = 1 - (i - 1) * 0.08; 
        const opacity = 1 - (i - 1) * 0.2; 
        const zIndex = 100 - i; 

        gsap.set(card, {
            x: xOffset,
            scale: scale,
            opacity: opacity,
            zIndex: zIndex
        });

        if (i === 1) {
            card.classList.add('top-card');
            card.onclick = () => triggerTransition(card, index);
        }

        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.subtitle}</p>
            </div>
        `;
        cardsWrapper.appendChild(card);
    }
}

// 👉 正向动画：卡片放大变成全屏
function triggerTransition(cardElement, nextIndex) {
    if (isAnimating) return;
    isAnimating = true;

    const cardImg = cardElement.querySelector('img');
    const rect = cardImg.getBoundingClientRect();

    const cloneImg = document.createElement('img');
    cloneImg.src = projects[nextIndex].img;
    cloneImg.className = 'fullscreen-clone';
    cloneImg.style.top = rect.top + 'px';
    cloneImg.style.left = rect.left + 'px';
    cloneImg.style.width = rect.width + 'px';
    cloneImg.style.height = rect.height + 'px';
    cloneImg.style.borderRadius = '20px';
    document.body.appendChild(cloneImg);

    cardElement.style.opacity = 0;

    const tl = gsap.timeline({
        onComplete: () => {
            currentIndex = nextIndex;
            updateMainContent(currentIndex); 
            renderCards();                   
            gsap.set([subTitle, mainTitle, mainDesc, '.explore-btn'], { x: 0, y: 0, opacity: 1 });

            // 防闪烁淡出
            gsap.to(cloneImg, {
                opacity: 0,
                duration: 0.4, 
                ease: "power2.out",
                onComplete: () => {
                    cloneImg.remove(); 
                    isAnimating = false; 
                }
            });
        }
    });

    // A. 放大
    tl.to(cloneImg, {
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        borderRadius: 0,
        duration: 1.2,
        ease: 'power4.inOut'
    }, 0);

    // B. 文字消失
    tl.to([subTitle, mainTitle, mainDesc, '.explore-btn'], {
        x: -50, 
        opacity: 0,
        duration: 0.4,
        stagger: 0.05, 
        ease: 'power2.in'
    }, 0);

    // C. 卡片向左推进
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, i) => {
        if (i !== 0) { 
            const targetI = i; 
            const targetX = (targetI - 1) * 70;
            const targetScale = 1 - (targetI - 1) * 0.08;
            const targetOpacity = 1 - (targetI - 1) * 0.2;

            tl.to(card, {
                x: targetX, scale: targetScale, opacity: targetOpacity,
                duration: 1.2, ease: 'power4.inOut'
            }, 0);
        }
    });

    // D. 新文字滑入
    tl.call(() => {
        mainTitle.innerText = projects[nextIndex].title;
        subTitle.innerText = projects[nextIndex].subtitle;
        mainDesc.innerText = projects[nextIndex].desc;
        
        gsap.set([subTitle, mainTitle, mainDesc, '.explore-btn'], { y: 40, x: 0, opacity: 0 });
        gsap.to([subTitle, mainTitle, mainDesc, '.explore-btn'], {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out'
        });
    }, null, 0.6); 
}

// 👉 倒放动画：全屏缩小变成卡片
function playReverseAnimation() {
    if (isAnimating) return;
    isAnimating = true;

    // 计算上一张的索引
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;

    // 1. 克隆当前全屏背景，准备缩小
    const cloneImg = document.createElement('img');
    cloneImg.src = projects[currentIndex].img;
    cloneImg.className = 'fullscreen-clone';
    cloneImg.style.top = '0px';
    cloneImg.style.left = '0px';
    cloneImg.style.width = '100vw';
    cloneImg.style.height = '100vh';
    cloneImg.style.borderRadius = '0px';
    document.body.appendChild(cloneImg);

    // 2. 瞬间把底层换成前一张的信息（被克隆图盖住，看不见闪烁）
    updateMainContent(prevIndex);
    currentIndex = prevIndex;
    renderCards(); 

    // 获取新排版中第一张卡片的位置（这是缩小的终点坐标）
    const topCard = document.querySelector('.card.top-card');
    const targetRect = topCard.querySelector('img').getBoundingClientRect();
    topCard.style.opacity = 0; // 隐藏真身，留个空位给克隆体降落

    const tl = gsap.timeline({
        onComplete: () => {
            topCard.style.opacity = 1;
            cloneImg.remove();
            isAnimating = false;
        }
    });

    // A. 背景缩小跌入卡片堆
    tl.to(cloneImg, {
        top: targetRect.top + 'px',
        left: targetRect.left + 'px',
        width: targetRect.width + 'px',
        height: targetRect.height + 'px',
        borderRadius: '20px',
        duration: 1.2,
        ease: 'power4.inOut'
    }, 0);

    // B. 左侧文字切换
    gsap.set([subTitle, mainTitle, mainDesc, '.explore-btn'], { x: 50, opacity: 0 });
    tl.to([subTitle, mainTitle, mainDesc, '.explore-btn'], {
        x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out'
    }, 0.4);

    // C. 卡片洗牌效果：所有卡片向后退让出位置
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, i) => {
        if (i !== 0) {
            // 假设它们是从左前方的虚无中冒出来的
            const startX = (i - 2) * 70; 
            const startScale = 1 - (i - 2) * 0.08;
            const startOpacity = 1 - (i - 2) * 0.2;

            const targetX = (i - 1) * 70;
            const targetScale = 1 - (i - 1) * 0.08;
            const targetOpacity = 1 - (i - 1) * 0.2;

            gsap.fromTo(card, {
                x: startX, scale: startScale, opacity: startOpacity
            }, {
                x: targetX, scale: targetScale, opacity: targetOpacity,
                duration: 1.2, ease: 'power4.inOut'
            }, 0);
        }
    });
}

// 启动应用
init();