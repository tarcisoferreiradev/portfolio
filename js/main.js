// js/main.js

/**
 * @description Controle de Fade-in global para evitar FOUC (Flash of Unstyled Content).
 */
window.addEventListener('load', () => {
    gsap.to(document.body, {
        duration: 0.8,
        opacity: 1,
        ease: 'power2.inOut'
    });
});

/**
 * @module Aurora Background
 * @description Renderização de metaballs interativas em WebGL/Canvas 2D, otimizado com requestAnimationFrame.
 */
const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');
let blobs = [];
const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Blob {
    constructor(color, x, y, radius) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let targetX = this.originX;
        let targetY = this.originY;

        if (dist < 250) {
            const force = (250 - dist) / 250;
            targetX += (dx / dist) * force * 25;
            targetY += (dy / dist) * force * 25;
        }

        this.x += (targetX - this.x) * 0.04;
        this.y += (targetY - this.y) * 0.04;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function initAurora() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    blobs = [
        new Blob('rgba(59, 130, 246, 0.5)', canvas.width * 0.2, canvas.height * 0.3, 250),
        new Blob('rgba(91, 33, 182, 0.5)', canvas.width * 0.8, canvas.height * 0.2, 300),
        new Blob('rgba(129, 28, 152, 0.4)', canvas.width * 0.7, canvas.height * 0.8, 280),
        new Blob('rgba(30, 64, 175, 0.4)', canvas.width * 0.3, canvas.height * 0.7, 220)
    ];
}

function animateAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach(blob => {
        blob.update();
        blob.draw();
    });
    requestAnimationFrame(animateAurora);
}

initAurora();
animateAurora();
window.addEventListener('resize', initAurora);

/**
 * @module Preloader Engine
 * @description Gestão de state de carregamento utilizando SessionStorage para otimização de UX em navegações subsequentes.
 */
const preloader = document.getElementById('preloader');
const preloaderTitle = document.getElementById('preloader-title');
const preloaderUnderline = document.getElementById('preloader-underline');

function setupPreloaderAnimation() {
    preloaderTitle.style.visibility = 'visible';
    const text = preloaderTitle.textContent;
    preloaderTitle.textContent = '';

    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        preloaderTitle.appendChild(span);
    });

    const tl = gsap.timeline();
    tl.fromTo(
        '.preloader-title span',
        {
            autoAlpha: 0,
            y: 40,
            rotationX: -90,
            filter: 'blur(8px)'
        },
        {
            duration: 1.2,
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            filter: 'blur(0px)',
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.2
        }
    );
    tl.to(
        preloaderUnderline,
        { duration: 0.8, scaleX: 1, ease: 'power2.out' },
        '-=0.6'
    );
    tl.to(preloader, {
        duration: 1,
        opacity: 0,
        ease: 'power2.inOut',
        delay: 0.5,
        onComplete: () => {
            preloader.style.display = 'none';
        }
    });
}

if (sessionStorage.getItem('preloaderShown') === 'true') {
    preloader.style.display = 'none';
} else {
    window.addEventListener('load', setupPreloaderAnimation);
    sessionStorage.setItem('preloaderShown', 'true');
}

/**
 * @description Implementação de IntersectionObserver API para lazy rendering e CSS Class Injection baseada em view threshold.
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/**
 * @constant {Array<Object>} categoryConfig
 * @description Dicionário de configuração para mapeamento de categorias, schemas de cor e injeção de tokens de design.
 */
const categoryConfig = [
    { id: 'health', title: 'Saúde e Bem-Estar', badgeClass: 'badge-health', glowClass: 'card-glow-health' },
    { id: 'webgraphics', title: 'Web Graphics', badgeClass: 'badge-webgraphics', glowClass: 'card-glow-webgraphics' },
    { id: 'ecommerce', title: 'E-commerce', badgeClass: 'badge-ecommerce', glowClass: 'card-glow-ecommerce' },
    { id: 'landingpage', title: 'Landing Pages', badgeClass: 'badge-landingpage', glowClass: 'card-glow-systems' },
    { id: 'special', title: 'Projetos Especiais', badgeClass: 'badge-special', glowClass: 'card-glow-special' },
    { id: 'systems', title: 'Sistemas Web', badgeClass: 'badge-systems', glowClass: 'card-glow-systems' },
    { id: 'infra', title: 'Infraestrutura', badgeClass: 'badge-infra', glowClass: 'card-glow-infra' },
    { id: 'mobile', title: 'Mobile Development', badgeClass: 'badge-mobile', glowClass: 'card-glow-mobile' },
    { id: 'games', title: 'Game Center', badgeClass: 'badge-games', glowClass: 'card-glow-games' }
];

