
        // Interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            // Category selection
            const categories = document.querySelectorAll('.category');
            categories.forEach(category => {
                category.addEventListener('click', function() {
                    categories.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Nav item selection
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    navItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Order buttons
            const orderButtons = document.querySelectorAll('.btn-solid');
            orderButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                    alert(`Added to cart: ${productName}`);
                });
            });

            // CTA button
            document.querySelector('.btn-cta').addEventListener('click', function() {
                alert('Redirecting to order page...');
            });
        });

        // Responsive menu toggle for mobile
        function toggleMenu() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
        }

        // Add menu toggle for mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 992) {
                const header = document.querySelector('.header');
                if (!document.querySelector('.menu-toggle')) {
                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'menu-toggle';
                    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    toggleBtn.style.position = 'absolute';
                    toggleBtn.style.top = '20px';
                    toggleBtn.style.left = '20px';
                    toggleBtn.style.background = 'var(--primary)';
                    toggleBtn.style.color = 'white';
                    toggleBtn.style.border = 'none';
                    toggleBtn.style.borderRadius = '5px';
                    toggleBtn.style.padding = '8px 12px';
                    toggleBtn.style.fontSize = '18px';
                    toggleBtn.style.zIndex = '1000';
                    toggleBtn.onclick = toggleMenu;
                    document.body.prepend(toggleBtn);
                    
                    // Hide sidebar initially on mobile
                    document.querySelector('.sidebar').style.display = 'none';
                }
            } else {
                const toggleBtn = document.querySelector('.menu-toggle');
                if (toggleBtn) toggleBtn.remove();
                document.querySelector('.sidebar').style.display = 'block';
            }
        });


        document.addEventListener('DOMContentLoaded', function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.overlay');
            
            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });
            
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Initialize on load
        window.dispatchEvent(new Event('resize'));
