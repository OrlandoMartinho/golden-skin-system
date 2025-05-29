 // Navbar Scroll Effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile Menu Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

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
            // Adiciona classe fade-out após 2.5 segundos (tempo para animação completa)
            setTimeout(function() {
                loader.classList.add('fade-out');
                // Remove o loader do DOM após a animação terminar
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 800); // Deve corresponder à duração da transição
            }, 2500);
            
            // Adiciona folhas caindo aleatoriamente
            setInterval(function() {
                const leaf = document.createElement('div');
                leaf.className = 'leaf-fall';
                leaf.style.left = Math.random() * 100 + '%';
                leaf.style.animationDuration = (Math.random() * 2 + 2) + 's';
                leaf.style.fontSize = (Math.random() * 10 + 18) + 'px';
                leaf.innerHTML = '<i class="fas fa-leaf"></i>';
                loader.querySelector('.loader-content').appendChild(leaf);
                
                // Remove a folha após a animação terminar
                setTimeout(function() {
                    leaf.remove();
                }, 3000);
            }, 500);
        });