/**
 * @constant {Array<Object>} allProjects
 * @description Repositório central de dados do portfólio. Estrutura imutável para iteração de renderização do Virtual DOM/UI.
 */
const allProjects = [
    {
        title: 'Alimentando Fases',
        category: 'health',
        badge: 'Saúde e Bem-Estar',
        featured: true,
        description: 'Ecossistema de saúde com rede social integrada: perfis, posts, comentários e chat privado para troca de experiências.',
        image: 'img/alimentandofasescapa.png',
        link: 'https://alimentandofases.com/'
    },
    {
        title: "AURUM '25",
        category: 'webgraphics',
        badge: 'Web Graphics',
        featured: true,
        description: 'Experiência imersiva em WebGL com estética Dark Luxury. Shaders customizados, física dinâmica e pós-processamento de alta fidelidade.',
        image: 'img/aurumcapa.png',
        link: 'https://tarxdev.github.io/Aurum/'
    },
    {
        title: 'Senses Landing Page',
        category: 'landingpage',
        badge: 'Landing Page',
        featured: true,
        description: 'Landing page para o Senses, uma plataforma inovadora que conecta pais, crianças e profissionais, criando uma comunidade de apoio e desenvolvimento.',
        image: 'img/senseslp.png',
        link: '#'
    },
    {
        title: 'Sistema de Hospedagem',
        category: 'systems',
        badge: 'Sistemas Web',
        featured: false,
        description: 'Modelo de classes em C# para um sistema de hotel, com lógica para cálculo de diárias.',
        image: 'https://placehold.co/600x400/000/fff?text=Hospedagem+.NET',
        link: 'https://github.com/tarxdev/sistema-hospedagem-csharp.git'
    },
    {
        title: 'Sistema de Estacionamento',
        category: 'systems',
        badge: 'Sistemas Web',
        featured: false,
        description: 'Sistema de console em C# para gerenciar a entrada, saída e cobrança de veículos.',
        image: 'https://placehold.co/600x400/000/fff?text=C%23+Console',
        link: 'https://github.com/tarxdev/sistema-estacionamento-csharp.git'
    },
    {
        title: 'Site com Docker e Apache',
        category: 'infra',
        badge: 'Infraestrutura',
        featured: true,
        description: 'Uso de Docker Compose para servir um site estático com um container do servidor Apache.',
        image: 'https://placehold.co/600x400/000/fff?text=Docker+Compose',
        link: 'https://github.com/tarxdev/desafio-docker-compose-apache.git'
    },
    {
        title: 'Veloce',
        category: 'health',
        type: 'mobile',
        badge: 'Saúde e Bem-Estar',
        featured: false,
        description: 'Aplicativo de caminhada e corrida para acompanhar suas atividades físicas.',
        image: 'img/veloce.jpeg',
        link: '#'
    },
    {
        title: 'Alimentando Fases',
        category: 'health',
        type: 'mobile',
        badge: 'Saúde e Bem-Estar',
        featured: false,
        description: 'Aplicativo do Alimentando Fases, o ecossistema de saúde e troca de experiências também disponível na versão web.',
        image: '', // Quando tiver o print, use: 'img/alimentandofases-app.jpeg'
        link: '#' // Substitua pelo link do aplicativo quando estiver disponível.
    },
    {
        title: 'Retro Arcade Game',
        category: 'games',
        badge: 'Game Center',
        featured: false,
        description: 'Jogo 2D clássico desenvolvido com HTML5 Canvas e JS puro.',
        image: 'https://placehold.co/600x400/1e293b/4079ff?text=Game',
        link: '#'
    },
    {
        title: 'Cartão de Natal Interativo',
        category: 'special',
        subCategory: 'natal',
        badge: 'Projetos Especiais',
        featured: false,
        description: 'Animação festiva com partículas de neve e mensagem personalizada.',
        image: 'https://placehold.co/600x400/1e293b/4079ff?text=Natal',
        link: '#'
    },
    {
        title: 'Convite de Aniversário Digital',
        category: 'special',
        subCategory: 'aniversario',
        badge: 'Projetos Especiais',
        featured: false,
        description: 'Sistema de RSVP digital com contagem regressiva.',
        image: 'https://placehold.co/600x400/1e293b/4079ff?text=Aniversario',
        link: '#'
    }
];

