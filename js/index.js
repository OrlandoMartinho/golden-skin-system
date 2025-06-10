// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile após clicar em um link
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Animação ao rolar a página
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.mission-item, .service-card, .plan-card, .product-card, .gallery-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Adiciona opacidade inicial e transform para animação
document.querySelectorAll('.mission-item, .service-card, .plan-card, .product-card, .gallery-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
});

// Dispara a animação quando a página carrega e ao rolar
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Loader Script Premium
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    
    // Adiciona folhas caindo aleatoriamente
    setInterval(function() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-fall';
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDuration = (Math.random() * 2 + 2) + 's';
        leaf.style.fontSize = (Math.random() * 10 + 18) + 'px';
        leaf.innerHTML = '<i class="fas fa-leaf"></i>';
        
        // Remove a folha após a animação terminar
        setTimeout(function() {
            leaf.remove();
        }, 3000);
    }, 500);
});

// Menu mobile functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Alternar ícone do hamburger para X quando aberto
        if (navLinks.classList.contains('active')) {
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Fechar menu quando clicar em um link (já tratado no smooth scrolling)
});

document.addEventListener('DOMContentLoaded', function() {
    const videoBtn = document.getElementById('video-btn');
    const modal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.close');
    
    videoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});