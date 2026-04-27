// 获取所有导航按钮和所有页面区块
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');
const scrollContainer = document.querySelector('.scroll-container');

// 监听容器的滚动事件
scrollContainer.addEventListener('scroll', () => {
    let currentSection = '';

    // 判断当前滚动到了哪个区域
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // 如果页面滚动超过了区块的顶部一定距离
        if (scrollContainer.scrollTop >= sectionTop - 60) {
            currentSection = section.getAttribute('id');
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