/**
 * @function createItemCardHTML
 * @param {Object} item - Objeto de domínio estruturado.
 * @param {boolean} [showBadge=false] - Flag de injeção condicional para Category Badge.
 * @returns {string} AST serializado em HTML string safe.
 * @description Factory Method puro para componentes de cards, garantindo early return de fallbacks para assets ausentes.
 */
function createItemCardHTML(item, showBadge = false) {
    const subtext = item.institution || item.description || 'Clique para ver mais';
    const isMobile = item.type === 'mobile' || item.category === 'mobile';
    const buttonText = item.institution
        ? 'Ver Certificado'
        : isMobile ? 'Ver aplicativo' : 'Ver site';

    let imageUrl = item.image;
    if (!imageUrl || imageUrl.trim() === '') {
        imageUrl = `https://placehold.co/600x400/1e293b/475569?text=${encodeURIComponent(item.title)}`;
    }

    // Lazy loading estrito inserido nativamente para LCP improvements.
    const imageHTML = isMobile && !item.image?.trim()
        ? '<div class="app-screenshot-placeholder"><span>Prévia em breve</span><small>Aplicativo em desenvolvimento</small></div>'
        : `<img src="${imageUrl}" alt="${isMobile ? 'Tela do aplicativo' : 'Imagem de'} ${item.title}" loading="lazy">`;

    let badgeHTML = '';
    let glowClass = 'card-glow-default';

    const catConfig = categoryConfig.find(c => c.id === item.category);
    if (catConfig) {
        glowClass = catConfig.glowClass;
        if (showBadge) {
            badgeHTML = `<span class="category-badge ${catConfig.badgeClass}" aria-label="Categoria: ${item.badge || catConfig.title}">${item.badge || catConfig.title}</span>`;
        }
    } else if (item.institution) {
        glowClass = 'card-glow-health';
    }

    return `
        <article class="${glowClass}${isMobile ? ' app-card' : ''}" role="article">
            <div class="card-image-container">
                ${imageHTML}
            </div>
            <div class="card-content">
                <div>
                    <h2>${item.title}</h2>
                    <p>${subtext}</p>
                </div>
                <div class="card-footer">
                    ${isMobile && (!item.link || item.link === '#')
                        ? '<span class="card-btn" aria-disabled="true">Em desenvolvimento</span>'
                        : `
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-btn" aria-label="Acessar ${item.title}">
                        ${buttonText}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </a>`}
                    ${badgeHTML}
                </div>
            </div>
        </article>
    `;
}

/**
 * @description Rotinas de injeção de HTML no Document Fragment principal. Tratamento de aninhamento DOM.
 */
function renderFeaturedProjects() {
    const container = document.getElementById('gallery-container-featured');
    if (!container) return;

    const featured = allProjects.filter(p => p.featured).slice(0, 3);

    if (featured.length < 3) {
        const others = allProjects
            .filter(p => !p.featured)
            .slice(0, 3 - featured.length);
        featured.push(...others);
    }

    container.innerHTML = featured
        .map(item => createItemCardHTML(item, true))
        .join('');
}

function renderFeaturedApps() {
    const container = document.getElementById('gallery-container-apps-featured');
    if (!container) return;

    const featured = allProjects
        .filter(item => item.type === 'mobile' || item.category === 'mobile')
        .slice(0, 3);

    container.innerHTML = featured
        .map(item => createItemCardHTML(item, true))
        .join('');
}

