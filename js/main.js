// ==================================================
// 1. FADE-IN DA PÁGINA
// ==================================================

window.addEventListener('load', () => {
    gsap.to(document.body, {
        duration: 0.8,
        opacity: 1,
        ease: 'power2.inOut'
    });
});

// ==================================================
// 2. FUNDO ANIMADO
// ==================================================

const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');

let blobs = [];

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

window.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
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
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = this.originX;
        let targetY = this.originY;

        if (distance > 0 && distance < 250) {
            const force = (250 - distance) / 250;

            targetX += (dx / distance) * force * 25;
            targetY += (dy / distance) * force * 25;
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
        new Blob(
            'rgba(59, 130, 246, 0.5)',
            canvas.width * 0.2,
            canvas.height * 0.3,
            250
        ),
        new Blob(
            'rgba(91, 33, 182, 0.5)',
            canvas.width * 0.8,
            canvas.height * 0.2,
            300
        ),
        new Blob(
            'rgba(129, 28, 152, 0.4)',
            canvas.width * 0.7,
            canvas.height * 0.8,
            280
        ),
        new Blob(
            'rgba(30, 64, 175, 0.4)',
            canvas.width * 0.3,
            canvas.height * 0.7,
            220
        )
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

// ==================================================
// 3. PRELOADER
// ==================================================

const preloader = document.getElementById('preloader');
const preloaderTitle = document.getElementById('preloader-title');
const preloaderUnderline = document.getElementById('preloader-underline');

function setupPreloaderAnimation() {
    preloaderTitle.style.visibility = 'visible';

    const text = preloaderTitle.textContent;
    preloaderTitle.textContent = '';

    text.split('').forEach(character => {
        const span = document.createElement('span');

        span.innerHTML = character === ' ' ? '&nbsp;' : character;
        preloaderTitle.appendChild(span);
    });

    const timeline = gsap.timeline();

    timeline.fromTo(
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

    timeline.to(
        preloaderUnderline,
        {
            duration: 0.8,
            scaleX: 1,
            ease: 'power2.out'
        },
        '-=0.6'
    );

    timeline.to(preloader, {
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

// ==================================================
// 4. ANIMAÇÕES AO ROLAR
// ==================================================

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
});

// ==================================================
// 5. CATEGORIAS
// ==================================================

const categoryConfig = [
    {
        id: 'health',
        title: 'Saúde e Bem-Estar',
        badgeClass: 'badge-health',
        glowClass: 'card-glow-health'
    },
    {
        id: 'webgraphics',
        title: 'Web Graphics',
        badgeClass: 'badge-webgraphics',
        glowClass: 'card-glow-webgraphics'
    },
    {
        id: 'ecommerce',
        title: 'E-commerce',
        badgeClass: 'badge-ecommerce',
        glowClass: 'card-glow-ecommerce'
    },
    {
        id: 'landingpage',
        title: 'Landing Pages',
        badgeClass: 'badge-landingpage',
        glowClass: 'card-glow-systems'
    },
    {
        id: 'special',
        title: 'Projetos Especiais',
        badgeClass: 'badge-special',
        glowClass: 'card-glow-special'
    },
    {
        id: 'systems',
        title: 'Sistemas Web',
        badgeClass: 'badge-systems',
        glowClass: 'card-glow-systems'
    },
    {
        id: 'infra',
        title: 'Infraestrutura',
        badgeClass: 'badge-infra',
        glowClass: 'card-glow-infra'
    },
    {
        id: 'mobile',
        title: 'Mobile Development',
        badgeClass: 'badge-mobile',
        glowClass: 'card-glow-mobile'
    },
    {
        id: 'games',
        title: 'Game Center',
        badgeClass: 'badge-games',
        glowClass: 'card-glow-games'
    }
];

// ==================================================
// 6. PROJETOS E APLICATIVOS
// ==================================================

const allProjects = [
    {
        title: 'Alimentando Fases',
        category: 'health',
        badge: 'Saúde e Bem-Estar',
        featured: true,
        description:
            'Ecossistema de saúde com rede social integrada: perfis, posts, comentários e chat privado para troca de experiências.',
        image: 'img/alimentandofasescapa.png',
        link: 'https://alimentandofases.com/'
    },
    {
        title: "AURUM '25",
        category: 'webgraphics',
        badge: 'Web Graphics',
        featured: true,
        description:
            'Experiência imersiva em WebGL com estética Dark Luxury. Shaders customizados, física dinâmica e pós-processamento de alta fidelidade.',
        image: 'img/aurumcapa.png',
        link: 'https://tarxdev.github.io/Aurum/'
    },
    {
        title: 'Senses Landing Page',
        category: 'landingpage',
        badge: 'Landing Page',
        featured: true,
        description:
            'Landing page para o Senses, uma plataforma inovadora que conecta pais, crianças e profissionais, criando uma comunidade de apoio e desenvolvimento.',
        image: 'img/senseslp.png',
        link: '#'
    },
    {
        title: 'Sistema de Hospedagem',
        category: 'systems',
        badge: 'Sistemas Web',
        featured: false,
        description:
            'Modelo de classes em C# para um sistema de hotel, com lógica para cálculo de diárias.',
        image: 'https://placehold.co/600x400/000/fff?text=Hospedagem+.NET',
        link: 'https://github.com/tarxdev/sistema-hospedagem-csharp.git'
    },
    {
        title: 'Sistema de Estacionamento',
        category: 'systems',
        badge: 'Sistemas Web',
        featured: false,
        description:
            'Sistema de console em C# para gerenciar a entrada, saída e cobrança de veículos.',
        image: 'https://placehold.co/600x400/000/fff?text=C%23+Console',
        link: 'https://github.com/tarxdev/sistema-estacionamento-csharp.git'
    },
    {
        title: 'Site com Docker e Apache',
        category: 'infra',
        badge: 'Infraestrutura',
        featured: true,
        description:
            'Uso de Docker Compose para servir um site estático com um container do servidor Apache.',
        image: 'https://placehold.co/600x400/000/fff?text=Docker+Compose',
        link: 'https://github.com/tarxdev/desafio-docker-compose-apache.git'
    },
    {
        title: 'Veloce',
        category: 'health',
        type: 'mobile',
        badge: 'Saúde e Bem-Estar',
        featured: false,
        description:
            'Aplicativo de caminhada e corrida para acompanhar suas atividades físicas.',
        image: 'img/veloce.jpeg',
        link: '#'
    },
    {
        title: 'Alimentando Fases',
        category: 'health',
        type: 'mobile',
        badge: 'Saúde e Bem-Estar',
        featured: false,
        description:
            'Aplicativo do Alimentando Fases, o ecossistema de saúde e troca de experiências também disponível na versão web.',
        // Quando tiver o print, use: 'img/alimentandofases-app.jpeg'
        image: '',
        link: '#'
    },
    {
        title: 'Retro Arcade Game',
        category: 'games',
        badge: 'Game Center',
        featured: false,
        description:
            'Jogo 2D clássico desenvolvido com HTML5 Canvas e JS puro.',
        image: 'https://placehold.co/600x400/1e293b/4079ff?text=Game',
        link: '#'
    },
    {
        title: 'Cartão de Natal Interativo',
        category: 'special',
        subCategory: 'natal',
        badge: 'Projetos Especiais',
        featured: false,
        description:
            'Animação festiva com partículas de neve e mensagem personalizada.',
        image: 'https://placehold.co/600x400/1e293b/4079ff?text=Natal',
        link: '#'
    },
    {
        title: 'Convite de Aniversário Digital',
        category: 'special',
        subCategory: 'aniversario',
        badge: 'Projetos Especiais',
        featured: false,
        description:
            'Sistema de RSVP digital com contagem regressiva.',
        image: 'https://placehold.co/600x400/1e293b/4079ff?text=Aniversario',
        link: '#'
    }
];

// ==================================================
// 7. CRIAÇÃO DOS CARDS
// ==================================================

function createItemCardHTML(item, showBadge = false) {
    const subtext =
        item.institution ||
        item.description ||
        'Clique para ver mais';

    const isMobile =
        item.type === 'mobile' ||
        item.category === 'mobile';

    const appId = item.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const imageUrl = item.image?.trim();

    const imageHTML = imageUrl
        ? `
            <img
                src="${imageUrl}"
                alt="${isMobile ? 'Tela do aplicativo' : 'Imagem de'} ${item.title}"
                loading="lazy"
            >
        `
        : isMobile
            ? `
                <div class="app-screenshot-placeholder">
                    <svg
                        width="42"
                        height="42"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        aria-hidden="true"
                    >
                        <rect
                            x="6"
                            y="2"
                            width="12"
                            height="20"
                            rx="3"
                        />
                        <path d="M10 5h4M11 18h2"/>
                    </svg>

                    <span>${item.title}</span>
                    <small>Prévia em breve</small>
                </div>
            `
            : `
                <img
                    src="https://placehold.co/600x400/1e293b/475569?text=${encodeURIComponent(item.title)}"
                    alt="Imagem de ${item.title}"
                    loading="lazy"
                >
            `;

    const catConfig = categoryConfig.find(
        category => category.id === item.category
    );

    let glowClass =
        catConfig?.glowClass || 'card-glow-default';

    if (!catConfig && item.institution) {
        glowClass = 'card-glow-health';
    }

    // Aplicativos não exibem a etiqueta de categoria.
    const badgeHTML = !isMobile && showBadge && catConfig
        ? `
            <span
                class="category-badge ${catConfig.badgeClass}"
                aria-label="Categoria: ${item.badge || catConfig.title}"
            >
                ${item.badge || catConfig.title}
            </span>
        `
        : '';

    const actionHTML = isMobile
        ? `
            <a
                href="aplicativo.html?app=${encodeURIComponent(appId)}"
                class="app-details-btn"
                aria-label="Ver detalhes do aplicativo ${item.title}"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <rect
                        x="6"
                        y="2"
                        width="12"
                        height="20"
                        rx="3"
                    />
                    <path d="M10 5h4M11 18h2"/>
                </svg>

                <span>Ver Aplicativo</span>

                <svg
                    class="app-details-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
            </a>
        `
        : `
            <a
                href="${item.link || '#'}"
                target="_blank"
                rel="noopener noreferrer"
                class="card-btn"
                aria-label="Acessar ${item.title}"
            >
                ${item.institution ? 'Ver Certificado' : 'Ver site'}

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                </svg>
            </a>
        `;

    return `
        <article
            class="${glowClass}${isMobile ? ' app-card' : ''}"
            role="article"
        >
            <div class="card-image-container">
                ${imageHTML}
            </div>

            <div class="card-content">
                <div>
                    <h2>${item.title}</h2>
                    <p>${subtext}</p>
                </div>

                <div class="card-footer">
                    ${actionHTML}
                    ${badgeHTML}
                </div>
            </div>
        </article>
    `;
}

// ==================================================
// 8. PROJETOS EM DESTAQUE
// ==================================================

function renderFeaturedProjects() {
    const container = document.getElementById(
        'gallery-container-featured'
    );

    if (!container) return;

    const featured = allProjects
        .filter(project => project.featured)
        .slice(0, 3);

    if (featured.length < 3) {
        const others = allProjects
            .filter(project => !project.featured)
            .slice(0, 3 - featured.length);

        featured.push(...others);
    }

    container.innerHTML = featured
        .map(item => createItemCardHTML(item, true))
        .join('');
}

// ==================================================
// 9. APLICATIVOS EM DESTAQUE
// ==================================================

function renderFeaturedApps() {
    const container = document.getElementById(
        'gallery-container-apps-featured'
    );

    if (!container) return;

    const featured = allProjects
        .filter(item => {
            return item.type === 'mobile' ||
                item.category === 'mobile';
        })
        .slice(0, 3);

    container.innerHTML = featured
        .map(item => createItemCardHTML(item, true))
        .join('');
}

// ==================================================
// 10. GALERIA COMPLETA — SITES E APLICATIVOS
// ==================================================

function renderFullPortfolio() {
    const mainContainer = document.getElementById(
        'full-portfolio-container'
    );

    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div
            class="portfolio-type-filters"
            role="group"
            aria-label="Filtrar por tipo de projeto"
        >
            <button
                type="button"
                class="portfolio-type-btn active"
                data-portfolio-type="site"
                aria-pressed="true"
            >
                Sites
            </button>

            <button
                type="button"
                class="portfolio-type-btn"
                data-portfolio-type="app"
                aria-pressed="false"
            >
                Aplicativos
            </button>
        </div>

        <p
            id="portfolio-empty-message"
            class="portfolio-empty-message hidden"
            role="status"
        >
            Nenhum projeto encontrado para esse filtro.
        </p>
    `;

    categoryConfig.forEach(category => {
        const projects = allProjects.filter(
            project => project.category === category.id
        );

        if (projects.length === 0) return;

        const section = document.createElement('div');
        section.className = 'category-section';
        section.id = `section-${category.id}`;

        const title = document.createElement('h3');
        title.className = 'category-section-title';
        title.textContent = category.title;

        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'card-grid';

        grid.innerHTML = projects
            .map(project => createItemCardHTML(project, true))
            .join('');

        grid.querySelectorAll('article').forEach((card, index) => {
            const project = projects[index];

            const isApp =
                project.type === 'mobile' ||
                project.category === 'mobile';

            card.dataset.portfolioType = isApp ? 'app' : 'site';

            card.dataset.searchText = [
                project.title,
                project.description,
                project.badge,
                category.title
            ].filter(Boolean).join(' ');
        });

        section.appendChild(grid);

        if (category.id === 'special') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mt-8 text-center';

            buttonContainer.innerHTML = `
                <button
                    id="view-special-projects-btn"
                    class="gradient-btn font-bold px-6 py-2 text-sm"
                >
                    Acessar Projetos Especiais (Filtros)
                </button>
            `;

            section.appendChild(buttonContainer);
        }

        mainContainer.appendChild(section);
    });

    const specialButton = document.getElementById(
        'view-special-projects-btn'
    );

    if (specialButton) {
        specialButton.addEventListener(
            'click',
            openSpecialProjectsView
        );
    }

    const filterButtons = mainContainer.querySelectorAll(
        '.portfolio-type-btn'
    );

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(filter => {
                const isSelected = filter === button;

                filter.classList.toggle('active', isSelected);

                filter.setAttribute(
                    'aria-pressed',
                    String(isSelected)
                );
            });

            applyPortfolioFilters();
        });
    });

    applyPortfolioFilters();
}

// ==================================================
// 11. PESQUISA INTEGRADA AOS FILTROS
// ==================================================

function setupSearchFunctionality() {
    const searchInput = document.getElementById(
        'project-search-input'
    );

    if (!searchInput) return;

    if (searchInput.dataset.searchReady === 'true') return;

    searchInput.dataset.searchReady = 'true';

    searchInput.addEventListener(
        'input',
        applyPortfolioFilters
    );
}

function applyPortfolioFilters() {
    const container = document.getElementById(
        'full-portfolio-container'
    );

    if (!container) return;

    const normalizeText = text => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    };

    const searchInput = document.getElementById(
        'project-search-input'
    );

    const searchTerm = normalizeText(
        searchInput?.value || ''
    );

    const activeButton = container.querySelector(
        '.portfolio-type-btn[aria-pressed="true"]'
    );

    const selectedType =
        activeButton?.dataset.portfolioType || 'site';

    let totalVisible = 0;

    container.querySelectorAll('.category-section').forEach(section => {
        let sectionVisible = 0;

        const grid = section.querySelector('.card-grid');

        section.querySelectorAll('article').forEach(card => {
            const matchesType =
                card.dataset.portfolioType === selectedType;

            const matchesSearch = normalizeText(
                card.dataset.searchText || ''
            ).includes(searchTerm);

            const isVisible = matchesType && matchesSearch;

            card.classList.toggle('hidden', !isVisible);

            if (isVisible) {
                sectionVisible++;
                totalVisible++;
            }
        });

        section.classList.toggle(
            'hidden',
            sectionVisible === 0
        );

        if (grid) {
            grid.classList.toggle(
                'apps-grid',
                selectedType === 'app'
            );
        }
    });

    const emptyMessage = document.getElementById(
        'portfolio-empty-message'
    );

    if (emptyMessage) {
        emptyMessage.classList.toggle(
            'hidden',
            totalVisible > 0
        );
    }

    // Exibe no menu somente as categorias com resultados.
    const categoryMenu = document.getElementById(
        'nav-menu-list'
    );

    if (categoryMenu) {
        categoryMenu.querySelectorAll('.nav-menu-item').forEach(button => {
            const section = document.getElementById(
                button.dataset.target
            );

            const isVisible =
                section && !section.classList.contains('hidden');

            button.classList.toggle('hidden', !isVisible);
        });
    }
}

// ==================================================
// 12. PROJETOS ESPECIAIS
// ==================================================

function renderSpecialProjects(subFilter = 'all') {
    const container = document.getElementById(
        'gallery-container-special'
    );

    if (!container) return;

    let specialProjects = allProjects.filter(
        project => project.category === 'special'
    );

    if (subFilter !== 'all') {
        specialProjects = specialProjects.filter(
            project => project.subCategory === subFilter
        );
    }

    if (specialProjects.length === 0) {
        container.innerHTML = `
            <p class="text-gray-400 col-span-full text-center py-8">
                Nenhum projeto encontrado neste tema.
            </p>
        `;

        return;
    }

    container.innerHTML = specialProjects
        .map(item => createItemCardHTML(item, true))
        .join('');
}

function openSpecialProjectsView() {
    const projectsView = document.getElementById(
        'projects-view'
    );

    const specialView = document.getElementById(
        'special-projects-view'
    );

    const specialFilters = document.querySelectorAll(
        '#special-filters .filter-btn'
    );

    specialFilters.forEach(button => {
        button.classList.remove('active');
    });

    document.querySelector(
        '#special-filters .filter-btn[data-subfilter="all"]'
    ).classList.add('active');

    renderSpecialProjects('all');

    projectsView.style.opacity = '0';

    setTimeout(() => {
        projectsView.classList.add('hidden');
        specialView.classList.remove('hidden');

        requestAnimationFrame(() => {
            specialView.style.opacity = '1';

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }, 500);
}

// ==================================================
// 13. NAVEGAÇÃO POR CATEGORIAS
// ==================================================

function setupCategoryNavigation() {
    const menuList = document.getElementById(
        'nav-menu-list'
    );

    const menuContainer = document.getElementById(
        'category-navigation-menu'
    );

    const toggleButton = document.getElementById(
        'filter-toggle-btn'
    );

    if (!menuList || !menuContainer || !toggleButton) return;

    menuList.innerHTML = categoryConfig.map(category => `
        <button
            type="button"
            class="nav-menu-item"
            data-target="section-${category.id}"
        >
            ${category.title}
        </button>
    `).join('');

    if (toggleButton.dataset.menuReady !== 'true') {
        toggleButton.dataset.menuReady = 'true';

        toggleButton.addEventListener('click', event => {
            event.stopPropagation();

            const isOpen = menuContainer.classList.toggle(
                'active'
            );

            toggleButton.setAttribute(
                'aria-expanded',
                String(isOpen)
            );
        });

        document.addEventListener('click', event => {
            if (
                !menuContainer.contains(event.target) &&
                !toggleButton.contains(event.target)
            ) {
                menuContainer.classList.remove('active');

                toggleButton.setAttribute(
                    'aria-expanded',
                    'false'
                );
            }
        });
    }

    menuList.querySelectorAll('.nav-menu-item').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const target = document.getElementById(targetId);

            if (target && !target.classList.contains('hidden')) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }

            menuContainer.classList.remove('active');

            toggleButton.setAttribute(
                'aria-expanded',
                'false'
            );
        });
    });

    applyPortfolioFilters();
}

// ==================================================
// 14. NAVEGAÇÃO ENTRE AS VISUALIZAÇÕES
// ==================================================

function initSPA() {
    const homeView = document.getElementById('home-view');
    const projectsView = document.getElementById('projects-view');

    const specialView = document.getElementById(
        'special-projects-view'
    );

    const viewAllProjectsButton = document.getElementById(
        'view-all-projects-btn'
    );

    const backButton = document.getElementById(
        'back-to-home-btn'
    );

    const backToProjectsButton = document.getElementById(
        'back-to-projects-btn'
    );

    const navBrand = document.getElementById('nav-brand');

    const navLinks = document.querySelectorAll(
        '.nav-link-scroll'
    );

    function switchView(hideView, showView) {
        hideView.style.opacity = '0';

        setTimeout(() => {
            hideView.classList.add('hidden');
            showView.classList.remove('hidden');

            void showView.offsetWidth;

            requestAnimationFrame(() => {
                showView.style.opacity = '1';

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }, 500);
    }

    if (viewAllProjectsButton) {
        viewAllProjectsButton.addEventListener('click', () => {
            renderFullPortfolio();
            setupCategoryNavigation();
            setupSearchFunctionality();

            switchView(homeView, projectsView);
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            switchView(projectsView, homeView);
        });
    }

    if (backToProjectsButton) {
        backToProjectsButton.addEventListener('click', () => {
            switchView(specialView, projectsView);
        });
    }

    if (navBrand) {
        navBrand.addEventListener('click', event => {
            event.preventDefault();

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
            const isAnotherViewOpen =
                !projectsView.classList.contains('hidden') ||
                !specialView.classList.contains('hidden');

            if (!isAnotherViewOpen) return;

            projectsView.classList.add('hidden');
            projectsView.style.opacity = '0';

            specialView.classList.add('hidden');
            specialView.style.opacity = '0';

            homeView.classList.remove('hidden');

            setTimeout(() => {
                homeView.style.opacity = '1';

                const target = document.querySelector(
                    link.getAttribute('href')
                );

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }, 600);
        });
    });

    const specialFilters = document.querySelectorAll(
        '#special-filters .filter-btn'
    );

    specialFilters.forEach(button => {
        button.addEventListener('click', () => {
            specialFilters.forEach(filter => {
                filter.classList.remove('active');
            });

            button.classList.add('active');

            renderSpecialProjects(
                button.getAttribute('data-subfilter')
            );
        });
    });
}

// ==================================================
// 15. MENU MOBILE E INICIALIZAÇÃO
// ==================================================

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

                    hamburger.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                    document.body.classList.remove('menu-open');

                    overlay.classList.add(
                        'pointer-events-none'
                    );
                }
            });
        } else {
            document.body.classList.add('menu-open');

            hamburger.classList.add('is-active');
            hamburger.setAttribute('aria-expanded', 'true');

            menuNav.classList.remove('translate-x-full');
            overlay.classList.remove('pointer-events-none');

            gsap.to(overlay, {
                opacity: 1
            });

            gsap.fromTo(
                menuNav,
                {
                    x: '100%'
                },
                {
                    x: '0%',
                    duration: 0.4
                }
            );

            gsap.to('.mobile-nav-link', {
                opacity: 1,
                x: 0,
                delay: 0.2,
                stagger: 0.08
            });
        }
    }

    if (hamburger && menuNav && overlay) {
        hamburger.addEventListener('click', event => {
            event.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', toggleMenu);

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    renderFeaturedProjects();
    renderFeaturedApps();
    initSPA();
});

// ==================================================
// 16. CABEÇALHO AO ROLAR
// ==================================================

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    if (!header) return;

    function handleHeaderScroll() {
        header.classList.toggle(
            'header-scrolled',
            window.scrollY > 30
        );
    }

    window.addEventListener('scroll', handleHeaderScroll, {
        passive: true
    });

    handleHeaderScroll();
});