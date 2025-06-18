
const api_host = "http://localhost:3000";
// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile após clicar em um link
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks?.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Animação ao rolar a página
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.mission-item, .service-card, .plan-card, .product-card, .gallery-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
            element.classList.add('animate');
        }
    });
};

// Adiciona estilos iniciais para animação
const setupAnimations = () => {
    document.querySelectorAll('.mission-item, .service-card, .plan-card, .product-card, .gallery-item').forEach(element => {
        element.classList.add('animate-initial');
    });
};

// CSS necessário para animações
const animationStyles = `
    .animate-initial {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    .animate {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Injeta estilos de animação no <head>
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Dispara animações ao carregar e rolar a página
window.addEventListener('load', () => {
    setupAnimations();
    animateOnScroll();
});
window.addEventListener('scroll', animateOnScroll);

// Loader Script com folhas caindo
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Adiciona folhas caindo
    const createLeaf = () => {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-fall';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDuration = `${Math.random() * 2 + 2}s`;
        leaf.style.fontSize = `${Math.random() * 10 + 18}px`;
        leaf.innerHTML = '<i class="fas fa-leaf"></i>';
        document.body.appendChild(leaf);
        
        // Remove a folha após a animação
        leaf.addEventListener('animationend', () => leaf.remove());
    };
    
    // Cria folhas a cada 500ms
    setInterval(createLeaf, 500);
});

// Menu mobile
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }
});

// Modal de vídeo
document.addEventListener('DOMContentLoaded', () => {
    const videoBtn = document.getElementById('video-btn');
    const modal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.close');
    
    if (videoBtn && modal && closeBtn) {
        videoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            const video = modal.querySelector('video');
            if (video) video.pause();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                const video = modal.querySelector('video');
                if (video) video.pause();
            }
        });
    }
});

// Função para criar um card de serviço
const createServiceCard = (service) => {
    const card = document.createElement('div');
    card.className = `service-card ${service.highlight ? 'highlight' : ''}`;
    card.innerHTML = `
        <i class="${service.icon}"></i>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        ${service.highlight ? '<span class="badge">Destaque</span>' : ''}
    `;
    return card;
};

// Função para carregar os serviços
const loadServices = () => {
    const servicesContainer = document.querySelector('.services-grid');
    if (!servicesContainer) return;
    
    const servicesData = [
        {
            title: 'Consultoria de Skincare',
            description: 'Descubra quais produtos são ideais para o seu tipo de pele! Nossa equipe especializada analisa suas necessidades e recomenda a rotina perfeita.',
            icon: 'fas fa-spa',
            highlight: true
        },
        {
            title: 'Tratamentos Faciais',
            description: 'Oferecemos tratamentos personalizados para revitalizar sua pele, com ingredientes naturais do Douro.',
            icon: 'fas fa-leaf',
            highlight: false
        },
        {
            title: 'Cuidados Capilares',
            description: 'Soluções para fortalecer e hidratar seus cabelos, com fórmulas livres de sulfatos.',
            icon: 'fas fa-tint',
            highlight: false
        },
        {
            title: 'Workshops de Beleza',
            description: 'Participe de nossos workshops para aprender a cuidar da pele e dos cabelos de forma natural.',
            icon: 'fas fa-chalkboard-teacher',
            highlight: false
        }
    ];
    
    servicesContainer.innerHTML = '';
    servicesData.forEach(service => {
        servicesContainer.appendChild(createServiceCard(service));
    });
};

// Função para criar um card de plano
const createPlanCard = (plan) => {
    const card = document.createElement('div');
    card.className = `plan-card ${plan.popular ? 'popular' : ''}`;
    card.innerHTML = `
        <h3>${plan.title}</h3>
        <div class="plan-price">${plan.price}</div>
        <ul class="plan-features">
            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <a href="#" class="btn ${plan.popular ? '' : 'btn-outline'}">Assinar Agora</a>
    `;
    return card;
};

// Função para carregar os planos
const loadPlans = () => {
    const plansContainer = document.querySelector('.plans-grid');
    if (!plansContainer) return;
    
    const plansData = [
        {
            title: 'Plano Essencial',
            price: '39,90KZ/mês',
            features: [
                '2 produtos básicos de skincare ou cabelo',
                'Acesso a dicas e tutoriais exclusivos',
                '10% de desconto em compras avulsas'
            ],
            popular: false
        },
        {
            title: 'Plano Premium',
            price: '59,90KZ/mês',
            features: [
                '3 produtos selecionados para sua pele e cabelos',
                'Acesso antecipado a lançamentos',
                '15% de desconto em toda a loja',
                'Frete reduzido'
            ],
            popular: true
        },
        {
            title: 'Plano Luxo',
            price: '89,90KZ/mês',
            features: [
                '5 produtos premium personalizados',
                'Consultoria de skincare exclusiva',
                '20% de desconto em compras avulsas',
                'Frete grátis',
                'Kit especial todo mês'
            ],
            popular: false
        }
    ];
    
    plansContainer.innerHTML = '';
    plansData.forEach(plan => {
        plansContainer.appendChild(createPlanCard(plan));
    });
};

// Função para criar um card de produto
const createProductCard = (product) => {
    const card = document.createElement('div');
   
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-img">
            <img src="${product.photo}" alt="${product.title}">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>Descrição:${product.description}</p>
      
            <p>Stock:${product.amount} </p>
           <div class="product-price">
            ${product.priceInCents / 100} Kz
            ${product.priceInCents > 50000 
                ? `<del>${(product.priceInCents + 500) / 100} Kz</del>` 
                : ''}
            </div>
            <a href="pages/sessoes/login.html" class="btn">Comprar Agora</a>
        </div>
    `;
    return card;
};

// Função para carregar os produtos
const loadProducts = async () => {
    const productsContainer = document.querySelector('.products-grid');
    if (!productsContainer) return;
    const product = await getAllProducts("accessToken");
    let productsApiData = [];
    if(product== 200){
        productsApiData = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    }

    

    console.log("productsApiData:", productsApiData);
    const productsData = [
        {
            title: 'Máscara Facial Detox',
            description: 'Carvão Ativado & Argila Verde - Remove impurezas e deixa a pele fresca e renovada.',
            price: '25,000 AOA',
            oldPrice: '37,500 AOA',
            image: 'assets/img/product-1.png'
        },
        {
            title: 'Creme Hidratante Nutritivo',
            description: 'Com Azeite do Douro e manteiga de karité - Hidrata intensamente e protege contra o ressecamento.',
            price: '23,000 AOA',
            oldPrice: null,
            image: 'assets/img/product-2.png'
        },
        {
            title: 'Espuma de Limpeza Facial',
            description: 'Com aloe vera e camomila - Remove impurezas e maquiagem sem agredir a pele.',
            price: '23,000 AOA',
            oldPrice: null,
            image: 'assets/img/product-3.png'
        },
        {
            title: 'Shampoo Hidratante',
            description: 'Combina alecrim e camomila para uma limpeza suave que fortalece os fios.',
            price: '23,000 AOA',
            oldPrice: null,
            image: 'assets/img/product-4.png'
        }
    ];
    
    productsContainer.innerHTML = '';
    productsApiData.forEach(product => {
        productsContainer.appendChild(createProductCard(product));
    });
};

// Inicializa serviços, planos e produtos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    loadPlans();
    loadProducts();
});