function renderFullPortfolio() {
    const mainContainer = document.getElementById('full-portfolio-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    categoryConfig.forEach(cat => {
        const projects = allProjects.filter(p => p.category === cat.id);
        if (cat.id !== 'special' && projects.length === 0) return;

        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'category-section';
        sectionDiv.id = `section-${cat.id}`;

        const title = document.createElement('h3');
        title.className = 'category-section-title';
        title.textContent = cat.title;
        sectionDiv.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'card-grid';

        if (projects.length > 0) {
            grid.innerHTML = projects
                .map(p => createItemCardHTML(p, true))
                .join('');
        } else {
            grid.innerHTML = `<p class="text-gray-500 col-span-full">Em breve novos projetos de ${cat.title}...</p>`;
        }

        sectionDiv.appendChild(grid);

        if (cat.id === 'special') {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'mt-8 text-center';
            btnContainer.innerHTML = `
                <button id="view-special-projects-btn" class="gradient-btn font-bold px-6 py-2 text-sm">
                    Acessar Projetos Especiais (Filtros)
                </button>
            `;
            sectionDiv.appendChild(btnContainer);
        }

        mainContainer.appendChild(sectionDiv);
    });

    const specialBtn = document.getElementById('view-special-projects-btn');
    if (specialBtn) {
        specialBtn.addEventListener('click', openSpecialProjectsView);
    }
}

/**
 * @function setupSearchFunctionality
 * @description Acoplamento de event listeners para filtragem de DOM nodes em tempo real com complexidade O(n).
 */
function setupSearchFunctionality() {
    const searchInput = document.getElementById('project-search-input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const sections = document.querySelectorAll('#full-portfolio-container .category-section');

            sections.forEach(section => {
                const projectCards = section.querySelectorAll('.card-grid article');
                let hasVisibleProjects = false;

                projectCards.forEach(card => {
                    const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
                    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
                    const badge = card.querySelector('.category-badge')?.textContent.toLowerCase() || '';

                    if (
                        title.includes(searchTerm) ||
                        desc.includes(searchTerm) ||
                        badge.includes(searchTerm)
                    ) {
                        card.classList.remove('hidden');
                        hasVisibleProjects = true;
                    } else {
                        card.classList.add('hidden');
                    }
                });

                if (hasVisibleProjects) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    }
}

/**
 * @module Projetos Especiais Sub-Routing
 * @description Handler de roteamento e filtragem de subset de dados para special context rendering.
 */
function renderSpecialProjects(subFilter = 'all') {
    const container = document.getElementById('gallery-container-special');
    if (!container) return;

    let specialProjects = allProjects.filter(p => p.category === 'special');

    if (subFilter !== 'all') {
        specialProjects = specialProjects.filter(p => p.subCategory === subFilter);
    }

    if (specialProjects.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">Nenhum projeto encontrado neste tema.</p>';
        return;
    }

    container.innerHTML = specialProjects
        .map(item => createItemCardHTML(item, true))
        .join('');
}

function openSpecialProjectsView() {
    const projectsView = document.getElementById('projects-view');
    const specialView = document.getElementById('special-projects-view');

    const specialFilters = document.querySelectorAll('#special-filters .filter-btn');
    specialFilters.forEach(b => b.classList.remove('active'));
    document.querySelector('#special-filters .filter-btn[data-subfilter="all"]').classList.add('active');

    renderSpecialProjects('all');

    projectsView.style.opacity = '0';
    setTimeout(() => {
        projectsView.classList.add('hidden');
        specialView.classList.remove('hidden');

        requestAnimationFrame(() => {
            specialView.style.opacity = '1';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }, 500);
}

/**
 * @description Menu Controller (Event Delegation) e state sync de categorias.
 */
function setupCategoryNavigation() {
    const menuList = document.getElementById('nav-menu-list');
    const menuContainer = document.getElementById('category-navigation-menu');
    const toggleBtn = document.getElementById('filter-toggle-btn');

    if (!menuList || !toggleBtn) return;

    menuList.innerHTML = categoryConfig.map(cat => `
        <button class="nav-menu-item" data-target="section-${cat.id}">
            ${cat.title}
        </button>
    `).join('');

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuContainer.classList.toggle('active');

        if (menuContainer.classList.contains('active')) {
            document.addEventListener('click', closeMenuOutside);
        }
    });

    function closeMenuOutside(e) {
        if (!menuContainer.contains(e.target) && !toggleBtn.contains(e.target)) {
            menuContainer.classList.remove('active');
            document.removeEventListener('click', closeMenuOutside);
        }
    }

    menuList.querySelectorAll('.nav-menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                menuContainer.classList.remove('active');
            }
        });
    });
}

/**
 * @module SPA Router Controller
 * @description Transição de views baseada em opacidade e display block (Vanilla JS Virtual Routing).
 */
function initSPA() {
    const homeView = document.getElementById('home-view');
    const projectsView = document.getElementById('projects-view');
    const specialView = document.getElementById('special-projects-view');

    const viewAllProjectsBtn = document.getElementById('view-all-projects-btn');
    const backBtn = document.getElementById('back-to-home-btn');
    const backToProjBtn = document.getElementById('back-to-projects-btn');
    const navBrand = document.getElementById('nav-brand');
    const navLinks = document.querySelectorAll('.nav-link-scroll');

    function switchView(hideView, showView) {
        hideView.style.opacity = '0';
        setTimeout(() => {
            hideView.classList.add('hidden');
            showView.classList.remove('hidden');

            // Força reflow sincronizado antes da pintura para garantir o tracking da animação
            void showView.offsetWidth;

            requestAnimationFrame(() => {
                showView.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }, 500);
    }

    if (viewAllProjectsBtn) {
        viewAllProjectsBtn.addEventListener('click', () => {
            renderFullPortfolio();
            setupCategoryNavigation();
            setupSearchFunctionality();
            switchView(homeView, projectsView);
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchView(projectsView, homeView);
        });
    }

    if (backToProjBtn) {
        backToProjBtn.addEventListener('click', () => {
            switchView(specialView, projectsView);
        });
    }

    if (navBrand) {
        navBrand.addEventListener('click', (e) => {
            e.preventDefault();

            projectsView.classList.add('hidden');
            projectsView.style.opacity = '0';

            specialView.classList.add('hidden');
            specialView.style.opacity = '0';

            homeView.classList.remove('hidden');
            requestAnimationFrame(() => {
                homeView.style.opacity = '1';
            });
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (
                !projectsView.classList.contains('hidden') ||
                !specialView.classList.contains('hidden')
            ) {
                projectsView.classList.add('hidden');
                projectsView.style.opacity = '0';

                specialView.classList.add('hidden');
                specialView.style.opacity = '0';

                homeView.classList.remove('hidden');

                setTimeout(() => {
                    homeView.style.opacity = '1';
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 600);
            }
        });
    });

    const specialFilters = document.querySelectorAll('#special-filters .filter-btn');
    specialFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            specialFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSpecialProjects(btn.getAttribute('data-subfilter'));
        });
    });
}

/**
 * @description Mobile Menu Bootstrap e orquestração GSAP para transições fluidas da camada de navegação.
 */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-btn');
    const menuNav = document.getElementById('main-nav');
    const overlay = document.getElementById('menu-overlay');

    function toggleMenu() {
        const active = hamburger.classList.contains('is-active');

        if (active) {
            gsap.to('.mobile-nav-link', {
                opacity: 0,
                x: 30,
                stagger: 0.05
            });
            gsap.to(menuNav, {
                x: '100%',
                duration: 0.4,
                delay: 0.1
            });
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    menuNav.classList.add('translate-x-full');
                    hamburger.classList.remove('is-active');
                    document.body.classList.remove('menu-open');
                    overlay.classList.add('pointer-events-none');
                }
            });
        } else {
            document.body.classList.add('menu-open');
            hamburger.classList.add('is-active');
            menuNav.classList.remove('translate-x-full');
            overlay.classList.remove('pointer-events-none');

            gsap.to(overlay, { opacity: 1 });
            gsap.fromTo(
                menuNav,
                { x: '100%' },
                { x: '0%', duration: 0.4 }
            );
            gsap.to('.mobile-nav-link', {
                opacity: 1,
                x: 0,
                delay: 0.2,
                stagger: 0.08
            });
        }
    }

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Chamadas para montagem inicial da árvore DOM (Component Mounting)
    renderFeaturedProjects();
    renderFeaturedApps();
    initSPA();
});

/**
 * @description Acoplamento de monitoramento via Event Listener no Object Window para alteração de classe do Header baseada em threshold no Eixo Y (Scroll).
 */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    function handleHeaderScroll() {
        if (window.scrollY > 30) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();
});